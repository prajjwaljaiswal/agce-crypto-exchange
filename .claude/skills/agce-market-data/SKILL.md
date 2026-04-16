---
name: agce-market-data
description: AGCE backend integration reference for the agce-frontend monorepo. Covers matching-service REST (spot orders + market data), market-data-service Socket.IO (live streams), auth token flow, response envelopes, and the hybrid local/Binance liquidity model. Use when wiring a Trade-page feature, debugging socket/REST data flow, or adding a new market/order endpoint.
---

# AGCE Market Data — Backend Integration Reference

Two backend services, one gateway.

| Service | Purpose | Auth |
|---|---|---|
| `matching-service` | Spot CLOB — REST market reads + order place/cancel/mine + wallet balances | JWT for `/orders/**` and `/wallet/**`; public for `/market/**` |
| `market-data-service` | Socket.IO gateway — Binance public streams + local matching events | JWT required for socket connection |
| Gateway | Front door at port `8080`. Proxies both services | — |

**Never hardcode direct service ports in frontend code. Always go through the gateway.**

---

## Base URL & Auth

```
Base URL:  http://192.168.1.13:8080/api/v1
Socket:    http://192.168.1.13:8080   (path: /market-data/socket.io/)
Auth:      Authorization: Bearer <JWT-token>   (from auth_service login)
```

Frontend env (`apps/exchange/.env`):
```env
VITE_AUTH_API_URL=http://192.168.1.13:8080
VITE_MATCHING_API_URL=http://192.168.1.13:8080
VITE_MARKET_DATA_URL=http://192.168.1.13:8080
VITE_MARKET_DATA_PATH=/market-data/socket.io/
VITE_INSTANCE=global
```

Common mistakes:
- `KEY==value` (double `=`) — literal `=` becomes part of the base URL
- Setting `VITE_MARKET_DATA_URL` to the full socket.io path — only the origin goes there; the namespace path goes in `VITE_MARKET_DATA_PATH`
- Reading `localStorage.getItem('token')` — real key is `agce_access_token`. Use `tokenStore.getAccess()`.

---

## REST Endpoints

### Market Data — Public (no auth)

| Endpoint | Method | Purpose | Key Params |
|---|---|---|---|
| `/market/depth` | GET | Order book snapshot | `symbol=BTC-USDT`, `levels=20`, `granularity=0` |
| `/market/trades` | GET | Recent trades | `symbol=BTC-USDT`, `limit=50` |
| `/market/ticker` | GET | 24h ticker stats | `symbol=BTC-USDT` |
| `/market/ohlcv` | GET | OHLCV candles | `symbol=BTC-USDT`, `interval=1m`, `limit=100` |
| `/market/symbols` | GET | All tradeable symbols | — |

Symbol format for all AGCE-local endpoints: **dashed** (`BTC-USDT`, `ETH-USDT`).

Intervals: `1m` `5m` `15m` `1h` `4h` `1d`.

**Defensive parsing is required** — responses may ship levels as tuples `[price, qty]` or objects `{price, quantity}`:
```ts
const parseLevel = (lvl: any) => {
  const price = Array.isArray(lvl) ? lvl[0] : (lvl?.price ?? lvl?.p);
  const qty   = Array.isArray(lvl) ? lvl[1] : (lvl?.quantity ?? lvl?.qty ?? lvl?.q);
  return { price: parseFloat(price), quantity: parseFloat(qty) };
};
```

### Order Management — JWT Required

| Endpoint | Method | Purpose | Body |
|---|---|---|---|
| `/orders` | POST | Place order | `{ symbol, side, type, timeInForce, quantity, price?, stopPrice? }` |
| `/orders/{orderId}` | DELETE | Cancel resting order | — |
| `/orders/mine?limit=100` | GET | My recent orders | — |

**Order types:** `LIMIT`, `MARKET`, `STOP_LIMIT`
**Sides:** `BUY`, `SELL`
**Time in Force:** `GTC` (Good Till Cancelled), `IOC` (Immediate or Cancel), `FOK` (Fill or Kill), `POST_ONLY`

Example place order:
```json
POST /api/v1/orders
{
  "symbol": "BTC-USDT",
  "side": "BUY",
  "type": "LIMIT",
  "timeInForce": "GTC",
  "quantity": "0.01",
  "price": "50000.00"
}
```

Order shape returned by the server:
```json
{
  "_id": "…",
  "orderId": "uuid",
  "userId": "…",
  "symbol": "BTC-USDT",
  "side": "BUY",
  "type": "LIMIT",
  "timeInForce": "GTC",
  "price": "50000.00",
  "quantity": "0.01",
  "filledQty": "0",
  "status": "OPEN",
  "instance": "GLOBAL",
  "createdAt": "…",
  "updatedAt": "…"
}
```

