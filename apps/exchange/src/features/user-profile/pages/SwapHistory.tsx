const SWAPS = [
  {
    id: 1,
    date: '2026-04-14 11:20:44',
    paid: '1000.00 USDT',
    received: '0.01487 BTC',
    rate: '1 BTC = 67250.12 USDT',
    fee: '1.00 USDT',
    status: 'SUCCESS',
  },
  {
    id: 2,
    date: '2026-04-13 15:42:11',
    paid: '500.00 USDT',
    received: '0.1449 ETH',
    rate: '1 ETH = 3450.45 USDT',
    fee: '0.50 USDT',
    status: 'SUCCESS',
  },
]

export function SwapHistory() {
  return (
    <div className="dashboard_right">
      <div className="market_section spotorderhist">
        <div className="top_heading">
          <h4>Swap History</h4>
          <div className="coin_right">
            <div className="searchBar custom-tabs">
              <i className="ri-search-2-line" />
              <input
                type="search"
                className="custom_search"
                placeholder="Search crypto"
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
                    <th>Date/Time</th>
                    <th>Paid Amount</th>
                    <th>Received Amount</th>
                    <th>Conversion Rate</th>
                    <th>Fee</th>
                    <th className="right_t">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {SWAPS.map((s) => (
                    <tr key={s.id}>
                      <td>{s.id}</td>
                      <td>{s.date}</td>
                      <td>{s.paid}</td>
                      <td>{s.received}</td>
                      <td>{s.rate}</td>
                      <td>{s.fee}</td>
                      <td className="right_t green">{s.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mobile_view">
            <ul className="order_datalist">
              {SWAPS.map((s) => (
                <li key={s.id}>
                  <div className="d-flex justify-content-between">
                    <strong>
                      {s.paid.split(' ')[1]} → {s.received.split(' ')[1]}
                    </strong>
                    <span className="green">{s.status}</span>
                  </div>
                  <p>
                    {s.paid} → {s.received} · {s.date}
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
