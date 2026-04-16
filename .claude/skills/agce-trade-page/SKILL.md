---
name: agce-trade-page
description: Frontend integration reference for the AGCE trade page — REST endpoints, Socket.IO channels, authentication, event payloads, ordering flow, and ready-to-copy code. Use when building any trading UI (order book, chart, order entry, balances, ticker, recent trades) on top of the AGCE backend. All data is local AGCE matching data; Binance is NOT used on the trade page.
---

# AGCE Trade Page Integration Skill

Everything a frontend developer needs to wire the trade page to the AGCE backend. All market data is **local AGCE data**, served through the API Gateway. Binance is only used by the hedging engine internally.

---

## 1. Gateway

```
http://192.168.1.13:8080
```

Every REST call and the single Socket.IO connection go through this URL. Admin-only endpoints (`/admin/**`) are NOT exposed through the gateway.

---

## 2. Authentication

| Scope | Auth |
|---|---|
| Market data (depth, trades, ticker, OHLCV, symbols, pairs) | Public — no token |
| Place / cancel / list orders | **JWT required** (`Authorization: Bearer <token>`) |
| Wallet balances & ledger | **JWT required** |
| Socket.IO public channels (all `local_*`) | Public — no token |

Login → JWT:
```ts
const res = await fetch("http://192.168.1.13:8080/api/v1/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
const { data } = await res.json();
localStorage.setItem("agce_jwt", data.accessToken);
```

**Access token expires in 15 min** — refresh with the refresh token via `/api/v1/auth/refresh` (body: `{ refreshToken }`).

---

## 3. UI Block → Data Source Map

| UI Block | Initial REST Load | Live Socket.IO |
|---|---|---|
| Symbol selector | `GET /api/v1/pairs` | — |
| Top ticker bar | `GET /api/v1/market/ticker?symbol=BTC-USDT` | `local:ticker:BTC-USDT` |
| Candlestick chart | `GET /api/v1/market/ohlcv?symbol=BTC-USDT&interval=1m` | `local:kline:BTC-USDT:1m` |
| Order book (full) | `GET /api/v1/market/depth?symbol=BTC-USDT&levels=50` | `local:depth:BTC-USDT` |
| Order book (top N) | `GET /api/v1/market/depth?symbol=BTC-USDT&levels=20` | `local:depth5/10/20:BTC-USDT` |
| Best bid/ask header | — | `local:bookTicker:BTC-USDT` |
| Recent trades tab | `GET /api/v1/market/trades?symbol=BTC-USDT&limit=50` | `local:trade:BTC-USDT` |
| Open orders | `GET /api/v1/orders/mine?limit=100` (JWT) | re-fetch after place/cancel/fill |
| Trade history | `GET /api/v1/orders/mine?limit=100` (JWT) | same |
| Assets panel | `GET /api/v1/wallet/balances` (JWT) | re-fetch after fill |
| Place order | `POST /api/v1/orders` (JWT) | — |
| Cancel order | `DELETE /api/v1/orders/:orderId` (JWT) | — |

---

## 4. REST Endpoints

### 4.1 Pairs
```
GET /api/v1/pairs                    # list active pairs
GET /api/v1/pairs/:symbol            # pair detail + base/quote asset metadata
```
Response includes `referencePrice` (seeded from Binance on create) and `tickSize` / `lotSize` / `minNotional` — use these for order-form validation.

### 4.2 Market Data (public)
```
GET /api/v1/market/symbols
GET /api/v1/market/depth?symbol=BTC-USDT&levels=50&granularity=0
GET /api/v1/market/trades?symbol=BTC-USDT&limit=50
GET /api/v1/market/ticker?symbol=BTC-USDT
GET /api/v1/market/ohlcv?symbol=BTC-USDT&interval=1m&from=<ms>&to=<ms>
```

**Ticker response shape** (zero-filled if no trades yet):
```json
{
  "symbol": "BTC-USDT",
  "last": "50000", "open": "49000",
  "high": "50500", "low": "48800",
  "volume": "123.4",
  "priceChange": "1000",
  "priceChangePercent": "2.0408",
  "count": 42,
  "openTime": 1776200000000,
  "closeTime": 1776299999999,
  "now": 1776300000000
}
```

