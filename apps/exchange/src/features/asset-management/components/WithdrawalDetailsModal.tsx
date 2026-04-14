import type { WithdrawalRecord } from '../constants.js'
import { shortenHash } from '../constants.js'
import { CopyIcon } from './CopyIcon.js'

interface WithdrawalDetailsModalProps {
  modalId: string
  record: WithdrawalRecord
}

export function WithdrawalDetailsModal({ modalId, record }: WithdrawalDetailsModalProps) {
  return (
    <div
      className="modal fade search_form table_pop_up search_form_modal_2"
      id={modalId}
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Withdrawal Details</h2>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <div className="withdrawal_top_list">
              {record.timeline.map((step) => (
                <div key={step.label} className="bn_step_content">
                  <h5>{step.label}</h5>
                  <span>{step.at}</span>
                </div>
              ))}
            </div>

            <div className="hot_trading_t">
              <table>
                <tbody>
                  <tr>
                    <td>Status</td>
                    <td className="right_t price_tb">
                      <span className="green">{record.status}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Coin</td>
                    <td className="right_t price_tb">{record.coin}</td>
                  </tr>
                  <tr>
                    <td>Withdraw amount</td>
                    <td className="right_t price_tb">{record.amount}</td>
                  </tr>
                  <tr>
                    <td>Network</td>
                    <td className="right_t price_tb">{record.network}</td>
                  </tr>
                  <tr>
                    <td>Address</td>
                    <td className="right_t price_tb">
                      <div className="address_icon">
                        <span>{shortenHash(record.address)}</span>
                        <CopyIcon />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>TxID</td>
                    <td className="right_t price_tb">
                      <div className="address_icon">
                        <span>{shortenHash(record.txHash)}</span>
                        <CopyIcon />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
