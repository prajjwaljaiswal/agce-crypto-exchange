import { SwapModal } from './SwapModal.js'

interface Props {
  open: boolean
  onClose: () => void
  onConfirm?: () => void
}

export function OrderDetailsModal({ open, onClose, onConfirm }: Props) {
  const handleConfirm = () => {
    onConfirm?.()
    onClose()
  }

  return (
    <SwapModal
      open={open}
      onClose={onClose}
      id="more_details"
      className="search_form search_coin"
    >
      <div className="modal-header">
        <h5>Order details</h5>
        <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
      </div>
      <div className="modal-body modal-swap ">
        <div className="hot_trading_t model_height">
          <table>
            <tbody>
              <tr>
                <td>Swapping</td>
                <td className="right_t price_tb">
                  1000 USDT
                  <i className="ri-arrow-right-double-line"></i>
                  0.0152 BTC
                </td>
              </tr>
              <tr>
                <td>Swapping Fee (0.15%)</td>
                <td className="right_t price_tb">0.0000228 BTC</td>
              </tr>
              <tr>
                <td>Deductable Amount</td>
                <td className="right_t price_tb">1000 USDT</td>
              </tr>
              <tr>
                <td>Receivable Amount (Approx.)</td>
                <td className="right_t price_tb">0.0151772 BTC</td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <small>
                    <i className="ri-information-2-line"></i> This is an internal transfer. The final disbursed amount will be based on the current market rate at the time of execution. Minor fluctuations may occur between placing the order and its execution.
                  </small>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mt-3">
            <form>
              <button type="button" className="swap_button " onClick={handleConfirm}>
                Confirm Order
              </button>
            </form>
          </div>
        </div>
      </div>
    </SwapModal>
  )
}
