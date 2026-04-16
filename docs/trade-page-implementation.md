# AGCE Trade Page — Frontend Implementation Guide

Step-by-step guide for the frontend developer to wire the trade page to AGCE backend services. Every UI block on the trade page is mapped to a REST call (for initial load) and a Socket.IO subscription (for live updates). All data is **local AGCE data** — Binance is **not** used on this page.

---

## Gateway

```
http://192.168.1.13:8080
```

All REST calls and the Socket.IO connection go through this single URL. No direct service ports.

---

## Auth Bootstrap

Before rendering the trade page, get a JWT from `auth-service`:

```ts
const res = await fetch("http://192.168.1.13:8080/api/v1/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
const { data } = await res.json();
localStorage.setItem("agce_jwt", data.accessToken);
```

Anonymous users can still see the chart, order book, and live trades. Only placing orders and viewing personal data requires the JWT.

---

## Page Layout → Data Source Map

| UI Block | Initial Load (REST) | Live Updates (Socket.IO) |
|---|---|---|
| **Symbol selector (top-left)** | `GET /api/v1/market/symbols` | — |
| **Top ticker bar** (last price, 24h %, high, low, volume) | `GET /api/v1/market/ticker?symbol=BTC-USDT` | Derived from `local:trade:BTC-USDT` |
| **Candlestick chart + volume** | `GET /api/v1/market/ohlcv?symbol=BTC-USDT&interval=1m` | Append each `local:trade:BTC-USDT` to the latest candle |
| **Order Book** (bids/asks + spread) | `GET /api/v1/market/depth?symbol=BTC-USDT&levels=50` | `local:depth:BTC-USDT` |
| **Recent Trades** tab | `GET /api/v1/market/trades?symbol=BTC-USDT&limit=50` | `local:trade:BTC-USDT` |
| **Order panel** (Buy / Sell, Limit / Market / Conditional) | — | — |
| **Place order button** | `POST /api/v1/orders` | Response comes back via `local:trade:*` if it fills |
| **Open Orders tab** | `GET /api/v1/orders/mine?limit=100` (filter `status=OPEN`) | TODO — `user:order:*` private channel (not built yet) |
| **Order History tab** | `GET /api/v1/orders/mine?limit=100` | TODO — private channel |
| **Trade History tab** | `GET /api/v1/orders/mine?limit=100` (filter filled) | TODO — private channel |
| **Assets panel** (right bottom) | `GET /api/v1/wallet/balances` | TODO — `user:balance:*` private channel (not built yet) |
| **Cancel order button** | `DELETE /api/v1/orders/:orderId` | — |

> **Until user-specific Socket.IO channels are implemented**, the Open Orders / Order History / Assets panels should re-fetch after every `POST /orders`, `DELETE /orders/:id`, and every time a `local:trade` event arrives that involves the user.

---

## Phase 1 — Initial Page Load (on component mount)

Everything below fires in parallel. Don't wait for one before starting the next.

```ts
const GATEWAY = "http://192.168.1.13:8080";
const JWT     = localStorage.getItem("agce_jwt");
const SYMBOL  = "BTC-USDT";

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

// ---------- Public (no auth) ----------
const [symbols, ticker, candles, depth, recentTrades] = await Promise.all([
  api("/api/v1/market/symbols"),
  api(`/api/v1/market/ticker?symbol=${SYMBOL}`),
  api(`/api/v1/market/ohlcv?symbol=${SYMBOL}&interval=1m`),
  api(`/api/v1/market/depth?symbol=${SYMBOL}&levels=50`),
  api(`/api/v1/market/trades?symbol=${SYMBOL}&limit=50`),
]);

// ---------- Authed (needs JWT) — load only if logged in ----------
let balances = [], myOrders = [];
if (JWT) {
  [balances, myOrders] = await Promise.all([
    api("/api/v1/wallet/balances"),
    api("/api/v1/orders/mine?limit=100"),
  ]);
}
```

Render the page with this data. Nothing below depends on trades happening — the chart, order book, and recent trades all have the REST snapshot already.

---

## Phase 2 — Open the Socket.IO Connection

