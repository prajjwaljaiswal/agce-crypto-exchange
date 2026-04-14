const TRANSACTIONS = [
  {
    id: 1,
    date: '2026-04-14 10:15:01',
    type: 'Deposit',
    currency: 'USDT',
    chain: 'TRC20',
    amount: '1000.00',
    hash: 'abc123...def456',
    status: 'COMPLETED',
  },
  {
    id: 2,
    date: '2026-04-13 22:50:17',
    type: 'Withdrawal',
    currency: 'BTC',
    chain: 'BTC',
    amount: '0.02500',
    hash: 'xyz789...uvw012',
    status: 'PENDING',
  },
  {
    id: 3,
    date: '2026-04-12 14:02:33',
    type: 'Deposit',
    currency: 'ETH',
    chain: 'ERC20',
    amount: '0.5000',
    hash: 'mno345...pqr678',
    status: 'SUCCESS',
  },
  {
    id: 4,
    date: '2026-04-11 09:18:55',
    type: 'Withdrawal',
    currency: 'USDT',
    chain: 'BEP20',
    amount: '500.00',
    hash: '-',
    status: 'REJECTED',
  },
]

function statusClass(status: string): string {
  switch (status) {
    case 'COMPLETED':
    case 'SUCCESS':
      return 'green'
    case 'PENDING':
      return 'yellow'
    case 'REJECTED':
      return 'red'
    default:
      return ''
  }
}

export function TransactionHistory() {
  return (
    <div className="dashboard_right">
      <div className="market_section spotorderhist">
        <div className="top_heading">
          <h4>Deposit/Withdrawal history</h4>
          <div className="coin_right">
            <div className="searchBar custom-tabs">
              <i className="ri-search-2-line" />
              <input
                type="search"
                className="custom_search"
                placeholder="Search"
              />
            </div>
            <button type="button" className="btn btn-link">
              <i className="ri-download-2-line" /> Export
            </button>
          </div>
        </div>

        <div className="dashboard_summary">
          <div className="desktop_view">
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Sr No</th>
                    <th>Date &amp; Time</th>
                    <th>Type</th>
                    <th>Currency</th>
                    <th>Chain</th>
                    <th>Amount</th>
                    <th>Tx Hash</th>
                    <th className="right_t">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {TRANSACTIONS.map((t) => (
                    <tr key={t.id}>
                      <td>{t.id}</td>
                      <td>{t.date}</td>
                      <td>{t.type}</td>
                      <td>{t.currency}</td>
                      <td>{t.chain}</td>
                      <td>{t.amount}</td>
                      <td>{t.hash}</td>
                      <td className={`right_t ${statusClass(t.status)}`}>
                        {t.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mobile_view">
            <ul className="order_datalist">
              {TRANSACTIONS.map((t) => (
                <li key={t.id}>
                  <div className="d-flex justify-content-between">
                    <strong>
                      {t.type} · {t.currency}
                    </strong>
                    <span className={statusClass(t.status)}>{t.status}</span>
                  </div>
                  <p>
                    {t.amount} {t.currency} · {t.chain} · {t.date}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