**OHLCV candle shape** (for TradingView / Lightweight Charts):
```json
{
  "time": 1776200000000,
  "openTime": 1776200000000,
  "closeTime": 1776200059999,
  "open":  "50000",
  "high":  "50100",
  "low":   "49990",
  "close": "50050",
  "volume": "2.5"
}
```

### 4.3 Orders (JWT)
```
POST   /api/v1/orders                # place
DELETE /api/v1/orders/:orderId       # cancel resting
GET    /api/v1/orders/mine?limit=100 # my recent orders
```

**Place order body:**
```json
{
  "symbol": "BTC-USDT",
  "side": "BUY" | "SELL",
  "type": "LIMIT" | "MARKET" | "STOP_LIMIT",
  "timeInForce": "GTC" | "IOC" | "FOK" | "POST_ONLY",
  "quantity": "0.01",
  "price": "50000.00",    // required for LIMIT / STOP_LIMIT
  "stopPrice": "50900.00" // required for STOP_LIMIT
}
```

**Rejection codes** (422):
- `VALIDATION_ERROR` — bad body
- `POST_ONLY_WOULD_TAKE` — post-only that would have taken liquidity
- `FOK_NOT_FILLABLE` — FOK couldn't fill 100%
- `INVALID_ORDER` — outside `tickSize`/`lotSize`/`minNotional`, or pair not tradable
- `TRADING_HALTED` — admin halt in effect

### 4.4 Wallet (JWT)
```
GET /api/v1/wallet/balances              # all assets
GET /api/v1/wallet/balances/:asset       # single asset
GET /api/v1/wallet/ledger?limit=100      # balance change history
```

Balance row:
```json
{ "asset": "BTC", "free": "0.5", "locked": "0", "instance": "GLOBAL" }
```

**All numeric values are decimal strings.** Use `decimal.js` on the frontend — never `Number()` for math.

---

## 5. Socket.IO (Live Data)

### Connection

