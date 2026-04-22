import { useState } from "react";
import { SecurityBreadcrumb } from "../components/SecurityBreadcrumb.js";
import "./emailVerification.css";

const EmailVerification = () => {
  const [isChangeWarnOpen, setIsChangeWarnOpen] = useState(false);
  const [isVerifyEmailOpen, setIsVerifyEmailOpen] = useState(false);
  const [isChangeFormOpen, setIsChangeFormOpen] = useState(false);
  const [warnA, setWarnA] = useState(false);
  const [warnB, setWarnB] = useState(false);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

  const isOtpComplete = otp.every((d) => d !== "");

  const handleOtpChange = (idx: number, value: string) => {
    const v = String(value ?? "").replace(/\D/g, "").slice(0, 1);
    setOtp((prev) => {
      const next = [...prev];
      next[idx] = v;
      return next;
    });
  };

  const handleOtpInput = (idx: number, e: React.FormEvent<HTMLInputElement>) => {
    const v = String((e.target as HTMLInputElement)?.value ?? "").replace(/\D/g, "").slice(0, 1);
    handleOtpChange(idx, v);
    if (v && idx < 5) {
      document.getElementById(`ev-otp-${idx + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      document.getElementById(`ev-otp-${idx - 1}`)?.focus();
    }
  };

  return (
    <main className="ev-page" aria-labelledby="ev-title">
      <SecurityBreadcrumb label="Email" />

<div className="email_verification_lft">

      <h1 id="ev-title" className="ev-page__title">
        Email Verification
      </h1>
      <p className="ev-page__subtitle">
        Verifies user identity through secure email confirmation. Helps protect account access and ensures authenticity.{" "}
        <span className="ev-page__learn">Learn More &gt;</span>
      </p>

      <section className="ev-card" aria-label="Current email">
        <div className="ev-card__left">
          <span className="e" aria-hidden="true">
            <img src="/images/email_vector2.svg" alt="" />
          </span>
          <div className="ev-card__text">
            <div className="ev-card__email">j***9@gmail.com</div>
            <div className="ev-card__meta">Added: May 22, 2025</div>
          </div>
        </div>
        <button type="button" className="ev-card__edit" aria-label="Change email" onClick={() => setIsChangeWarnOpen(true)}>
        <img src="/images/security/edit_icon.svg" alt="" />
        </button>
      </section>

      </div>

      {isChangeWarnOpen ? (
        <div className="ev-modal-overlay" role="presentation">
          <div className="ev-modal" role="dialog" aria-modal="true" aria-labelledby="ev-warn-title">
            <button type="button" className="ev-modal__close" aria-label="Close" onClick={() => setIsChangeWarnOpen(false)}>
              ×
            </button>

            <div className="ev-modal__art" aria-hidden="true">
              <img src="/images/security/change_email_vector.svg" alt="" />
            </div>

            <h2 id="ev-warn-title" className="ev-modal__title">
              Change your email?
            </h2>
            <p className="ev-modal__subtitle">
              To enhance your account security, please activate at least one additional verification method.
            </p>

            <div className="ev-warnBox">
              <label className="ev-warnRow">
                <input type="checkbox" checked={warnA} onChange={(e) => setWarnA(e.target.checked)} />
                <span>
                  For enhanced security, withdrawals and P2P transactions may be temporarily restricted for up to 24 hours after
                  updating your email address.
                </span>
              </label>
              <label className="ev-warnRow">
                <input type="checkbox" checked={warnB} onChange={(e) => setWarnB(e.target.checked)} />
                <span>Your previous email can&apos;t be reused for 30 days.</span>
              </label>
            </div>

            <div className="ev-modal__actions">
              <button type="button" className="ev-btn ev-btn--ghost" onClick={() => setIsChangeWarnOpen(false)}>
                Cancel
              </button>
              <button
                type="button"
                className={`ev-btn ev-btn--primary ${warnA && warnB ? "ev-btn--enabled" : ""}`}
                disabled={!warnA || !warnB}
                onClick={() => {
                  setIsChangeWarnOpen(false);
                  setIsVerifyEmailOpen(true);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isVerifyEmailOpen ? (
        <div className="passkey-modal-overlay" role="presentation">
          <div
            className="passkey-modal passkey-verify-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="passkey-verify-title"
          >
            <button
              type="button"
              className="passkey-modal__close"
              aria-label="Close"
              onClick={() => {
                setIsVerifyEmailOpen(false);
                setOtp(["", "", "", "", "", ""]);
              }}
            >
              ×
            </button>

            <h2 id="passkey-verify-title" className="passkey-verify-modal__title">
              Verify Your Email
            </h2>
            <p className="passkey-verify-modal__subtitle">
              The verification code has been sent to your email j***9@gmail.com, valid for 10 minutes.
            </p>

            <div className="passkey-verify-modal__otpRow" aria-label="Verification code">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`ev-otp-${idx}`}
                  className="passkey-verify-modal__otp"
                  value={digit}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  autoComplete={idx === 0 ? "one-time-code" : undefined}
                  aria-label={`Digit ${idx + 1}`}
                  onInput={(e) => handleOtpInput(idx, e)}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                />
              ))}
            </div>

            <div className="passkey-verify-modal__links">
              <button type="button" className="passkey-verify-modal__link">
                Resend
              </button>
              <button type="button" className="passkey-verify-modal__link passkey-verify-modal__link--paste">
                Paste{" "}
                <span aria-hidden="true">
                  <i className="ri-file-copy-fill" />
                </span>
              </button>
            </div>

            <button
              type="button"
              className="passkey-verify-modal__confirm"
              disabled={!isOtpComplete}
              onClick={() => {
                setIsVerifyEmailOpen(false);
                setIsChangeFormOpen(true);
              }}
            >
              Confirm
            </button>

            <button type="button" className="passkey-verify-modal__unable">
              Unable to Verify?
            </button>
          </div>
        </div>
      ) : null}

      {isChangeFormOpen ? (
        <div className="ev-modal-overlay" role="presentation">
          <div className="ev-modal ev-change-modal" role="dialog" aria-modal="true" aria-labelledby="ev-change-title">
            <button type="button" className="ev-modal__close" aria-label="Close" onClick={() => setIsChangeFormOpen(false)}>
              ×
            </button>

            <h2 id="ev-change-title" className="ev-change-modal__title">
              Change Email
            </h2>
            <p className="ev-change-modal__subtitle">Enter the 6-digit code Verification code sent to ha***@gmail.com</p>

            <div className="ev-change-field">
              <label className="ev-change-label">New Email Address</label>
              <input className="ev-change-input" placeholder="" />
            </div>

            <div className="ev-change-field">

            <label className="ev-change-label">Enter Verification Code</label>
              <div className="ev-change-labelRow">
                <input className="ev-change-input" placeholder="" />
                <button type="button" className="ev-change-get">
                  Get Code
                </button>
              </div>

            </div>

            <button type="button" className="ev-change-submit">
              Submit
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
};

export default EmailVerification;
