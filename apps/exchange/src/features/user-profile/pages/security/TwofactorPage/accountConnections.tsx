import { useMemo, useState } from "react";
import { GoogleProviderIcon } from "../components/GoogleProviderIcon.js";
import { SecurityBreadcrumb } from "../components/SecurityBreadcrumb.js";
import "./accountConnections.css";

type View = "main" | "unavailable" | "addEmail";
type PendingAction = "connect-apple" | "disconnect-google" | null;

const AppleLogo = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="#101828" aria-hidden="true">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);

const AccountConnections = () => {
  const [view, setView] = useState<View>("main");
  const [googleConnected, setGoogleConnected] = useState(true);
  const [appleConnected, setAppleConnected] = useState(false);

  const [emailVerifyOpen, setEmailVerifyOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [verifyCode, setVerifyCode] = useState("");

  const [unavailEmailSelected, setUnavailEmailSelected] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetAck, setResetAck] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [newEmailCode, setNewEmailCode] = useState("");

  const isVerifySubmitEnabled = verifyCode.trim().length === 6;
  const isUnavailConfirmEnabled = unavailEmailSelected;
  const isResetConfirmEnabled = resetAck;
  const isAddSubmitEnabled = useMemo(() => {
    const e = newEmail.trim();
    return e.length > 3 && e.includes("@") && newEmailCode.trim().length > 0;
  }, [newEmail, newEmailCode]);

  const openEmailVerify = (action: Exclude<PendingAction, null>) => {
    setPendingAction(action);
    setVerifyCode("");
    setEmailVerifyOpen(true);
  };

  const closeEmailVerify = () => {
    setEmailVerifyOpen(false);
    setPendingAction(null);
    setVerifyCode("");
  };

  const handleEmailVerifySubmit = () => {
    if (!isVerifySubmitEnabled) return;
    if (pendingAction === "connect-apple") setAppleConnected(true);
    if (pendingAction === "disconnect-google") setGoogleConnected(false);
    closeEmailVerify();
  };

  const handleSecurityUnavailable = () => {
    closeEmailVerify();
    setView("unavailable");
    setUnavailEmailSelected(false);
  };

  const handleUnavailConfirm = () => {
    if (!isUnavailConfirmEnabled) return;
    setResetModalOpen(true);
    setResetAck(false);
  };

  const handleResetConfirm = () => {
    if (!isResetConfirmEnabled) return;
    setResetModalOpen(false);
    setResetAck(false);
    setView("addEmail");
    setNewEmail("");
    setNewEmailCode("");
  };

  const handleAddSubmit = () => {
    if (!isAddSubmitEnabled) return;
    setView("main");
    setGoogleConnected(true);
  };

  const crumbActive =
    view === "main"
      ? "Account Connections"
      : view === "unavailable"
        ? "Select Unavailable Methods"
        : "Add Email";

  return (
    <main className="acct-page" aria-labelledby="acct-title">
      <SecurityBreadcrumb label={crumbActive} />

      {view === "main" ? (
        <>


          <div className="acct-list">
          <h1 id="acct-title" className="acct-page__title">
            Account Connections
          </h1>
            <div className="acct-card">
              <div className="acct-card__left">
                <div className="acct-card__logo">
                  <GoogleProviderIcon size={36} />
                </div>
                <div className="acct-card__body">
                  <p className="acct-card__title">Sign in with Google</p>
                  <p className="acct-card__meta">{googleConnected ? "ji*****@gmail.com" : "Not Connected"}</p>
                </div>
              </div>
              <button
                type="button"
                className="acct-card__btn acct-card__btn--disconnect"
                disabled={!googleConnected}
                onClick={() => openEmailVerify("disconnect-google")}
              >
                Disconnect
              </button>
            </div>

            <div className="acct-card">
              <div className="acct-card__left">
                <div className="acct-card__logo">
                  <AppleLogo />
                </div>
                <div className="acct-card__body">
                  <p className="acct-card__title">Sign in with Apple</p>
                  <p className="acct-card__meta">{appleConnected ? "Connected" : "Not Connected"}</p>
                </div>
              </div>
              <button
                type="button"
                className="acct-card__btn acct-card__btn--connect"
                disabled={appleConnected}
                onClick={() => openEmailVerify("connect-apple")}
              >
                Connect
              </button>
            </div>
          </div>
        </>
      ) : view === "unavailable" ? (
        <div className="acct-unavail">
          <h1 id="acct-title" className="acct-unavail__title">
            Select Unavailable Methods
          </h1>
          <p className="acct-unavail__sub">
            Please select ALL the security methods that are unavailable and you would like to reset
          </p>

          <button
            type="button"
            className={`acct-unavail__choice ${unavailEmailSelected ? "is-selected" : ""}`}
            onClick={() => setUnavailEmailSelected(true)}
          >
            <div className="acct-unavail__choiceLeft">
              <span className="acct-unavail__choiceIcon" aria-hidden="true">
                <i className="ri-mail-line" />
              </span>
              <div>
                <div className="acct-unavail__choiceTitle">Email unavailable?</div>
                <div className="acct-unavail__choiceSub">Reset j***9@gmail.com</div>
              </div>
            </div>
            <span className="acct-unavail__radio" aria-hidden="true" />
          </button>

          <button
            type="button"
            className={`acct-unavail__confirm ${isUnavailConfirmEnabled ? "is-enabled" : ""}`}
            disabled={!isUnavailConfirmEnabled}
            onClick={handleUnavailConfirm}
          >
            Confirm
          </button>

          <button type="button" className="acct-unavail__how">
            How does this work?
          </button>
        </div>
      ) : (
        <div className="acct-add">
          <h1 id="acct-title" className="acct-add__title">
            Add Email
          </h1>
          <p className="acct-add__sub">
            Add your email address to receive important notifications and enhance your account security.
          </p>

          <div className="acct-field">
            <label className="acct-label" htmlFor="acct-new-email">
              New Email Address
            </label>
            <input
              id="acct-new-email"
              className="acct-input"
              placeholder=""
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>

          <div className="acct-field">
            <label className="acct-label" htmlFor="acct-new-code">
              Enter Verification Code
            </label>
            <div className="acct-inputWrap">
              <input
                id="acct-new-code"
                className="acct-input acct-input--code"
                placeholder=""
                value={newEmailCode}
                onChange={(e) => setNewEmailCode(e.target.value)}
              />
              <button type="button" className="acct-getCode">
                Get Code
              </button>
            </div>
          </div>

          <button
            type="button"
            className={`acct-add__submit ${isAddSubmitEnabled ? "is-enabled" : ""}`}
            disabled={!isAddSubmitEnabled}
            onClick={handleAddSubmit}
          >
            Submit
          </button>
        </div>
      )}

      {emailVerifyOpen ? (
        <div className="acct-modalOverlay" role="presentation">
          <div className="acct-emailModal" role="dialog" aria-modal="true" aria-labelledby="acct-ev-title">
            <button type="button" className="acct-emailModal__close" aria-label="Close" onClick={closeEmailVerify}>
              ×
            </button>
            <h2 id="acct-ev-title" className="acct-emailModal__title">
              Email Verification
            </h2>
            <p className="acct-emailModal__sub">
              Enter the 6-digit code Verification code sent to hal***@gmail.com
            </p>

            <label className="acct-label" htmlFor="acct-ev-code">
              Enter Verification Code
            </label>
            <div className="acct-inputWrap">
              <input
                id="acct-ev-code"
                className="acct-input acct-input--code"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric"
              />
              <button type="button" className="acct-getCode">
                Get Code
              </button>
            </div>

            <button
              type="button"
              className={`acct-emailModal__submit ${isVerifySubmitEnabled ? "is-enabled" : ""}`}
              disabled={!isVerifySubmitEnabled}
              onClick={handleEmailVerifySubmit}
            >
              Submit
            </button>

            <button type="button" className="acct-emailModal__link" onClick={handleSecurityUnavailable}>
              Security verification unavailable?
            </button>

            <div className="acct-emailModal__footer">
              <img className="acct-emailModal__footerIcon" src="/images/protected_icon.svg" alt="shield icon" />
              <span>Protected by Balance Risk</span>
            </div>
          </div>
        </div>
      ) : null}

      {resetModalOpen ? (
        <div className="acct-modalOverlay" role="presentation">
          <div className="acct-resetModal" role="dialog" aria-modal="true" aria-labelledby="acct-reset-title">
            <button
              type="button"
              className="acct-resetModal__close"
              aria-label="Close"
              onClick={() => {
                setResetModalOpen(false);
                setResetAck(false);
              }}
            >
              ×
            </button>

            <div className="acct-resetModal__art">
             <img src="/images/security/confirm _reset_vector.svg" alt="reset"/>
            </div>

            <h2 id="acct-reset-title" className="acct-resetModal__title">
              Confirm Reset of Security Methods
            </h2>
            <p className="acct-resetModal__sub">
              Resetting your security methods will remove current settings and may temporarily restrict some features.
            </p>

            <div className="acct-resetModal__box">
              <label className="acct-resetModal__row">
                <input type="checkbox" checked={resetAck} onChange={(e) => setResetAck(e.target.checked)} />
                <span className="acct-resetModal__warnText">
                  For your account&apos;s protection, certain services such as withdrawals, P2P selling, and payment features may be
                  temporarily restricted for 48-72 hours after you make this change. This security measure helps prevent
                  unauthorized access and ensures the safety of your funds during sensitive updates.
                </span>
              </label>
            </div>

            <div className="acct-resetModal__actions">
              <button
                type="button"
                className="acct-resetModal__cancel"
                onClick={() => {
                  setResetModalOpen(false);
                  setResetAck(false);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`acct-resetModal__confirm ${isResetConfirmEnabled ? "is-enabled" : ""}`}
                disabled={!isResetConfirmEnabled}
                onClick={handleResetConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
};

export default AccountConnections;
