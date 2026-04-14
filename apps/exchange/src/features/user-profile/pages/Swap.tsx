import { MOCK_RECENT_SWAPS } from './__mocks__/swaps.js'

export function Swap() {
  return (
    <div className="dashboard_right">
      <div className="swap_outer_section">
        <div className="swaplist d-flex justify-content-between mb-3">
          <div>
            <p>
              Daily limit: <strong>100,000 USDT</strong>
            </p>
          </div>
          <div>
            <p>
              Fee: <strong>0.1%</strong>
            </p>
          </div>
        </div>

        <div className="swap_usdtdata">
          <div className="swap_ustd_bl">
            <label>From</label>
            <div className="d-flex justify-content-between align-items-center">
              <input
                type="number"
                className="emailinput"
                placeholder="0.00"
                defaultValue="1000"
              />
              <button type="button" className="btn btn-outline-custom">
                USDT
              </button>
            </div>
            <small>Available: 14566.12 USDT</small>
          </div>

          <div className="text-center my-2">
            <button type="button" className="btn btn-link">
              <i className="ri-arrow-up-down-line" />
            </button>
          </div>

          <div className="swap_ustd_bl">
            <label>To</label>
            <div className="d-flex justify-content-between align-items-center">
              <input
                type="number"
                className="emailinput"
                placeholder="0.00"
                defaultValue="0.01487"
                readOnly
              />
              <button type="button" className="btn btn-outline-custom">
                BTC
              </button>
            </div>
            <small>Rate: 1 BTC = 67250.12 USDT</small>
          </div>

          <button type="button" className="btn btn-deposit w-100 mt-3">
            Swap Now
          </button>
        </div>
      </div>

      <div className="dashboard_recent_s mt-4">
        <div className="top_heading">
          <h4>Recent Swaps</h4>
        </div>
        <div className="swap_tb_his">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Date</th>
                  <th>Pair</th>
                  <th>Pay</th>
                  <th>Get</th>
                  <th>Fee</th>
                  <th>Rate</th>
                  <th className="right_t">Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_RECENT_SWAPS.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.date}</td>
                    <td>{s.pair}</td>
                    <td>{s.pay}</td>
                    <td>{s.get}</td>
                    <td>{s.fee}</td>
                    <td>{s.rate}</td>
                    <td className="right_t green">{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
