import { useMemo, useState } from "react";
import type { Dispatch, SetStateAction, ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CountryCodeSelect } from "../../../../auth/CountryCodeSelect.js";
import "./changeLoginPassword.css";

const PHASE = {
  RESTRICT: "restrict",
  VERIFY_LOGIN: "verify_login",
  CHANGE: "change",
  RESET_TABS: "reset_tabs",
  VERIFY_FORGOT: "verify_forgot",
  RESET_NEW: "reset_new",
} as const;

type Phase = typeof PHASE[keyof typeof PHASE];

type OtpValue = string[];

interface PasswordRulesResult {
  ok: boolean;
  notPureNumber: boolean;
  notOnlyLetters: boolean;
  min8: boolean;
  notAccount: boolean;
}

function useOtpHandlers(otp: OtpValue, setOtp: Dispatch<SetStateAction<OtpValue>>) {
  const handleChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const digit = String(e.target.value ?? "").replace(/\D/g, "").slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[idx] = digit;
      return next;
    });
    if (digit && idx < 5) {
      window.requestAnimationFrame(() => {
        document.getElementById(`pm-otp-${idx + 1}`)?.focus();
      });
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      window.requestAnimationFrame(() => {
        document.getElementById(`pm-otp-${idx - 1}`)?.focus();
      });
    }
  };

  const isComplete = otp.every((d) => d && d.length === 1);
  return { handleChange, handleKeyDown, isComplete };
}

interface OtpModalProps {
  title: string;
  subtitle: string;
  otp: OtpValue;
  setOtp: Dispatch<SetStateAction<OtpValue>>;
  onClose: () => void;
  onConfirm: () => void;
  footerExtra?: ReactNode;
}

