const OPEN_ORDERS = [
  {
    id: 1,
    date: '2026-04-14 09:12:44',
    pair: 'BTC/USDT',
    side: 'Buy',
    price: '66000.00',
    qty: '0.05',
    filled: '0',
    total: '3300.00',
    status: 'Open',
  },
  {
    id: 2,
    date: '2026-04-14 08:25:09',
    pair: 'ETH/USDT',
    side: 'Sell',
    price: '3500.00',
    qty: '0.4',
    filled: '0.1',
    total: '1400.00',
    status: 'Partial',
  },
]

export function OpenOrders() {
  return (
    <div className="dashboard_right">
      <div className="market_section spotorderhist">
        <div className="top_heading">
          <h4>Open orders</h4>
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
                    <th>Date/Time</th>
                    <th>Currency Pair</th>
                    <th>Side</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Filled</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th className="right_t">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {OPEN_ORDERS.map((o) => (
                    <tr key={o.id}>
                      <td>{o.id}</td>
                      <td>{o.date}</td>
                      <td>{o.pair}</td>
                      <td className={o.side === 'Buy' ? 'green' : 'red'}>
                        {o.side}
                      </td>
                      <td>{o.price}</td>
                      <td>{o.qty}</td>
                      <td>{o.filled}</td>
                      <td>{o.total}</td>
                      <td>{o.status}</td>
                      <td className="right_t">
                        <button
                          type="button"
                          className="btn text-danger btn-sm"
                          aria-label="Cancel order"
                        >
                          <i className="ri-delete-bin-line" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mobile_view">
            <ul className="order_datalist">
              {OPEN_ORDERS.map((o) => (
                <li key={o.id}>
                  <div className="d-flex justify-content-between">
                    <strong>{o.pair}</strong>
                    <span>{o.status}</span>
                  </div>
                  <p>
                    {o.side} · {o.qty} @ {o.price}
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
