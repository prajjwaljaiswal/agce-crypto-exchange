const TRANSFERS = [
  {
    id: 1,
    date: '2026-04-14 13:25:00',
    currency: 'USDT',
    from: 'Spot',
    to: 'Main',
    status: 'SUCCESS',
  },
  {
    id: 2,
    date: '2026-04-13 09:12:44',
    currency: 'BTC',
    from: 'Main',
    to: 'Earning',
    status: 'SUCCESS',
  },
]

export function WalletTransferHistory() {
  return (
    <div className="dashboard_right">
      <div className="market_section spotorderhist">
        <div className="top_heading">
          <h4>Internal Wallet Transfer History</h4>
          <div className="coin_right">
            <div className="searchBar custom-tabs">
              <i className="ri-search-2-line" />
              <input
                type="search"
                className="custom_search"
                placeholder="Search"
              />
            </div>
          </div>
        </div>

        <div className="dashboard_summary">
          <div className="desktop_view">
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Sr No.</th>
                    <th>Date</th>
                    <th>Currency</th>
                    <th>Wallet</th>
                    <th className="right_t">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {TRANSFERS.map((t) => (
                    <tr key={t.id}>
                      <td>{t.id}</td>
                      <td>{t.date}</td>
                      <td>{t.currency}</td>
                      <td>
                        <div className="td_first">
                          <div className="price_heading">
                            {t.from}{' '}
                            <i className="ri-arrow-right-double-line" /> {t.to}
                          </div>
                        </div>
                      </td>
                      <td className="right_t green">{t.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mobile_view">
            <ul className="order_datalist_2">
              {TRANSFERS.map((t) => (
                <li key={t.id}>
                  <div className="d-flex justify-content-between">
                    <strong>
                      {t.from} → {t.to}
                    </strong>
                    <span className="green">{t.status}</span>
                  </div>
                  <p>
                    {t.currency} · {t.date}
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