const OtpModal = ({ title, subtitle, otp, setOtp, onClose, onConfirm, footerExtra }: OtpModalProps) => {
  const { handleChange, handleKeyDown, isComplete } = useOtpHandlers(otp, setOtp);
  return (
    <div className="passkey-modal-overlay" role="presentation">
      <div
        className="passkey-modal passkey-verify-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pm-verify-title"
      >
        <button type="button" className="passkey-modal__close" aria-label="Close" onClick={onClose}>
          ×
        </button>
        <h2 id="pm-verify-title" className="passkey-verify-modal__title">
          {title}
        </h2>
        <p className="passkey-verify-modal__subtitle">{subtitle}</p>
        <div className="passkey-verify-modal__otpRow" aria-label="Verification code">
          {otp.map((d, idx) => (
            <input
              key={idx}
              id={`pm-otp-${idx}`}
              className="passkey-verify-modal__otp"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              autoComplete={idx === 0 ? "one-time-code" : undefined}
              aria-label={`Digit ${idx + 1}`}
              value={d}
              onChange={(e) => handleChange(idx, e)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
            />
          ))}
        </div>
        <div className="passkey-verify-modal__links">
          <button type="button" className="passkey-verify-modal__link">
            Resend
          </button>
          <button type="button" className="passkey-verify-modal__link passkey-verify-modal__link--paste">
            Paste <i className="ri-file-copy-fill" aria-hidden="true" />
          </button>
        </div>
        <button
          type="button"
          className="passkey-verify-modal__confirm"
          disabled={!isComplete}
          onClick={onConfirm}
        >
          Confirm
        </button>
        {footerExtra ? <div className="pm-verifyFooter">{footerExtra}</div> : (
          <button type="button" className="passkey-verify-modal__unable">
            Unable to Verify?
          </button>
        )}
      </div>
    </div>
  );
};

const passwordRulesOk = (pw: string): PasswordRulesResult => {
  if (!pw || pw.length < 8) return { ok: false, notPureNumber: false, notOnlyLetters: false, min8: false, notAccount: true };
  const notPureNumber = !/^\d+$/.test(pw);
  const notOnlyLetters = !/^[a-zA-Z]+$/.test(pw);
  const min8 = pw.length >= 8;
  const notAccount = !/@/.test(pw) && pw.toLowerCase().indexOf("agce") === -1;
  const ok = notPureNumber && notOnlyLetters && min8 && notAccount;
  return { ok, notPureNumber, notOnlyLetters, min8, notAccount };
};

const ChangeLoginPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isFund = searchParams.get("type") === "fund";

  const [phase, setPhase] = useState<Phase>(PHASE.RESTRICT);

  const [otpLogin, setOtpLogin] = useState<OtpValue>(["", "", "", "", "", ""]);
  const [otpForgot, setOtpForgot] = useState<OtpValue>(["", "", "", "", "", ""]);

  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const [resetTab, setResetTab] = useState<"email" | "phone">("email");
  const [resetEmail, setResetEmail] = useState("");
  const [resetPhone, setResetPhone] = useState("");
  const [resetCountryCode, setResetCountryCode] = useState("+91");

  const [newResetPwd, setNewResetPwd] = useState("");
  const [confirmResetPwd, setConfirmResetPwd] = useState("");

  const [showOldPwd, setShowOldPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [showResetNewPwd, setShowResetNewPwd] = useState(false);
  const [showResetConfirmPwd, setShowResetConfirmPwd] = useState(false);

  const newPwdTrimmed = newPwd.trim();
  const confirmPwdTrimmed = confirmPwd.trim();
  const rules = useMemo(() => passwordRulesOk(newPwdTrimmed), [newPwdTrimmed]);
  const changeConfirmEnabled =
    oldPwd.trim().length > 0 &&
    rules.ok &&
    newPwdTrimmed === confirmPwdTrimmed &&
    confirmPwdTrimmed.length > 0;

  const resetNextEnabled =
    resetTab === "email" ? resetEmail.trim().includes("@") : resetPhone.replace(/\D/g, "").length >= 8;

  const resetSubmitEnabled = useMemo(() => {
    const a = newResetPwd.trim();
    const b = confirmResetPwd.trim();
    return a.length >= 8 && b.length >= 8 && a === b;
  }, [newResetPwd, confirmResetPwd]);

  const goSecurity = () => navigate("/user_profile/security");

  const renderBreadcrumb = (activeLabel: string) => (
    <nav className="pm-page__crumbs" aria-label="Breadcrumb">
      <ol className="pm-page__crumbList">
        <li className="pm-page__crumbItem">
          <button type="button" className="pm-page__crumbLink" onClick={goSecurity}>
            Security
          </button>
        </li>
        <li className="pm-page__crumbSep" aria-hidden="true">
          ›
        </li>
        <li className="pm-page__crumbItem pm-page__crumbItem--active" aria-current="page">
          {activeLabel}
        </li>
      </ol>
    </nav>
  );

  return (
    <>
      {phase === PHASE.RESTRICT ? (
        <div className="pm-restrictOverlay" role="presentation">
          <div className="pm-restrictModal" role="dialog" aria-modal="true" aria-labelledby="pm-restrict-title">
            <button type="button" className="pm-restrictModal__close" aria-label="Close" onClick={goSecurity}>
              ×
            </button>
            <div className="pm-restrictModal__art">
              <img src="/images/security/account_restrictions.svg" alt="" />
            </div>
            <h2 id="pm-restrict-title" className="pm-restrictModal__title">
              Account Restrictions
            </h2>
            <p className="pm-restrictModal__text">
              For the security of your account, withdrawals and P2P selling will be temporarily locked for 24 hours after a
              password change.
            </p>
            <div className="pm-restrictModal__actions">
              <button type="button" className="pm-restrictModal__cancel" onClick={goSecurity}>
                Cancel
              </button>
              <button type="button" className="pm-restrictModal__confirm" onClick={() => setPhase(PHASE.VERIFY_LOGIN)}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {phase === PHASE.VERIFY_LOGIN ? (
        <OtpModal
          title="Verify Your Email"
          subtitle="The verification code has been sent to your email j***9@gmail.com, valid for 10 minutes."
          otp={otpLogin}
          setOtp={setOtpLogin}
          onClose={goSecurity}
          onConfirm={() => setPhase(PHASE.CHANGE)}
        />
      ) : null}

      {phase === PHASE.VERIFY_FORGOT ? (
        <OtpModal
          title="Verify Your Email"
          subtitle="The verification code has been sent to your email j***9@gmail.com, valid for 10 minutes."
          otp={otpForgot}
          setOtp={setOtpForgot}
          onClose={() => setPhase(PHASE.RESET_TABS)}
          onConfirm={() => setPhase(PHASE.RESET_NEW)}
          footerExtra={
            <button type="button" className="passkey-verify-modal__unable">
              Didn&apos;t receive the code?
            </button>
          }
        />
      ) : null}

      {phase === PHASE.CHANGE ? (
        <main className="pm-page" aria-labelledby="pm-change-title">
          {renderBreadcrumb(isFund ? "Fund Password" : "Change Login Password")}


          <div className="pm-form">
          <h1 id="pm-change-title" className="pm-page__title pm-page__title--left">
            {isFund ? "Fund Password" : "Change Login Password"}
          </h1>
            <div className="pm-field">
              <label className="pm-label" htmlFor="pm-old">
                Old Password
              </label>
              <div className="pm-inputWrap">
                <input
                  id="pm-old"
                  type={showOldPwd ? "text" : "password"}
                  className="pm-input pm-input--withToggle"
                  placeholder="Enter your Old Password"
                  value={oldPwd}
                  onChange={(e) => setOldPwd(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="pm-togglePw"
                  aria-label={showOldPwd ? "Hide password" : "Show password"}
                  onClick={() => setShowOldPwd((v) => !v)}
                >
                  <i className={showOldPwd ? "ri-eye-line" : "ri-eye-off-line"} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="pm-field">
              <label className="pm-label" htmlFor="pm-new">
                New Password
              </label>
              <div className="pm-inputWrap">
                <input
                  id="pm-new"
                  type={showNewPwd ? "text" : "password"}
                  className="pm-input pm-input--withToggle"
                  placeholder="Enter your New Password"
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="pm-togglePw"
                  aria-label={showNewPwd ? "Hide password" : "Show password"}
                  onClick={() => setShowNewPwd((v) => !v)}
                >
                  <i className={showNewPwd ? "ri-eye-line" : "ri-eye-off-line"} aria-hidden="true" />
                </button>
              </div>
              <ul className="pm-rules" aria-label="Password requirements">
                <li className="pm-rule">
                  <span className={`pm-ruleIcon ${rules.notPureNumber ? "is-ok" : ""}`}>
                   <img src="/images/security/check.svg" alt="not pure number" />
                  </span>
                  Cannot be a pure number
                </li>
                <li className="pm-rule">
                  <span className={`pm-ruleIcon ${rules.notOnlyLetters ? "is-ok" : ""}`}>
                  <img src="/images/security/check.svg" alt="not pure number" />
                  </span>
                  Don&apos;t allow only letters (case sensitive)
                </li>
                <li className="pm-rule">
                  <span className={`pm-ruleIcon ${rules.min8 ? "is-ok" : ""}`}>
                  <img src="/images/security/check.svg" alt="not pure number" />
                  </span>
                  Minimum 8 characters
                </li>
                <li className="pm-rule">
                  <span className={`pm-ruleIcon ${rules.notAccount ? "is-ok" : ""}`}>
                  <img src="/images/security/check.svg" alt="not pure number" />
                  </span>
                  Cannot contain accounts
                </li>
              </ul>
            </div>

            <div className="pm-field">
              <label className="pm-label" htmlFor="pm-confirm">
                Confirm Password
              </label>
              <div className="pm-inputWrap">
                <input
                  id="pm-confirm"
                  type={showConfirmPwd ? "text" : "password"}
                  className="pm-input pm-input--withToggle"
                  placeholder="Re-Enter your New Password"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="pm-togglePw"
                  aria-label={showConfirmPwd ? "Hide password" : "Show password"}
                  onClick={() => setShowConfirmPwd((v) => !v)}
                >
                  <i className={showConfirmPwd ? "ri-eye-line" : "ri-eye-off-line"} aria-hidden="true" />
                </button>
              </div>
            </div>

            <button
              type="button"
              className={`pm-confirmBtn ${changeConfirmEnabled ? "is-enabled" : ""}`}
              disabled={!changeConfirmEnabled}
              onClick={goSecurity}
            >
              Confirm
            </button>

            <button type="button" className="pm-forgot" onClick={() => setPhase(PHASE.RESET_TABS)}>
              Forgot password?
            </button>
          </div>
        </main>
      ) : null}

      {phase === PHASE.RESET_TABS ? (
        <main className="pm-page" aria-labelledby="pm-reset-title">
          {renderBreadcrumb("Reset Password")}
          <div className="pm-reset">
            <h1 id="pm-reset-title" className="pm-reset__title">
              Reset Your Password
            </h1>

            <div className="pm-tabs">
              <button
                type="button"
                className={`pm-tab ${resetTab === "email" ? "is-active" : ""}`}
                onClick={() => setResetTab("email")}
              >
                Email
              </button>
              <button
                type="button"
                className={`pm-tab ${resetTab === "phone" ? "is-active" : ""}`}
                onClick={() => setResetTab("phone")}
              >
                Phone
              </button>
            </div>

            {resetTab === "email" ? (
              <div className="pm-field">
                <input
                  className="pm-input"
                  placeholder="Enter email address"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            ) : (
              <div className="pm-phoneWrap">
                <CountryCodeSelect
                  id="pm-reset-country-code"
                  value={resetCountryCode}
                  onChange={(dial) => setResetCountryCode(dial)}
                />
                <input
                  className="pm-input"
                  type="tel"
                  placeholder="Enter phone number"
                  value={resetPhone}
                  onChange={(e) => setResetPhone(e.target.value.replace(/\D/g, "").slice(0, 15))}
                  autoComplete="tel"
                />
              </div>
            )}

            <button
              type="button"
              className="pm-nextBtn"
              disabled={!resetNextEnabled}
              onClick={() => {
                setOtpForgot(["", "", "", "", "", ""]);
                setPhase(PHASE.VERIFY_FORGOT);
              }}
            >
              Next
            </button>
          </div>
        </main>
      ) : null}

      {phase === PHASE.RESET_NEW ? (
        <main className="pm-page" aria-labelledby="pm-resetnew-title">
          {renderBreadcrumb("Reset Password")}
          <div className="pm-resetNew">
            <h1 id="pm-resetnew-title" className="pm-resetNew__title">
              Reset Your Password
            </h1>

            <div className="pm-field">
              <label className="pm-label" htmlFor="pm-newp">
                New Password
              </label>
              <div className="pm-inputWrap">
                <input
                  id="pm-newp"
                  type={showResetNewPwd ? "text" : "password"}
                  className="pm-input pm-input--withToggle"
                  placeholder="Enter New Password"
                  value={newResetPwd}
                  onChange={(e) => setNewResetPwd(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="pm-togglePw"
                  aria-label={showResetNewPwd ? "Hide password" : "Show password"}
                  onClick={() => setShowResetNewPwd((v) => !v)}
                >
                  <i className={showResetNewPwd ? "ri-eye-line" : "ri-eye-off-line"} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="pm-field">
              <label className="pm-label" htmlFor="pm-newp2">
                Enter Password Again
              </label>
              <div className="pm-inputWrap">
                <input
                  id="pm-newp2"
                  type={showResetConfirmPwd ? "text" : "password"}
                  className="pm-input pm-input--withToggle"
                  placeholder="Confirm Password"
                  value={confirmResetPwd}
                  onChange={(e) => setConfirmResetPwd(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="pm-togglePw"
                  aria-label={showResetConfirmPwd ? "Hide password" : "Show password"}
                  onClick={() => setShowResetConfirmPwd((v) => !v)}
                >
                  <i className={showResetConfirmPwd ? "ri-eye-line" : "ri-eye-off-line"} aria-hidden="true" />
                </button>
              </div>
            </div>

            <button
              type="button"
              className={`pm-resetBtn ${resetSubmitEnabled ? "is-enabled" : ""}`}
              disabled={!resetSubmitEnabled}
              onClick={goSecurity}
            >
              Reset
            </button>
          </div>
        </main>
      ) : null}
    </>
  );
};

export default ChangeLoginPassword;
