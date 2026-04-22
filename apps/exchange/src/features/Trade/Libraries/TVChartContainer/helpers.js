import { klinesApi, pairsApi } from '../../../../lib/matching-api.js';

export function generateSymbol(exchange, fromSymbol, toSymbol) {
	const short = `${fromSymbol}/${toSymbol}`;
	return {
		short,
		full: `${exchange}:${short}`,
	};
}

export function parseFullSymbol(fullSymbol) {
	const match = fullSymbol?.split('/');
	if (!match || match.length < 2) return null;
	return {
		fromSymbol: match[0],
		toSymbol: match[1],
	};
}

/**
 * TV resolution → backend kline interval string. The backend now
 * natively supports the full 8-tier set (1m/5m/15m/30m/1h/4h/1d/1w),
 * so we no longer need to downgrade 30m → 1h or 1W → 1d.
 *
 * 1M (monthly) still falls back to 1w because Binance's public kline
 * `/api/v3/klines` does not expose a monthly resolution that lines up
 * with calendar months.
 */
export function resolutionToMatchingInterval(resolution) {
	const r = String(resolution || '').toUpperCase();
	if (r === '1M' || r === 'M') return '1w';
	if (r === '1W' || r === 'W') return '1w';
	if (r === '1D' || r === 'D') return '1d';
	if (r === '240') return '4h';
	if (r === '60') return '1h';
	if (r === '30') return '30m';
	if (r === '15') return '15m';
	if (r === '5') return '5m';
	return '1m';
}

/** Normalize a raw timestamp to milliseconds. Server may return seconds or ms. */
function toMs(raw) {
	const n = Number(raw);
	// Values below 1e12 are seconds (year ~2001 = 1e12 ms). Multiply to get ms.
	return n < 1e12 ? n * 1000 : n;
}

/** Map a raw candle (tuple or object) to a TradingView bar. Returns null on invalid data. */
function mapCandle(c) {
	let bar;
	if (Array.isArray(c)) {
		bar = {
			time: toMs(c[0]),
			open: parseFloat(c[1]),
			high: parseFloat(c[2]),
			low: parseFloat(c[3]),
			close: parseFloat(c[4]),
			volume: parseFloat(c[5]),
		};
	} else {
		bar = {
			time: toMs(c.openTime ?? c.t ?? c.time),
			open: parseFloat(c.open ?? c.o),
			high: parseFloat(c.high ?? c.h),
			low: parseFloat(c.low ?? c.l),
			close: parseFloat(c.close ?? c.c),
			volume: parseFloat(c.volume ?? c.v ?? 0),
		};
	}
	if (!Number.isFinite(bar.time) || bar.time <= 0) return null;
	if (!Number.isFinite(bar.close) || bar.close <= 0) return null;
	return bar;
}

/** Interval string → milliseconds per candle. */
const INTERVAL_MS = {
	'1m': 60_000,
	'5m': 300_000,
	'15m': 900_000,
	'30m': 1_800_000,
	'1h': 3_600_000,
	'4h': 14_400_000,
	'1d': 86_400_000,
	'1w': 604_800_000,
};

export function intervalToMs(interval) {
	return INTERVAL_MS[interval] ?? 60_000;
}

/**
 * When the local tape has no trades, draw a flat horizontal line at the pair's
 * reference price so the chart isn't blank. We synthesize `count` zero-volume
 * candles with open=high=low=close=refPrice, spaced by the interval and aligned
 * to the interval boundary so TradingView accepts them.
 */
function synthesizeFlatCandles(refPrice, interval, count = 200) {
	const ms = INTERVAL_MS[interval] ?? 60_000;
	const nowAligned = Math.floor(Date.now() / ms) * ms;
	const bars = [];
	for (let i = count - 1; i >= 0; i--) {
		bars.push({
			time: nowAligned - i * ms,
			open: refPrice,
			high: refPrice,
			low: refPrice,
			close: refPrice,
			volume: 0,
		});
	}
	return bars;
}

/**
 * Tracks how many consecutive empty/error responses we've seen for
 * each `symbol:interval` pair. Incremented on every miss, reset to 0
 * on a successful non-empty response.
 *
 * Once the counter crosses `MAX_EMPTY_BEFORE_BAIL`, subsequent calls
 * skip the network entirely and fall straight through to the LOCAL
 * flat-line fallback (if applicable). Stops the situation where a
 * freshly-listed LOCAL pair has no candles and TradingView keeps
 * paginating, burning one `/api/v1/klines` request per pagination
 * step forever.
 *
 * Cleared on resolution or symbol change by resetKlineEmptyCounter().
 */
const emptyResponseCount = new Map();
const MAX_EMPTY_BEFORE_BAIL = 3;

function klineKey(symbol, interval) {
	return `${symbol}:${interval}`;
}

export function resetKlineEmptyCounter(symbol, interval) {
	if (symbol && interval) {
		emptyResponseCount.delete(klineKey(symbol, interval));
	} else if (symbol && !interval) {
		// Resolution change for the same symbol — drop any interval for it.
		for (const k of emptyResponseCount.keys()) {
			if (k.startsWith(`${symbol}:`)) emptyResponseCount.delete(k);
		}
	} else {
		emptyResponseCount.clear();
	}
}

