import { Modal } from '@agce/ui'

const EXPORT_PRESETS = [
  'Last 24 hours',
  '2 Weeks',
  '1 Month',
  '3 Months',
  '6 Months',
  'Customize',
]
const EXPORT_FORMATS = ['PDF', 'Excel']

interface ExportTradeHistoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ExportTradeHistoryModal({
  isOpen,
  onClose,
}: ExportTradeHistoryModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      staticBackdrop
      size="lg"
      modalClassName="search_form export_modal"
      title="Export Trade History"
    >
      <div className="export_modal_body">
        <div className="export_section">
          <label className="export_label">Select Time Period</label>
          <div className="export_btn_group export_presets">
            {EXPORT_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                className={`export_btn${preset === 'Customize' ? ' active' : ''}`}
              >
                {preset}
              </button>
            ))}
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
            {EXPORT_FORMATS.map((format) => (
              <button
                key={format}
                type="button"
                className={`export_btn${format === 'PDF' ? ' active' : ''}`}
              >
                {format}
              </button>
            ))}
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
