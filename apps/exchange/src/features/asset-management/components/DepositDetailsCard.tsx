import { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'
import { StepBadge } from './StepBadge.js'
import { CopyField } from './CopyField.js'

interface DepositDetailsCardProps {
  depositAddress: string
  memo: string | null
  minDeposit?: string
  confirmationsRequired?: number
  selectedCoin?: string
  expectedArrival?: string
  expectedUnlock?: string
}

export function DepositDetailsCard({
  depositAddress,
  memo,
  minDeposit,
  confirmationsRequired,
  selectedCoin,
  expectedArrival,
  expectedUnlock,
}: DepositDetailsCardProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const hasAddress = Boolean(depositAddress)
  const qrPayload = useMemo(() => {
    if (!depositAddress) return ''
    return memo ? `${depositAddress}?memo=${encodeURIComponent(memo)}` : depositAddress
  }, [depositAddress, memo])

  useEffect(() => {
    let cancelled = false
    if (!qrPayload) {
      setQrDataUrl(null)
      return
    }

    void QRCode.toDataURL(qrPayload, {
      width: 180,
      margin: 1,
      errorCorrectionLevel: 'M',
    })
      .then((url: string) => {
        if (!cancelled) setQrDataUrl(url)
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl(null)
      })

    return () => {
      cancelled = true
    }
  }, [qrPayload])

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
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Deposit QR"
                    className="deposit_qr_img"
                  />
                ) : (
                  <img
                    src="/images/deposit_scan.png"
                    alt="Deposit QR"
                    className="deposit_qr_img"
                  />
                )}
              </div>
              <div className="deposit_qr_hint">Scan to deposit</div>
            </div>

            <div className="deposit_details_fields">
              <CopyField label="Deposit Address" value={depositAddress} />
              {memo && <CopyField label="Memo (Tag)" value={memo} />}

              <div className="deposit_details_meta">
                <div className="deposit_meta_row">
                  <span className="deposit_meta_label">Minimum Deposit:</span>
                  <span className="deposit_meta_value">
                    {minDeposit ? `${minDeposit}${selectedCoin ? ` ${selectedCoin}` : ''}` : '—'}
                  </span>
                </div>
                <div className="deposit_meta_row">
                  <span className="deposit_meta_label">Expected Arrival:</span>
                  <span className="deposit_meta_value">
                    {expectedArrival ?? '—'}
                  </span>
                </div>
                <div className="deposit_meta_row">
                  <span className="deposit_meta_label">Expected Unlock:</span>
                  <span className="deposit_meta_value">
                    {expectedUnlock
                      ?? (typeof confirmationsRequired === 'number'
                        ? `${confirmationsRequired} network confirmation${confirmationsRequired === 1 ? '' : 's'}`
                        : '—')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
