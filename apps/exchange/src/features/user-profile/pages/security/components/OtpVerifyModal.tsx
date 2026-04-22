import { useState } from 'react'
import './security-shared.css'

interface OtpVerifyModalProps {
  onClose: () => void
  // Default is "Email Verification" since every current caller uses that
  // label; callers that need a different title pass one.
  title?: string
  description: string
  onSubmit: (code: string) => void
  isSubmitting?: boolean
  // Optional "Get Code" handler. No backend call is wired today at any
  // caller site, so omitting this leaves the button as a visual stub.
  onGetCode?: () => void
  // Optional "Security verification unavailable?" handler. Same caveat.
  onHelp?: () => void
}

export function OtpVerifyModal({
  onClose,
  title = 'Email Verification',
  description,
  onSubmit,
  isSubmitting,
  onGetCode,
  onHelp,
}: OtpVerifyModalProps) {
  const [code, setCode] = useState('')
  const canSubmit = code.length === 6 && !isSubmitting

  return (
    <div className="sec-otp-modal__overlay" role="presentation">
      <div
        className="sec-otp-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sec-otp-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="sec-otp-modal__close" aria-label="Close" onClick={onClose}>
          ×
        </button>

        <h2 id="sec-otp-title" className="sec-otp-modal__title">
          {title}
        </h2>
        <p className="sec-otp-modal__desc">{description}</p>

        <label className="sec-otp-modal__label" htmlFor="sec-otp-code">
          Enter Verification Code
        </label>
        <div className="sec-otp-modal__inputWrap">
          <input
            id="sec-otp-code"
            className="sec-otp-modal__input"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          />
          <button type="button" className="sec-otp-modal__getCode" onClick={onGetCode}>
            Get Code
          </button>
        </div>

        <button
          type="button"
          className="sec-otp-modal__submit"
          disabled={!canSubmit}
          onClick={() => onSubmit(code)}
        >
          {isSubmitting ? 'Submitting…' : 'Submit'}
        </button>

        <button type="button" className="sec-otp-modal__help" onClick={onHelp}>
          Security verification unavailable?
        </button>

        <div className="sec-otp-modal__footer">
          <img src="/images/protected_icon.svg" alt="shield icon" />
          <span>Protected by Balance Risk</span>
        </div>
      </div>
    </div>
  )
}
