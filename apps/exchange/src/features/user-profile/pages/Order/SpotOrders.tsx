import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import { CustomDropdown } from "../SpotOrders/spotOrderUi.js";
import { ordersApi } from "../../../../lib/matching-api.js";
import { alertSuccessMessage, alertErrorMessage } from "../../../Trade/CustomAlertMessage/index.js";
import { toErrorMessage } from "../../../Trade/utils/errorMessage.js";

const SIDE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "BUY", label: "Buy" },
  { value: "SELL", label: "Sell" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "OPEN", label: "Open" },
  { value: "PENDING", label: "Pending" },
  { value: "PARTIALLY_FILLED", label: "Partial" },
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
  return o.avgFillPrice ?? o.avgPrice ?? "--";
}

function getTimestamp(o: ApiOrder): string | number | undefined {
  return o.createdAt ?? o.timestamp ?? o.createTime;
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

const SpotOrders = () => {
  const [symbol, setSymbol] = useState("all");
  const [side, setSide] = useState("all");
  const [status, setStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState("2026-04-10");
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const dateFromRef = useRef<HTMLInputElement | null>(null);
  const dateToRef = useRef<HTMLInputElement | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const mine = await ordersApi.mine(100);
      setOrders((mine as ApiOrder[]).filter((o) => OPEN_STATUSES.has(o.status)));
    } catch (err) {
      alertErrorMessage(toErrorMessage(err, "Could not load your orders"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Dynamic symbol options built from fetched orders
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
      if (side !== "all" && order.side !== side) return false;
      if (status !== "all" && order.status !== status) return false;
      const ts = getTimestamp(order);
      if (ts !== undefined) {
        const orderDate =
          typeof ts === "string" ? ts.slice(0, 10) : new Date(ts).toISOString().slice(0, 10);
        if (dateFrom && orderDate < dateFrom) return false;
        if (dateTo && orderDate > dateTo) return false;
      }
      return true;
    });
  }, [orders, symbol, side, status, dateFrom, dateTo]);

  const handleCancel = async (orderId: string) => {
    if (!orderId) return;
    setCancellingId(orderId);
    try {
      const res = await ordersApi.cancel(orderId);
      setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
      alertSuccessMessage(`Order cancelled (${res.status || "CANCELLED"}).`);
      await fetchOrders();
    } catch (err) {
      alertErrorMessage(toErrorMessage(err, "Cancel failed"));
    } finally {
      setCancellingId(null);
    }
  };

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
    <div className={`so-toolbar ${stacked ? "so-toolbar--stack" : ""}`} role="search" aria-label="Filter orders">
      <div className="so-toolbar__left">
        <CustomDropdown
          id="so-dd-symbol"
          label="Symbol"
          value={symbol}
          options={symbolOptions}
          onChange={setSymbol}
          menuKey="so-symbol"
          openKey={openDropdown}
          onOpenToggle={setOpenDropdown}
        />
        <CustomDropdown
          id="so-dd-side"
          label="Side"
          value={side}
          options={SIDE_OPTIONS}
          onChange={setSide}
          menuKey="so-side"
          openKey={openDropdown}
          onOpenToggle={setOpenDropdown}
        />
        <CustomDropdown
          id="so-dd-status"
          label="Status"
          value={status}
          options={STATUS_OPTIONS}
          onChange={setStatus}
          menuKey="so-status"
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
          <img src="/images/security/download_vector.svg" alt="Download" /> Download
        </button>
        <button type="button" className="so-dlBtn">
          <img src="/images/security/download_vector.svg" alt="Download" /> Batch Download
        </button>
      </div>
    </div>
  );

  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={10} className="so-table__emptyWrap">
            <div className="so-emptyState" role="status">Loading...</div>
          </td>
        </tr>
      );
    }
    if (filteredOrders.length === 0) {
      return (
        <tr>
          <td colSpan={10} className="so-table__emptyWrap">
            <div className="so-emptyState" role="status">
              <img src="/images/no-data.svg" alt="" width={120} height={144} className="so-emptyState__img" />
            </div>
          </td>
        </tr>
      );
    }
    return filteredOrders.map((order) => (
      <tr key={order.orderId}>
        <td className="so-num" title={order.orderId}>{order.orderId.slice(0, 8)}…</td>
        <td>{formatDateTime(getTimestamp(order))}</td>
        <td>{formatSymbol(order.symbol)}</td>
        <td>
          <span className={order.side === "BUY" ? "so-side--buy" : "so-side--sell"}>
            {order.side === "BUY" ? "Buy" : "Sell"}
          </span>
        </td>
        <td className="so-num">{order.price}</td>
        <td className="so-num">{getFillPrice(order)}</td>
        <td className="so-num">{order.quantity}</td>
        <td className="so-num">{getFilledQty(order)}</td>
        <td>
          <span className={`so-status so-status--${order.status.toLowerCase()}`}>{order.status}</span>
        </td>
        <td>
          <button
            type="button"
            className="so-cancelBtn"
            disabled={cancellingId === order.orderId}
            onClick={() => handleCancel(order.orderId)}
          >
            {cancellingId === order.orderId ? "..." : "Cancel"}
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="dashboard_right">
      <div className="dashboard_listing_section Overview_mid">
        <div className="listing_left_outer full_width transaction_history_t desktop_view2 so-desktopWrap">
          <main className="so-page" aria-labelledby="so-spot-title">
            <h1 id="so-spot-title" className="so-page__title">Open Orders</h1>
            {renderToolbar(false)}
            <div className="so-tableWrap">
              <table className="so-table">
                <thead>
                  <tr>
                    <th scope="col">Order ID</th>
                    <th scope="col">Time</th>
                    <th scope="col">Symbol</th>
                    <th scope="col">Side</th>
                    <th scope="col">Price</th>
                    <th scope="col">Fill Price</th>
                    <th scope="col">Order Quantity</th>
                    <th scope="col">Filled Amount</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>{renderTableBody()}</tbody>
              </table>
            </div>
          </main>
        </div>

        <div className="order_history_mobile_view so-mobile">
          <h2 className="so-mobile__title">Spot Orders</h2>
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
                  <span className="so-num" title={order.orderId}>{order.orderId.slice(0, 8)}…</span>
                </div>
                <div className="so-mobileCard__row">
                  <span>Time</span>
                  <span>{formatDateTime(getTimestamp(order))}</span>
                </div>
                <div className="so-mobileCard__row">
                  <span>Symbol</span>
                  <span>{formatSymbol(order.symbol)}</span>
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
                  <span>Order Quantity</span>
                  <span className="so-num">{order.quantity}</span>
                </div>
                <div className="so-mobileCard__row">
                  <span>Filled Amount</span>
                  <span className="so-num">{getFilledQty(order)}</span>
                </div>
                <div className="so-mobileCard__row">
                  <span>Status</span>
                  <span className={`so-status so-status--${order.status.toLowerCase()}`}>{order.status}</span>
                </div>
                <div className="so-mobileCard__actions">
                  <button
                    type="button"
                    className="so-cancelBtn"
                    disabled={cancellingId === order.orderId}
                    onClick={() => handleCancel(order.orderId)}
                  >
                    {cancellingId === order.orderId ? "..." : "Cancel"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SpotOrders;