Open **once** when the trade page mounts. It stays open until the user navigates away. The connection must not be re-created on every symbol change — just subscribe/unsubscribe.

```ts
import io from "socket.io-client";

const socket = io(GATEWAY, {
  transports: ["websocket"],
  ...(JWT ? { auth: { token: JWT } } : {}),
});

socket.on("connect", () => {
  console.log("[socket] connected:", socket.id);
  subscribeSymbol(SYMBOL);
});

socket.on("disconnect", (reason) => {
  console.warn("[socket] disconnected:", reason);
});

socket.on("connect_error", (err) => {
  console.error("[socket] connect_error:", err.message);
});

function subscribeSymbol(sym) {
  socket.emit("subscribe", { channel: "local_depth", symbol: sym });
  socket.emit("subscribe", { channel: "local_trade", symbol: sym });
}

function unsubscribeSymbol(sym) {
  socket.emit("unsubscribe", { channel: "local_depth", symbol: sym });
  socket.emit("unsubscribe", { channel: "local_trade", symbol: sym });
}
```

### Important

- Open the socket **immediately on page mount**, even if no trades are happening. An idle connection is cheap.
- When the user switches pair (e.g. BTC-USDT → ETH-USDT): call `unsubscribeSymbol(oldSym)` then `subscribeSymbol(newSym)`. Do not disconnect the socket.
- On page unmount: `socket.emit("unsubscribe:all"); socket.disconnect();`

---

## Phase 3 — Handle Live Events

### 3.1 Order Book Updates

```ts
socket.on(`local:depth:${SYMBOL}`, (update) => {
  // update = {
  //   source: "local",
  //   symbol: "BTC-USDT",
  //   sequence: 42,
  //   bids: [["50000.00", "0.01"], ...],  // price, quantity
  //   asks: [["50001.00", "0.02"], ...],
  //   ts: 1708234560000
  // }

  // Overwrite / merge into your local order-book state.
  // Each update is a full snapshot of the changed price levels — safest
  // to merge into the existing book keyed by price.
  setOrderBook((prev) => mergeDepth(prev, update));
});

function mergeDepth(prev, u) {
  const bids = new Map(prev.bids);
  const asks = new Map(prev.asks);
  u.bids.forEach(([p, q]) => (q === "0" ? bids.delete(p) : bids.set(p, q)));
  u.asks.forEach(([p, q]) => (q === "0" ? asks.delete(p) : asks.set(p, q)));
  return { bids, asks, sequence: u.sequence };
}
```

### 3.2 Live Trades → Feed + Chart + Ticker

```ts
socket.on(`local:trade:${SYMBOL}`, (trade) => {
  // trade = {
  //   source: "local",
  //   tradeId: "t-abc123",
  //   symbol: "BTC-USDT",
  //   price: "50000.00",
  //   quantity: "0.01",
  //   takerSide: "BUY",        // BUY = green row, SELL = red row
  //   timestamp: 1708234560000
  // }

  // 1. Prepend to Recent Trades list (cap at 50).
  setRecentTrades((prev) => [trade, ...prev].slice(0, 50));

  // 2. Update the last candle on the chart.
  setCandles((prev) => appendToLastCandle(prev, trade));

  // 3. Update the top ticker bar (last price + 24h % change).
  setTicker((prev) => ({
    ...prev,
    lastPrice: trade.price,
    pctChange: calcPct(prev.open24h, trade.price),
  }));

  // 4. If the user placed this order, re-fetch orders + balances.
  if (JWT && trade.userIds?.includes(currentUserId)) {
    refetchMyOrders();
    refetchBalances();
  }
});
```

### 3.3 Server Confirmations & Errors

```ts
socket.on("subscribed",   ({ channel, symbol }) => console.log("sub ok",   channel, symbol));
socket.on("unsubscribed", ({ channel, symbol }) => console.log("unsub ok", channel, symbol));
socket.on("error", (e) => console.error("[socket error]", e));
```

---

## Phase 4 — Place / Cancel Orders

### 4.1 Place Order (from the right-hand order panel)