Field notes:
- Server uses `OPEN` (not `NEW` like Binance)
- `filledQty` not `filled` — compute remaining as `quantity - filledQty`
- Use `orderId` (UUID) for cancel, not `_id`

### Wallet / Balances — JWT Required

| Endpoint | Method | Purpose |
|---|---|---|
| `/wallet/balances` | GET | List all asset balances |
| `/wallet/balances/{code}` | GET | Single asset balance (e.g. `/wallet/balances/BTC`) |
| `/wallet/ledger?limit=100` | GET | Balance change history (trades, deposits, etc.) |

Call `GET /wallet/balances` after every successful order placement or cancellation so the UI reflects updated locked/available funds immediately.

### Binance-proxied REST — Public (bootstrap / chart history)

| Endpoint | Purpose |
|---|---|
| `GET /api/v1/binance/depth?symbol=BTCUSDT&limit=100` | Binance order book snapshot |
| `GET /api/v1/binance/trades?symbol=BTCUSDT&limit=100` | Binance recent trades |
| `GET /api/v1/binance/klines?symbol=BTCUSDT&interval=1m&limit=100` | Binance klines |
| `GET /api/v1/binance/ticker/24hr?symbol=BTCUSDT` | 24h ticker |
| `GET /api/v1/binance/exchangeInfo` | All symbols + trading rules (tick/step size) |

Binance endpoints use concat symbol format (`BTCUSDT`, no separator). These are **display-only** — user orders never match against Binance liquidity.

---

## Response Envelope

Both services wrap responses:
```json
{ "success": true, "data": [...] }
{ "success": false, "message": "…", "code": "OPTIONAL_CODE" }
```

Frontend wrappers:
- `matching-api.ts` → `request<T>()` — transparently unwraps `{success, data}`; use for matching-service calls
- `http.ts` → `http<T>()` — unwraps `data[0]` when array; use for auth + kyc

---

## Socket.IO — Live Streams

```ts
import { io } from 'socket.io-client';

const socket = io('http://192.168.1.13:8080', {
  path: '/market-data/socket.io/',
  auth: { token: tokenStore.getAccess() }   // JWT required — refused without it
});
```

**JWT is required.** If the token is missing or invalid, the server refuses the connection with `UNAUTHORIZED`. Guest users get no live stream — REST seed still works.

### Subscribe Protocol

```js
socket.emit('subscribe',   { channel, symbol, interval? })
socket.emit('unsubscribe', { channel, symbol, interval? })
```

Always pair `subscribe` with `unsubscribe` in effect cleanup — the server refcounts streams.

### AGCE Local Channels (matchable liquidity)

| Channel | Symbol format | Listen event | Payload |
|---|---|---|---|
| `local_trade` | `BTC-USDT` | `local:trade:BTC-USDT` | `{ side, price, quantity, timestamp, orderId? }` |
| `local_depth` | `BTC-USDT` | `local:depth:BTC-USDT` | `{ bids: [[price,qty]], asks: [[price,qty]] }` |

```js
socket.emit('subscribe', { channel: 'local_depth', symbol: 'BTC-USDT' });
socket.on('local:depth:BTC-USDT', (data) => { /* live order book */ });

socket.emit('subscribe', { channel: 'local_trade', symbol: 'BTC-USDT' });
socket.on('local:trade:BTC-USDT', (data) => { /* live trades */ });

// Cleanup
socket.emit('unsubscribe', { channel: 'local_depth', symbol: 'BTC-USDT' });
socket.emit('unsubscribe', { channel: 'local_trade', symbol: 'BTC-USDT' });
```

Defensive parse — same tuple/object ambiguity as REST:
```js
const e = event?.payload ?? event;
const price = Array.isArray(e) ? e[0] : e?.price;
```

### Binance-proxied Channels (display-only)

All arrive via a single `"data"` event with an envelope `{ stream, channel, symbol, interval?, payload, ts }`:

| Channel | Symbol | Notes |
|---|---|---|
| `ticker` | `BTCUSDT` | 24h rolling stats — `payload.c` = last price |
| `miniTicker` | `BTCUSDT` | Light ticker |
| `bookTicker` | `BTCUSDT` | Best bid/ask |
| `depth` | `BTCUSDT` | Diff stream (seed from REST first) |
| `depth5` / `depth10` / `depth20` | `BTCUSDT` | Full snapshot at 100ms |
| `trade` | `BTCUSDT` | Individual trade |
| `aggTrade` | `BTCUSDT` | Compressed trades |
| `kline` + `interval` | `BTCUSDT` | Candle ticks |
| `all_tickers` | — | All symbols |
| `all_miniTickers` | — | All symbols, lite |

```js
socket.emit('subscribe', { channel: 'ticker', symbol: 'BTCUSDT' });
socket.on('data', (event) => {
  if (event.channel !== 'ticker') return;
  // event.payload = raw Binance payload
});
```

Filter by `event.symbol.toUpperCase() === expected` after a pair switch to discard stale frames.

