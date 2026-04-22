import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./security.css";

interface UserDetails {
  emailId?: string;
  email?: string;
}

interface TwofactorPageProps {
  userDetails?: UserDetails;
}

interface Login2StepState {
  googleAuthenticator: boolean;
  smsVerification: boolean;
  emailVerification: boolean;
  authenticator: boolean;
}

interface WithdrawSettingsState {
  smsVerification: boolean;
  fundPassword: boolean;
  emailVerification: boolean;
  trustedAddresses: boolean;
}

type WithdrawAddressMode = "addressBook" | "verificationFree";

function maskEmailForDisplay(raw?: string): string {
  if (!raw || typeof raw !== "string") return "you***@email.com";
  const at = raw.indexOf("@");
  if (at <= 0) return "***";
  const local = raw.slice(0, at);
  const domain = raw.slice(at + 1);
  const visible = Math.min(3, local.length);
  return `${local.slice(0, visible)}***@${domain}`;
}

const TwofactorPage = ({ userDetails = {} }: TwofactorPageProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const go = (path: string) => navigate(path);

  const maskedEmail = useMemo(
    () => maskEmailForDisplay(userDetails?.emailId || userDetails?.email),
    [userDetails?.emailId, userDetails?.email]
  );
  const [isLogin2StepOpen, setIsLogin2StepOpen] = useState(false);
  const [login2Step, setLogin2Step] = useState<Login2StepState>({
    googleAuthenticator: false,
    smsVerification: false,
    emailVerification: true,
    authenticator: false,
  });
  const [isWithdrawSettingsOpen, setIsWithdrawSettingsOpen] = useState(false);
  const [withdrawSettings, setWithdrawSettings] = useState<WithdrawSettingsState>({
    smsVerification: false,
    fundPassword: false,
    emailVerification: true,
    trustedAddresses: false,
  });
  const [withdrawAddressMode, setWithdrawAddressMode] = useState<WithdrawAddressMode>("addressBook");

  useEffect(() => {
    const state = location.state as { openLogin2Step?: boolean } | null;
    if (!state?.openLogin2Step) return;
    setIsLogin2StepOpen(true);
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.state, location.pathname, navigate]);

  return (
    <>
      <div className="dashboard_right">
        <div className="tf-sec-page">
        <div className="tf-sec-page__hero">
          <div className="tf-sec-page__hero-content">
            <h1 className="tf-sec-page__hero-title">Security Settings</h1>
            <p className="tf-sec-page__hero-description">
              Take full control of your account security with advanced verification options like passkeys, email OTP, and mobile
              authentication for a safer experience.
            </p>
          </div>
          <div className="tf-sec-page__hero-media">
            <img src="/images/security/417923014-aaa37ef0-270c-49ed-99d0-02b7e5924263-1.svg" alt="" />
          </div>
        </div>

        <section className="tf-sec-page__card">
          <div className="tf-sec-page__card-header">
            <h2 className="tf-sec-page__card-title">Two-Factor Authentication (2FA)</h2>
            <p className="tf-sec-page__card-subtitle">
              Choose Passkeys, Verification Code, or Trading Password to ensure the safety of your assets
            </p>
          </div>
          <div className="tf-sec-page__card-body">
            <div className="tf-sec-page__row">
              <div className="tf-sec-page__row-main">
                <div className="tf-sec-page__row-icon-wrap">
                  <img className="tf-sec-page__row-icon" src="/images/security/Container4.svg" alt="" />
                </div>
                <div className="tf-sec-page__row-body">
                  <div className="tf-sec-page__row-heading-line">
                    <span className="tf-sec-page__row-heading">Passkeys</span>
                    <span className="tf-sec-page__badge">Recommended</span>
                  </div>
                  <p className="tf-sec-page__row-description">
                    Enables secure, passwordless authentication using device-based credentials. Provides faster logins and stronger
                    protection against phishing and unauthorized access.
                  </p>
                </div>
              </div>
              <div className="tf-sec-page__row-meta">
                <div className="tf-sec-page__status">
                <div className="tf_checkfill"><i className="ri-check-fill"></i></div>
                  <span>Off</span>
                </div>
              </div>
              <div className="tf-sec-page__row-actions">
                <button type="button" className="tf-sec-page__btn" onClick={() => go("/user_profile/security/passkey")}>
                  Turn on
                </button>
              </div>
            </div>

            <div className="tf-sec-page__row">
              <div className="tf-sec-page__row-main">
                <div className="tf-sec-page__row-icon-wrap">
                  <img className="tf-sec-page__row-icon" src="/images/security/Container8.svg" alt="" />
                </div>
                <div className="tf-sec-page__row-body">
                  <div className="tf-sec-page__row-heading-line">
                    <span className="tf-sec-page__row-heading">Google Authenticator</span>
                  </div>
                  <p className="tf-sec-page__row-description">
                    Generates time-based one-time codes for secure login verification. Adds an extra layer of protection beyond
                    passwords to prevent unauthorized access.
                  </p>
                </div>
              </div>
              <div className="tf-sec-page__row-meta">
                <div className="tf-sec-page__status">
                <div className="tf_checkfill"><i className="ri-check-fill"></i></div>
                  <span>Off</span>
                </div>
              </div>
              <div className="tf-sec-page__row-actions">
                <button type="button" className="tf-sec-page__btn" onClick={() => setIsLogin2StepOpen(true)}>
                  Turn on
                </button>
              </div>
            </div>

            <div className="tf-sec-page__row">
              <div className="tf-sec-page__row-main">
                <div className="tf-sec-page__row-icon-wrap">
                  <img className="tf-sec-page__row-icon" src="/images/security/Container6.svg" alt="" />
                </div>
                <div className="tf-sec-page__row-body">
                  <div className="tf-sec-page__row-heading-line">
                    <span className="tf-sec-page__row-heading">Phone Verification</span>
                  </div>
                  <p className="tf-sec-page__row-description">
                    Securely verifies user identity using SMS-based OTP. Ensures safe logins and protects sensitive actions with an
                    added layer of security.
                  </p>
                </div>
              </div>
              <div className="tf-sec-page__row-meta">
                <div className="tf-sec-page__status">
                <div className="tf_checkfill"><i className="ri-check-fill"></i></div>
                  <span>Off</span>
                </div>
              </div>
              <div className="tf-sec-page__row-actions">
                <button type="button" className="tf-sec-page__btn" onClick={() => go("/user_profile/security/smsVerification")}>
                  Turn on
                </button>
              </div>
            </div>

            <div className="tf-sec-page__row">
              <div className="tf-sec-page__row-main">
                <div className="tf-sec-page__row-icon-wrap">
                  <img className="tf-sec-page__row-icon" src="/images/security/Container9.svg" alt="" />
                </div>
                <div className="tf-sec-page__row-body">
                  <div className="tf-sec-page__row-heading-line">
                    <span className="tf-sec-page__row-heading">Email Verification</span>
                  </div>
                  <p className="tf-sec-page__row-description">
                    Securely verifies user identity via email confirmation, adding an extra layer of protection.
                  </p>
                </div>
              </div>
              <div className="tf-sec-page__row-meta">
                <span className="tf-sec-page__status-email">{maskedEmail}</span>
              </div>
              <div className="tf-sec-page__row-actions">
                <button type="button" className="tf-sec-page__btn" onClick={() => go("/user_profile/security/emailVerification")}>
                  Change
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="tf-sec-page__card">
          <div className="tf-sec-page__card-header">
            <h2 className="tf-sec-page__card-title">Advanced Security</h2>
          </div>
          <div className="tf-sec-page__card-body">
            <div className="tf-sec-page__row">
              <div className="tf-sec-page__row-main">
                <div className="tf-sec-page__row-icon-wrap">
                  <img className="tf-sec-page__row-icon" src="/images/security/Container14.svg" alt="" />
                </div>
                <div className="tf-sec-page__row-body">
                  <div className="tf-sec-page__row-heading-line">
                    <span className="tf-sec-page__row-heading">Login 2-Step Verification</span>
                  </div>
                  <p className="tf-sec-page__row-description">
                    Adds a second verification step for secure login. Protects accounts even if the password is compromised.
                  </p>
                </div>
              </div>
              <div className="tf-sec-page__row-meta">
                <div className="tf-sec-page__status">
                  <div className="email_verify">
                    <img src="/images/emailicon2.svg" alt="" />
                  </div>
                <div className="tf_checkfill"><i className="ri-check-fill"></i></div>
                  <span>Off</span>
                </div>
              </div>
              <div className="tf-sec-page__row-actions">
                <button type="button" className="tf-sec-page__btn" onClick={() => setIsLogin2StepOpen(true)}>
                  Turn on
                </button>
              </div>
            </div>

            <div className="tf-sec-page__row">
              <div className="tf-sec-page__row-main">
                <div className="tf-sec-page__row-icon-wrap">
                  <img className="tf-sec-page__row-icon" src="/images/security/Container13.svg" alt="" />
                </div>
                <div className="tf-sec-page__row-body">
                  <div className="tf-sec-page__row-heading-line">
                    <span className="tf-sec-page__row-heading">Anti-Phishing Code</span>
                  </div>
                  <p className="tf-sec-page__row-description">
                    Adds a personal code to verify authentic messages. Helps users identify and avoid phishing attempts.
                  </p>
                </div>
              </div>
              <div className="tf-sec-page__row-meta">
                <div className="tf-sec-page__status">
                <div className="tf_checkfill"><i className="ri-check-fill"></i></div>
                  <span>Off</span>
                </div>
              </div>
              <div className="tf-sec-page__row-actions">
                <button type="button" className="tf-sec-page__btn" onClick={() => go("/user_profile/security/antiPhishing")}>
                  Turn on
                </button>
              </div>
            </div>

            <div className="tf-sec-page__row">
              <div className="tf-sec-page__row-main">

                <div className="tf-sec-page__row-icon-wrap">
                  <img className="tf-sec-page__row-icon" src="/images/security/Container3.svg" alt="" />
                </div>
                <div className="tf-sec-page__row-body">
                  <div className="tf-sec-page__row-heading-line">
                    <span className="tf-sec-page__row-heading">Withdrawal Settings</span>
                  </div>
                  <p className="tf-sec-page__row-description">
                    Manages withdrawal options and security controls. Ensures safe and authorized fund transfers.
                  </p>
                </div>
              </div>
              <div className="tf-sec-page__row-meta">

                <div className="tf-sec-page__status">
                <div className="email_verify">
                    <img src="/images/emailicon2.svg" alt="" />
                  </div>
                <div className="tf_checkfill"><i className="ri-check-fill"></i></div>
                  <span>Off</span>
                </div>
              </div>
              <div className="tf-sec-page__row-actions">
                <button type="button" className="tf-sec-page__btn" onClick={() => setIsWithdrawSettingsOpen(true)}>
                  Change
                </button>
              </div>
            </div>

            <div className="tf-sec-page__row">
              <div className="tf-sec-page__row-main">
                <div className="tf-sec-page__row-icon-wrap">
                  <img className="tf-sec-page__row-icon" src="/images/security/Container10.svg" alt="" />
                </div>
                <div className="tf-sec-page__row-body">
                  <div className="tf-sec-page__row-heading-line">
                    <span className="tf-sec-page__row-heading">Emergency Contact</span>
                  </div>
                  <p className="tf-sec-page__row-description">Adds a trusted contact for account recovery. Helps in case of emergencies.</p>
                </div>
              </div>
              <div className="tf-sec-page__row-meta">
                <div className="tf-sec-page__status">
                <div className="tf_checkfill"><i className="ri-check-fill"></i></div>
                  <span>Off</span>
                </div>
              </div>
              <div className="tf-sec-page__row-actions">
                <button type="button" className="tf-sec-page__btn" onClick={() => go("/user_profile/security/emergencyContact")}>
                  Turn on
                </button>
              </div>
            </div>

            <div className="tf-sec-page__row">
              <div className="tf-sec-page__row-main">
                <div className="tf-sec-page__row-icon-wrap">
                  <img className="tf-sec-page__row-icon" src="/images/security/Container5.svg" alt="" />
                </div>
                <div className="tf-sec-page__row-body">
                  <div className="tf-sec-page__row-heading-line">
                    <span className="tf-sec-page__row-heading">Account Connections</span>
                  </div>
                  <p className="tf-sec-page__row-description">
                    Manages linked accounts and services. Helps control access and maintain security.
                  </p>
                </div>
              </div>
              <div className="tf-sec-page__row-meta">
                <div className="tf-sec-page__status">
                <div className="tf_checkfill"><i className="ri-check-fill"></i></div>
                  <span>Off</span>
                </div>
              </div>
              <div className="tf-sec-page__row-actions">
                <button type="button" className="tf-sec-page__btn" onClick={() => go("/user_profile/security/accountConnections")}>
                  Turn on
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="tf-sec-page__card">
          <div className="tf-sec-page__card-header">
            <h2 className="tf-sec-page__card-title">Password Management</h2>
          </div>
          <div className="tf-sec-page__card-body">
            <div className="tf-sec-page__row">
              <div className="tf-sec-page__row-main">
                <div className="tf-sec-page__row-icon-wrap">
                  <img className="tf-sec-page__row-icon" src="/images/security/Container1.svg" alt="" />
                </div>
                <div className="tf-sec-page__row-body">
                  <div className="tf-sec-page__row-heading-line">
                    <span className="tf-sec-page__row-heading">Password</span>
                  </div>
                  <p className="tf-sec-page__row-description">
                    Protects account access with secure authentication. Helps prevent unauthorized logins.
                  </p>
                </div>
              </div>
              <div className="tf-sec-page__row-meta">
                <div className="tf-sec-page__status">
                <div className="tf_checkfill"><i className="ri-check-fill"></i></div>
                  <span>Off</span>
                </div>
              </div>
              <div className="tf-sec-page__row-actions">
                <button type="button" className="tf-sec-page__btn" onClick={() => go("/user_profile/security/changeLoginPassword")}>
                  Change
                </button>
              </div>
            </div>

            <div className="tf-sec-page__row">
              <div className="tf-sec-page__row-main">
                <div className="tf-sec-page__row-icon-wrap">
                  <img className="tf-sec-page__row-icon" src="/images/security/Container11.svg" alt="" />
                </div>
                <div className="tf-sec-page__row-body">
                  <div className="tf-sec-page__row-heading-line">
                    <span className="tf-sec-page__row-heading">Fund Password</span>
                  </div>
                  <p className="tf-sec-page__row-description">
                    Adds an extra password layer for transactions and withdrawals. Ensures stronger protection for funds against
                    unauthorized actions.
                  </p>
                </div>
              </div>
              <div className="tf-sec-page__row-meta">
                <div className="tf-sec-page__status">
                <div className="tf_checkfill"><i className="ri-check-fill"></i></div>
                  <span>Off</span>
                </div>
              </div>
              <div className="tf-sec-page__row-actions">
                <button
                  type="button"
                  className="tf-sec-page__btn"
                  onClick={() => go("/user_profile/security/setFundPassword")}
                >
                  Setup
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="tf-sec-page__card">
          <div className="tf-sec-page__card-header">
            <h2 className="tf-sec-page__card-title">Devices & activity</h2>
          </div>
          <div className="tf-sec-page__card-body">
            <div className="tf-sec-page__row">
              <div className="tf-sec-page__row-main">
                <div className="tf-sec-page__row-icon-wrap">
                  <img className="tf-sec-page__row-icon" src="/images/security/Container12.svg" alt="" />
                </div>
                <div className="tf-sec-page__row-body">
                  <div className="tf-sec-page__row-heading-line">
                    <span className="tf-sec-page__row-heading">Authorized Devices</span>
                  </div>
                  <p className="tf-sec-page__row-description">
                    Manages and recognizes trusted devices for secure account access. Helps prevent unauthorized logins by allowing
                    access only from approved devices.
                  </p>
                </div>
              </div>
              <div className="tf-sec-page__row-meta">
                <div className="tf-sec-page__status">
                <div className="tf_checkfill"><i className="ri-check-fill"></i></div>
                  <span>Off</span>
                </div>
              </div>
              <div className="tf-sec-page__row-actions">
                <button type="button" className="tf-sec-page__btn" onClick={() => go("/user_profile/security/authorizedDevices")}>
                  Change
                </button>
              </div>
            </div>

            <div className="tf-sec-page__row">
              <div className="tf-sec-page__row-main">
                <div className="tf-sec-page__row-icon-wrap">
                  <img className="tf-sec-page__row-icon" src="/images/security/Container.svg" alt="" />
                </div>
                <div className="tf-sec-page__row-body">
                  <div className="tf-sec-page__row-heading-line">
                    <span className="tf-sec-page__row-heading">Security Logs</span>
                  </div>
                  <p className="tf-sec-page__row-description">
                    Tracks and records account activity, including logins and security actions. Helps monitor suspicious behavior and
                    maintain account safety.
                  </p>
                </div>
              </div>
              <div className="tf-sec-page__row-meta">
                <div className="tf-sec-page__status">
                <div className="tf_checkfill"><i className="ri-check-fill"></i></div>
                  <span>Off</span>
                </div>
              </div>
              <div className="tf-sec-page__row-actions">
                <button type="button" className="tf-sec-page__btn" onClick={() => go("/user_profile/security/securityLogs")}>
                  Setup
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="tf-sec-page__card">
          <div className="tf-sec-page__card-header">
            <h2 className="tf-sec-page__card-title">Account Management</h2>
          </div>
          <div className="tf-sec-page__card-body">
            <div className="tf-sec-page__row">
              <div className="tf-sec-page__row-main">
                <div className="tf-sec-page__row-icon-wrap">
                  <img className="tf-sec-page__row-icon" src="/images/security/Container15.svg" alt="" />
                </div>
                <div className="tf-sec-page__row-body">
                  <div className="tf-sec-page__row-heading-line">
                    <span className="tf-sec-page__row-heading">Disable Account</span>
                  </div>
                  <p className="tf-sec-page__row-description">
                    Allows users to temporarily deactivate their account for added security. Prevents access and protects data until
                    the account is re-enabled.
                  </p>
                </div>
              </div>
              <div className="tf-sec-page__row-meta">
                <div className="tf-sec-page__status">
                <div className="tf_checkfill"><i className="ri-check-fill"></i></div>
                  <span>Off</span>
                </div>
              </div>
              <div className="tf-sec-page__row-actions">
                <button type="button" className="tf-sec-page__btn" onClick={() => go("/user_profile/security/disableAccount")}>
                  Disable
                </button>
              </div>
            </div>

            <div className="tf-sec-page__row">
              <div className="tf-sec-page__row-main">
                <div className="tf-sec-page__row-icon-wrap">
                  <img className="tf-sec-page__row-icon" src="/images/security/Container.svg" alt="" />
                </div>
                <div className="tf-sec-page__row-body">
                  <div className="tf-sec-page__row-heading-line">
                    <span className="tf-sec-page__row-heading">Close Account</span>
                  </div>
                  <p className="tf-sec-page__row-description">
                    Permanently deletes the user account and associated data. Ensures complete removal of access and disables all
                    related services.
                  </p>
                </div>
              </div>
              <div className="tf-sec-page__row-meta">
                <div className="tf-sec-page__status">
                <div className="tf_checkfill"><i className="ri-check-fill"></i></div>
                  <span>Off</span>
                </div>
              </div>
              <div className="tf-sec-page__row-actions">
                <button type="button" className="tf-sec-page__btn" onClick={() => go("/user_profile/security/closeAccount")}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="tf-sec-page__card">
          <div className="tf-sec-page__card-header">
            <h2 className="tf-sec-page__card-title">Other Settings</h2>
          </div>
          <div className="tf-sec-page__card-body">
            <div className="tf-sec-page__row">
              <div className="tf-sec-page__row-main">
                <div className="tf-sec-page__row-icon-wrap">
                  <img className="tf-sec-page__row-icon" src="/images/security/Container2.svg" alt="" />
                </div>
                <div className="tf-sec-page__row-body">
                  <div className="tf-sec-page__row-heading-line">
                    <span className="tf-sec-page__row-heading">Third Party Account Access Management</span>
                  </div>
                  <p className="tf-sec-page__row-description">
                    Controls and manages access granted to external apps and services. Helps protect account data by allowing users to
                    review and revoke permissions anytime.
                  </p>
                </div>
              </div>
              <div className="tf-sec-page__row-meta">
                <span className="tf-sec-page__google-badge">
                  <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
                    <path
                      fill="#FFC107"
                      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                    />
                    <path
                      fill="#FF3D00"
                      d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
                    />
                    <path
                      fill="#4CAF50"
                      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                    />
                    <path
                      fill="#1976D2"
                      d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                    />
                  </svg>
                </span>
              </div>
              <div className="tf-sec-page__row-actions">
                <button type="button" className="tf-sec-page__btn" onClick={() => go("/user_profile/security/thirdPartyAccess")}>
                  Change
                </button>
              </div>
            </div>
          </div>
        </section>

        {isLogin2StepOpen ? (
          <div className="tf-sec-page__l2sv-overlay" role="presentation">
            <div className="tf-sec-page__l2sv-modal" role="dialog" aria-modal="true" aria-labelledby="tf-l2sv-title">
              <button
                type="button"
                className="tf-sec-page__l2sv-close"
                aria-label="Close"
                onClick={() => setIsLogin2StepOpen(false)}
              >
                ×
              </button>

              <h2 id="tf-l2sv-title" className="tf-sec-page__l2sv-title">
                Login 2-Step Verification
              </h2>
              <p className="tf-sec-page__l2sv-subtitle">
                Once enabled, these methods will be used to verify your identity when you log in.
              </p>

              <div className="tf-sec-page__l2sv-list" role="list">
                <div className="tf-sec-page__l2sv-item" role="listitem">
                  <div className="tf-sec-page__l2sv-left">
                    <span className="tf-sec-page__l2sv-icon" aria-hidden="true">
                      <img src="/images/security/verification_icon.svg" alt="" />
                    </span>
                    <span className="tf-sec-page__l2sv-text">Google Authenticator</span>
                  </div>
                  <button
                    type="button"
                    className={`tf-sec-page__l2sv-switch ${login2Step.googleAuthenticator ? "is-on" : ""}`}
                    role="switch"
                    aria-checked={login2Step.googleAuthenticator}
                    onClick={() => setLogin2Step((s) => ({ ...s, googleAuthenticator: !s.googleAuthenticator }))}
                  >
                    <span className="tf-sec-page__l2sv-knob" aria-hidden="true" />
                  </button>
                </div>

                <div className="tf-sec-page__l2sv-item" role="listitem">
                  <div className="tf-sec-page__l2sv-left">
                    <span className="tf-sec-page__l2sv-icon" aria-hidden="true">
                    <img src="/images/security/verification_icontwo.svg" alt="" />
                    </span>
                    <span className="tf-sec-page__l2sv-text">SMS verification</span>
                  </div>
                  <button
                    type="button"
                    className={`tf-sec-page__l2sv-switch ${login2Step.smsVerification ? "is-on" : ""}`}
                    role="switch"
                    aria-checked={login2Step.smsVerification}
                    onClick={() => setLogin2Step((s) => ({ ...s, smsVerification: !s.smsVerification }))}
                  >
                    <span className="tf-sec-page__l2sv-knob" aria-hidden="true" />
                  </button>
                </div>

                <div className="tf-sec-page__l2sv-item" role="listitem">
                  <div className="tf-sec-page__l2sv-left">
                    <span className="tf-sec-page__l2sv-icon" aria-hidden="true">
                    <img src="/images/security/verification_icon3.svg" alt="" />
                    </span>
                    <span className="tf-sec-page__l2sv-text">Email verification</span>
                  </div>
                  <button
                    type="button"
                    className={`tf-sec-page__l2sv-switch ${login2Step.emailVerification ? "is-on" : ""}`}
                    role="switch"
                    aria-checked={login2Step.emailVerification}
                    onClick={() => setLogin2Step((s) => ({ ...s, emailVerification: !s.emailVerification }))}
                  >
                    <span className="tf-sec-page__l2sv-knob" aria-hidden="true" />
                  </button>
                </div>

                <div className="tf-sec-page__l2sv-item" role="listitem">
                  <div className="tf-sec-page__l2sv-left">
                    <span className="tf-sec-page__l2sv-icon" aria-hidden="true">
                    <img src="/images/security/verification_icon4.svg" alt="" />
                    </span>
                    <span className="tf-sec-page__l2sv-text">Authenticator</span>
                  </div>
                  <button
                    type="button"
                    className={`tf-sec-page__l2sv-switch ${login2Step.authenticator ? "is-on" : ""}`}
                    role="switch"
                    aria-checked={login2Step.authenticator}
                    onClick={() => setLogin2Step((s) => ({ ...s, authenticator: !s.authenticator }))}
                  >
                    <span className="tf-sec-page__l2sv-knob" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {isWithdrawSettingsOpen ? (
          <div className="tf-sec-page__wds-overlay" role="presentation">
            <div className="tf-sec-page__wds-modal" role="dialog" aria-modal="true" aria-labelledby="tf-wds-title">
              <button
                type="button"
                className="tf-sec-page__wds-close"
                aria-label="Close"
                onClick={() => setIsWithdrawSettingsOpen(false)}
              >
                ×
              </button>

              <h2 id="tf-wds-title" className="tf-sec-page__wds-title">
                Withdrawal Settings
              </h2>
              <p className="tf-sec-page__wds-subtitle">Manage security verification for asset withdrawals.</p>

              <div className="tf-sec-page__wds-list" role="list">
                <div className="tf-sec-page__wds-item" role="listitem">
                  <div className="tf-sec-page__wds-left">
                    <span className="tf-sec-page__wds-icon" aria-hidden="true">
                      <img src="/images/security/setting_icon.svg" alt="" />
                    </span>
                    <span className="tf-sec-page__wds-text">SMS verification</span>
                  </div>
                  <button
                    type="button"
                    className={`tf-sec-page__wds-switch ${withdrawSettings.smsVerification ? "is-on" : ""}`}
                    role="switch"
                    aria-checked={withdrawSettings.smsVerification}
                    onClick={() => setWithdrawSettings((s) => ({ ...s, smsVerification: !s.smsVerification }))}
                  >
                    <span className="tf-sec-page__wds-knob" aria-hidden="true" />
                  </button>
                </div>

                <div className="tf-sec-page__wds-item" role="listitem">
                  <div className="tf-sec-page__wds-left">
                    <span className="tf-sec-page__wds-icon" aria-hidden="true">
                    <img src="/images/security/setting_icon2.svg" alt="" />
                    </span>
                    <span className="tf-sec-page__wds-text">Fund Password</span>
                  </div>
                  <button
                    type="button"
                    className={`tf-sec-page__wds-switch ${withdrawSettings.fundPassword ? "is-on" : ""}`}
                    role="switch"
                    aria-checked={withdrawSettings.fundPassword}
                    onClick={() => setWithdrawSettings((s) => ({ ...s, fundPassword: !s.fundPassword }))}
                  >
                    <span className="tf-sec-page__wds-knob" aria-hidden="true" />
                  </button>
                </div>

                <div className="tf-sec-page__wds-item" role="listitem">
                  <div className="tf-sec-page__wds-left">
                    <span className="tf-sec-page__wds-icon" aria-hidden="true">
                    <img src="/images/security/setting_icon3.svg" alt="" />
                    </span>
                    <span className="tf-sec-page__wds-text">Email verification</span>
                  </div>
                  <button
                    type="button"
                    className={`tf-sec-page__wds-switch ${withdrawSettings.emailVerification ? "is-on" : ""}`}
                    role="switch"
                    aria-checked={withdrawSettings.emailVerification}
                    onClick={() => setWithdrawSettings((s) => ({ ...s, emailVerification: !s.emailVerification }))}
                  >
                    <span className="tf-sec-page__wds-knob" aria-hidden="true" />
                  </button>
                </div>

                <div className="tf-sec-page__wds-item" role="listitem">
                  <div className="tf-sec-page__wds-left">
                    <span className="tf-sec-page__wds-icon" aria-hidden="true">
                    <img src="/images/security/setting_icon4.svg" alt="" />
                    </span>
                    <span className="tf-sec-page__wds-text">Withdraw Only to Trusted Addresses</span>
                  </div>
                  <button
                    type="button"
                    className={`tf-sec-page__wds-switch ${withdrawSettings.trustedAddresses ? "is-on" : ""}`}
                    role="switch"
                    aria-checked={withdrawSettings.trustedAddresses}
                    onClick={() => setWithdrawSettings((s) => ({ ...s, trustedAddresses: !s.trustedAddresses }))}
                  >
                    <span className="tf-sec-page__wds-knob" aria-hidden="true" />
                  </button>
                </div>

                <button type="button" className="tf-sec-page__wds-item tf-sec-page__wds-item--link">
                  <div className="tf-sec-page__wds-left">
                    <span className="tf-sec-page__wds-icon" aria-hidden="true">
                      <img src="/images/security/Icon.svg" alt="" />
                    </span>
                    <span className="tf-sec-page__wds-text">API Withdrawal Settings</span>
                  </div>
                  <span className="tf-sec-page__wds-right">
                    <span className="tf-sec-page__wds-muted">More options</span>
                    <span className="tf-sec-page__wds-chev" aria-hidden="true">
                      ›
                    </span>
                  </span>
                </button>
              </div>

              <div className="tf-sec-page__wds-radioGroup" role="radiogroup" aria-label="Withdrawal address options">
                <button
                  type="button"
                  className={`tf-sec-page__wds-radioRow ${withdrawAddressMode === "addressBook" ? "is-selected" : ""}`}
                  onClick={() => setWithdrawAddressMode("addressBook")}
                >
                  <span className="tf-sec-page__wds-radio" aria-hidden="true" />
                  <span className="tf-sec-page__wds-radioText">To Address Book Addresses Only</span>
                </button>
                <button
                  type="button"
                  className={`tf-sec-page__wds-radioRow ${withdrawAddressMode === "verificationFree" ? "is-selected" : ""}`}
                  onClick={() => setWithdrawAddressMode("verificationFree")}
                >
                  <span className="tf-sec-page__wds-radio" aria-hidden="true" />
                  <span className="tf-sec-page__wds-radioText">Verification-free addresses only</span>
                </button>
              </div>
            </div>
          </div>
        ) : null}

        </div>
      </div>
    </>
  );
};

export default TwofactorPage;
