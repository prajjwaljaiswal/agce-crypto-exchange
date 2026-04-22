import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import { useLocation } from "react-router-dom";
import { CustomDropdown } from "../SpotOrders/spotOrderUi.js";
import { tokenStore } from "../../../../lib/tokenStore.js";

const GATEWAY = "http://192.168.1.13:8080";

const ORDER_TYPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "LIMIT", label: "Limit" },
  { value: "MARKET", label: "Market" },
  { value: "STOP_LIMIT", label: "Stop Limit" },
];

const SIDE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "BUY", label: "Buy" },
  { value: "SELL", label: "Sell" },
];

const ORDER_HISTORY_STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "FILLED", label: "Filled" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "EXPIRED", label: "Expired" },
];

const TRADE_HISTORY_STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "FILLED", label: "Filled" },
];

interface ApiOrder {
  orderId: string;
  symbol: string;
  side: string;
  type: string;
  quantity: string;
  price: string;
  status: string;
  filledQty?: string;
  filledQuantity?: string;
  executedQty?: string;
  avgFillPrice?: string;
  avgPrice?: string;
  fee?: string;
  createdAt?: string | number;
  timestamp?: string | number;
  createTime?: string | number;
  [key: string]: unknown;
}

const OPEN_STATUSES = new Set(["OPEN", "PENDING", "PARTIALLY_FILLED", "NEW"]);

function formatDateTime(ts?: string | number): string {
  if (!ts) return "--";
  const d = new Date(typeof ts === "number" ? ts : ts);
  if (isNaN(d.getTime())) return String(ts);
  return d.toISOString().replace("T", " ").slice(0, 19);
}

function formatSymbol(symbol: string): string {
  return symbol.replace("-", "/");
}

function getFilledQty(o: ApiOrder): string {
  return o.filledQty ?? o.filledQuantity ?? o.executedQty ?? "0.0000";
}

function getFillPrice(o: ApiOrder): string {
  return o.avgFillPrice ?? o.avgPrice ?? o.price;
}

function getTimestamp(o: ApiOrder): string | number | undefined {
  return o.createdAt ?? o.timestamp ?? o.createTime;
}

function shortOrderId(orderId: string): string {
  return orderId.length > 10 ? `#${orderId.slice(-10).toUpperCase()}` : `#${orderId}`;
}

interface DatePickerCellProps {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  inputRef: RefObject<HTMLInputElement | null>;
}

function DatePickerCell({ value, onChange, ariaLabel, inputRef }: DatePickerCellProps) {
  return (
    <div className="so-dateCell">
      <span className="so-dateCell__text" aria-hidden="true">
        {value}
      </span>
      <input
        ref={inputRef}
        type="date"
        className="so-dateCell__native"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
      />
    </div>
  );
}

function OrderTypeCell({ value }: { value: string }) {
  if (value === "LIMIT") return <span className="so-spotPosAction--open">Limit</span>;
  if (value === "MARKET") return <span className="so-spotPosAction--close">Market</span>;
  if (value === "STOP_LIMIT") return <span className="so-spotPosAction--open">Stop Limit</span>;
  return <span>{value}</span>;
}

