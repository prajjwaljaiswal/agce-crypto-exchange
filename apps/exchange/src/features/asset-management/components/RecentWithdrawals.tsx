import { RECENT_WITHDRAWALS, shortenHash } from '../constants.js'
import { CopyIcon } from './CopyIcon.js'
import { WithdrawalDetailsModal } from './WithdrawalDetailsModal.js'

const DETAILS_MODAL_ID = 'recent_withdrawal_table'

export function RecentWithdrawals() {
  return (
    <div className="recent_deposit_list">
      <div className="top_heading">
        <h4>Recent Withdrawals</h4>
        <a className="more_btn" href="/user_profile/transaction_history">
          More &gt;
        </a>
      </div>

      <div className="table_outer">
        <div className="withdraw_history_desktop">
          <table>
            <tbody>
              {RECENT_WITHDRAWALS.map((row) => (
                <tr key={row.id}>
                  <td>
                    <div className="td_first">
                      <div className="price_heading">
                        <img width="30" src={row.icon} alt="icon" />
                        {row.amount} {row.coin}{' '}
                        <span className="text-success">{row.status}</span>
                      </div>
                      <div className="date_info">
                        <span>Date</span>
                        {row.date}
                      </div>
                    </div>
                  </td>
                  <td>
                    Network <span>{row.network}</span>
                  </td>
                  <td>
                    Address{' '}
                    <div className="address_icon">
                      <span>{shortenHash(row.address)}</span>
                      <span>
                        <CopyIcon />
                      </span>
                    </div>
                  </td>
                  <td>
                    TxID{' '}
                    <div className="address_icon">
                      <span>{shortenHash(row.txHash)}</span>
                      <span>
                        <CopyIcon />
                      </span>
                    </div>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="bg-transparent border-0 p-0 text-inherit"
                      data-bs-toggle="modal"
                      data-bs-target={`#${DETAILS_MODAL_ID}`}
                      style={{ cursor: 'pointer' }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="withdraw_history_mobile">
          <div className="withdraw_cards_list">
            {RECENT_WITHDRAWALS.map((row) => (
              <div key={row.id} className="withdraw_card_item">
                <div className="withdraw_card_header">
                  <div className="withdraw_card_title">
                    <img width="32" height="32" src={row.icon} alt="" />
                    <span className="withdraw_amount">
                      {row.amount} {row.coin}
                    </span>
                    <span className="withdraw_status text-success">{row.status}</span>
                  </div>
                  <div className="withdraw_card_date">
                    <span className="label">Date</span> {row.date}
                  </div>
                </div>
                <div className="withdraw_card_row">
                  <span className="label">Network</span>
                  <span>{row.network}</span>
                </div>
                <div className="withdraw_card_row address_icon">
                  <span className="label">Address</span>
                  <span className="value">
                    {shortenHash(row.address)}
                    <span>
                      <CopyIcon />
                    </span>
                  </span>
                </div>
                <div className="withdraw_card_row address_icon">
                  <span className="label">TxID</span>
                  <span className="value">{shortenHash(row.txHash)}</span>
                  <span>
                    <CopyIcon />
                  </span>
                </div>
                <div className="withdraw_card_footer">
                  <button
                    type="button"
                    className="withdraw_card_view_btn"
                    data-bs-toggle="modal"
                    data-bs-target={`#${DETAILS_MODAL_ID}`}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {RECENT_WITHDRAWALS[0] ? (
        <WithdrawalDetailsModal
          modalId={DETAILS_MODAL_ID}
          record={RECENT_WITHDRAWALS[0]}
        />
      ) : null}
    </div>
  )
}
