import { parseFullSymbol } from './helpers.js';

// One subscription per TradingView channel ("BTC/USDT" → subscription state).
const channelToSubscription = new Map();

let socket = null;
let pendingStreamParams = null;

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

function attachListener(channelString, subscriptionItem) {
	if (!socket) return;
	const parsed = parseFullSymbol(channelString);
	if (!parsed?.fromSymbol || !parsed?.toSymbol) return;

	const localSymbol = `${parsed.fromSymbol}-${parsed.toSymbol}`;
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
			if (subscriptionItem.localSymbol) {
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
