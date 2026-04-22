import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileContext } from "../../../../../context/ProfileProvider.js";
import "./closeAccount.css";

const STEP_RETENTION = 1;
const STEP_REASON = 2;
const STEP_ASSETS = 3;

const REASON_NO_LONGER = "no_longer";
const REASON_MERGE = "merge";
const REASON_OTHERS = "others";

type Step = typeof STEP_RETENTION | typeof STEP_REASON | typeof STEP_ASSETS;
type Reason = typeof REASON_NO_LONGER | typeof REASON_MERGE | typeof REASON_OTHERS;

function maskEmailForDisplay(raw?: string): string {
  if (!raw || typeof raw !== "string") return "you***@email.com";
  const at = raw.indexOf("@");
  if (at <= 0) return "***";
  const local = raw.slice(0, at);
  const domain = raw.slice(at + 1);
  const visible = Math.min(3, local.length);
  return `${local.slice(0, visible)}***@${domain}`;
}

const CONFIRM_POINTS = [
  "If you create a new account after closing this one, your identity verification may be restricted for 30 days or longer.",
  "Please note that your transaction records will no longer be accessible once your account is closed. We recommend downloading them before proceeding with account deletion. Refer to the FAQ for download instructions.",
  "If you close your account and register a new one under a different referral relationship, you may lose eligibility for any referral rewards or rebates.",
];

