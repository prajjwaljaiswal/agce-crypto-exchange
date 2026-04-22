import { useEffect, useState } from "react";
import { CustomDropdown } from "../SpotOrders/spotOrderUi.js";

interface OpenOrdersProps {
  pageTitle?: string;
  idPrefix?: string;
}

const TYPE_OPTIONS = [
  { value: "limit", label: "Limit" },
  { value: "market", label: "Market" },
  { value: "stop_limit", label: "Stop Limit" },
  { value: "stop_market", label: "Stop Market" },
];

const SETTLEMENT_OPTIONS = [
  { value: "all", label: "All" },
  { value: "usdt", label: "USDT" },
  { value: "usdc", label: "USDC" },
  { value: "busd", label: "BUSD" },
];

const CONTRACT_OPTIONS = [
  { value: "all", label: "All" },
  { value: "btcusdt", label: "BTCUSDT" },
  { value: "ethusdt", label: "ETHUSDT" },
  { value: "bnbusdt", label: "BNBUSDT" },
];

interface OpenOrderRow {
  id: number;
  contract: string;
  orderId: string;
  creationTime: string;
  side: string;
  price: string;
  size: string;
  unfilled: string;
  fillPrice: string;
  source: string;
  remarks: string;
}

const OPEN_ORDER_ROWS: OpenOrderRow[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  contract: "BTCUSDT",
  orderId: "26475839201",
  creationTime: "2026-04-16 10:30:15",
  side: "Buy",
  price: "68,450.00",
  size: "0.5000",
  unfilled: "0.5000",
  fillPrice: "--",
  source: "Web",
  remarks: "Open Long Position",
}));

const OpenOrders = ({ pageTitle = "Open Orders", idPrefix = "oo" }: OpenOrdersProps) => {
  const [filterType, setFilterType] = useState("limit");
  const [settlement, setSettlement] = useState("all");
  const [contract, setContract] = useState("all");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const titleId = `${idPrefix}-page-title`;

  useEffect(() => {
    if (!openDropdown) return undefined;
    const onDocClick = (e: MouseEvent) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (!t.closest("[data-so-dropdown]")) {
        setOpenDropdown(null);
      }
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
    <div className={`so-toolbar ${stacked ? "so-toolbar--stack" : ""}`} role="search" aria-label="Filter open orders">
      <div className="so-toolbar__left">
        <CustomDropdown
          id={`${idPrefix}-dd-type`}
          label="Type"
          value={filterType}
          options={TYPE_OPTIONS}
          onChange={setFilterType}
          menuKey={`${idPrefix}-type`}
          openKey={openDropdown}
          onOpenToggle={setOpenDropdown}
        />
        <CustomDropdown
          id={`${idPrefix}-dd-settlement`}
          label="Settlement Coin"
          value={settlement}
          options={SETTLEMENT_OPTIONS}
          onChange={setSettlement}
          menuKey={`${idPrefix}-settlement`}
          openKey={openDropdown}
          onOpenToggle={setOpenDropdown}
        />
        <CustomDropdown
          id={`${idPrefix}-dd-contract`}
          label="Contract"
          value={contract}
          options={CONTRACT_OPTIONS}
          onChange={setContract}
          menuKey={`${idPrefix}-contract`}
          openKey={openDropdown}
          onOpenToggle={setOpenDropdown}
        />
      </div>
    </div>
  );

  return (
    <div className="dashboard_right">
      <div className="dashboard_listing_section Overview_mid">
        <div className="listing_left_outer full_width transaction_history_t desktop_view2 so-desktopWrap">
          <main className="so-page" aria-labelledby={titleId}>
            <h1 id={titleId} className="so-page__title">
              {pageTitle}
            </h1>

            {renderToolbar(false)}

            <div className="so-tableWrap">
              <table className="so-table so-table--air">
                <thead>
                  <tr>
                    <th scope="col">Contract</th>
                    <th scope="col">Order ID</th>
                    <th scope="col">Creation Time</th>
                    <th scope="col" className="so-table__th--center">
                      Side
                    </th>
                    <th scope="col" className="so-table__th--right">
                      Price
                    </th>
                    <th scope="col" className="so-table__th--right">
                      Size
                    </th>
                    <th scope="col" className="so-table__th--right">
                      Unfilled
                    </th>
                    <th scope="col" className="so-table__th--right">
                      Fill Price
                    </th>
                    <th scope="col">Source</th>
                    <th scope="col">Remarks</th>
                    <th scope="col" className="so-table__th--center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {OPEN_ORDER_ROWS.map((row) => (
                    <tr key={row.id}>
                      <td>{row.contract}</td>
                      <td className="so-num">{row.orderId}</td>
                      <td>{row.creationTime}</td>
                      <td className="so-table__td--center">
                        <span className={row.side === "Buy" ? "so-side--buy" : "so-side--sell"}>{row.side}</span>
                      </td>
                      <td className="so-table__td--right so-num">{row.price}</td>
                      <td className="so-table__td--right so-num">{row.size}</td>
                      <td className="so-table__td--right so-num">{row.unfilled}</td>
                      <td className="so-table__td--right so-num so-table__td--muted">{row.fillPrice}</td>
                      <td>{row.source}</td>
                      <td>{row.remarks}</td>
                      <td className="so-table__td--center">
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
          <h2 className="so-mobile__title">{pageTitle}</h2>
          <div className="so-mobile__toolbar">{renderToolbar(true)}</div>
          {OPEN_ORDER_ROWS.map((row) => (
            <div key={`m-${row.id}`} className="so-mobileCard">
              <div className="so-mobileCard__row">
                <span>Contract</span>
                <span>{row.contract}</span>
              </div>
              <div className="so-mobileCard__row">
                <span>Order ID</span>
                <span className="so-num">{row.orderId}</span>
              </div>
              <div className="so-mobileCard__row">
                <span>Creation Time</span>
                <span>{row.creationTime}</span>
              </div>
              <div className="so-mobileCard__row">
                <span>Side</span>
                <span className={row.side === "Buy" ? "so-side--buy" : "so-side--sell"}>{row.side}</span>
              </div>
              <div className="so-mobileCard__row">
                <span>Price</span>
                <span className="so-num">{row.price}</span>
              </div>
              <div className="so-mobileCard__row">
                <span>Size</span>
                <span className="so-num">{row.size}</span>
              </div>
              <div className="so-mobileCard__row">
                <span>Unfilled</span>
                <span className="so-num">{row.unfilled}</span>
              </div>
              <div className="so-mobileCard__row">
                <span>Fill Price</span>
                <span className="so-num so-table__td--muted">{row.fillPrice}</span>
              </div>
              <div className="so-mobileCard__row">
                <span>Source</span>
                <span>{row.source}</span>
              </div>
              <div className="so-mobileCard__row">
                <span>Remarks</span>
                <span>{row.remarks}</span>
              </div>
              <div className="so-mobileCard__actions">
                <button type="button" className="so-cancelLink">
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OpenOrders;
