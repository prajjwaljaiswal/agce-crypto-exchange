import { marketApi, pairsApi } from '../../../../lib/matching-api.js';

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

/** TV resolution → matching-service OHLCV interval string. */
export function resolutionToMatchingInterval(resolution) {
	const r = String(resolution || '').toUpperCase();
	if (r === '1D' || r === 'D') return '1d';
	if (r === '1W' || r === 'W') return '1d'; // matching-service max is 1d
	if (r === '1M' || r === 'M') return '1d';
	if (r === '240') return '4h';
	if (r === '60') return '1h';
	if (r === '30') return '1h'; // fall back to 1h
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
	'1h': 3_600_000,
	'4h': 14_400_000,
	'1d': 86_400_000,
};

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
 * Fetch historical klines from matching-service. Local AGCE data only —
 * per the trade-page implementation doc, Binance data is not used on the
 * trade chart. If the local tape is empty we fall back to a flat line drawn
 * at the pair's referencePrice from /pairs so the chart isn't blank.
 */
export async function fetchMatchingOhlcv(fromSymbol, toSymbol, resolution) {
	const symbol = `${fromSymbol}-${toSymbol}`;
	const interval = resolutionToMatchingInterval(resolution);

	try {
		const candles = await marketApi.ohlcv(symbol, interval, 500);
		if (Array.isArray(candles) && candles.length > 0) {
			const bars = candles.map(mapCandle).filter(Boolean);
			bars.sort((a, b) => a.time - b.time);
			if (bars.length > 0) {
				console.log('[Chart] ohlcv', symbol, interval, ':', bars.length, 'bars');
				return bars;
			}
		}
	} catch (err) {
		console.warn('[Chart] ohlcv fetch failed:', err);
	}

	// Tape empty — draw flat line at pair.referencePrice.
	try {
		const pair = await pairsApi.get(symbol);
		const refPrice = parseFloat(pair?.referencePrice ?? '0');
		if (Number.isFinite(refPrice) && refPrice > 0) {
			console.log('[Chart] local tape empty — flat line at refPrice', refPrice, 'for', symbol);
			return synthesizeFlatCandles(refPrice, interval);
		}
	} catch (err) {
		console.warn('[Chart] pairs fetch for refPrice failed:', err);
	}
	return [];
}