| Field | Value |
|---|---|
| URL | `http://192.168.1.13:8080` |
| Handshake path | `/socket.io/` (default — don't change) |
| Transport | `websocket` |
| Auth (optional) | `{ auth: { token: "<jwt>" } }` |

**Use the Socket.IO client library** — raw WebSocket tools do NOT work:
- ✅ `socket.io-client` (npm)
- ✅ Postman "Socket.IO" request type
- ❌ Postman "WebSocket" type, wscat, browser `new WebSocket()`

```ts
import io from "socket.io-client";
const socket = io("http://192.168.1.13:8080");
```

### All Local Channels (Binance parity)

#### Per-symbol

| Subscribe payload | Emit event | Payload description |
|---|---|---|
| `{channel:"local_trade", symbol:"BTC-USDT"}` | `local:trade:BTC-USDT` | Individual trade |
| `{channel:"local_aggTrade", symbol:"BTC-USDT"}` | `local:aggTrade:BTC-USDT` | Aggregated trade (same as trade for now) |
| `{channel:"local_kline", symbol:"BTC-USDT", interval:"1m"}` | `local:kline:BTC-USDT:1m` | Candlestick update |
| `{channel:"local_ticker", symbol:"BTC-USDT"}` | `local:ticker:BTC-USDT` | 24h rolling ticker |
| `{channel:"local_miniTicker", symbol:"BTC-USDT"}` | `local:miniTicker:BTC-USDT` | 24h rolling lite |
| `{channel:"local_bookTicker", symbol:"BTC-USDT"}` | `local:bookTicker:BTC-USDT` | Best bid/ask |
| `{channel:"local_depth", symbol:"BTC-USDT"}` | `local:depth:BTC-USDT` | Full depth snapshot |
| `{channel:"local_depth5", symbol:"BTC-USDT"}` | `local:depth5:BTC-USDT` | Top 5 each side |
| `{channel:"local_depth10", symbol:"BTC-USDT"}` | `local:depth10:BTC-USDT` | Top 10 each side |
| `{channel:"local_depth20", symbol:"BTC-USDT"}` | `local:depth20:BTC-USDT` | Top 20 each side |

#### Global (all symbols)

| Subscribe payload | Emit event | Cadence |
|---|---|---|
| `{channel:"local_all_tickers"}` | `local:all_tickers` | Every 1s — array of every symbol's ticker |
| `{channel:"local_all_miniTickers"}` | `local:all_miniTickers` | Every 1s — array of every symbol's miniTicker |

### Payload Shapes

**trade / aggTrade:**
```json
{ "source":"local", "tradeId":"...", "symbol":"BTC-USDT",
  "price":"50000", "quantity":"0.01", "takerSide":"BUY",
  "timestamp":1776300000000 }
```

**kline:**
```json
{ "source":"local", "symbol":"BTC-USDT", "interval":"1m",
  "openTime":1776300000000, "closeTime":1776300059999,
  "open":"50000", "high":"50100", "low":"49990", "close":"50050",
  "volume":"2.5", "trades":42, "isClosed":false }
```

**ticker:**
```json
{ "source":"local", "symbol":"BTC-USDT", "last":"50050",
  "open":"49000", "high":"50100", "low":"48800", "volume":"123.4",
  "priceChange":"1050", "priceChangePercent":"2.1428",
  "count":42, "openTime":..., "closeTime":..., "now":... }
```

**miniTicker:**
```json
{ "source":"local", "symbol":"BTC-USDT", "last":"50050",
  "open":"49000", "high":"50100", "low":"48800",
  "volume":"123.4", "closeTime":1776300000000 }
```

**bookTicker:**
```json
{ "source":"local", "symbol":"BTC-USDT",
  "bidPrice":"49998", "bidQty":"0.5",
  "askPrice":"50002", "askQty":"0.3",
  "ts":1776300000000 }
```

**depth / depth5 / depth10 / depth20:**
```json
{ "source":"local", "symbol":"BTC-USDT", "sequence":42,
  "bids":[["49998","0.5"], ...], "asks":[["50002","0.3"], ...],
  "ts":1776300000000 }
```

### Server → Client utility events
- `connect` — connection open
- `subscribed` / `unsubscribed` — ack
- `error` — invalid subscribe or internal error
- `disconnect` — connection dropped (client reconnects automatically)

### Client → Server events
- `subscribe` (payloads above)
- `unsubscribe` (same payload shape)
- `unsubscribe:all` — clears every subscription on this socket

---

## 6. Page Lifecycle

### 6.1 On Mount

```ts
const GATEWAY = "http://192.168.1.13:8080";
const SYMBOL  = "BTC-USDT";
const JWT     = localStorage.getItem("agce_jwt");

async function api(path, init = {}) {
  const res = await fetch(`${GATEWAY}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(JWT ? { Authorization: `Bearer ${JWT}` } : {}),
      ...(init.headers || {}),
    },
  });
  const body = await res.json();
  if (!body.success) throw new Error(body.error?.message ?? "request failed");
  return body.data;
}

// Parallel public fetches
const [pairs, ticker, candles, depth, trades] = await Promise.all([
  api("/api/v1/pairs"),
  api(`/api/v1/market/ticker?symbol=${SYMBOL}`),
  api(`/api/v1/market/ohlcv?symbol=${SYMBOL}&interval=1m`),
  api(`/api/v1/market/depth?symbol=${SYMBOL}&levels=50`),
  api(`/api/v1/market/trades?symbol=${SYMBOL}&limit=50`),
]);

// Authed fetches (only when logged in)
const [balances, myOrders] = JWT
  ? await Promise.all([
      api("/api/v1/wallet/balances"),
      api("/api/v1/orders/mine?limit=100"),
    ])
  : [[], []];
```

### 6.2 Open Socket Once

```ts
import io from "socket.io-client";

const socket = io(GATEWAY, {
  transports: ["websocket"],
  ...(JWT ? { auth: { token: JWT } } : {}),
});

socket.on("connect", () => {
  subscribeSymbol(SYMBOL);
});

function subscribeSymbol(sym) {
  // Pick the ones your page actually renders
  socket.emit("subscribe", { channel: "local_ticker",     symbol: sym });
  socket.emit("subscribe", { channel: "local_bookTicker", symbol: sym });
  socket.emit("subscribe", { channel: "local_trade",      symbol: sym });
  socket.emit("subscribe", { channel: "local_depth20",    symbol: sym });
  socket.emit("subscribe", { channel: "local_kline",      symbol: sym, interval: "1m" });
}

