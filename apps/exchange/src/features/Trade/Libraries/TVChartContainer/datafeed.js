import { parseFullSymbol, fetchMatchingOhlcv } from './helpers.js';
import { subscribeOnStream, unsubscribeFromStream } from './streaming.js';

const lastBarsCache = new Map();

const configurationData = {
    supported_resolutions: ["1", "5", "15", "60", "240", "D"],
};

// Default price scale (8 decimals). matching-service /symbols only returns
// symbol strings — tick_size isn't available, so we pick a safe fallback.
const DEFAULT_PRICE_SCALE = 100000000;

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
        onSymbolResolvedCallback({
            ticker: symbolName,
            name: symbolName,
            description: symbolName,
            type: 'crypto',
            session: '24x7',
            timezone: 'Asia/Kolkata',
            exchange: 'AGCE',
            minmov: 1,
            pricescale: DEFAULT_PRICE_SCALE,
            has_intraday: true,
            intraday_multipliers: ['1', '5', '15', '60', '240'],
            supported_resolutions: configurationData.supported_resolutions,
            has_weekly_and_monthly: false,
            volume_precision: 2,
            data_status: 'streaming',
        });
    },

    getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
        const { firstDataRequest } = periodParams;

        // We only serve the most recent N bars from the API — no time-range
        // pagination. Tell TradingView there's no older data so it stops asking.
        if (!firstDataRequest) {
            onHistoryCallback([], { noData: true });
            return;
        }

        const parsedSymbol = parseFullSymbol(symbolInfo.name);
        if (!parsedSymbol) {
            onErrorCallback('invalid symbol');
            return;
        }
        try {
            const bars = await fetchMatchingOhlcv(parsedSymbol.fromSymbol, parsedSymbol.toSymbol, resolution);
            if (bars.length) {
                lastBarsCache.set(symbolInfo.name, { ...bars[bars.length - 1] });
            }
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
