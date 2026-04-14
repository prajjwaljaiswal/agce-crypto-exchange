import { MOCK_TICKETS } from './__mocks__/tickets.js'

export function Support() {
  return (
    <div className="dashboard_right">
      <div className="supportsection">
        <div className="supportinquery">
          <h4>Raise a Support Ticket</h4>
          <form className="profile_form">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Subject</label>
                <input
                  type="text"
                  className="emailinput"
                  placeholder="Briefly describe your issue"
                />
              </div>
              <div className="col-md-3 mb-3">
                <label>Category</label>
                <select className="form-select">
                  <option>Select</option>
                  <option>Deposit</option>
                  <option>Withdrawal</option>
                  <option>KYC</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="col-md-3 mb-3">
                <label>Priority</label>
                <select className="form-select">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div className="col-md-12 mb-3">
                <label>Description</label>
                <textarea
                  className="emailinput"
                  rows={4}
                  placeholder="Describe your issue in detail..."
                />
              </div>
              <div className="col-md-12 mb-3">
                <label>Supporting documents</label>
                <input type="file" className="form-control" multiple />
              </div>
              <div className="col-md-12">
                <button type="button" className="btn btn-deposit px-4">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="tt_main mt-4">
        <div className="top_heading">
          <h4>Issue List</h4>
          <div className="coin_right">
            <div className="searchBar custom-tabs">
              <i className="ri-search-2-line" />
              <input
                type="search"
                className="custom_search"
                placeholder="Search tickets"
              />
            </div>
          </div>
        </div>
        <div className="issuelist_data">
          <div className="desktop_view">
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Sr No.</th>
                    <th>Ticket ID</th>
                    <th>Category</th>
                    <th>Subject</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th className="right_t">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_TICKETS.map((t) => (
                    <tr key={t.id}>
                      <td>{t.id}</td>
                      <td>{t.ticketId}</td>
                      <td>{t.category}</td>
                      <td>{t.subject}</td>
                      <td>{t.priority}</td>
                      <td>{t.status}</td>
                      <td className="right_t">
                        <button type="button" className="btn btn-link">
                          View
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
  )
}
