import { useMemo, useState, useCallback, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useInstanceConfig } from "@agce/hooks";
import { mapInstanceToJurisdiction } from "@agce/config";
import { useKycStatus, useStartKyc } from "./kyc/hooks.js";
import { useAuth } from "../../../providers/index.js";
import { KycVerifyWarningModal } from "./kyc/modals/KycVerifyWarningModal.js";
import { formatApiError } from "../../../lib/errors.js";

import '../../../../public/css-new/kyc-figma.css'

type KycView = "center" | "failed" | "complete" | "pending";

function resolveKycView(status: string | undefined): KycView {
  if (status === "APPROVED") return "complete";
  if (status === "DECLINED") return "failed";
  if (status === "IN_PROGRESS" || status === "IN_REVIEW" || status === "RESUBMITTED") return "pending";
  return "center";
}

function useKycFaqAccordion() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const toggle = useCallback((key: string) => {
    setOpenKey((k) => (k === key ? null : key));
  }, []);
  return { openKey, toggle };
}

function FaqBlockComplete() {
  const { openKey, toggle } = useKycFaqAccordion();

  return (
    <section className="container-wrapper">
      <div className="container27">
        <div className="arab-global-group">
          <div className="frequently-asked-questions2">Frequently Asked Questions</div>
        </div>
        <div className="container28">
          <div className="container29">
            <div
              className="button24 kyc-faq-row"
              role="button"
              tabIndex={0}
              aria-expanded={openKey === "individual"}
              onClick={() => toggle("individual")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle("individual");
                }
              }}
            >
              <div className="text24">
                <div className="how-to-complete3">How to complete individual KYC?</div>
              </div>
              <span className="question-icons2" aria-hidden="true">
                <i className={`ri-arrow-down-s-line icon19 kyc-faq-caret ${openKey === "individual" ? "is-open" : ""}`} aria-hidden="true" />
              </span>
            </div>
            {openKey === "individual" ? (
              <div className="paragraph3">
                <div className="to-protect-your2">
                  Upload a valid government-issued ID, complete the liveness check when prompted, and submit your details in the Verification Center. This usually
                  takes 2–5 minutes.
                </div>
              </div>
            ) : null}
          </div>

          <div className="container29">
            <div
              className="button25 kyc-faq-row"
              role="button"
              tabIndex={0}
              aria-expanded={openKey === "business"}
              onClick={() => toggle("business")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle("business");
                }
              }}
            >
              <div className="text25">
                <div className="how-to-complete4">How to complete business KYC?</div>
              </div>
              <span className="question-icons2" aria-hidden="true">
                <i className={`ri-arrow-down-s-line icon19 kyc-faq-caret ${openKey === "business" ? "is-open" : ""}`} aria-hidden="true" />
              </span>
            </div>
            {openKey === "business" ? (
              <div className="paragraph3">
                <div className="to-protect-your2">
                  Provide business registration documents, beneficial owner information, and any extra forms requested. Our team may review submissions as part of
                  compliance checks.
                </div>
              </div>
            ) : null}
          </div>

          <div className="container31">
            <div
              className="button26 kyc-faq-row"
              role="button"
              tabIndex={0}
              aria-expanded={openKey === "whyKyc"}
              onClick={() => toggle("whyKyc")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle("whyKyc");
                }
              }}
            >
              <div className="text25">
                <div className="why-is-kyc2">Why is KYC verification required?</div>
              </div>
              <span className="question-icons2" aria-hidden="true">
                <i className={`ri-arrow-down-s-line icon19 kyc-faq-caret ${openKey === "whyKyc" ? "is-open" : ""}`} aria-hidden="true" />
              </span>
            </div>
            {openKey === "whyKyc" ? (
              <div className="paragraph3">
                <div className="to-protect-your2">
                  To protect your assets and promote a secure, compliant crypto environment, AGCE requires all users to complete KYC (Know Your Customer)
                  verification. This helps prevent fraud, money laundering, and other illicit activities. Once your KYC is verified, you&apos;ll gain access to key
                  platform features including crypto deposits and withdrawals, P2P trading, and participation in events like Launchpool.
                </div>
              </div>
            ) : null}
          </div>

          <div className="container32">
            <div
              className="button27 kyc-faq-row"
              role="button"
              tabIndex={0}
              aria-expanded={openKey === "whyAdvanced"}
              onClick={() => toggle("whyAdvanced")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle("whyAdvanced");
                }
              }}
            >
              <div className="text27">
                <div className="why-is-an2">Why is an advanced verification necessary?</div>
              </div>
              <span className="question-icons2" aria-hidden="true">
                <i className={`ri-arrow-down-s-line icon19 kyc-faq-caret ${openKey === "whyAdvanced" ? "is-open" : ""}`} aria-hidden="true" />
              </span>
            </div>
            {openKey === "whyAdvanced" ? (
              <div className="paragraph4">
                <div className="advanced-verification-unlocks2">
                  Advanced verification unlocks higher limits. Rewards Hub with exclusive beginner rewards, and gain access to more platform features, including
                  deposits, buy crypto, trade, and more.
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqBlockFailed() {
  const { openKey, toggle } = useKycFaqAccordion();

  return (
    <section className="container15">
      <div className="arab-global-parent">
        <div className="frequently-asked-questions">Frequently Asked Questions</div>
      </div>
      <div className="container16">
        <div className="container17">
          <div
            className="button11 kyc-faq-row"
            role="button"
            tabIndex={0}
            aria-expanded={openKey === "individual"}
            onClick={() => toggle("individual")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle("individual");
              }
            }}
          >
            <div className="text11">
              <div className="how-to-complete">How to complete individual KYC?</div>
            </div>
            <span className="question-icons" aria-hidden="true">
              <i className={`ri-arrow-down-s-line icon kyc-faq-caret ${openKey === "individual" ? "is-open" : ""}`} aria-hidden="true" />
            </span>
          </div>
          {openKey === "individual" ? (
            <div className="paragraph">
              <div className="to-protect-your">
                Upload a valid government-issued ID, complete the liveness check when prompted, and submit your details in the Verification Center. This usually
                takes 2–5 minutes.
              </div>
            </div>
          ) : null}
        </div>
        <div className="container17">
          <div
            className="button12 kyc-faq-row"
            role="button"
            tabIndex={0}
            aria-expanded={openKey === "business"}
            onClick={() => toggle("business")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle("business");
              }
            }}
          >
            <div className="text12">
              <div className="how-to-complete2">How to complete business KYC?</div>
            </div>
            <span className="question-icons" aria-hidden="true">
              <i className={`ri-arrow-down-s-line icon kyc-faq-caret ${openKey === "business" ? "is-open" : ""}`} aria-hidden="true" />
            </span>
          </div>
          {openKey === "business" ? (
            <div className="paragraph">
              <div className="to-protect-your">
                Provide business registration documents, beneficial owner information, and any extra forms requested. Our team may review submissions as part of
                compliance checks.
              </div>
            </div>
          ) : null}
        </div>
        <div className="container19">
          <div
            className="button13 kyc-faq-row"
            role="button"
            tabIndex={0}
            aria-expanded={openKey === "whyKyc"}
            onClick={() => toggle("whyKyc")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle("whyKyc");
              }
            }}
          >
            <div className="text12">
              <div className="why-is-kyc">Why is KYC verification required?</div>
            </div>
            <span className="question-icons" aria-hidden="true">
              <i className={`ri-arrow-down-s-line icon kyc-faq-caret ${openKey === "whyKyc" ? "is-open" : ""}`} aria-hidden="true" />
            </span>
          </div>
          {openKey === "whyKyc" ? (
            <div className="paragraph">
              <div className="to-protect-your">
                To protect your assets and promote a secure, compliant crypto environment, AGCE requires all users to complete KYC (Know Your Customer) verification.
                This helps prevent fraud, money laundering, and other illicit activities. Once your KYC is verified, you&apos;ll gain access to key platform features
                including crypto deposits and withdrawals, P2P trading, and participation in events like Launchpool.
              </div>
            </div>
          ) : null}
        </div>
        <div className="container20">
          <div
            className="button14 kyc-faq-row"
            role="button"
            tabIndex={0}
            aria-expanded={openKey === "whyAdvanced"}
            onClick={() => toggle("whyAdvanced")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle("whyAdvanced");
              }
            }}
          >
            <div className="text14">
              <div className="why-is-an">Why is an advanced verification necessary?</div>
            </div>
            <span className="question-icons" aria-hidden="true">
              <i className={`ri-arrow-down-s-line icon kyc-faq-caret ${openKey === "whyAdvanced" ? "is-open" : ""}`} aria-hidden="true" />
            </span>
          </div>
          {openKey === "whyAdvanced" ? (
            <div className="paragraph2">
              <div className="advanced-verification-unlocks">
                Advanced verification unlocks higher limits. Rewards Hub with exclusive beginner rewards, and gain access to more platform features, including
                deposits, buy crypto, trade, and more.
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function FaqBlockCenter() {
  const { openKey, toggle } = useKycFaqAccordion();

  return (
    <section className="container-wrapper">
      <div className="container27">
        <div className="arab-global-group">
          <div className="frequently-asked-questions2">Frequently Asked Questions</div>
        </div>
        <div className="container28">
          <div className="container29">
            <div
              className="button24 kyc-faq-row"
              role="button"
              tabIndex={0}
              aria-expanded={openKey === "individual"}
              onClick={() => toggle("individual")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle("individual");
                }
              }}
            >
              <div className="text24">
                <div className="how-to-complete3">How to complete individual KYC?</div>
              </div>
              <span className="question-icons2" aria-hidden="true">
                <i className={`ri-arrow-down-s-line icon19 kyc-faq-caret ${openKey === "individual" ? "is-open" : ""}`} aria-hidden="true" />
              </span>
            </div>
            {openKey === "individual" ? (
              <div className="paragraph3">
                <div className="to-protect-your2">
                  Upload a valid government-issued ID, complete the liveness check when prompted, and submit your details in the Verification Center. This usually
                  takes 2–5 minutes.
                </div>
              </div>
            ) : null}
          </div>
          <div className="container29">
            <div
              className="button25 kyc-faq-row"
              role="button"
              tabIndex={0}
              aria-expanded={openKey === "business"}
              onClick={() => toggle("business")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle("business");
                }
              }}
            >
              <div className="text25">
                <div className="how-to-complete4">How to complete business KYC?</div>
              </div>
              <span className="question-icons2" aria-hidden="true">
                <i className={`ri-arrow-down-s-line icon19 kyc-faq-caret ${openKey === "business" ? "is-open" : ""}`} aria-hidden="true" />
              </span>
            </div>
            {openKey === "business" ? (
              <div className="paragraph3">
                <div className="to-protect-your2">
                  Provide business registration documents, beneficial owner information, and any extra forms requested. Our team may review submissions as part of
                  compliance checks.
                </div>
              </div>
            ) : null}
          </div>
          <div className="container31">
            <div
              className="button26 kyc-faq-row"
              role="button"
              tabIndex={0}
              aria-expanded={openKey === "whyKyc"}
              onClick={() => toggle("whyKyc")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle("whyKyc");
                }
              }}
            >
              <div className="text25">
                <div className="why-is-kyc2">Why is KYC verification required?</div>
              </div>
              <span className="question-icons2" aria-hidden="true">
                <i className={`ri-arrow-down-s-line icon19 kyc-faq-caret ${openKey === "whyKyc" ? "is-open" : ""}`} aria-hidden="true" />
              </span>
            </div>
            {openKey === "whyKyc" ? (
              <div className="paragraph3">
                <div className="to-protect-your2">
                  To protect your assets and promote a secure, compliant crypto environment, AGCE requires all users to complete KYC (Know Your Customer) verification.
                  This helps prevent fraud, money laundering, and other illicit activities. Once your KYC is verified, you&apos;ll gain access to key platform features
                  including crypto deposits and withdrawals, P2P trading, and participation in events like Launchpool.
                </div>
              </div>
            ) : null}
          </div>
          <div className="container32">
            <div
              className="button27 kyc-faq-row"
              role="button"
              tabIndex={0}
              aria-expanded={openKey === "whyAdvanced"}
              onClick={() => toggle("whyAdvanced")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle("whyAdvanced");
                }
              }}
            >
              <div className="text27">
                <div className="why-is-an2">Why is an advanced verification necessary?</div>
              </div>
              <span className="question-icons2" aria-hidden="true">
                <i className={`ri-arrow-down-s-line icon19 kyc-faq-caret ${openKey === "whyAdvanced" ? "is-open" : ""}`} aria-hidden="true" />
              </span>
            </div>
            {openKey === "whyAdvanced" ? (
              <div className="paragraph4">
                <div className="advanced-verification-unlocks2">
                  Advanced verification unlocks higher limits. Rewards Hub with exclusive beginner rewards, and gain access to more platform features, including
                  deposits, buy crypto, trade, and more.
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function LockedRow({ title, subtitle, layout = "row" }: { title: string; subtitle: string; layout?: string }) {
  if (layout === "trading") {
    return (
      <div className="container12">
        <div className="container-parent2">
          <div className="container13">
            <img src="/images/trading-icon.svg" alt="Trading" />
            <div className="text10">
              <div className="trading">{title}</div>
            </div>
          </div>
          <div className="transaction-process">
            <div className="verification-ensures-safe">{subtitle}</div>
          </div>
        </div>
        <div className="icons-list">
          <img src="/images/lock_icon2.svg" alt="Locked Features" />
        </div>
      </div>
    );
  }
  return (
    <div className="container10">
      <img src="/images/withdrawal_icon2.svg" alt="Trading" />
      <div className="control-area">
        <div className="action-list">
          <div className="verification-incomplete">{title}</div>
          <div className="locked-to-prevent">{subtitle}</div>
        </div>
      </div>
      <div className="icons-list">
        <img src="/images/lock_icon2.svg" alt="Locked Features" />
      </div>
    </div>
  );
}

function LockedRowDeposit() {
  return (
    <div className="container11">
      <img src="/images/deposit-icon2.svg" alt="Trading" />
      <div className="container-inner">
        <div className="frame-parent4">
          <div className="deposit-wrapper">
            <div className="verification-incomplete">Deposit</div>
          </div>
          <div className="locked-to-prevent">Locked to prevent fraud until identity is verified.</div>
        </div>
      </div>
      <div className="icons-list">
        <img src="/images/lock_icon2.svg" alt="Locked Features" />
      </div>
    </div>
  );
}

function LockedRowP2p() {
  return (
    <div className="container14">
      <img src="/images/p2p-icon2.svg" alt="Trading" />
      <div className="p2p-parent">
        <div className="verification-incomplete">P2P</div>
        <div className="locked-to-prevent">Requires verification for secure transactions.</div>
      </div>
      <div className="icons-list">
        <img src="/images/lock_icon2.svg" alt="Locked Features" />
      </div>
    </div>
  );
}

function ViewComplete({ navigate }: { navigate: (path: string) => void }) {
  return (
    <section className="verification-details-wrapper">
      <div className="verification-details">
        <div className="kyc-complete-columns">
          <div className="kyc-complete-main">
            <section className="k-y-c-container">
              <div className="frame-parent20">
                <div className="frame-wrapper6">
                  <div className="verification-complete-parent">
                    <div className="reward-image">
                      <img src="/images/verification_gift.svg" alt="Gift box" />
                    </div>

                    <h1 className="verification-complete">Verification Complete!</h1>
                  </div>
                </div>
                <div className="your-identity-has">
                  Your identity has been successfully verified. Welcome to full trading access with enhanced privileges.
                </div>
              </div>
            </section>

            <section className="container33">
              <div className="container-parent6">
                <div className="container34">
                  <div className="container35">

                    <div className="d-flex verification-details-row">

                      <div className="verification_icon2">
                        <img src="/images/verification_vector.svg" alt="Withdrawal" />
                      </div>
                      <div className="container36 verification_cnt_mid">
                        <div className="heading-3">
                          <div className="withdrawal-limit">Withdrawal Limit</div>
                        </div>
                        <div className="container37">
                          <h3 className="m-usdt">3M USDT</h3>
                        </div>
                        <div className="paragraph5">
                          <div className="daily-withdrawal-limit">Daily withdrawal limit</div>
                        </div>
                      </div>
                    </div>

                    <div className="clear-icon">
                      <img src="/images/clear-icon.svg" alt="Withdrawal" />
                    </div>
                  </div>
                </div>
                <div className="container34">
                  <div className="container35">

                    <div className="d-flex verification-details-row">

                      <div className="verification_icon2">
                        <img src="/images/verification_vector2.svg" alt="Withdrawal" />
                      </div>
                      <div className="container36 verification_cnt_mid">
                        <div className="heading-3">
                          <div className="trading3">Trading</div>
                        </div>
                        <div className="container37">
                          <h3 className="full-access">Full Access</h3>
                        </div>
                        <div className="paragraph5">
                          <div className="all-markets-available">All markets available</div>
                        </div>
                      </div>
                    </div>

                    <div className="clear-icon">
                      <img src="/images/clear-icon.svg" alt="Withdrawal" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="container-parent6">
                <div className="container34">
                  <div className="container35">

                    <div className="d-flex verification-details-row">

                      <div className="verification_icon2">
                        <img src="/images/verification_vector3.svg" alt="Withdrawal" />
                      </div>
                      <div className="container36 verification_cnt_mid">
                        <div className="heading-3">
                          <div className="deposit3">Deposit</div>
                        </div>
                        <div className="container37">
                          <h3 className="unlimited">Unlimited</h3>
                        </div>
                        <div className="paragraph5">
                          <div className="no-restrictions">No restrictions</div>
                        </div>
                      </div>

                    </div>

                    <div className="clear-icon">
                      <img src="/images/clear-icon.svg" alt="Withdrawal" />
                    </div>
                  </div>
                </div>
                <div className="container34">
                  <div className="container35">

                    <div className="d-flex verification-details-row">

                      <div className="verification_icon2">
                        <img src="/images/verification_vector4.svg" alt="Withdrawal" />
                      </div>
                      <div className="container36 verification_cnt_mid">
                        <div className="heading-3">
                          <div className="p2p-trading">P2P Trading</div>
                        </div>
                        <div className="container37">
                          <h3 className="enabled">Enabled</h3>
                        </div>
                        <div className="paragraph5">
                          <div className="trade-with-peers">Trade with peers</div>
                        </div>
                      </div>

                    </div>

                    <div className="clear-icon">
                      <img src="/images/clear-icon.svg" alt="Withdrawal" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="container50">
              <div className="container51">
                <div className="trading-header">
                  <div className="container52" />
                  <div className="container53" />
                </div>
              </div>
              <div className="trade-intro">
                <div className="arab-global-container">
                  <h2 className="ready-to-start">Ready to Start Trading?</h2>
                </div>
                <div className="trading-subtitle">
                  <div className="access-all-markets">Access all markets and start trading with the best rates</div>
                </div>
              </div>
              <button type="button" className="button36" onClick={() => navigate("/market")}>
                <div className="start-trading-now">Start Trading Now</div>
                <span className="icon-wrapper12" aria-hidden="true">
                  <i className="ri-arrow-right-line icon36" />
                </span>
              </button>
              <div className="container54">
                <div className="text36">
                  <div className="bank-level-encryption"> <img src="/images/icon3.svg" alt="Shield" /> Bank-level encryption • Fully secured</div>
                </div>
              </div>
            </section>
          </div>

          <FaqBlockComplete />
        </div>
      </div>
    </section>
  );
}

function ViewFailed({ displayName, declineReason, onRetry, isRetrying }: {
  displayName: string;
  declineReason?: string;
  onRetry: () => void;
  isRetrying: boolean;
}) {
  const initials = (displayName || "U").slice(0, 2).toUpperCase();
  return (
    <section className="frame-section">
      <div className="inner-content-parent">
        <div className="inner-content">
          <div className="nested-content">
            <div className="data-container">
              <h2 className="verification-center">Verification Center</h2>
              <div className="manage-your-identity">Manage your identity verification and unlock platform features</div>
            </div>
            <div className="container-parent">
              <div className="container user_adminprofile">
                <div className="container2">
                  <h3 className="gu">{initials}</h3>
                </div>
                <div className="container3">
                  <div className="container4">
                    <div className="agce-user-0c52a95c">{displayName}</div>
                  </div>
                  <div className="container5">
                    <div className="container6" />
                    <div className="text9">
                      <div className="verification-failed">Verification Failed</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="status-detail">
                <div className="container7">
                  <span className="icon-wrapper" aria-hidden="true">
                    <img src="/images/verification_icon2.svg" alt="Error Warning" />
                  </span>
                  <div className="status-title">
                    <div className="verification-incomplete">Verification Incomplete</div>
                    <div className="your-identity-verification">
                      {declineReason
                        ? `Your verification was declined: ${declineReason}`
                        : "Your identity verification is currently incomplete. To complete the process, please submit the required information and finish facial recognition."}
                    </div>
                  </div>
                </div>
              </div>
              <div className="action-button">
                <div className="container8">
                  <button type="button" className="button9" onClick={onRetry} disabled={isRetrying}>
                    <div className="try-again">{isRetrying ? "Starting…" : "Try Again"}</div>
                  </button>
                  <Link to="/user_profile/support" className="button10">
                    <div className="need-help">Need Help?</div>
                  </Link>
                </div>
              </div>
              <section className="container-group">
                <div className="container9">
                  <img src="/images/lock_icon2.svg" alt="Locked Features" />
                  <div className="heading-2">
                    <div className="locked-features-">Locked Features - Verify to Unlock</div>
                  </div>
                </div>
                <div className="container-container">
                  <LockedRow title="Withdrawal" subtitle="Locked to prevent fraud until identity is verified." />
                  <LockedRowDeposit />
                  <LockedRow title="Trading" subtitle="Verification ensures safe and legitimate transactions." layout="trading" />
                  <LockedRowP2p />
                </div>
              </section>
            </div>
          </div>
        </div>
        <FaqBlockFailed />
      </div>
    </section>
  );
}

function ViewPending({ displayName }: { displayName: string }) {
  const initials = (displayName || "U").slice(0, 2).toUpperCase();
  return (
    <section className="frame-section">
      <div className="inner-content-parent">
        <div className="inner-content">
          <div className="nested-content">
            <div className="data-container">
              <h2 className="verification-center">Verification Center</h2>
              <div className="manage-your-identity">Manage your identity verification and unlock platform features</div>
            </div>
            <div className="container-parent">
              <div className="container user_adminprofile">
                <div className="container2">
                  <h3 className="gu">{initials}</h3>
                </div>
                <div className="container3">
                  <div className="container4">
                    <div className="agce-user-0c52a95c">{displayName}</div>
                  </div>
                  <div className="container5">
                    <div className="container6" />
                    <div className="text9">
                      <div className="verification-failed" style={{ color: "#D1AA67" }}>Under Review</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="status-detail">
                <div className="container7">
                  <span className="icon-wrapper" aria-hidden="true">
                    <i className="ri-loader-4-line" style={{ fontSize: 32, color: "#D1AA67" }} />
                  </span>
                  <div className="status-title">
                    <div className="verification-incomplete">Verification In Progress</div>
                    <div className="your-identity-verification">
                      Your identity verification is being reviewed. This usually takes a few minutes. We&apos;ll update your status automatically — no action needed.
                    </div>
                  </div>
                </div>
              </div>
              <section className="container-group">
                <div className="container9">
                  <img src="/images/lock_icon2.svg" alt="Locked Features" />
                  <div className="heading-2">
                    <div className="locked-features-">Locked Features - Verify to Unlock</div>
                  </div>
                </div>
                <div className="container-container">
                  <LockedRow title="Withdrawal" subtitle="Locked to prevent fraud until identity is verified." />
                  <LockedRowDeposit />
                  <LockedRow title="Trading" subtitle="Verification ensures safe and legitimate transactions." layout="trading" />
                  <LockedRowP2p />
                </div>
              </section>
            </div>
          </div>
        </div>
        <FaqBlockFailed />
      </div>
    </section>
  );
}

function ViewCenter({ onVerify, isVerifying }: { onVerify: () => void; isVerifying: boolean }) {
  return (
    <section className="frame-wrapper4">
      <div className="frame-parent11">
        <div className="frame-parent12">
          <section className="verification-center-parent">
            <h2 className="verification-center2">Verification Center</h2>
            <div className="manage-your-identity2">Manage your identity verification and unlock platform features</div>
            <div className="frame-parent13">
              <div className="standard-identity-verification-parent">
                <h2 className="standard-identity-verification">Standard Identity Verification</h2>
                <div className="manage-your-identity2">It takes only 2-5 minutes to verify your account.</div>
              </div>
              <button type="button" className="button23" onClick={onVerify} disabled={isVerifying}>
                <div className="verify-now">{isVerifying ? "Starting…" : "Verify Now"}</div>
              </button>
              <div className="rectangle-div" aria-hidden="true" />
              <img
                className="a3cde5-da6b-41f8-89ee-884ddd64-icon"
                src="/images/Kyc-image/417922960-04a3cde5-da6b-41f8-89ee-884ddd64db8f-1.svg"
                alt=""
                loading="lazy"
              />
            </div>
          </section>
          <section className="container-parent3">
            <div className="container21">
              <img src="/images/lock_icon2.svg" alt="Locked Features" />
              <div className="heading-23">
                <div className="locked-features-2">Locked Features - Verify to Unlock</div>
              </div>
            </div>
            <div className="container-parent4">
              <div className="container22">
                <img src="/images/withdrawal_icon2.svg" alt="Withdrawal" />
                <div className="deposit-area-wrapper">
                  <div className="deposit-area">
                    <div className="withdrawal2">Withdrawal</div>
                    <div className="locked-to-prevent3">Locked to prevent fraud until identity is verified.</div>
                  </div>
                </div>
                <div className="icon-holders">
                  <img src="/images/lock_icon2.svg" alt="Withdrawal" />
                </div>
              </div>
              <div className="container23">
                <img src="/images/deposit-icon2.svg" alt="Withdrawal" />
                <div className="container-child">
                  <div className="frame-parent14">
                    <div className="deposit-container">
                      <div className="withdrawal2">Deposit</div>
                    </div>
                    <div className="locked-to-prevent3">Locked to prevent fraud until identity is verified.</div>
                  </div>
                </div>
                <div className="icon-holders">
                  <img src="/images/lock_icon2.svg" alt="Withdrawal" />
                </div>
              </div>
              <div className="container24">
                <div className="container-parent5">
                  <div className="container25">
                    <img src="/images/trading-icon.svg" alt="Withdrawal" />
                    <div className="text23">
                      <div className="trading2">Trading</div>
                    </div>
                  </div>
                  <div className="verification-ensures-safe-and-wrapper">
                    <div className="verification-ensures-safe2">Verification ensures safe and legitimate transactions.</div>
                  </div>
                </div>
                <div className="icon-holders">
                  <img src="/images/lock_icon2.svg" alt="Withdrawal" />
                </div>
              </div>
              <div className="container26">
                <img src="/images/p2p-icon2.svg" alt="Withdrawal" />
                <div className="p2p-group">
                  <div className="withdrawal2">P2P</div>
                  <div className="locked-to-prevent3">Requires verification for secure transactions.</div>
                </div>
                <div className="icon-holders">
                  <img src="/images/lock_icon2.svg" alt="Withdrawal" />
                </div>
              </div>
            </div>
          </section>
        </div>
        <FaqBlockCenter />
      </div>
    </section>
  );
}

export function KycVerificationNew() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const instance = useInstanceConfig();
  const { data: kycData, isLoading } = useKycStatus();
  const { mutateAsync: startKyc, isPending: isStarting } = useStartKyc();
  const [pendingVerifyUrl, setPendingVerifyUrl] = useState('');

  // When Didit redirects back with ?session_id=, force a fresh status fetch
  useEffect(() => {
    if (searchParams.get('session_id')) {
      queryClient.invalidateQueries({ queryKey: ['kyc', 'status'] });
    }
  }, [searchParams, queryClient]);

  const handleVerify = useCallback(async () => {
    try {
      const identifier = user?.identifier ?? '';
      const isEmail = identifier.includes('@');
      const session = await startKyc({
        jurisdiction: mapInstanceToJurisdiction(instance.id),
        ...(isEmail ? { email: identifier } : identifier.startsWith('+') ? { phone: identifier } : {}),
      });
      setPendingVerifyUrl(session.diditUrl);
    } catch (err) {
      alert(formatApiError(err, 'Could not start verification. Please try again.'));
    }
  }, [user, instance, startKyc]);

  const displayName = useMemo(() => {
    const identifier = user?.identifier;
    if (!identifier) return "AGCE User";
    const local = String(identifier).split("@")[0];
    return `AGCE User-${local.slice(0, 8)}`;
  }, [user]);

  const view = useMemo(() => resolveKycView(kycData?.status), [kycData?.status]);

  if (isLoading) {
    return (
      <div className="dashboard_right kyc-page">
        <main className="navigation-group" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <i className="ri-loader-4-line" style={{ fontSize: 40 }} />
        </main>
      </div>
    );
  }

  return (
    <div className={`dashboard_right kyc-page${view === "failed" || view === "pending" ? " kyc-failed" : ""}${view === "center" ? " kyc-1" : ""}`}>
      <KycVerifyWarningModal
        isOpen={!!pendingVerifyUrl}
        onContinue={() => { window.location.href = pendingVerifyUrl; }}
        onLater={() => setPendingVerifyUrl('')}
      />
      <main className="navigation-group">
        {view === "complete" && <ViewComplete navigate={navigate} />}
        {view === "failed" && (
          <ViewFailed
            displayName={displayName}
            declineReason={kycData?.decision?.decline_reason}
            onRetry={handleVerify}
            isRetrying={isStarting}
          />
        )}
        {view === "pending" && <ViewPending displayName={displayName} />}
        {view === "center" && <ViewCenter onVerify={handleVerify} isVerifying={isStarting} />}
      </main>
    </div>
  );
}

export default KycVerificationNew;