```ts
async function placeOrder({ side, type, timeInForce, quantity, price, stopPrice }) {
  return api("/api/v1/orders", {
    method: "POST",
    body: JSON.stringify({
      symbol: SYMBOL,
      side,            // "BUY" | "SELL"
      type,            // "LIMIT" | "MARKET" | "STOP_LIMIT"
      timeInForce,     // "GTC" | "IOC" | "FOK" | "POST_ONLY"
      quantity,        // decimal string, e.g. "0.01"
      price,           // decimal string (required for LIMIT / STOP_LIMIT)
      stopPrice,       // decimal string (required for STOP_LIMIT)
    }),
  });
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "ord-abc123",
    "status": "OPEN",          // or "FILLED" / "PARTIALLY_FILLED" / "REJECTED"
    "filledQty": "0",
    "fills": []
  }
}
```

**After a successful place call:** re-fetch Open Orders and Balances. The fills (if any) will also come through `local:trade:<SYMBOL>` on the socket — use whichever arrives first.

### 4.2 Cancel Order (from the Open Orders tab)

```ts
async function cancelOrder(orderId) {
  await api(`/api/v1/orders/${orderId}`, { method: "DELETE" });
  await refetchMyOrders();
}
```

### 4.3 Rejection Codes (show as toast)

| Code | What happened |
|---|---|
| `VALIDATION_ERROR` | Body failed schema (bad decimal, missing field) |
| `POST_ONLY_WOULD_TAKE` | Post-only order would have taken liquidity — rejected |
| `FOK_NOT_FILLABLE` | FOK order couldn't be filled in full — rejected |
| `INVALID_ORDER` | Symbol not tradeable, price/qty outside filters, etc. |
| `TRADING_HALTED` | Admin has halted trading for this symbol / instance |
| `UNAUTHORIZED` | JWT expired or missing |

---

## Phase 5 — Symbol Switch

When the user changes the pair from BTC-USDT to (say) ETH-USDT:

```ts
async function switchSymbol(oldSym, newSym) {
  // 1. Tear down live subs for the old symbol.
  unsubscribeSymbol(oldSym);

  // 2. Re-fetch everything for the new symbol in parallel.
  const [ticker, candles, depth, trades] = await Promise.all([
    api(`/api/v1/market/ticker?symbol=${newSym}`),
    api(`/api/v1/market/ohlcv?symbol=${newSym}&interval=1m`),
    api(`/api/v1/market/depth?symbol=${newSym}&levels=50`),
    api(`/api/v1/market/trades?symbol=${newSym}&limit=50`),
  ]);
  applyNewSymbol({ ticker, candles, depth, trades });

  // 3. Subscribe on the (same) open socket.
  subscribeSymbol(newSym);
}
```

The Socket.IO connection does **not** get closed — only the subscriptions change.

---

## Phase 6 — Chart Intervals

If the user switches chart interval (1m → 5m → 1h → 1d):

```ts
async function switchInterval(newInterval) {
  const candles = await api(
    `/api/v1/market/ohlcv?symbol=${SYMBOL}&interval=${newInterval}`,
  );
  setCandles(candles);
  // No socket change. Future trades keep appending to the new "current" candle.
}
```

Supported intervals: `1m`, `5m`, `15m`, `30m`, `1h`, `4h`, `1d`.

---

## Phase 7 — Reconnect Handling

If the socket disconnects (network blip, laptop sleep):

```ts
socket.on("connect", () => {
  // Re-subscribe to the currently-selected symbol.
  subscribeSymbol(currentSymbol);

  // Refresh the REST snapshots — we may have missed events.
  refreshDepth();
  refreshRecentTrades();
  refreshTicker();
  if (JWT) {
    refreshBalances();
    refreshMyOrders();
  }
});
```

`socket.io-client` reconnects automatically by default. On reconnect, it re-emits `connect`, so the handler above handles both first-connect and re-connect.

---

## Phase 8 — Empty-State UX (Until First Trade)

Because the matching engine is brand new, the book and trade feed will often be empty. Your UI should handle this gracefully:

