import {
    parseFullSymbol,
    fetchKlines,
    intervalToMs,
    resolutionToMatchingInterval,
    resetKlineEmptyCounter,
} from './helpers.js';
import { subscribeOnStream, unsubscribeFromStream, setStreamAvailability } from './streaming.js';
import { pairsApi } from '../../../../lib/matching-api.js';

const lastBarsCache = new Map();

/**
 * The full set of resolutions the backend now supports natively.
 * 1w is exposed via TradingView's "W" token; 1M falls back to 1w
 * server-side because Binance public REST has no calendar-month kline.
 */
const configurationData = {
    supported_resolutions: ["1", "5", "15", "30", "60", "240", "D", "W"],
};

const DEFAULT_PRICE_SCALE = 100000000;

/**
 * TradingView renders the price scale + OHLC strip with `pricescale`
 * decimals (pricescale = 10^N means N decimals). We read the pair's
 * `tickSize` from the backend and derive the correct scale per symbol
 * instead of forcing 8 decimals on every market.
 *
 * Examples:
 *   tickSize "0.01"     → pricescale 100       (2 dp, e.g. BTC-USDT)
 *   tickSize "0.00001"  → pricescale 100000    (5 dp, e.g. DOGE-USDT)
 *   tickSize "1"        → pricescale 1         (0 dp)
 *
 * Falls back to DEFAULT_PRICE_SCALE when the lookup fails or tickSize
 * is missing — TradingView tolerates extra precision, so the fallback
 * is safe.
 */
async function resolvePriceScale(symbol) {
    try {
        const pair = await pairsApi.get(symbol);
        const tick = parseFloat(pair?.tickSize);
        if (!Number.isFinite(tick) || tick <= 0) return DEFAULT_PRICE_SCALE;
        // Round to nearest power of 10; handles float noise like
        // `1 / 0.00001 = 99999.99999999999`.
        const scale = Math.round(1 / tick);
        // Clamp into a sane range — TradingView has issues with
        // astronomical pricescales and very tiny ones break volume
        // formatting.
        return Math.max(1, Math.min(scale, 100000000));
    } catch {
        return DEFAULT_PRICE_SCALE;
    }
}

// Module-level holder for the currently selected data source. The chart
// container flips this via setDatafeedAvailability() from its LOCAL/GLOBAL
// toggle. Reading through a holder (not a closure) means we don't have to
// recreate the TradingView widget when the user switches sources — the
// next history fetch and the stream subscription both pick up the new
// value automatically.
let currentAvailability = 'LOCAL';

export function setDatafeedAvailability(next) {
    const v = next === 'GLOBAL' ? 'GLOBAL' : 'LOCAL';
    if (v === currentAvailability) return;
    currentAvailability = v;
    // The previous source's empty-response counts are irrelevant for
    // the new source (e.g. LOCAL may have been empty, but GLOBAL has
    // plenty of data). Reset so the next fetch gets a fresh shot.
    resetKlineEmptyCounter();
    setStreamAvailability(v);
}

export function getDatafeedAvailability() {
    return currentAvailability;
}

export default {
    onReady: (callback) => setTimeout(() => callback({ supported_resolutions: configurationData.supported_resolutions })),

    searchSymbols: (_userInput, _exchange, symbolType, onResultReadyCallback) => {
        onResultReadyCallback(symbolType);
    },

    resolveSymbol: async (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
        if (!symbolName) {
            onResolveErrorCallback('cannot resolve symbol');
            return;
        }
        const pair = symbolName.split('/');
        if (!pair[0] || !pair[1]) {
            onResolveErrorCallback('cannot resolve symbol');
            return;
        }
        // Look up tickSize → pricescale (# of decimal places) so both
        // the right-axis labels and the OHLC strip render with the
        // right precision per pair instead of a blanket 8 decimals.
        const pricescale = await resolvePriceScale(`${pair[0]}-${pair[1]}`);
        onSymbolResolvedCallback({
            ticker: symbolName,
            name: symbolName,
            description: symbolName,
            type: 'crypto',
            session: '24x7',
            timezone: 'Asia/Kolkata',
            exchange: 'AGCE',
            minmov: 1,
            pricescale,
            has_intraday: true,
            intraday_multipliers: ['1', '5', '15', '30', '60', '240'],
            supported_resolutions: configurationData.supported_resolutions,
            has_weekly_and_monthly: true,
            volume_precision: 2,
            data_status: 'streaming',
        });
    },

    /**
     * TradingView calls getBars twice conceptually:
     *   1. firstDataRequest: true  → initial load; we fetch the most
     *      recent `limit` candles for the resolution.
     *   2. firstDataRequest: false → user scrolled left; `periodParams.from`
     *      and `.to` are in SECONDS and span the visible older range.
     *      We forward them as startTime/endTime (ms) so the backend
     *      returns candles for that window — this is what makes
     *      horizontal scrolling back in time actually work.
     */
    getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
        const { firstDataRequest, from, to, countBack } = periodParams;

        const parsedSymbol = parseFullSymbol(symbolInfo.name);
        if (!parsedSymbol) {
            onErrorCallback('invalid symbol');
            return;
        }

        try {
            let bars;
            if (firstDataRequest) {
                // Fresh load for this symbol/resolution — clear any
                // stale "this pair was empty" count from a previous
                // visit so we give the API one real chance again.
                resetKlineEmptyCounter(
                    `${parsedSymbol.fromSymbol}-${parsedSymbol.toSymbol}`,
                );
                bars = await fetchKlines(
                    parsedSymbol.fromSymbol,
                    parsedSymbol.toSymbol,
                    resolution,
                    {
                        availability: currentAvailability,
                        limit: Math.min(Math.max(countBack || 500, 50), 1000),
                        isInitial: true,
                    },
                );
            } else {
                // Pagination. `from`/`to` are seconds; convert to ms and
                // cap `limit` to the window size the user asked for.
                const startTime = Math.floor(Number(from) * 1000);
                const endTime = Math.ceil(Number(to) * 1000);
                const intervalMs = intervalToMs(resolutionToMatchingInterval(resolution));
                const span = Math.max(endTime - startTime, intervalMs);
                const limit = Math.min(Math.ceil(span / intervalMs) + 1, 1000);
                bars = await fetchKlines(
                    parsedSymbol.fromSymbol,
                    parsedSymbol.toSymbol,
                    resolution,
                    {
                        availability: currentAvailability,
                        startTime,
                        endTime,
                        limit,
                        isInitial: false,
                    },
                );
            }

            if (bars.length) {
                lastBarsCache.set(symbolInfo.name, { ...bars[bars.length - 1] });
            }
            // `noData: true` tells TradingView "no older data exists" —
            // it stops paginating. Critical for LOCAL pairs with no
            // historical candles; without it the widget would drag →
            // fetch → empty → drag → fetch → empty forever.
            onHistoryCallback(bars, { noData: bars.length === 0 });
        } catch (error) {
            onErrorCallback(error);
        }
    },

    subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {
        subscribeOnStream(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback, lastBarsCache.get(symbolInfo.name));
    },

    unsubscribeBars: unsubscribeFromStream,
};
