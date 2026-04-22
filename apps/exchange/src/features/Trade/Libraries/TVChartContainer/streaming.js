import { parseFullSymbol, resolutionToMatchingInterval } from './helpers.js';

// One subscription per TradingView channel ("BTC/USDT" → subscription state).
const channelToSubscription = new Map();

let socket = null;
let pendingStreamParams = null;

/**
 * Live-update source for the chart.
 *   'LOCAL'  → apply AGCE `local:trade:<SYMBOL>` ticks to the current bar.
 *   'GLOBAL' → subscribe to the Binance `kline@<symbol>@<interval>`
 *              stream through market-data-service's multiplexer. Each
 *              frame carries the full candle (o/h/l/c/v/x), so we
 *              replace the current bar outright instead of accumulating
 *              trades client-side.
 */
let availability = 'LOCAL';

/** "BTC-USDT" → "BTCUSDT" — Binance symbols carry no dash. */
function toBinanceSymbol(local) {
	return String(local || '').replace(/-/g, '').toUpperCase();
}

/**
 * Set the shared socket from SocketContext. The chart builds bars from the
 * matching-service `local:trade:<SYMBOL>` Socket.IO events — no Binance.
 * Event payload shape (from market-data-service):
 *   { side: 'BUY'|'SELL', price: string|number, quantity: string|number, timestamp: number }
 */
export function setSharedSocket(socketInstance) {
	if (!socketInstance) return;
	if (socket && socket !== socketInstance) {
		// Previous socket is being replaced (auth state change etc.) — detach
		// all per-symbol listeners we own on it.
		for (const [, sub] of channelToSubscription) {
			if (sub.handlerRef && sub.eventName) {
				socket.off(sub.eventName, sub.handlerRef);
				sub.handlerRef = null;
			}
		}
	}
	socket = socketInstance;
	if (pendingStreamParams) {
		setupStreamWithSocket(pendingStreamParams);
		pendingStreamParams = null;
	} else {
		// Re-attach listeners + re-subscribe for any existing subscriptions.
		for (const [channelString, sub] of channelToSubscription) {
			attachListener(channelString, sub);
		}
	}
}

export function clearSharedSocket() {
	if (socket) {
		for (const [, sub] of channelToSubscription) {
			if (sub.handlerRef && sub.eventName) {
				socket.off(sub.eventName, sub.handlerRef);
				sub.handlerRef = null;
			}
		}
	}
}

/** Full teardown — call when leaving the trade page. */
export function disconnectChartSocket() {
	clearSharedSocket();
	channelToSubscription.clear();
	pendingStreamParams = null;
}

export function isSocketReady() {
	return socket !== null && socket.connected;
}

/**
 * Called by datafeed.setDatafeedAvailability when the user flips the
 * LOCAL/GLOBAL toggle. We tear down any existing local-trade listeners
 * (GLOBAL shouldn't leak AGCE ticks onto a Binance series) and then
 * re-attach with the new mode for every active subscription.
 *
 * The TradingView widget is NOT recreated — we just swap listeners —
 * because recreating it would lose chart overlays and user zoom state.
 */
export function setStreamAvailability(next) {
	const v = next === 'GLOBAL' ? 'GLOBAL' : 'LOCAL';
	if (v === availability) return;

	// Detach any existing local listeners before flipping the flag —
	// otherwise stale `local:trade:*` events could still fire while we
	// transition.
	if (socket) {
		for (const [, sub] of channelToSubscription) {
			if (sub.handlerRef && sub.eventName) {
				socket.off(sub.eventName, sub.handlerRef);
				sub.handlerRef = null;
			}
			if (sub.binanceSymbol && sub.binanceInterval) {
				socket.emit('unsubscribe', {
					channel: 'kline',
					symbol: sub.binanceSymbol,
					interval: sub.binanceInterval,
				});
				sub.binanceSymbol = null;
				sub.binanceInterval = null;
			} else if (sub.localSymbol) {
				socket.emit('unsubscribe', { channel: 'local_trade', symbol: sub.localSymbol });
			}
		}
	}

	availability = v;

	// Re-attach with the new mode. Each live bar accumulator resets so
	// the first tick after the switch opens a fresh bar rather than
	// extending a stale one.
	for (const [channelString, sub] of channelToSubscription) {
		sub.lastDailyBar = undefined;
		attachListener(channelString, sub);
	}
}