| State | What to render |
|---|---|
| REST depth returns empty bids/asks | "No orders yet. Place the first!" row in the book |
| REST trades returns `[]` | "No trades yet" in the Recent Trades tab |
| OHLCV returns fewer candles than the chart window | Render whatever exists, don't pad with fake data |

Do **not** block the page behind "waiting for live data". The socket is already open; events will flow in the moment someone places matchable orders.

---

## Full Bootstrap Skeleton (React)

```tsx
import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

const GATEWAY = "http://192.168.1.13:8080";

export function TradePage() {
  const [symbol, setSymbol]         = useState("BTC-USDT");
  const [ticker, setTicker]         = useState<any>(null);
  const [candles, setCandles]       = useState<any[]>([]);
  const [orderBook, setOrderBook]   = useState<any>({ bids: new Map(), asks: new Map() });
  const [trades, setTrades]         = useState<any[]>([]);
  const [balances, setBalances]     = useState<any[]>([]);
  const [myOrders, setMyOrders]     = useState<any[]>([]);
  const socketRef                   = useRef<Socket | null>(null);
  const JWT                         = localStorage.getItem("agce_jwt");

  // 1. Initial REST load
  useEffect(() => {
    (async () => {
      const [t, c, d, r] = await Promise.all([
        fetchTicker(symbol),
        fetchOhlcv(symbol, "1m"),
        fetchDepth(symbol, 50),
        fetchTrades(symbol, 50),
      ]);
      setTicker(t);
      setCandles(c);
      setOrderBook(seedBook(d));
      setTrades(r);

      if (JWT) {
        const [b, o] = await Promise.all([fetchBalances(), fetchMyOrders()]);
        setBalances(b);
        setMyOrders(o);
      }
    })();
  }, [symbol]);

  // 2. Open socket once, subscribe when symbol changes
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(GATEWAY, {
        transports: ["websocket"],
        ...(JWT ? { auth: { token: JWT } } : {}),
      });
    }
    const socket = socketRef.current;

    const onDepth = (u: any) => setOrderBook((p: any) => mergeDepth(p, u));
    const onTrade = (t: any) => {
      setTrades((p) => [t, ...p].slice(0, 50));
      setCandles((p) => appendToLastCandle(p, t));
      setTicker((p: any) => ({ ...p, lastPrice: t.price }));
    };

    socket.on(`local:depth:${symbol}`, onDepth);
    socket.on(`local:trade:${symbol}`, onTrade);

    socket.emit("subscribe", { channel: "local_depth", symbol });
    socket.emit("subscribe", { channel: "local_trade", symbol });

    return () => {
      socket.emit("unsubscribe", { channel: "local_depth", symbol });
      socket.emit("unsubscribe", { channel: "local_trade", symbol });
      socket.off(`local:depth:${symbol}`, onDepth);
      socket.off(`local:trade:${symbol}`, onTrade);
    };
  }, [symbol]);

  // 3. Close socket on unmount
  useEffect(() => () => {
    socketRef.current?.emit("unsubscribe:all");
    socketRef.current?.disconnect();
  }, []);

  // ... render the UI
}
```

---

## Checklist for the Frontend Developer

- [ ] REST: symbol list, ticker, OHLCV, depth, recent trades loaded on mount
- [ ] REST (if logged in): balances and my-orders loaded on mount
- [ ] Socket.IO: opens once, survives symbol switches
- [ ] Socket.IO: subscribes to `local_depth` and `local_trade` for the active symbol
- [ ] Order book merges depth updates by price level (not naive replace)
- [ ] Recent trades prepends new trade, capped at 50
- [ ] Chart last candle updates on each trade
- [ ] Ticker last-price + 24h % updates on each trade
- [ ] Place / cancel order wired with toast for rejection codes
- [ ] On successful place/cancel → re-fetch open orders + balances
- [ ] On socket reconnect → re-subscribe + refresh REST snapshots
- [ ] Decimal values kept as strings end-to-end (use `decimal.js` for math)
- [ ] Empty states rendered when book / trades / candles are empty
- [ ] Symbol selector tears down old subs and re-subscribes on the same socket
