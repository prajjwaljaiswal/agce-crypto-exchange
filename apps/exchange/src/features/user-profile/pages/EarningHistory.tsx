const PLANS = [
  {
    id: 1,
    currency: 'USDT',
    wallet: 'Flexible',
    duration: '—',
    start: '2026-03-01',
    mature: '—',
    subscription: '2000.00',
    bonus: '12.45',
    receivable: '2012.45',
    status: 'ACTIVE',
  },
  {
    id: 2,
    currency: 'BTC',
    wallet: 'Locked',
    duration: '30 Days',
    start: '2026-02-10',
    mature: '2026-03-12',
    subscription: '0.0500',
    bonus: '0.00065',
    receivable: '0.05065',
    status: 'COMPLETED',
  },
]

export function EarningHistory() {
  return (
    <div className="dashboard_right">
      <div className="market_section spotorderhist">
        <div className="top_heading">
          <h4>Earning History</h4>
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
                    <th>S.No</th>
                    <th>Currency</th>
                    <th>Wallet</th>
                    <th>Duration</th>
                    <th>Start date</th>
                    <th>Mature date</th>
                    <th>Subscription</th>
                    <th>Bonus</th>
                    <th>Receivable</th>
                    <th className="right_t">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {PLANS.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.currency}</td>
                      <td>{p.wallet}</td>
                      <td>{p.duration}</td>
                      <td>{p.start}</td>
                      <td>{p.mature}</td>
                      <td>{p.subscription}</td>
                      <td>{p.bonus}</td>
                      <td>{p.receivable}</td>
                      <td
                        className={`right_t ${p.status === 'COMPLETED' ? 'text-success' : 'text-warning'}`}
                      >
                        {p.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mobile_view">
            <ul className="order_datalist">
              {PLANS.map((p) => (
                <li key={p.id}>
                  <div className="d-flex justify-content-between">
                    <strong>
                      {p.currency} · {p.wallet}
                    </strong>
                    <span
                      className={
                        p.status === 'COMPLETED'
                          ? 'text-success'
                          : 'text-warning'
                      }
                    >
                      {p.status}
                    </span>
                  </div>
                  <p>
                    {p.subscription} {p.currency} · +{p.bonus} · {p.start}
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
