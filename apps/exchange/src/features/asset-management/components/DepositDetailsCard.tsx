import { useState } from 'react'
import { SAMPLE_MEMO } from '../constants.js'
import { StepBadge } from './StepBadge.js'
import { CopyField } from './CopyField.js'

interface DepositDetailsCardProps {
  depositAddress: string
}

export function DepositDetailsCard({ depositAddress }: DepositDetailsCardProps) {
  const [isOpen, setIsOpen] = useState(true)
  const hasAddress = Boolean(depositAddress)

  return (
    <div className="deposit_step_section select_network_s">
      <div className="deposit_step_header">
        <StepBadge step={3} done={false} />
        <h2>Deposit Details</h2>
      </div>

      <div className="deposit_details_card">
        <button
          type="button"
          className="deposit_details_toggle"
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-controls="deposit-details-grid"
        >
          <span className="deposit_details_label">Address</span>
          <span
            className={`deposit_details_caret ${isOpen ? 'is-open' : ''}`}
            aria-hidden="true"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>

        {isOpen && hasAddress ? (
          <div id="deposit-details-grid" className="deposit_details_grid">
            <div className="deposit_qr_box_container">
              <div className="deposit_qr_box">
                <img
                  src="/images/deposit_scan.png"
                  alt="Deposit QR"
                  className="deposit_qr_img"
                />
              </div>
              <div className="deposit_qr_hint">Scan to deposit</div>
            </div>

            <div className="deposit_details_fields">
              <CopyField label="Deposit Address" value={depositAddress} />
              <CopyField label="Memo (Tag)" value={SAMPLE_MEMO} />

              <div className="deposit_details_meta">
                <div className="deposit_meta_row">
                  <span className="deposit_meta_label">Minimum Deposit:</span>
                  <span className="deposit_meta_value">1 USDT</span>
                </div>
                <div className="deposit_meta_row">
                  <span className="deposit_meta_label">Expected Arrival:</span>
                  <span className="deposit_meta_value">1 network confirmation</span>
                </div>
                <div className="deposit_meta_row">
                  <span className="deposit_meta_label">Expected Unlock:</span>
                  <span className="deposit_meta_value">1 network confirmation</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
