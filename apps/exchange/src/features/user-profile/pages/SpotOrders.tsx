const ORDERS = [
  {
    id: '1',
    date: '2026-04-14 10:12:33',
    pair: 'BTC/USDT',
    side: 'Buy',
    price: '67250.12',
    avg: '67200.00',
    qty: '0.0250',
    remaining: '0',
    total: '1680.00',
    fee: '1.68 USDT',
    type: 'Limit',
    status: 'Filled',
  },
  {
    id: '2',
    date: '2026-04-13 18:02:10',
    pair: 'ETH/USDT',
    side: 'Sell',
    price: '3450.45',
    avg: '3449.80',
    qty: '0.5000',
    remaining: '0',
    total: '1724.90',
    fee: '1.72 USDT',
    type: 'Market',
    status: 'Filled',
  },
  {
    id: '3',
    date: '2026-04-12 09:45:00',
    pair: 'SOL/USDT',
    side: 'Buy',
    price: '142.33',
    avg: '0',
    qty: '10',
    remaining: '10',
    total: '1423.30',
    fee: '-',
    type: 'Limit',
    status: 'Cancelled',
  },
]

export function SpotOrders() {
  return (
    <div className="dashboard_right">
      <div className="market_section spotorderhist">
        <div className="top_heading">
          <h4>Spot orders</h4>
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
            <div className="checkbox">
              <input type="checkbox" /> Hide cancelled
            </div>
          </div>
        </div>

        <div className="dashboard_summary">
          <div className="desktop_view">
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Trading Pair</th>
                    <th>Side</th>
                    <th>Price</th>
                    <th>Average</th>
                    <th>Quantity</th>
                    <th>Remaining</th>
                    <th>Total</th>
                    <th>Fee</th>
                    <th>Type</th>
                    <th className="right_t">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ORDERS.map((o) => (
                    <tr key={o.id}>
                      <td>{o.date}</td>
                      <td>{o.pair}</td>
                      <td className={o.side === 'Buy' ? 'green' : 'red'}>
                        {o.side}
                      </td>
                      <td>{o.price}</td>
                      <td>{o.avg}</td>
                      <td>{o.qty}</td>
                      <td>{o.remaining}</td>
                      <td>{o.total}</td>
                      <td>{o.fee}</td>
                      <td>{o.type}</td>
                      <td
                        className={`right_t ${o.status === 'Filled' ? 'green' : o.status === 'Cancelled' ? 'red' : 'yellow'}`}
                      >
                        {o.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mobile_view">
            <ul className="order_datalist">
              {ORDERS.map((o) => (
                <li key={o.id}>
                  <div className="d-flex justify-content-between">
                    <strong>{o.pair}</strong>
                    <span
                      className={
                        o.status === 'Filled'
                          ? 'green'
                          : o.status === 'Cancelled'
                            ? 'red'
                            : 'yellow'
                      }
                    >
                      {o.status}
                    </span>
                  </div>
                  <p>
                    {o.side} · {o.qty} @ {o.price} · {o.date}
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
