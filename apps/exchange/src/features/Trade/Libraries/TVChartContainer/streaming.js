import { parseFullSymbol } from "./helpers";

const channelToSubscription = new Map();

let socket = null;
let pendingStreamParams = null;
let dataHandler = null;
let listenerAttached = false;

/**
 * Set the shared socket from SocketContext.
 * The market-data-service emits `data` events of shape
 *   { channel: 'ticker' | 'trade' | ..., symbol: 'BTCUSDT', payload: {...} }
 * We build 1-minute bars from the ticker channel and dispatch to whichever
 * TradingView subscription matches the symbol.
 */
export function setSharedSocket(socketInstance) {
  if (!socketInstance) return;
  if (socket && socket !== socketInstance && dataHandler) {
    socket.off('data', dataHandler);
    listenerAttached = false;
    dataHandler = null;
  }
  socket = socketInstance;
  if (pendingStreamParams) {
    setupStreamWithSocket(pendingStreamParams);
    pendingStreamParams = null;
  } else if (channelToSubscription.size > 0) {
    ensureDataListener();
  }
}

export function clearSharedSocket() {
  if (socket && dataHandler) {
    socket.off('data', dataHandler);
    dataHandler = null;
    listenerAttached = false;
  }
}

/** Full teardown — call when leaving the trade page. */
export function disconnectChartSocket() {
  if (socket && dataHandler) {
    socket.off('data', dataHandler);
  }
  dataHandler = null;
  listenerAttached = false;
  pendingStreamParams = null;
  channelToSubscription.clear();
}

export function isSocketReady() {
  return socket !== null && socket.connected;
}

/**
 * Attach a single persistent `data` listener. Dispatches ticker updates to
 * any TradingView subscription whose symbol matches the payload symbol.
 */
function ensureDataListener() {
  if (!socket || listenerAttached || dataHandler) return;
  if (channelToSubscription.size === 0) return;

  dataHandler = (event) => {
    try {
      if (event?.channel !== 'ticker') return;
      const p = event.payload;
      if (!p) return;

      // Binance ticker fields: c = last price, v = base volume, E = event time ms
      const tradePrice = parseFloat(p.c);
      if (!Number.isFinite(tradePrice)) return;
      const volume = parseFloat(p.v);
      const tradeTime = Number(p.E) || Date.now();
      const eventSymbol = String(event.symbol || '').toUpperCase();

      for (const [channelString, subscriptionItem] of channelToSubscription) {
        const parsed = parseFullSymbol(channelString);
        if (!parsed?.fromSymbol || !parsed?.toSymbol) continue;
        const subSymbol = `${parsed.fromSymbol}${parsed.toSymbol}`.toUpperCase();
        if (subSymbol !== eventSymbol) continue;

        if (!subscriptionItem.lastDailyBar) {
          subscriptionItem.lastDailyBar = {
            time: tradeTime,
            open: tradePrice,
            high: tradePrice,
            low: tradePrice,
            close: tradePrice,
            volume: Number.isFinite(volume) ? volume : 0,
          };
          subscriptionItem.handlers?.forEach(h => h.callback(subscriptionItem.lastDailyBar));
          continue;
        }

        const lastBarTime = getStartOfMinute(subscriptionItem.lastDailyBar.time);
        const currentTradeMinute = getStartOfMinute(tradeTime);
        let bar;

        if (currentTradeMinute > lastBarTime) {
          bar = {
            time: tradeTime,
            open: subscriptionItem.lastDailyBar.close,
            high: tradePrice,
            low: tradePrice,
            close: tradePrice,
            volume: Number.isFinite(volume) ? volume : subscriptionItem.lastDailyBar.volume,
          };
        } else {
          bar = {
            ...subscriptionItem.lastDailyBar,
            high: Math.max(subscriptionItem.lastDailyBar.high ?? 0, tradePrice),
            low: Math.min(subscriptionItem.lastDailyBar.low ?? Infinity, tradePrice),
            close: tradePrice,
            volume: Number.isFinite(volume) ? volume : (subscriptionItem.lastDailyBar.volume ?? 0),
          };
        }
        subscriptionItem.lastDailyBar = bar;
        subscriptionItem.handlers?.forEach(h => h.callback(bar));
      }
    } catch {
      // Never crash the chart on malformed frames
    }
  };

  socket.on('data', dataHandler);
  listenerAttached = true;
}

/**
 * Register a TradingView subscription and ensure the shared `data` listener
 * is attached. Also asks the server to start streaming ticker for this symbol
 * (the Trade page already subscribes to ticker for the selected pair, but
 * subscribing again is idempotent on the gateway).
 */
function setupStreamWithSocket(params) {
  const { symbolInfo, resolution, onRealtimeCallback, subscriberUID, lastDailyBar } = params;
  const channelString = symbolInfo.name;
  const handler = { id: subscriberUID, callback: onRealtimeCallback };

  let subscriptionItem = channelToSubscription.get(channelString);
  if (subscriptionItem) {
    subscriptionItem.handlers.push(handler);
    ensureDataListener();
    return;
  }

  subscriptionItem = {
    subscriberUID,
    resolution,
    lastDailyBar,
    handlers: [handler],
  };
  channelToSubscription.set(channelString, subscriptionItem);

  // Ask gateway for ticker stream for this symbol (idempotent on the server)
  const parsed = parseFullSymbol(channelString);
  if (socket && parsed?.fromSymbol && parsed?.toSymbol) {
    const binanceSymbol = `${parsed.fromSymbol}${parsed.toSymbol}`.toUpperCase();
    socket.emit('subscribe', { channel: 'ticker', symbol: binanceSymbol });
  }

  ensureDataListener();
}

/**
 * Subscribe to real-time stream for chart updates.
 * Called by the TradingView datafeed.
 */
export async function subscribeOnStream(
  symbolInfo,
  resolution,
  onRealtimeCallback,
  subscriberUID,
  _onResetCacheNeededCallback,
  lastDailyBar
) {
  const params = { symbolInfo, resolution, onRealtimeCallback, subscriberUID, lastDailyBar };
  if (socket) {
    setupStreamWithSocket(params);
  } else {
    pendingStreamParams = params;
  }
}

/**
 * Unsubscribe a single TradingView handler. Called by the TradingView datafeed.
 */
export function unsubscribeFromStream(subscriberUID) {
  for (const [channelString, subscriptionItem] of channelToSubscription) {
    const handlerIndex = subscriptionItem.handlers.findIndex(h => h.id === subscriberUID);
    if (handlerIndex !== -1) {
      subscriptionItem.handlers.splice(handlerIndex, 1);
      if (subscriptionItem.handlers.length === 0) {
        channelToSubscription.delete(channelString);
        const parsed = parseFullSymbol(channelString);
        if (socket && parsed?.fromSymbol && parsed?.toSymbol) {
          const binanceSymbol = `${parsed.fromSymbol}${parsed.toSymbol}`.toUpperCase();
          socket.emit('unsubscribe', { channel: 'ticker', symbol: binanceSymbol });
        }
      }
      break;
    }
  }
}

function getStartOfMinute(timestamp) {
  const date = new Date(timestamp);
  date.setSeconds(0, 0);
  return date.getTime();
}