---

## Typical Trade Page Flow

```
1. Bootstrap (works for guests)
   GET /market/depth + /market/ohlcv + /market/ticker + /market/trades
   GET /wallet/balances  (if authenticated)

2. Subscribe to live (authenticated only — socket refuses guests)
   socket.emit('subscribe', { channel: 'local_depth', symbol: 'BTC-USDT' })
   socket.emit('subscribe', { channel: 'local_trade', symbol: 'BTC-USDT' })

3. Place order
   POST /orders  with JWT

4. After fill/order event
   GET /wallet/balances  → refresh balances
   GET /orders/mine      → refresh order table

5. Cancel
   DELETE /orders/{orderId}
   GET /wallet/balances  → refresh
```

---

## Which Channels to Use on the Trade Page

The same Socket.IO connection carries **two separate data sources**. Use them differently:

| Channel | Listen Event | Source | Use for |
|---|---|---|---|
| `local_depth` (`BTC-USDT`) | `local:depth:BTC-USDT` | AGCE matching engine | **Order book (primary)** — real resting orders, matchable |
| `local_trade` (`BTC-USDT`) | `local:trade:BTC-USDT` | AGCE matching engine | **Trade tape (primary)** — actual fills |
| `ticker` (`BTCUSDT`) | `"data"` | Binance (proxied) | 24h stats display (last price, change %, high/low/vol) |
| `depth20` (`BTCUSDT`) | `"data"` | Binance (proxied) | Reference depth behind local book (display-only rows) |
| `trade` (`BTCUSDT`) | `"data"` | Binance (proxied) | Reference trade feed only |
| `kline` (`BTCUSDT`) | `"data"` | Binance (proxied) | Chart candle ticks when local tape is empty |

**Rule of thumb for the trade page:** subscribe to `local_depth` + `local_trade` for everything functional (order book, trade tape, chart updates). Binance channels are optional reference data for display enrichment only — user orders never match against them.

---

## Architectural Rules

1. **Matching-service has NO Socket.IO.** All live market data goes through `market-data-service` socket.
2. **User orders NEVER match Binance liquidity.** Binance rows in the book are **display-only** — tag with `source: 'binance'`, grey them out, disable click-to-fill.
3. **Symbol format:** dashed (`BTC-USDT`) for AGCE-local; concat (`BTCUSDT`) for Binance-proxied. Never cross them.
4. **Token key:** `agce_access_token` in localStorage. Use `tokenStore.getAccess()`, never raw `localStorage.getItem('token')`.

---

## Known Empty-State Behavior

- `/market/ohlcv` returns `[]` when no local trades yet — chart shows "no data", correct behavior
- `/market/depth` returns empty bids/asks when no resting orders — order book shows empty, correct
- Socket emits nothing for guests (server refuses connection) — REST seed still renders the page

---

## Frontend Integration Points

| Concern | File |
|---|---|
| Socket provider | `apps/exchange/src/features/Trade/SocketContext.js` |
| REST client + types | `apps/exchange/src/lib/matching-api.ts` |
| Token storage | `apps/exchange/src/lib/tokenStore.ts` |
| Trade page orchestration | `apps/exchange/src/features/Trade/index.tsx` |
| Market data hook | `apps/exchange/src/features/Trade/hooks/useMarketData.ts` |
| Wallets hook | `apps/exchange/src/features/Trade/hooks/useSpotWallets.ts` |
| My orders hook | `apps/exchange/src/features/Trade/hooks/useMyOrders.ts` |
| Order book panel | `apps/exchange/src/features/Trade/components/OrderBook/OrderBookPanel.tsx` |
| Chart datafeed | `apps/exchange/src/features/Trade/Libraries/TVChartContainer/datafeed.js` |
| Chart streaming | `apps/exchange/src/features/Trade/Libraries/TVChartContainer/streaming.js` |

---

## Common Pitfalls

| Pitfall | Symptom | Fix |
|---|---|---|
| Hardcoded symbol in socket subscribe | Only BTC/USDT gets live updates | Use the dynamic `localSymbol` variable (dashed format) |
| Reading `localStorage.getItem('token')` | Always null | Use `tokenStore.getAccess()` |
| Missing `auth: { token }` in `io()` | `UNAUTHORIZED` disconnect | Pass token in `io(url, { auth: { token } })` |
| Binance rows clickable in order book | User places unmatchable order | Tag Binance rows `source:'binance'`, disable click |
| No wallet refresh after order | Stale balance shown | Call `GET /wallet/balances` after every place/cancel |
| Status `NEW` check on orders | Open orders disappear | Server uses `OPEN` not `NEW` |
| `filledQty` vs `filled` | Wrong fill calculation | Field is `filledQty`; remaining = `quantity - filledQty` |
| Double `=` in env | API 404s on `/=http://…` | Single `=` per env line |