function unsubscribeSymbol(sym) {
  socket.emit("unsubscribe", { channel: "local_ticker",     symbol: sym });
  socket.emit("unsubscribe", { channel: "local_bookTicker", symbol: sym });
  socket.emit("unsubscribe", { channel: "local_trade",      symbol: sym });
  socket.emit("unsubscribe", { channel: "local_depth20",    symbol: sym });
  socket.emit("unsubscribe", { channel: "local_kline",      symbol: sym, interval: "1m" });
}
```

### 6.3 Handle Live Events

```ts
socket.on(`local:ticker:${SYMBOL}`, (t) => {
  setTicker(t);
});

socket.on(`local:bookTicker:${SYMBOL}`, (b) => {
  setBestBid(b.bidPrice);
  setBestAsk(b.askPrice);
});

socket.on(`local:trade:${SYMBOL}`, (t) => {
  setTrades(prev => [t, ...prev].slice(0, 50));
});

socket.on(`local:depth20:${SYMBOL}`, (d) => {
  setOrderBook({ bids: d.bids, asks: d.asks });
});

socket.on(`local:kline:${SYMBOL}:1m`, (k) => {
  setCandles(prev => {
    const last = prev[prev.length - 1];
    if (last && last.openTime === k.openTime) {
      return [...prev.slice(0, -1), k]; // replace current bucket
    }
    return [...prev, k]; // new bucket
  });
});
```

### 6.4 Place Order Flow

```ts
async function placeOrder({ side, type, timeInForce, quantity, price, stopPrice }) {
  try {
    const data = await api("/api/v1/orders", {
      method: "POST",
      body: JSON.stringify({
        symbol: SYMBOL, side, type, timeInForce, quantity, price, stopPrice,
      }),
    });
    // Successful place → refresh open orders + balances. Fills arrive
    // via local:trade (+ derived local:ticker / local:depth).
    await Promise.all([refreshMyOrders(), refreshBalances()]);
    return data;
  } catch (err) {
    toast.error(err.message); // VALIDATION_ERROR / POST_ONLY_WOULD_TAKE / etc.
  }
}
```

### 6.5 Cancel Order

```ts
await api(`/api/v1/orders/${orderId}`, { method: "DELETE" });
await refreshMyOrders();
```

### 6.6 Symbol Switch

Same socket, new subs:
```ts
async function switchSymbol(oldSym, newSym) {
  unsubscribeSymbol(oldSym);
  const [ticker, candles, depth, trades] = await Promise.all([
    api(`/api/v1/market/ticker?symbol=${newSym}`),
    api(`/api/v1/market/ohlcv?symbol=${newSym}&interval=1m`),
    api(`/api/v1/market/depth?symbol=${newSym}&levels=50`),
    api(`/api/v1/market/trades?symbol=${newSym}&limit=50`),
  ]);
  applyNewSymbol({ ticker, candles, depth, trades });
  subscribeSymbol(newSym);
}
```

### 6.7 Chart Interval Switch

```ts
async function switchInterval(newInterval) {
  socket.emit("unsubscribe", { channel: "local_kline", symbol: SYMBOL, interval: currentInterval });
  const candles = await api(`/api/v1/market/ohlcv?symbol=${SYMBOL}&interval=${newInterval}`);
  setCandles(candles);
  socket.emit("subscribe", { channel: "local_kline", symbol: SYMBOL, interval: newInterval });
  currentInterval = newInterval;
}
```

### 6.8 Reconnect

`socket.io-client` auto-reconnects. On reconnect, re-emit all subscriptions AND refresh REST snapshots (you may have missed events):

```ts
socket.on("connect", () => {
  subscribeSymbol(currentSymbol);
  refreshDepth(); refreshTicker(); refreshTrades();
  if (JWT) { refreshBalances(); refreshMyOrders(); }
});
```

---

## 7. React Example (Complete Skeleton)

```tsx
import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

const GATEWAY = "http://192.168.1.13:8080";