function attachListener(channelString, subscriptionItem) {
	if (!socket) return;
	const parsed = parseFullSymbol(channelString);
	if (!parsed?.fromSymbol || !parsed?.toSymbol) return;

	const localSymbol = `${parsed.fromSymbol}-${parsed.toSymbol}`;
	subscriptionItem.localSymbol = localSymbol;

	// GLOBAL pair → subscribe to Binance kline WS through the
	// market-data-service multiplexer. The service forwards every tick
	// wrapped in a DataEnvelope on the generic `data` channel.
	if (availability === 'GLOBAL') {
		attachBinanceKlineListener(subscriptionItem, localSymbol);
		return;
	}

	// LOCAL pair → accumulate AGCE `local:trade:<SYM>` ticks into the
	// current bar. The payload shape differs from Binance's kline frame
	// (trade-by-trade) so we handle it separately.
	const eventName = `local:trade:${localSymbol}`;

	// Ask gateway for the local trade stream (idempotent server-side).
	socket.emit('subscribe', { channel: 'local_trade', symbol: localSymbol });

	if (subscriptionItem.handlerRef && subscriptionItem.eventName) {
		socket.off(subscriptionItem.eventName, subscriptionItem.handlerRef);
	}

	const handler = (event) => {
		try {
			// Server may wrap the payload: { payload: { price, ... } } or send it flat.
			const e = event?.payload ?? event;
			const tradePrice = parseFloat(e?.price ?? e?.p);
			if (!Number.isFinite(tradePrice)) return;
			const volume = parseFloat(e?.quantity ?? e?.qty ?? e?.q);
			// Normalize trade time to ms (server may send seconds).
			const rawTs = Number(e?.timestamp ?? e?.time ?? e?.T);
			const tradeTime = rawTs > 0 ? (rawTs < 1e12 ? rawTs * 1000 : rawTs) : Date.now();
			// TradingView bar time must be aligned to the start of the interval.
			const barTime = getBarStart(tradeTime, subscriptionItem.resolution);

			if (!subscriptionItem.lastDailyBar) {
				subscriptionItem.lastDailyBar = {
					time: barTime,
					open: tradePrice,
					high: tradePrice,
					low: tradePrice,
					close: tradePrice,
					volume: Number.isFinite(volume) ? volume : 0,
				};
				subscriptionItem.handlers?.forEach((h) => h.callback(subscriptionItem.lastDailyBar));
				return;
			}

			const lastBarTime = getBarStart(subscriptionItem.lastDailyBar.time, subscriptionItem.resolution);
			let bar;
			if (barTime > lastBarTime) {
				// New candle — open at previous close.
				bar = {
					time: barTime,
					open: subscriptionItem.lastDailyBar.close,
					high: tradePrice,
					low: tradePrice,
					close: tradePrice,
					volume: Number.isFinite(volume) ? volume : 0,
				};
			} else {
				// Update current candle.
				bar = {
					...subscriptionItem.lastDailyBar,
					high: Math.max(subscriptionItem.lastDailyBar.high ?? 0, tradePrice),
					low: Math.min(subscriptionItem.lastDailyBar.low ?? Infinity, tradePrice),
					close: tradePrice,
					volume: (subscriptionItem.lastDailyBar.volume ?? 0) + (Number.isFinite(volume) ? volume : 0),
				};
			}
			subscriptionItem.lastDailyBar = bar;
			subscriptionItem.handlers?.forEach((h) => h.callback(bar));
		} catch {
			// Never crash the chart on malformed frames.
		}
	};

	socket.on(eventName, handler);
	subscriptionItem.handlerRef = handler;
	subscriptionItem.eventName = eventName;
	subscriptionItem.localSymbol = localSymbol;
}

/**
 * GLOBAL path — subscribe to Binance `kline@<symbol>@<interval>` through
 * market-data-service's multiplexer. Frames arrive on the generic `data`
 * channel wrapped in a DataEnvelope `{ channel, symbol, interval,
 * payload: { k: {...} }, ts }`. We filter by channel + symbol +
 * interval so multiple charts on the same socket don't cross-wire.
 *
 * The payload shape matches Binance's WS kline frame:
 *   { k: { t, T, s, i, o, c, h, l, v, n, x, q, V, Q, ... } }
 * We use the FULL candle (not trade-by-trade aggregation) so there's
 * no client-side OHLC math — we just replace the current bar.
 */