/**
 * Fetch historical klines from the backend. Response shape is always
 * Binance's 12-element array — see `klinesApi` in matching-api.ts.
 *
 *   availability = 'LOCAL'  → our matching-service trade tape (persisted
 *                             as `candles` in market-data-service).
 *   availability = 'GLOBAL' → market-data-service proxies to Binance.
 *
 * `startTime`/`endTime` (ms) drive horizontal-scroll pagination — the
 * datafeed passes them from TradingView's periodParams when the user
 * drags the chart into older ranges.
 *
 * `isInitial` distinguishes the first load (TradingView calls getBars
 * with firstDataRequest=true) from pagination calls. The LOCAL
 * flat-line fallback only triggers on isInitial — on pagination, we
 * return [] so the datafeed can send `noData: true` and TradingView
 * stops asking. This is what fixes the "frontend keeps hitting the
 * API" loop for pairs with no local candles.
 */
export async function fetchKlines(
	fromSymbol,
	toSymbol,
	resolution,
	{ availability = 'LOCAL', startTime, endTime, limit = 500, isInitial = true } = {},
) {
	const symbol = `${fromSymbol}-${toSymbol}`;
	const interval = resolutionToMatchingInterval(resolution);
	const key = klineKey(symbol, interval);

	// Circuit breaker: after N consecutive empties, skip the API call
	// entirely for this (symbol, interval). Saves the browser from
	// spamming `/klines` on every pagination tick for a quiet pair.
	const bailed = (emptyResponseCount.get(key) ?? 0) >= MAX_EMPTY_BEFORE_BAIL;
	if (bailed) {
		if (isInitial && availability === 'LOCAL') {
			return await synthesizeFlatLineFromPair(symbol, interval);
		}
		return [];
	}

	try {
		const candles = await klinesApi.klines(symbol, interval, {
			availability,
			startTime,
			endTime,
			limit,
		});
		if (Array.isArray(candles) && candles.length > 0) {
			const bars = candles.map(mapCandle).filter(Boolean);
			bars.sort((a, b) => a.time - b.time);
			if (bars.length > 0) {
				// Fresh data for this key — reset the empty counter so
				// a later quiet window doesn't tip us into bail mode.
				emptyResponseCount.delete(key);
				console.log(
					'[Chart]', availability, 'klines', symbol, interval, ':', bars.length, 'bars',
				);
				return bars;
			}
		}
		// Empty response — count it.
		emptyResponseCount.set(key, (emptyResponseCount.get(key) ?? 0) + 1);
	} catch (err) {
		emptyResponseCount.set(key, (emptyResponseCount.get(key) ?? 0) + 1);
		console.warn('[Chart] klines fetch failed (' + availability + '):', err);
	}

	// Pagination empties → return [] so the datafeed tells TradingView
	// `noData: true`. Synthesizing here would anchor candles to "now"
	// instead of the requested window, which TradingView would reject
	// as not-older-data and immediately ask for more — infinite loop.
	if (!isInitial) {
		return [];
	}

	// LOCAL-only fallback: draw a flat line at the pair's current price.
	if (availability === 'LOCAL') {
		return await synthesizeFlatLineFromPair(symbol, interval);
	}
	return [];
}

/**
 * Build a synthetic flat-line bar set from the pair's known price.
 * Used only on the INITIAL chart load for LOCAL pairs with no trades
 * yet, so the chart isn't blank. Not used for pagination (see
 * fetchKlines's `isInitial` branching) — synthesizing past bars for a
 * dragged window would trick TradingView into infinite pagination.
 *
 * Field fallback order when reading the pair's price:
 *   1. pair.price           → live market price maintained by the
 *                             matching/market-data service.
 *   2. pair.initialPrice    → admin-supplied price at pair creation
 *                             (seeded via /api/v1/pairs/admin).
 *   3. pair.referencePrice  → legacy field name, kept for backwards
 *                             compatibility with older backend builds.
 */
async function synthesizeFlatLineFromPair(symbol, interval) {
	try {
		const pair = await pairsApi.get(symbol);
		const raw =
			pair?.price ??
			pair?.initialPrice ??
			pair?.referencePrice ??
			'0';
		const refPrice = parseFloat(raw);
		if (Number.isFinite(refPrice) && refPrice > 0) {
			console.log(
				'[Chart] local tape empty — flat line at price', refPrice, 'for', symbol,
			);
			return synthesizeFlatCandles(refPrice, interval);
		}
	} catch (err) {
		console.warn('[Chart] pairs fetch for refPrice failed:', err);
	}
	return [];
}

/**
 * @deprecated Call `fetchKlines` with availability: 'LOCAL' instead.
 * Kept as a thin shim so any remaining callers don't break.
 */
export async function fetchMatchingOhlcv(fromSymbol, toSymbol, resolution) {
	return fetchKlines(fromSymbol, toSymbol, resolution, {
		availability: 'LOCAL',
	});
}
