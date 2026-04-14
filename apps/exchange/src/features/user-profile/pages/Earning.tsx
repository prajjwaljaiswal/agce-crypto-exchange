const PRODUCTS = [
  { token: 'USDT', apr: '8.5%', duration: 'Flexible' },
  { token: 'BTC', apr: '2.2%', duration: '30 Days' },
  { token: 'ETH', apr: '3.8%', duration: '60 Days' },
  { token: 'BNB', apr: '5.4%', duration: 'Flexible' },
]

const STATS = [
  { label: 'Total Invested', value: '12,450.00 USDT' },
  { label: 'Expected Return', value: '+865.20 USDT' },
  { label: 'Running Plans', value: '3' },
  { label: 'Bonus Earned', value: '12.45 USDT' },
]

export function Earning() {
  return (
    <section className="earning_outer_s">
      <div className="container-fluid">
        <div className="toptabs_hd">
          <ul className="nav nav-tabs" role="tablist">
            <li className="nav-item">
              <button type="button" className="nav-link active">
                Earning
              </button>
            </li>
            <li className="nav-item">
              <button type="button" className="nav-link">
                Earning Dashboard
              </button>
            </li>
          </ul>
        </div>

        <div className="balance_list_s row mt-3">
          {STATS.map((s) => (
            <div className="col-md-3" key={s.label}>
              <div className="market_section p-3">
                <p>{s.label}</p>
                <h4>{s.value}</h4>
              </div>
            </div>
          ))}
        </div>

        <div className="market_section mt-4">
          <div className="top_heading">
            <h4>All Plans</h4>
          </div>
          <div className="dashboard_summary">
            <div className="desktop_view">
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Token</th>
                      <th>Est. APR</th>
                      <th>Duration</th>
                      <th className="right_t">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRODUCTS.map((p) => (
                      <tr key={p.token}>
                        <td>{p.token}</td>
                        <td className="green">{p.apr}</td>
                        <td>{p.duration}</td>
                        <td className="right_t">
                          <button type="button" className="btn btn-deposit">
                            Subscribe
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
