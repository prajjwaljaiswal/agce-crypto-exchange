import { useEffect, useState } from "react";
import { CustomDropdown } from "../SpotOrders/spotOrderUi.js";

const TYPE_OPTIONS = [
  { value: "crypto", label: "Crypto" },
  { value: "fiat", label: "Fiat" },
];

const TIME_OPTIONS = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
];

const COIN_OPTIONS = [
  { value: "all", label: "All" },
  { value: "btc", label: "Bitcoin" },
  { value: "eth", label: "Ethereum" },
  { value: "matic", label: "Polygon" },
  { value: "ltc", label: "Litecoin" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
];

interface DepositRow {
  id: number;
  time: string;
  type: string;
  wallet: string;
  coin: string;
  coinSub: string;
  amount: string;
  destination: string;
  txid: string;
  txSub: string;
  status: string;
}

const ROWS: DepositRow[] = [
  {
    id: 1,
    time: "2026-04-20 14:32:15",
    type: "Crypto",
    wallet: "0x742d...8c3a",
    coin: "Bitcoin",
    coinSub: "BTC",
    amount: "0.125000",
    destination: "Spot Wallet",
    txid: "8f7e...2b9c",
    txSub: "6/6",
    status: "Completed",
  },
  {
    id: 2,
    time: "2026-04-20 13:45:22",
    type: "Crypto",
    wallet: "0x9a1b...4f2e",
    coin: "Ethereum",
    coinSub: "ETH",
    amount: "2.500000",
    destination: "Futures Wallet",
    txid: "3d2a...5e8f",
    txSub: "12/12",
    status: "Pending",
  },
  {
    id: 3,
    time: "2026-04-19 20:18:33",
    type: "Crypto",
    wallet: "0x8e2f...5c7d",
    coin: "Polygon",
    coinSub: "MATIC",
    amount: "8,500.000000",
    destination: "Spot Wallet",
    txid: "1d6b...9e4a",
    txSub: "2/30",
    status: "Completed",
  },
  {
    id: 4,
    time: "2026-04-19 16:28:45",
    type: "Crypto",
    wallet: "ltc1...m9n2",
    coin: "Litecoin",
    coinSub: "LTC",
    amount: "75.500000",
    destination: "Spot Wallet",
    txid: "7c3e...27Bd",
    txSub: "",
    status: "Pending",
  },
];

function StatusPill({ value }: { value: string }) {
  if (value === "Completed") return <span className="so-status so-status--completed">{value}</span>;
  if (value === "Pending") return <span className="so-status so-status--pending">{value}</span>;
  return <span className="so-badge--closed">{value}</span>;
}

const DepositHistory = () => {
  const [type, setType] = useState("crypto");
  const [time, setTime] = useState("30d");
  const [coin, setCoin] = useState("all");
  const [status, setStatus] = useState("all");
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
    <div className={`so-toolbar ${stacked ? "so-toolbar--stack" : ""}`} role="search" aria-label="Filter deposit history">
      <div className="so-toolbar__left">
        <CustomDropdown
          id="dh-dd-type"
          label="Type"
          value={type}
          options={TYPE_OPTIONS}
          onChange={setType}
          menuKey="dh-type"
          openKey={openDropdown}
          onOpenToggle={setOpenDropdown}
        />
        <CustomDropdown
          id="dh-dd-time"
          label="Time"
          value={time}
          options={TIME_OPTIONS}
          onChange={setTime}
          menuKey="dh-time"
          openKey={openDropdown}
          onOpenToggle={setOpenDropdown}
        />
        <CustomDropdown
          id="dh-dd-coin"
          label="Coin"
          value={coin}
          options={COIN_OPTIONS}
          onChange={setCoin}
          menuKey="dh-coin"
          openKey={openDropdown}
          onOpenToggle={setOpenDropdown}
        />
        <CustomDropdown
          id="dh-dd-status"
          label="Status"
          value={status}
          options={STATUS_OPTIONS}
          onChange={setStatus}
          menuKey="dh-status"
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
          <main className="so-page" aria-labelledby="so-deposit-history-title">
            <h1 id="so-deposit-history-title" className="so-page__title">
              Deposit History
            </h1>

            {renderToolbar(false)}

            <div className="so-tableWrap">
              <table className="so-table">
                <thead>
                  <tr>
                    <th scope="col">Time</th>
                    <th scope="col">Type</th>
                    <th scope="col">Deposit Wallet</th>
                    <th scope="col">Coin</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Destination</th>
                    <th scope="col">TxID</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r) => (
                    <tr key={r.id}>
                      <td className="so-num">{r.time}</td>
                      <td>
                        <span className="so-badge-crypto">{r.type}</span>
                      </td>
                      <td className="so-num">{r.wallet}</td>
                      <td>
                        <div className="so-contractCell">
                          <span className="so-contractCell__symbol">{r.coin}</span>
                          <span className="so-contractCell__time">{r.coinSub}</span>
                        </div>
                      </td>
                      <td className="so-num">{r.amount}</td>
                      <td>{r.destination}</td>
                      <td>
                        <div className="so-contractCell">
                          <span className="so-contractCell__symbol so-num">{r.txid}</span>
                          {r.txSub ? <span className="so-contractCell__time so-num">{r.txSub}</span> : null}
                        </div>
                      </td>
                      <td>
                        <StatusPill value={r.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>

        <div className="order_history_mobile_view so-mobile">
          <h2 className="so-mobile__title">Deposit History</h2>
          <div className="so-mobile__toolbar">{renderToolbar(true)}</div>
          {ROWS.map((r) => (
            <div key={`m-${r.id}`} className="so-mobileCard">
              <div className="so-mobileCard__row">
                <span>Time</span>
                <span className="so-num">{r.time}</span>
              </div>
              <div className="so-mobileCard__row">
                <span>Type</span>
                <span className="so-badge--closed">{r.type}</span>
              </div>
              <div className="so-mobileCard__row">
                <span>Wallet</span>
                <span className="so-num">{r.wallet}</span>
              </div>
              <div className="so-mobileCard__row">
                <span>Coin</span>
                <span>
                  {r.coin} <span className="so-table__td--muted">({r.coinSub})</span>
                </span>
              </div>
              <div className="so-mobileCard__row">
                <span>Amount</span>
                <span className="so-num">{r.amount}</span>
              </div>
              <div className="so-mobileCard__row">
                <span>Destination</span>
                <span>{r.destination}</span>
              </div>
              <div className="so-mobileCard__row">
                <span>TxID</span>
                <span className="so-mobileCard__stack">
                  <span className="so-num">{r.txid}</span>
                  {r.txSub ? <span className="so-table__td--muted so-num">{r.txSub}</span> : null}
                </span>
              </div>
              <div className="so-mobileCard__row">
                <span>Status</span>
                <span>
                  <StatusPill value={r.status} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepositHistory;
