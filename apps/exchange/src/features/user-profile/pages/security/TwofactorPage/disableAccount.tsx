import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileContext } from "../../../../../context/ProfileProvider.js";
import "./security.css";
import "./disableAccount.css";

function maskEmailForDisplay(raw?: string): string {
  if (!raw || typeof raw !== "string") return "you***@email.com";
  const at = raw.indexOf("@");
  if (at <= 0) return "***";
  const local = raw.slice(0, at);
  const domain = raw.slice(at + 1);
  const visible = Math.min(3, local.length);
  return `${local.slice(0, visible)}***@${domain}`;
}

const IMPACT_INTRO = "Please be aware of the following impacts on your account once it is disabled:";

const IMPACT_ITEMS = [
  "Any pending withdrawal requests will be canceled.",
  "All trading features on your account will be disabled.",
  "All API keys linked to your account will be removed.",
  "Your identity verification details will be retained and not deleted.",
];

const DisableAccount = () => {
  const navigate = useNavigate();
  const { userDetails } = useContext(ProfileContext);
  const maskedEmail = useMemo(
    () => maskEmailForDisplay(userDetails?.email),
    [userDetails?.email]
  );

  const [emailVerifyOpen, setEmailVerifyOpen] = useState(false);
  const [disableAccountCode, setDisableAccountCode] = useState("");

  const goSecurity = () => navigate("/user_profile/security");

  const closeEmailModal = () => {
    setEmailVerifyOpen(false);
    setDisableAccountCode("");
  };

  const handleEmailSubmit = () => {
    if (disableAccountCode.length !== 6) return;
    closeEmailModal();
    goSecurity();
  };

  return (
    <main className="da-page" aria-labelledby="da-title">
      <nav className="da-page__crumbs" aria-label="Breadcrumb">
        <ol className="da-page__crumbList">
          <li className="da-page__crumbItem">
            <button type="button" className="da-page__crumbLink" onClick={goSecurity}>
              Security
            </button>
          </li>
          <li className="da-page__crumbSep" aria-hidden="true">
            ›
          </li>
          <li className="da-page__crumbItem da-page__crumbItem--active" aria-current="page">
            Disable Account
          </li>
        </ol>
      </nav>

      <h1 id="da-title" className="da-page__title">
          Disable Account
        </h1>

      <div className="da-inner">


        <div className="da-art" aria-hidden="true">
          <img src="/images/security/disable_vector.svg" alt="" />
        </div>

        <p className="da-intro">{IMPACT_INTRO}</p>

        <ul className="da-list">
          {IMPACT_ITEMS.map((text) => (
            <li key={text} className="da-list__item">
              <span className="da-list__hex" aria-hidden="true" />
              <span className="da-list__text">{text}</span>
            </li>
          ))}
        </ul>

        <button type="button" className="da-btnPrimary" onClick={() => setEmailVerifyOpen(true)}>
          Disable Account
        </button>
      </div>

      {emailVerifyOpen ? (
        <div className="tf-sec-page__daev-overlay" role="presentation">
          <div
            className="tf-sec-page__daev-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="da-daev-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="tf-sec-page__daev-close" aria-label="Close" onClick={closeEmailModal}>
              ×
            </button>

            <h2 id="da-daev-title" className="tf-sec-page__daev-title">
              Email Verification
            </h2>
            <p className="tf-sec-page__daev-desc">Enter the 6-digit verification code sent to {maskedEmail}</p>

            <label className="tf-sec-page__daev-label" htmlFor="da-daev-code">
              Enter Verification Code
            </label>
            <div className="tf-sec-page__daev-inputWrap">
              <input
                id="da-daev-code"
                className="tf-sec-page__daev-input"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder=""
                value={disableAccountCode}
                onChange={(e) => setDisableAccountCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              />
              <button type="button" className="tf-sec-page__daev-getCode">
                Get Code
              </button>
            </div>

            <button
              type="button"
              className="tf-sec-page__daev-submit"
              disabled={disableAccountCode.length !== 6}
              onClick={handleEmailSubmit}
            >
              Submit
            </button>

            <button type="button" className="tf-sec-page__daev-help">
              Security verification unavailable?
            </button>

            <div className="tf-sec-page__daev-footer">
              <img src="/images/protected_icon.svg" alt="shield icon" />
              <span>Protected by Balance Risk</span>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
};

export default DisableAccount;
