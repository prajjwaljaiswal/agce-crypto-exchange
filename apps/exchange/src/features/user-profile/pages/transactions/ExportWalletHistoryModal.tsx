import { Modal } from '@agce/ui'

interface ExportWalletHistoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ExportWalletHistoryModal({
  isOpen,
  onClose,
}: ExportWalletHistoryModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      staticBackdrop
      size="lg"
      modalClassName="search_form export_modal"
      title="Export Deposit/Withdrawal History"
    >
      <div className="export_modal_body">
        <div className="export_section">
          <label className="export_label">Transaction Type</label>
          <div className="export_btn_group">
            <button type="button" className="export_btn active">
              All
            </button>
            <button type="button" className="export_btn">
              Deposit
            </button>
            <button type="button" className="export_btn">
              Withdrawal
            </button>
          </div>
        </div>

        <div className="export_section">
          <label className="export_label">Select Time Period</label>
          <div className="export_btn_group export_presets">
            <button type="button" className="export_btn">
              Last 24 hours
            </button>
            <button type="button" className="export_btn">
              2 Weeks
            </button>
            <button type="button" className="export_btn">
              1 Month
            </button>
            <button type="button" className="export_btn">
              3 Months
            </button>
            <button type="button" className="export_btn">
              6 Months
            </button>
            <button type="button" className="export_btn active">
              Customize
            </button>
          </div>
          <div className="export_date_range">
            <input
              type="date"
              className="export_date_input"
              defaultValue="2026-03-09"
            />
            <span className="export_date_arrow">
              <i className="ri-arrow-right-line" />
            </span>
            <input
              type="date"
              className="export_date_input"
              defaultValue="2026-04-09"
            />
          </div>
          <small className="export_note">
            * Up to 10,000 data can be generated each time.
          </small>
        </div>

        <div className="export_section">
          <label className="export_label">Format</label>
          <div className="export_btn_group">
            <button type="button" className="export_btn active">
              PDF
            </button>
            <button type="button" className="export_btn">
              Excel
            </button>
          </div>
        </div>

        <div className="export_section export_actions">
          <button type="button" className="export_submit_btn" onClick={onClose}>
            Export
          </button>
        </div>
      </div>
    </Modal>
  )
}