export function TradePage() {
  const [symbol, setSymbol]       = useState("BTC-USDT");
  const [ticker, setTicker]       = useState<any>(null);
  const [candles, setCandles]     = useState<any[]>([]);
  const [orderBook, setOrderBook] = useState<any>({ bids: [], asks: [] });
  const [trades, setTrades]       = useState<any[]>([]);
  const [balances, setBalances]   = useState<any[]>([]);
  const [myOrders, setMyOrders]   = useState<any[]>([]);
  const socketRef                 = useRef<Socket | null>(null);
  const JWT = localStorage.getItem("agce_jwt");

  useEffect(() => {
    (async () => {
      const [t, c, d, r] = await Promise.all([
        fetch(`${GATEWAY}/api/v1/market/ticker?symbol=${symbol}`).then(x => x.json()).then(x => x.data),
        fetch(`${GATEWAY}/api/v1/market/ohlcv?symbol=${symbol}&interval=1m`).then(x => x.json()).then(x => x.data),
        fetch(`${GATEWAY}/api/v1/market/depth?symbol=${symbol}&levels=50`).then(x => x.json()).then(x => x.data),
        fetch(`${GATEWAY}/api/v1/market/trades?symbol=${symbol}&limit=50`).then(x => x.json()).then(x => x.data),
      ]);
      setTicker(t); setCandles(c); setOrderBook(d); setTrades(r);
      if (JWT) {
        const [b, o] = await Promise.all([
          fetch(`${GATEWAY}/api/v1/wallet/balances`, { headers: { Authorization: `Bearer ${JWT}` }}).then(x => x.json()).then(x => x.data),
          fetch(`${GATEWAY}/api/v1/orders/mine?limit=100`, { headers: { Authorization: `Bearer ${JWT}` }}).then(x => x.json()).then(x => x.data),
        ]);
        setBalances(b); setMyOrders(o);
      }
    })();
  }, [symbol]);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(GATEWAY, {
        transports: ["websocket"],
        ...(JWT ? { auth: { token: JWT } } : {}),
      });
    }
    const s = socketRef.current;

    const onTicker = (x: any) => setTicker(x);
    const onTrade  = (x: any) => setTrades(p => [x, ...p].slice(0, 50));
    const onDepth  = (x: any) => setOrderBook({ bids: x.bids, asks: x.asks });
    const onKline  = (k: any) => setCandles(p => {
      const last = p[p.length - 1];
      if (last && last.time === k.openTime) return [...p.slice(0, -1), { ...k, time: k.openTime }];
      return [...p, { ...k, time: k.openTime }];
    });

    s.on(`local:ticker:${symbol}`, onTicker);
    s.on(`local:trade:${symbol}`, onTrade);
    s.on(`local:depth20:${symbol}`, onDepth);
    s.on(`local:kline:${symbol}:1m`, onKline);

    s.emit("subscribe", { channel: "local_ticker", symbol });
    s.emit("subscribe", { channel: "local_trade", symbol });
    s.emit("subscribe", { channel: "local_depth20", symbol });
    s.emit("subscribe", { channel: "local_kline", symbol, interval: "1m" });

    return () => {
      s.emit("unsubscribe", { channel: "local_ticker", symbol });
      s.emit("unsubscribe", { channel: "local_trade", symbol });
      s.emit("unsubscribe", { channel: "local_depth20", symbol });
      s.emit("unsubscribe", { channel: "local_kline", symbol, interval: "1m" });
      s.off(`local:ticker:${symbol}`, onTicker);
      s.off(`local:trade:${symbol}`, onTrade);
      s.off(`local:depth20:${symbol}`, onDepth);
      s.off(`local:kline:${symbol}:1m`, onKline);
    };
  }, [symbol]);

  useEffect(() => () => {
    socketRef.current?.emit("unsubscribe:all");
    socketRef.current?.disconnect();
  }, []);

  // ... render UI
}
```

---

## 8. Implementation Checklist

- [ ] REST bootstrap: pairs, ticker, OHLCV, depth, trades on mount
- [ ] REST bootstrap (JWT): balances + my-orders on mount
- [ ] Socket.IO opens once per trade page visit
- [ ] Subscribe to chosen channels for active symbol
- [ ] On reconnect: re-subscribe + refresh REST snapshots
- [ ] Order-book merge: don't naive-replace, merge by price level
- [ ] Chart candles: last candle replaced on each kline event (`openTime` matches); new candle appended on rollover
- [ ] Recent trades prepended, capped at 50
- [ ] Ticker live-updates last price + 24h %
- [ ] Place order → toast on rejection codes → refresh orders + balances on success
- [ ] Cancel order → refresh orders on success
- [ ] Symbol switch: unsubscribe old, fetch REST, subscribe new (DON'T disconnect)
- [ ] Decimal math with `decimal.js` (strings, never `Number()`)
- [ ] Empty-state: render page even when book / candles / trades are empty
- [ ] JWT refresh before expiry (15 min access token)
- [ ] Hide `/admin/*` — those routes are not exposed through the gateway

---

## 9. Common Gotchas

1. **Socket.IO ≠ raw WebSocket.** Use `socket.io-client`, not `new WebSocket()`. Postman "WebSocket" type will NOT work — use "Socket.IO".
2. **All amounts are strings.** `0.1 + 0.2 !== 0.3` in JavaScript — use `decimal.js`.
3. **JWT expires in 15 min.** Wire up `/auth/refresh` before expiry.
4. **No fund reservation yet.** Placing a LIMIT order does NOT lock balance. Balance only changes when a trade executes.
5. **MARKET orders with no liquidity get CANCELLED**, not rested.
6. **Symbol format:** `BTC-USDT` (dash, uppercase). Always. Binance `BTCUSDT` is NOT valid for local endpoints.
7. **`_id` vs `orderId`:** orders have both — use `orderId` in all API calls (it's what `DELETE /orders/:orderId` expects).
8. **Zero-filled ticker:** A pair with no trades returns `{ last:"0", high:"0", ... }`, not null. No null-guard needed.
9. **`referencePrice` on pairs:** seeded from Binance on pair creation — use as a "market reference" hint when the internal book is empty.
10. **Kline rollover:** when `k.openTime` differs from your last candle's `openTime`, append a new candle; otherwise replace the last one.

---

## 10. Admin / Backend-only (NOT on public gateway)

If you see `/admin/*` routes in docs — they require an `X-Admin-Token` and are reachable only via `kubectl port-forward` or a future admin UI. Don't try to call them from the public frontend.

Endpoints intentionally hidden from the gateway:
- `/api/v1/wallet/admin/**` (balance adjust)
- `/api/v1/orders/admin/**` (halt / resume / status)
- `/api/v1/assets/admin/**` and `/api/v1/pairs/admin/**` (catalogue writes)
- `/api/v1/mm/admin/**` (market-maker onboarding)
- `/api/v1/hedging/admin/**` (treasury ops)

---

## 11. Quick Reference Card

| Thing | Endpoint / Channel |
|---|---|
| Gateway | `http://192.168.1.13:8080` |
| Socket.IO path | `/socket.io/` |
| Login | `POST /api/v1/auth/login` |
| Refresh JWT | `POST /api/v1/auth/refresh` |
| Pairs list | `GET /api/v1/pairs` |
| Pair detail | `GET /api/v1/pairs/:symbol` |
| Order book | `GET /api/v1/market/depth` |
| Trades | `GET /api/v1/market/trades` |
| Ticker | `GET /api/v1/market/ticker` |
| Candles | `GET /api/v1/market/ohlcv` |
| Symbols | `GET /api/v1/market/symbols` |
| Place order | `POST /api/v1/orders` |
| Cancel order | `DELETE /api/v1/orders/:orderId` |
| My orders | `GET /api/v1/orders/mine` |
| Balances | `GET /api/v1/wallet/balances` |
| Ledger | `GET /api/v1/wallet/ledger` |
| Live trade | subscribe `local_trade` → `local:trade:<SYM>` |
| Live depth | subscribe `local_depth` → `local:depth:<SYM>` |
| Live top-N | `local_depth5/10/20` → `local:depth5/10/20:<SYM>` |
| Live ticker | subscribe `local_ticker` → `local:ticker:<SYM>` |
| Live miniTicker | subscribe `local_miniTicker` → `local:miniTicker:<SYM>` |
| Live bookTicker | subscribe `local_bookTicker` → `local:bookTicker:<SYM>` |
| Live candles | subscribe `local_kline` (with `interval`) → `local:kline:<SYM>:<INT>` |
| Live all tickers | subscribe `local_all_tickers` → `local:all_tickers` |
| Live all mini | subscribe `local_all_miniTickers` → `local:all_miniTickers` |