function attachBinanceKlineListener(subscriptionItem, localSymbol) {
	const binanceSymbol = toBinanceSymbol(localSymbol);
	const interval = resolutionToMatchingInterval(subscriptionItem.resolution);

	// Idempotent server-side — safe to re-emit on resubscribe.
	socket.emit('subscribe', {
		channel: 'kline',
		symbol: binanceSymbol,
		interval,
	});

	if (subscriptionItem.handlerRef && subscriptionItem.eventName) {
		socket.off(subscriptionItem.eventName, subscriptionItem.handlerRef);
	}

	const handler = (envelope) => {
		try {
			if (envelope?.channel !== 'kline') return;
			if (envelope?.symbol && envelope.symbol !== binanceSymbol) return;
			if (envelope?.interval && envelope.interval !== interval) return;

			// Binance wraps the candle under `k`. Some forwarders flatten
			// it — handle both shapes.
			const p = envelope?.payload ?? envelope;
			const k = p?.k ?? p;

			const open = parseFloat(k?.o);
			const high = parseFloat(k?.h);
			const low = parseFloat(k?.l);
			const close = parseFloat(k?.c);
			const vol = parseFloat(k?.v);
			const openTime = Number(k?.t);
			if (!Number.isFinite(close) || !Number.isFinite(openTime)) return;

			const bar = {
				time: openTime,
				open: Number.isFinite(open) ? open : close,
				high: Number.isFinite(high) ? high : close,
				low: Number.isFinite(low) ? low : close,
				close,
				volume: Number.isFinite(vol) ? vol : 0,
			};
			subscriptionItem.lastDailyBar = bar;
			subscriptionItem.handlers?.forEach((h) => h.callback(bar));
		} catch {
			// Never crash the chart on malformed frames.
		}
	};

	socket.on('data', handler);
	subscriptionItem.handlerRef = handler;
	subscriptionItem.eventName = 'data';
	subscriptionItem.binanceSymbol = binanceSymbol;
	subscriptionItem.binanceInterval = interval;
}

function setupStreamWithSocket(params) {
	const { symbolInfo, resolution, onRealtimeCallback, subscriberUID, lastDailyBar } = params;
	const channelString = symbolInfo.name;
	const handler = { id: subscriberUID, callback: onRealtimeCallback };

	let subscriptionItem = channelToSubscription.get(channelString);
	if (subscriptionItem) {
		subscriptionItem.handlers.push(handler);
		return;
	}

	subscriptionItem = {
		subscriberUID,
		resolution,
		lastDailyBar,
		handlers: [handler],
	};
	channelToSubscription.set(channelString, subscriptionItem);
	attachListener(channelString, subscriptionItem);
}

export async function subscribeOnStream(
	symbolInfo,
	resolution,
	onRealtimeCallback,
	subscriberUID,
	_onResetCacheNeededCallback,
	lastDailyBar,
) {
	const params = { symbolInfo, resolution, onRealtimeCallback, subscriberUID, lastDailyBar };
	if (socket) {
		setupStreamWithSocket(params);
	} else {
		pendingStreamParams = params;
	}
}

export function unsubscribeFromStream(subscriberUID) {
	for (const [channelString, subscriptionItem] of channelToSubscription) {
		const handlerIndex = subscriptionItem.handlers.findIndex((h) => h.id === subscriberUID);
		if (handlerIndex === -1) continue;
		subscriptionItem.handlers.splice(handlerIndex, 1);
		if (subscriptionItem.handlers.length > 0) return;

		if (socket) {
			if (subscriptionItem.handlerRef && subscriptionItem.eventName) {
				socket.off(subscriptionItem.eventName, subscriptionItem.handlerRef);
			}
			// Tell the gateway we're done with the upstream stream —
			// Binance kline multiplexer OR local trade tape, whichever
			// this subscription had attached.
			if (subscriptionItem.binanceSymbol && subscriptionItem.binanceInterval) {
				socket.emit('unsubscribe', {
					channel: 'kline',
					symbol: subscriptionItem.binanceSymbol,
					interval: subscriptionItem.binanceInterval,
				});
			} else if (subscriptionItem.localSymbol) {
				socket.emit('unsubscribe', { channel: 'local_trade', symbol: subscriptionItem.localSymbol });
			}
		}
		channelToSubscription.delete(channelString);
		return;
	}
}

/**
 * Returns the start-of-bar timestamp (ms) for a given resolution.
 * TradingView requires bar.time to be aligned to the interval boundary —
 * e.g. a 5m bar at 14:07 must have time=14:05:00.000, not 14:07:xx.xxx.
 */
function getBarStart(timestamp, resolution) {
	const ms = Number(timestamp);
	const r = String(resolution || '1').toUpperCase();

	if (r === 'D' || r === '1D') {
		const d = new Date(ms);
		d.setUTCHours(0, 0, 0, 0);
		return d.getTime();
	}
	if (r === 'W' || r === '1W') {
		const d = new Date(ms);
		const day = d.getUTCDay(); // 0 = Sunday
		d.setUTCDate(d.getUTCDate() - day);
		d.setUTCHours(0, 0, 0, 0);
		return d.getTime();
	}

	// Intraday: floor to the nearest N-minute boundary
	const minutes = parseInt(r, 10) || 1;
	const periodMs = minutes * 60 * 1000;
	return Math.floor(ms / periodMs) * periodMs;
}