const SpotPositionHistory = () => {
  const location = useLocation();
  const isTradeHistory = location.pathname.includes("trade_history");
  const pageTitle = isTradeHistory ? "Trade History" : "Order History";
  const titleId = isTradeHistory ? "so-trade-history-title" : "so-order-history-title";

  const [symbol, setSymbol] = useState("all");
  const [orderType, setOrderType] = useState("all");
  const [side, setSide] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState("2026-04-10");
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(false);

  const dateFromRef = useRef<HTMLInputElement | null>(null);
  const dateToRef = useRef<HTMLInputElement | null>(null);

  const statusOptions = isTradeHistory ? TRADE_HISTORY_STATUS_OPTIONS : ORDER_HISTORY_STATUS_OPTIONS;

  const fetchOrders = useCallback(async () => {
    const token = tokenStore.getAccess();
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${GATEWAY}/api/v1/orders/mine?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await res.json();
      if (body.success) {
        const all: ApiOrder[] = body.data ?? [];
        const base = isTradeHistory
          ? all.filter((o) => o.status === "FILLED")
          : all.filter((o) => !OPEN_STATUSES.has(o.status));
        setOrders(base);
      }
    } catch {
      /* silently fail */
    } finally {
      setLoading(false);
    }
  }, [isTradeHistory]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Reset filter dropdowns when tab changes
  useEffect(() => {
    setSymbol("all");
    setOrderType("all");
    setSide("all");
    setFilterStatus("all");
  }, [isTradeHistory]);

  const symbolOptions = useMemo(() => {
    const unique = Array.from(new Set(orders.map((o) => o.symbol)));
    return [
      { value: "all", label: "All" },
      ...unique.map((s) => ({ value: s, label: formatSymbol(s) })),
    ];
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (symbol !== "all" && order.symbol !== symbol) return false;
      if (orderType !== "all" && order.type !== orderType) return false;
      if (side !== "all" && order.side !== side) return false;
      if (filterStatus !== "all" && order.status !== filterStatus) return false;
      const ts = getTimestamp(order);
      if (ts !== undefined) {
        const orderDate =
          typeof ts === "string" ? ts.slice(0, 10) : new Date(ts).toISOString().slice(0, 10);
        if (dateFrom && orderDate < dateFrom) return false;
        if (dateTo && orderDate > dateTo) return false;
      }
      return true;
    });
  }, [orders, symbol, orderType, side, filterStatus, dateFrom, dateTo]);

  useEffect(() => {
    if (!openDropdown) return undefined;
    const onDocClick = (e: MouseEvent) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (!t.closest("[data-so-dropdown]")) setOpenDropdown(null);
    };
    document.addEventListener("click", onDocClick, true);
    return () => document.removeEventListener("click", onDocClick, true);
  }, [openDropdown]);

  useEffect(() => {
    if (!openDropdown) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenDropdown(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openDropdown]);

  const openDatePicker = () => {
    const el = dateToRef.current;
    if (el && typeof el.showPicker === "function") {
      try { el.showPicker(); return; } catch { /* fall through */ }
    }
    el?.click();
  };

  const renderToolbar = (stacked: boolean) => (
    <div
      className={`so-toolbar ${stacked ? "so-toolbar--stack" : ""}`}
      role="search"
      aria-label={`Filter ${pageTitle.toLowerCase()}`}
    >
      <div className="so-toolbar__left">
        <CustomDropdown
          id="sph-dd-symbol"
          label="Symbol"
          value={symbol}
          options={symbolOptions}
          onChange={setSymbol}
          menuKey="sph-symbol"
          openKey={openDropdown}
          onOpenToggle={setOpenDropdown}
        />
        <CustomDropdown
          id="sph-dd-type"
          label="Order Type"
          value={orderType}
          options={ORDER_TYPE_OPTIONS}
          onChange={setOrderType}
          menuKey="sph-type"
          openKey={openDropdown}
          onOpenToggle={setOpenDropdown}
        />
        <CustomDropdown
          id="sph-dd-side"
          label="Side"
          value={side}
          options={SIDE_OPTIONS}
          onChange={setSide}
          menuKey="sph-side"
          openKey={openDropdown}
          onOpenToggle={setOpenDropdown}
        />
        <CustomDropdown
          id="sph-dd-status"
          label="Status"
          value={filterStatus}
          options={statusOptions}
          onChange={setFilterStatus}
          menuKey="sph-status"
          openKey={openDropdown}
          onOpenToggle={setOpenDropdown}
        />
        <div className="so-dateBlock">
          <span className="so-dateBlock__label">Date</span>
          <div className="so-dateRow">
            <DatePickerCell value={dateFrom} onChange={setDateFrom} ariaLabel="Start date" inputRef={dateFromRef} />
            <span className="so-dateArrow" aria-hidden="true">→</span>
            <DatePickerCell value={dateTo} onChange={setDateTo} ariaLabel="End date" inputRef={dateToRef} />
            <button type="button" className="so-dateCalBtn" aria-label="Open calendar" onClick={openDatePicker}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.35" />
                <path d="M3 10h18" stroke="currentColor" strokeWidth="1.35" />
                <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="so-toolbar__right">
        <button type="button" className="so-dlBtn">
          <img src="/images/security/download_vector.svg" alt="" /> Download
        </button>
        <button type="button" className="so-dlBtn">
          <img src="/images/security/download_vector.svg" alt="" /> Batch Download
        </button>
      </div>
    </div>
  );

  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={11} className="so-table__emptyWrap">
            <div className="so-emptyState" role="status">Loading...</div>
          </td>
        </tr>
      );
    }
    if (filteredOrders.length === 0) {
      return (
        <tr>
          <td colSpan={11} className="so-table__emptyWrap">
            <div className="so-emptyState" role="status">
              <img src="/images/no-data.svg" alt="" width={120} height={144} className="so-emptyState__img" />
            </div>
          </td>
        </tr>
      );
    }
    return filteredOrders.map((order) => (
      <tr key={order.orderId}>
        <td className="so-num" title={order.orderId}>{shortOrderId(order.orderId)}</td>
        <td className="so-num">{formatDateTime(getTimestamp(order))}</td>
        <td className="so-num">{formatSymbol(order.symbol)}</td>
        <td><OrderTypeCell value={order.type} /></td>
        <td>
          <span className={order.side === "BUY" ? "so-side--buy" : "so-side--sell"}>
            {order.side === "BUY" ? "Buy" : "Sell"}
          </span>
        </td>
        <td className="so-num">{order.price}</td>
        <td className="so-num">{getFillPrice(order)}</td>
        <td className="so-num">{getFilledQty(order)}</td>
        <td className="so-num">{order.quantity}</td>
        <td>
          <span className={`so-status so-status--${order.status.toLowerCase()}`}>{order.status}</span>
        </td>
        <td className="so-num">{order.fee ?? "--"}</td>
      </tr>
    ));
  };

  return (
    <div className="dashboard_right">
      <div className="dashboard_listing_section Overview_mid">
        <div className="listing_left_outer full_width transaction_history_t desktop_view2 so-desktopWrap">
          <main className="so-page" aria-labelledby={titleId}>
            <h1 id={titleId} className="so-page__title">{pageTitle}</h1>
            {renderToolbar(false)}
            <div className="so-tableWrap so-tableWrap--staking">
              <table className="so-table so-table--rowLines so-table--wide">
                <thead>
                  <tr>
                    <th scope="col">Order ID</th>
                    <th scope="col">Date</th>
                    <th scope="col">Symbol</th>
                    <th scope="col">Order Type</th>
                    <th scope="col">Side</th>
                    <th scope="col">Price</th>
                    <th scope="col">Fill Price</th>
                    <th scope="col">Filled Amount</th>
                    <th scope="col">Order Quantity</th>
                    <th scope="col">Status</th>
                    <th scope="col">Fee</th>
                  </tr>
                </thead>
                <tbody>{renderTableBody()}</tbody>
              </table>
            </div>
          </main>
        </div>

        <div className="order_history_mobile_view so-mobile">
          <h2 className="so-mobile__title">{pageTitle}</h2>
          <div className="so-mobile__toolbar">{renderToolbar(true)}</div>
          {loading ? (
            <div className="so-emptyState so-emptyState--mobile" role="status">Loading...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="so-emptyState so-emptyState--mobile" role="status">
              <img src="/images/no-data.svg" alt="" width={120} height={144} className="so-emptyState__img" />
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={`m-${order.orderId}`} className="so-mobileCard">
                <div className="so-mobileCard__row">
                  <span>Order ID</span>
                  <span className="so-num" title={order.orderId}>{shortOrderId(order.orderId)}</span>
                </div>
                <div className="so-mobileCard__row">
                  <span>Date</span>
                  <span className="so-num">{formatDateTime(getTimestamp(order))}</span>
                </div>
                <div className="so-mobileCard__row">
                  <span>Symbol</span>
                  <span className="so-num">{formatSymbol(order.symbol)}</span>
                </div>
                <div className="so-mobileCard__row">
                  <span>Order Type</span>
                  <OrderTypeCell value={order.type} />
                </div>
                <div className="so-mobileCard__row">
                  <span>Side</span>
                  <span className={order.side === "BUY" ? "so-side--buy" : "so-side--sell"}>
                    {order.side === "BUY" ? "Buy" : "Sell"}
                  </span>
                </div>
                <div className="so-mobileCard__row">
                  <span>Price</span>
                  <span className="so-num">{order.price}</span>
                </div>
                <div className="so-mobileCard__row">
                  <span>Fill Price</span>
                  <span className="so-num">{getFillPrice(order)}</span>
                </div>
                <div className="so-mobileCard__row">
                  <span>Filled Amount</span>
                  <span className="so-num">{getFilledQty(order)}</span>
                </div>
                <div className="so-mobileCard__row">
                  <span>Order Quantity</span>
                  <span className="so-num">{order.quantity}</span>
                </div>
                <div className="so-mobileCard__row">
                  <span>Status</span>
                  <span className={`so-status so-status--${order.status.toLowerCase()}`}>{order.status}</span>
                </div>
                <div className="so-mobileCard__row">
                  <span>Fee</span>
                  <span className="so-num">{order.fee ?? "--"}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SpotPositionHistory;
