import { DEPOSIT_HISTORY_COLUMNS } from '../constants.js'

export function DepositHistory() {
  return (
    <div className="recent_deposit_list deposit_history_section">
      <div className="deposit_history_top">
        <h4 className="deposit_history_title">Deposit History</h4>
      </div>

      <div className="deposit_history_card">
        <div className="deposit_history_head_wrap">
          <div className="deposit_history_head" role="row">
            {DEPOSIT_HISTORY_COLUMNS.map((label) => (
              <div
                key={label}
                className="deposit_history_head_cell"
                role="columnheader"
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
