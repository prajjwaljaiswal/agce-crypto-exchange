import { DEPOSIT_HISTORY_COLUMNS } from '../constants.js'
import type { DepositRecord } from '../../../lib/matching-api.js'

interface DepositHistoryProps {
  deposits: DepositRecord[]
  isLoading: boolean
}

export function DepositHistory({ deposits, isLoading }: DepositHistoryProps) {
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

        {isLoading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading deposits...</div>
        ) : deposits.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>No deposits yet</div>
        ) : (
          <div className="deposit_history_body">
            {deposits.map((deposit) => (
              <div key={deposit.id} className="deposit_history_row" role="row">
                <div className="deposit_history_cell">{new Date(deposit.createdAt).toLocaleString()}</div>
                <div className="deposit_history_cell">{deposit.network}</div>
                <div className="deposit_history_cell">{deposit.address.slice(0, 10)}...{deposit.address.slice(-10)}</div>
                <div className="deposit_history_cell">{deposit.txId ? `${deposit.txId.slice(0, 10)}...` : '—'}</div>
                <div className="deposit_history_cell">{deposit.assetId}</div>
                <div className="deposit_history_cell">
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    backgroundColor: deposit.status === 'COMPLETED' ? '#d4edda' : '#fff3cd',
                    color: deposit.status === 'COMPLETED' ? '#155724' : '#856404'
                  }}>
                    {deposit.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
