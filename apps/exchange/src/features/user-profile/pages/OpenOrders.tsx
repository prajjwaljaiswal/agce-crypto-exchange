import { TablePagination } from '@agce/ui'

interface OpenOrder {
  id: number
  date: string
  time: string
  pair: string
  side: 'BUY' | 'SELL'
  price: string
  qty: string
  filled: string
  total: string
  status: 'OPEN' | 'PARTIALLY_FILLED'
}

const OPEN_ORDERS: OpenOrder[] = [
  {
    id: 1,
    date: '09/04/2026',
    time: '10:30 AM',
    pair: 'BTC/USDT',
    side: 'BUY',
    price: '67250.123456',
    qty: '0.05',
    filled: '0',
    total: '3362.506172',
    status: 'OPEN',
  },
  {
    id: 2,
    date: '08/04/2026',
    time: '02:15 PM',
    pair: 'ETH/USDT',
    side: 'SELL',
    price: '3250.8',
    qty: '1.25',
    filled: '0.4',
    total: '4063.5',
    status: 'PARTIALLY_FILLED',
  },
  {
    id: 3,
    date: '07/04/2026',
    time: '09:00 AM',
    pair: 'SOL/USDT',
    side: 'BUY',
    price: '145.75',
    qty: '50',
    filled: '0',
    total: '7287.5',
    status: 'OPEN',
  },
]

function CancelButton() {
  return (
    <button
      className="btn text-danger btn-sm btn-icon"
      type="button"
      title="Cancel order"
    >
      <i className="ri-delete-bin-6-line pr-0" />
    </button>
  )
}

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

function OpenOrdersTable({ orders }: { orders: OpenOrder[] }) {
  return (
    <div className="listing_left_outer full_width transaction_history_t desktop_view2">
      <div className="market_section spotorderhist">
        <div className="top_heading">
          <h4>Open orders </h4>
          <div className="coin_right">
            <SearchBar />
          </div>
        </div>
        <div className="dashboard_summary">
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
                  <th className="right_td">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr key={o.id}>
                    <td>{i + 1}</td>
                    <td>
                      <div className=" justify-content-start">
                        <span>
                          {o.date}
                          <small>{o.time}</small>
                        </span>
                      </div>
                    </td>
                    <td>{o.pair}</td>
                    <td>{o.side}</td>
                    <td>{o.price}</td>
                    <td>{o.qty}</td>
                    <td>{o.filled}</td>
                    <td>{o.total}</td>
                    <td>{o.status}</td>
                    <td className="right_td">
                      <CancelButton />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <TablePagination label={`1-${orders.length} of ${orders.length}`} />
        </div>
      </div>
    </div>
  )
}

function OpenOrdersMobileList({ orders }: { orders: OpenOrder[] }) {
  return (
    <div className="order_history_mobile_view">
      <div className="coin_right d-flex flex-row justify-content-between align-items-center p-0">
        <h5>Open orders</h5>
        <div className="d-flex flex-row justify-content-end align-items-end mb-3">
          <SearchBar />
        </div>
      </div>
      <div className="d-flex">
        {orders.map((o) => (
          <div key={o.id} className="order_datalist">
            <ul className="listdata">
              <li>
                <span className="date">Date</span>
                <span className="date_light">{o.date}</span>
              </li>
              <li>
                <span>Time</span>
                <span>{o.time}</span>
              </li>
              <li>
                <span>Currency Pair</span>
                <span>{o.pair}</span>
              </li>
              <li>
                <span>Side</span>
                <span>{o.side}</span>
              </li>
              <li>
                <span>Price</span>
                <span>{o.price}</span>
              </li>
              <li>
                <span>Quantity</span>
                <span>{o.qty}</span>
              </li>
              <li>
                <span>Filled</span>
                <span>{o.filled}</span>
              </li>
              <li>
                <span>Total</span>
                <span>{o.total}</span>
              </li>
              <li>
                <span>Status</span>
                <span>{o.status}</span>
              </li>
              <li>
                <span>Action</span>
                <span>
                  <CancelButton />
                </span>
              </li>
            </ul>
          </div>
        ))}
      </div>
      <TablePagination
        className="mt-3"
        label={`1-${orders.length} of ${orders.length}`}
      />
    </div>
  )
}

export function OpenOrders() {
  return (
    <div className="dashboard_right">
      <div className="dashboard_listing_section Overview_mid">
        <OpenOrdersTable orders={OPEN_ORDERS} />
        <OpenOrdersMobileList orders={OPEN_ORDERS} />
      </div>
    </div>
  )
}