const CloseAccount = () => {
  const navigate = useNavigate();
  const { userDetails } = useContext(ProfileContext);
  const maskedEmail = useMemo(
    () => maskEmailForDisplay(userDetails?.email),
    [userDetails?.email]
  );

  const [step, setStep] = useState<Step>(STEP_RETENTION);
  const [reason, setReason] = useState<Reason>(REASON_NO_LONGER);
  const [assetWaiver, setAssetWaiver] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmChecks, setConfirmChecks] = useState<boolean[]>([false, false, false]);
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailCode, setEmailCode] = useState("");

  const allConfirmChecked = confirmChecks.every(Boolean);

  const openConfirm = () => {
    if (!assetWaiver) return;
    setConfirmOpen(true);
  };

  const handleConfirmModal = () => {
    if (!allConfirmChecked) return;
    setConfirmOpen(false);
    setConfirmChecks([false, false, false]);
    setEmailOpen(true);
  };

  const closeEmailModal = () => {
    setEmailOpen(false);
    setEmailCode("");
  };

  const handleEmailSubmit = () => {
    if (emailCode.length !== 6) return;
    closeEmailModal();
    navigate("/user_profile/security");
  };

  const toggleConfirmCheck = (idx: number) => {
    setConfirmChecks((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  return (
    <main className="ca-page" aria-labelledby="ca-title">
      <nav className="ca-page__crumbs" aria-label="Breadcrumb">
        <ol className="ca-page__crumbList">
          <li className="ca-page__crumbItem">
            <button type="button" className="ca-page__crumbLink" onClick={() => navigate("/user_profile/security")}>
              Security
            </button>
          </li>
          <li className="ca-page__crumbSep" aria-hidden="true">
            ›
          </li>
          <li className="ca-page__crumbItem ca-page__crumbItem--active" aria-current="page">
            Close Account
          </li>
        </ol>
      </nav>

      <div className="security_section_bl">

      <h1 id="ca-title" className="ca-page__title">
        Close Account
      </h1>

      {step === STEP_RETENTION ? (
        <section className="ca-retention" aria-labelledby="ca-retention-heading">
          <h2 id="ca-retention-heading" className="ca-retention__sub">
            Personal Data Retention
          </h2>
          <p className="ca-retention__text">
            We inform you that the personal data you provided while using our services will be retained as long as necessary to
            fulfill the purposes outlined in our Privacy Policy, and to comply with legal obligations such as tax, accounting,
            Anti-Money Laundering regulations, or to resolve disputes and legal claims.
          </p>
          <button type="button" className="ca-btn-primary" onClick={() => setStep(STEP_REASON)}>
            Disable Account
          </button>
        </section>
      ) : null}

      {step === STEP_REASON ? (
        <section className="ca-reason" aria-labelledby="ca-reason-heading">
          <h2 id="ca-reason-heading" className="ca-reason__heading">
            Reason for Closure
          </h2>
          <div className="ca-reason__list" role="radiogroup" aria-label="Reason for closure">
            {([
              { id: REASON_NO_LONGER, label: "I no longer wish to use this account" },
              { id: REASON_MERGE, label: "Merge multiple accounts into one" },
              { id: REASON_OTHERS, label: "Others" },
            ] as const).map((opt) => (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={reason === opt.id}
                className={`ca-reason__option ${reason === opt.id ? "is-selected" : ""}`}
                onClick={() => setReason(opt.id)}
              >
                <span>{opt.label}</span>
                <span className="ca-reason__radio" aria-hidden="true" />
              </button>
            ))}
          </div>
          <button type="button" className="ca-btn-primary" onClick={() => setStep(STEP_ASSETS)}>
            Continue
          </button>
        </section>
      ) : null}

      {step === STEP_ASSETS ? (
        <section className="ca-assets" aria-labelledby="ca-assets-heading">
          <p id="ca-assets-heading" className="ca-assets__lead">
            You have the following assets:
          </p>
          <div className="ca-assets__list">
            <div className="ca-assets__row">
              <span>NFT: 0</span>
              <span className="ca-assets__radioArt" aria-hidden="true" />
            </div>
            <div className="ca-assets__row">
              <span>Assets: 0 BTC</span>
              <span className="ca-assets__radioArt" aria-hidden="true" />
            </div>
          </div>

          <label className="ca-assets__waiver">
            <input
              type="checkbox"
              checked={assetWaiver}
              onChange={(e) => setAssetWaiver(e.target.checked)}
            />
            <span>
              I agree to forfeit any remaining assets in my account and confirm that I fully waive and release all claims, and will
              not make any claims, against AGCE in connection with the closure of my account or the forfeiture of my account balance.
            </span>
          </label>

          <button type="button" className="ca-btn-primary" disabled={!assetWaiver} onClick={openConfirm}>
            Close Account
          </button>
        </section>
      ) : null}

      {confirmOpen ? (
        <div className="ca-modal-overlay" role="presentation">
          <div
            className="ca-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ca-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="ca-modal__close" aria-label="Close" onClick={() => setConfirmOpen(false)}>
              ×
            </button>
            <h2 id="ca-modal-title" className="ca-modal__title">
              Are you sure you want to close your account?
            </h2>
            <p className="ca-modal__subtitle">Please read through the information below and ensure all three checkboxes are ticked.</p>

            <div className="ca-modal__box">
              {CONFIRM_POINTS.map((text, idx) => (
                <label key={text} className="ca-modal__check">
                  <input type="checkbox" checked={confirmChecks[idx]} onChange={() => toggleConfirmCheck(idx)} />
                  <span>{text}</span>
                </label>
              ))}
            </div>

            <button type="button" className="ca-modal__confirm" disabled={!allConfirmChecked} onClick={handleConfirmModal}>
              Confirm
            </button>
          </div>
        </div>
      ) : null}

      {emailOpen ? (
        <div className="ca-evm-overlay" role="presentation">
          <div className="ca-evm" role="dialog" aria-modal="true" aria-labelledby="ca-evm-title" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="ca-evm__close" aria-label="Close" onClick={closeEmailModal}>
              ×
            </button>

            <h2 id="ca-evm-title" className="ca-evm__title">
              Email Verification
            </h2>
            <p className="ca-evm__desc">Enter the 6-digit verification code sent to {maskedEmail}</p>

            <label className="ca-evm__label" htmlFor="ca-evm-code">
              Enter Verification Code
            </label>
            <div className="ca-evm__inputWrap">
              <input
                id="ca-evm-code"
                className="ca-evm__input"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={emailCode}
                onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              />
              <button type="button" className="ca-evm__getCode">
                Get Code
              </button>
            </div>

            <button
              type="button"
              className="ca-evm__submit"
              disabled={emailCode.length !== 6}
              onClick={handleEmailSubmit}
            >
              Submit
            </button>

            <button type="button" className="ca-evm__help">
              Security verification unavailable?
            </button>

            <div className="ca-evm__footer">
              <img src="/images/protected_icon.svg" alt="shield icon" />
              <span>Protected by Balance Risk</span>
            </div>
          </div>
        </div>
      ) : null}

</div>

    </main>
  );
};

export default CloseAccount;
