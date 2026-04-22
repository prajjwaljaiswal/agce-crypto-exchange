import { useEffect, useState } from "react";
import { CustomDropdown } from "../SpotOrders/spotOrderUi.js";

const TYPE_OPTIONS = [
  { value: "limit", label: "Limit" },
  { value: "market", label: "Market" },
  { value: "stop_limit", label: "Stop Limit" },
  { value: "stop_market", label: "Stop Market" },
];

const SIDE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "buy", label: "Buy" },
  { value: "sell", label: "Sell" },
];

const PAIRS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "btc_usdt", label: "BTC/USDT" },
  { value: "eth_usdt", label: "ETH/USDT" },
  { value: "bnb_usdt", label: "BNB/USDT" },
];

interface SpotOpenRow {
  id: number;
  time: string;
  accountType: string;
  side: string;
  pairs: string;
  price: string;
  fillPrice: string;
  orderQty: string;
  pendingAmount: string;
  filledBase: string;
  filledQuote: string;
}

const SPOT_OPEN_ROWS: SpotOpenRow[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  time: "2026-04-16 10:30:15",
  accountType: "Spot",
  side: "Buy",
  pairs: "BTC/USDT",
  price: "68,450.00",
  fillPrice: "68,450.00",
  orderQty: "0.5000",
  pendingAmount: "34,225.00",
  filledBase: "0.0000",
  filledQuote: "0.00",
}));

const SpotOpenOrders = () => {
  const [filterType, setFilterType] = useState("limit");
  const [side, setSide] = useState("all");
  const [pairs, setPairs] = useState("all");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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

  const renderToolbar = (stacked: boolean) => (
    <div className={`so-toolbar ${stacked ? "so-toolbar--stack" : ""}`} role="search" aria-label="Filter spot open orders">
      <div className="so-toolbar__left">
        <CustomDropdown
          id="soo-dd-type"
          label="Type"
          value={filterType}
          options={TYPE_OPTIONS}
          onChange={setFilterType}
          menuKey="soo-type"
          openKey={openDropdown}
          onOpenToggle={setOpenDropdown}
        />
        <CustomDropdown
          id="soo-dd-side"
          label="Side"
          value={side}
          options={SIDE_OPTIONS}
          onChange={setSide}
          menuKey="soo-side"
          openKey={openDropdown}
          onOpenToggle={setOpenDropdown}
        />
        <CustomDropdown
          id="soo-dd-pairs"
          label="Pairs"
          value={pairs}
          options={PAIRS_OPTIONS}
          onChange={setPairs}
          menuKey="soo-pairs"
          openKey={openDropdown}
          onOpenToggle={setOpenDropdown}
        />
      </div>
    </div>
  );

  const renderEmptyBody = () => (
    <tr>
      <td colSpan={11} className="so-table__emptyWrap">
        <div className="so-emptyState" role="status">
          <img src="/images/no-data.svg" alt="" width={120} height={144} className="so-emptyState__img" />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="dashboard_right">
      <div className="dashboard_listing_section Overview_mid">
        <div className="listing_left_outer full_width transaction_history_t desktop_view2 so-desktopWrap">
          <main className="so-page" aria-labelledby="so-spot-order-history-title">
            <h1 id="so-spot-order-history-title" className="so-page__title">
              Order History
            </h1>

            {renderToolbar(false)}

            <div className="so-tableWrap so-tableWrap--staking">
              <table className="so-table so-table--rowLines so-table--wide">
                <thead>
                  <tr>
                    <th scope="col">Time</th>
                    <th scope="col">Account Type</th>
                    <th scope="col">
                      Side
                    </th>
                    <th scope="col">Pairs</th>
                    <th scope="col">
                      Price
                    </th>
                    <th scope="col">
                      Fill Price
                    </th>
                    <th scope="col">
                      Order Quantity
                    </th>
                    <th scope="col">
                      Pending Order Amount
                    </th>
                    <th scope="col">
                      Filled Amount
                    </th>
                    <th scope="col">
                      Filled Amount
                    </th>
                    <th scope="col">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SPOT_OPEN_ROWS.length === 0
                    ? renderEmptyBody()
                    : SPOT_OPEN_ROWS.map((row) => (
                        <tr key={row.id}>
                          <td className="so-num">{row.time}</td>
                          <td>{row.accountType}</td>
                          <td>
                            <span className={row.side === "Buy" ? "so-side--buy" : "so-side--sell"}>{row.side}</span>
                          </td>
                          <td className="so-num">{row.pairs}</td>
                          <td className="so-num">{row.price}</td>
                          <td className="so-num">{row.fillPrice}</td>
                          <td className="so-num">{row.orderQty}</td>
                          <td className="so-num">{row.pendingAmount}</td>
                          <td className="so-num">{row.filledBase}</td>
                          <td className="so-num">{row.filledQuote}</td>
                          <td>
                            <button type="button" className="so-cancelLink">
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>

        <div className="order_history_mobile_view so-mobile">
          <h2 className="so-mobile__title">Spot Order History</h2>
          <div className="so-mobile__toolbar">{renderToolbar(true)}</div>
          {SPOT_OPEN_ROWS.length === 0 ? (
            <div className="so-emptyState so-emptyState--mobile" role="status">
              <img src="/images/no-data.svg" alt="" width={120} height={144} className="so-emptyState__img" />
            </div>
          ) : (
            SPOT_OPEN_ROWS.map((row) => (
              <div key={`m-${row.id}`} className="so-mobileCard">
                <div className="so-mobileCard__row">
                  <span>Time</span>
                  <span className="so-num">{row.time}</span>
                </div>
                <div className="so-mobileCard__row">
                  <span>Account Type</span>
                  <span>{row.accountType}</span>
                </div>
                <div className="so-mobileCard__row">
                  <span>Side</span>
                  <span className={row.side === "Buy" ? "so-side--buy" : "so-side--sell"}>{row.side}</span>
                </div>
                <div className="so-mobileCard__row">
                  <span>Pairs</span>
                  <span className="so-num">{row.pairs}</span>
                </div>
                <div className="so-mobileCard__row">
                  <span>Price</span>
                  <span className="so-num">{row.price}</span>
                </div>
                <div className="so-mobileCard__row">
                  <span>Fill Price</span>
                  <span className="so-num">{row.fillPrice}</span>
                </div>
                <div className="so-mobileCard__row">
                  <span>Order Quantity</span>
                  <span className="so-num">{row.orderQty}</span>
                </div>
                <div className="so-mobileCard__row">
                  <span>Pending Order Amount</span>
                  <span className="so-num">{row.pendingAmount}</span>
                </div>
                <div className="so-mobileCard__row">
                  <span>Filled Amount (qty)</span>
                  <span className="so-num">{row.filledBase}</span>
                </div>
                <div className="so-mobileCard__row">
                  <span>Filled Amount (value)</span>
                  <span className="so-num">{row.filledQuote}</span>
                </div>
                <div className="so-mobileCard__actions">
                  <button type="button" className="so-cancelLink">
                    Cancel
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

export default SpotOpenOrders;
