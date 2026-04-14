import { TablePagination } from '@agce/ui'
import { useDisclosure } from '@agce/hooks'
import { ExportWalletHistoryModal } from './transactions/ExportWalletHistoryModal.js'

interface Transaction {
  id: number
  date: string
  time: string
  type: 'DEPOSIT' | 'WITHDRAWAL'
  currency: string
  chain: string
  amount: string
  hash: string
  status: 'COMPLETED' | 'PENDING' | 'SUCCESS' | 'REJECTED'
}

const STATUS_COLOR: Record<Transaction['status'], string> = {
  COMPLETED: 'green',
  SUCCESS: 'green',
  PENDING: 'yellow',
  REJECTED: 'red',
}

const STATUS_TEXT_CLASS: Record<Transaction['status'], string> = {
  COMPLETED: 'text-success',
  SUCCESS: 'text-success',
  PENDING: 'text-warning',
  REJECTED: 'text-danger',
}

const TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    date: '09/04/2026',
    time: '11:45 AM',
    type: 'DEPOSIT',
    currency: 'USDT',
    chain: 'TRC20',
    amount: '500.25',
    hash: '0x1a2b3c4d...9f8e7d',
    status: 'COMPLETED',
  },
  {
    id: 2,
    date: '08/04/2026',
    time: '03:20 PM',
    type: 'WITHDRAWAL',
    currency: 'BTC',
    chain: 'Bitcoin',
    amount: '0.015',
    hash: 'bc1qxy2k...g9hm',
    status: 'PENDING',
  },
  {
    id: 3,
    date: '07/04/2026',
    time: '09:10 AM',
    type: 'DEPOSIT',
    currency: 'ETH',
    chain: 'ERC20',
    amount: '2.5',
    hash: '0xdeadbeef...a1b2c3',
    status: 'SUCCESS',
  },
  {
    id: 4,
    date: '06/04/2026',
    time: '06:00 PM',
    type: 'WITHDRAWAL',
    currency: 'SOL',
    chain: 'Solana',
    amount: '25',
    hash: '5VERv8NMv...4BUP',
    status: 'REJECTED',
  },
]

function SearchBar() {
  return (
    <div className="searchBar custom-tabs">
      <i className="ri-search-2-line" />
      <input
        type="search"
        className="custom_search"
        placeholder="Search Crypto"
        defaultValue=""
      />
    </div>
  )
}

function ExportButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="searchBar custom-tabs"
      onClick={onClick}
      title="Export Deposit/Withdrawal History"
      style={{ cursor: 'pointer' }}
    >
      <i className="ri-download-2-line" />
    </button>
  )
}

function HashCell({ hash }: { hash: string }) {
  return (
    <div className="d-flex align-items-center gap-1 flex-wrap">
      <span>{hash}</span>
      <button
        type="button"
        className="btn btn-sm btn-icon p-0"
        title="Copy Tx Hash"
      >
        <i className="ri-file-copy-line" />
      </button>
    </div>
  )
}

function TransactionsTable({
  rows,
  onExport,
}: {
  rows: Transaction[]
  onExport: () => void
}) {
  return (
    <div className="listing_left_outer full_width transaction_history_t desktop_view2">
      <div className="market_section spotorderhist">
        <div className="top_heading">
          <h4>Deposit/Withdrawal history</h4>
          <div className="coin_right">
            <SearchBar />
            <ExportButton onClick={onExport} />
          </div>
        </div>

        <div className="dashboard_summary">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Sr No</th>
                  <th>Date & Time</th>
                  <th>Transaction Type</th>
                  <th>Currency </th>
                  <th>Chain</th>
                  <th>Amount</th>
                  <th>Tx Hash</th>
                  <th className="right_td">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((t, i) => (
                  <tr key={t.id} className="cursor-pointer">
                    <td className="color-grey">
                      <small>{i + 1}</small>
                    </td>
                    <td>
                      <div className="c_view justify-content-start">
                        <span>
                          {t.date}
                          <small>{t.time}</small>
                        </span>
                      </div>
                    </td>
                    <td>{t.type}</td>
                    <td>{t.currency}</td>
                    <td>{t.chain}</td>
                    <td>{t.amount}</td>
                    <td>
                      <HashCell hash={t.hash} />
                    </td>
                    <td className={`right_td ${STATUS_COLOR[t.status]}`}>
                      {t.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <TablePagination label={`1-${rows.length} of ${rows.length}`} />
        </div>
      </div>
    </div>
  )
}

function TransactionsMobileList({
  rows,
  onExport,
}: {
  rows: Transaction[]
  onExport: () => void
}) {
  return (
    <div className="order_history_mobile_view">
      <div className="coin_right d-flex flex-row justify-content-between align-items-center p-0">
        <h5>Deposit/Withdrawal history</h5>
        <div className="d-flex flex-row justify-content-end align-items-end mb-3 gap-2">
          <ExportButton onClick={onExport} />
          <SearchBar />
        </div>
      </div>
      <div className="d-flex">
        {rows.map((t) => (
          <div key={t.id} className="order_datalist">
            <ul className="listdata">
              <li>
                <span className="date">Date</span>
                <span className="date_light">{t.date}</span>
              </li>
              <li>
                <span>Time</span>
                <span>{t.time}</span>
              </li>
              <li>
                <span>Transaction Type</span>
                <span>{t.type}</span>
              </li>
              <li>
                <span>Currency</span>
                <span>{t.currency}</span>
              </li>
              <li>
                <span>Chain</span>
                <span>{t.chain}</span>
              </li>
              <li>
                <span>Amount</span>
                <span>{t.amount}</span>
              </li>
              <li>
                <span>Tx Hash</span>
                <span>
                  <span className="text-white">
                    {t.hash} <i className="ri-file-copy-line" />
                  </span>
                </span>
              </li>
              <li>
                <span>Status</span>
                <span className={STATUS_TEXT_CLASS[t.status]}>{t.status}</span>
              </li>
            </ul>
          </div>
        ))}
      </div>
      <TablePagination
        className="mt-3"
        label={`1-${rows.length} of ${rows.length}`}
      />
    </div>
  )
}

export function TransactionHistory() {
  const exportModal = useDisclosure()
  return (
    <div className="dashboard_right">
      <div className="dashboard_listing_section Overview_mid">
        <TransactionsTable rows={TRANSACTIONS} onExport={exportModal.open} />
        <TransactionsMobileList
          rows={TRANSACTIONS}
          onExport={exportModal.open}
        />
      </div>
      <ExportWalletHistoryModal
        isOpen={exportModal.isOpen}
        onClose={exportModal.close}
      />
    </div>
  )
}
