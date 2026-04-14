import { WITHDRAW_NETWORK_OPTIONS } from '../constants.js'

interface WithdrawNetworkSelectProps {
  selectedNetwork: string
  address: string
  onAddressChange: (value: string) => void
}

export function WithdrawNetworkSelect({
  selectedNetwork,
  address,
  onAddressChange,
}: WithdrawNetworkSelectProps) {
  return (
    <div className="select_network_s select-option">
      <h2>Withdraw to</h2>
      <div
        className="search_icon_s"
        data-bs-toggle="modal"
        data-bs-target="#network_pop_up"
      >
        {selectedNetwork}
      </div>

      <div className="address_input">
        <input
          type="text"
          placeholder="Enter Address"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
        />
        <div className="icon_cnt">
          <svg
            className="bn-svg icon-normal-pointer text-IconNormal"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.25 4.41h-3v3h3v-3zM6.25 10.41h-3v3h3v-3zM6.25 16.41h-3v3h3v-3z"
              fill="currentColor"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M20.75 20h-12V4h12v16zm-6-8.521a1.872 1.872 0 100-3.745 1.872 1.872 0 000 3.745zm-1.338 1.07c-.886 0-1.604.718-1.604 1.604v1.605h5.884v-1.605c0-.886-.719-1.605-1.605-1.605h-2.675z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div className="d-flex items-center top_space opt_cnt" />
      </div>

      <p>
        The network you selected is {selectedNetwork}, please ensure that the withdrawal
        address supports the {selectedNetwork} network. You will potentially lose your
        assets if the chosen plateform does not support refunds of wrongfully deposited
        assets.
      </p>

      <div
        className="modal fade search_form search_coin"
        id="network_pop_up"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="network_top_p">
                <svg
                  className="bn-svg h-m w-m flex-shrink-0"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 21a9 9 0 100-18 9 9 0 000 18zm-1.25-5.5V18h2.5v-2.5h-2.5zm0-9.5v7h2.5V6h-2.5z"
                    fill="currentColor"
                  />
                </svg>
                <p>
                  Only supported networks on the AGCE platform are shown. If you provide
                  an address from an unsupported network, your withdrawal request may be
                  rejected.
                </p>
              </div>

              <div className="hot_trading_t">
                <table>
                  <tbody>
                    {WITHDRAW_NETWORK_OPTIONS.map((network) => (
                      <tr key={network.code} data-bs-dismiss="modal">
                        <td>
                          <div className="td_first">
                            <div className="price_heading">
                              {network.code} <br />
                              <span />
                            </div>
                          </div>
                        </td>
                        <td className="right_t price_tb">
                          {network.range}
                          <br />
                          <span>{network.eta}</span>
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
    </div>
  )
}
