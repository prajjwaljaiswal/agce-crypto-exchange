import { Link } from 'react-router-dom'

interface SwapRow {
  sno: number
  date: string
  from: string
  to: string
  pay: string
  get: string
  fee: string
  rate: string
  status: string
}

const ROWS: SwapRow[] = [
  {
    sno: 1,
    date: '2026-04-08 02:30 PM',
    from: 'USDT',
    to: 'BTC',
    pay: '1000.00000000 USDT',
    get: '0.01520000 BTC',
    fee: '0.50000000 USDT',
    rate: '1 USDT => 0.00001520000 BTC',
    status: 'Completed',
  },
  {
    sno: 2,
    date: '2026-04-05 11:12 AM',
    from: 'BTC',
    to: 'ETH',
    pay: '0.05000000 BTC',
    get: '1.42000000 ETH',
    fee: '0.00007500 BTC',
    rate: '1 BTC => 28.40000000 ETH',
    status: 'Completed',
  },
  {
    sno: 3,
    date: '2026-04-01 09:45 PM',
    from: 'ETH',
    to: 'USDT',
    pay: '2.00000000 ETH',
    get: '6420.00000000 USDT',
    fee: '0.00300000 ETH',
    rate: '1 ETH => 3210.00000000 USDT',
    status: 'Completed',
  },
]

export function RecentSwapsTable() {
  return (
    <div className="dashboard_recent_s swap_tb_his">
      <div className="user_list_top">
        <div className="d-flex-between  mb-3  custom_dlflex">
          <h4>
            Recent Transactions{' '}
            <small>
              <Link to="/user_profile/swap_history" className="mx-2 text-white">
                <small>View All<i className="ri-arrow-right-line"></i></small>
              </Link>
            </small>
          </h4>

          <div className="searchBar custom-tabs">
            <i className="ri-search-2-line"></i>
            <input type="search" className="custom_search" placeholder="Search Crypto" defaultValue="" />
          </div>
        </div>
      </div>

      <div className="desktop_view2">
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Date</th>
                <th>Swapping Currencies</th>
                <th>Pay Amount</th>
                <th>Get Amount</th>
                <th>Swapping Fee</th>
                <th>Conversion Rate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.sno}>
                  <td>{r.sno}</td>
                  <td>{r.date}</td>
                  <td>
                    {r.from} <i className="ri-arrow-right-double-line"></i> {r.to}
                  </td>
                  <td>{r.pay}</td>
                  <td>{r.get}</td>
                  <td>{r.fee}</td>
                  <td>{r.rate}</td>
                  <td className="text-success">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mobile_view">
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Swapping Currencies</th>
                <th>Pay Amount</th>
                <th>Get Amount/Fee</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.slice(0, 2).map((r) => (
                <tr key={r.sno}>
                  <td>
                    {r.from} <i className="ri-arrow-right-double-line"></i> {r.to}
                  </td>
                  <td>{r.pay}</td>
                  <td>
                    {r.get}<br />{r.fee}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
