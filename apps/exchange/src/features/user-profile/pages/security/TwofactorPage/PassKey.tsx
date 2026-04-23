import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { startRegistration, browserSupportsWebAuthn } from "@simplewebauthn/browser";
import { useAuth } from "../../../../../providers/AuthProvider.js";
import { useOtpCountdown } from "../../../hooks/useOtpCountdown.js";
import { authApi } from "../../../../../lib/auth-api.js";
import { formatApiError } from "../../../../../lib/errors.js";
import { SecurityBreadcrumb } from "../components/SecurityBreadcrumb.js";
import "./passkey.css";

type Step = "intro" | "verify";

function makeOtp() {
  return ["", "", "", "", "", ""];
}

function OtpRow({
  prefix,
  values,
  onChange,
  onKeyDown,
}: {
  prefix: string;
  values: string[];
  onChange: (idx: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="pv-otp-row" aria-label="Verification code">
      {values.map((v, idx) => (
        <input
          key={idx}
          id={`${prefix}-${idx}`}
          className="pv-otp-input"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          autoComplete={idx === 0 ? "one-time-code" : undefined}
          aria-label={`Digit ${idx + 1}`}
          value={v}
          onChange={(e) => onChange(idx, e)}
          onKeyDown={(e) => onKeyDown(idx, e)}
        />
      ))}
    </div>
  );
}

const PasskeyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const security = user?.security;
  const userIdentifier = user?.email || user?.phone || "";

  const showEmail = Boolean(security?.emailVerification);
  const showPhone = Boolean(security?.mobileVerification);
  const showGa = Boolean(security?.googleAuthenticatorEnabled);

  const [step, setStep] = useState<Step>("intro");
  const [emailOtp, setEmailOtp] = useState<string[]>(makeOtp());
  const [phoneOtp, setPhoneOtp] = useState<string[]>(makeOtp());
  const [gaOtp, setGaOtp] = useState<string[]>(makeOtp());

  const makeHandlers = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    values: string[],
    prefix: string,
  ) => ({
    onChange: (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const digit = String(e.target.value ?? "").replace(/\D/g, "").slice(-1);
      setter((prev) => {
        const next = [...prev];
        next[idx] = digit;
        return next;
      });
      if (digit && idx < 5) {
        window.requestAnimationFrame(() => {
          document.getElementById(`${prefix}-${idx + 1}`)?.focus();
        });
      }
    },
    onKeyDown: (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !values[idx] && idx > 0) {
        window.requestAnimationFrame(() => {
          document.getElementById(`${prefix}-${idx - 1}`)?.focus();
        });
      }
    },
  });

  const emailHandlers = makeHandlers(setEmailOtp, emailOtp, "pk-email-otp");
  const phoneHandlers = makeHandlers(setPhoneOtp, phoneOtp, "pk-phone-otp");
  const gaHandlers = makeHandlers(setGaOtp, gaOtp, "pk-ga-otp");

  const isEmailComplete = emailOtp.every((d) => d.length === 1);
  const isPhoneComplete = phoneOtp.every((d) => d.length === 1);
  const isGaComplete = gaOtp.every((d) => d.length === 1);
  const canProceed = (showEmail && isEmailComplete) || (showPhone && isPhoneComplete) || (showGa && isGaComplete);

  const unsupported = !browserSupportsWebAuthn();

  const sendOtpMutation = useMutation({
    mutationFn: async () => {
      const calls: Promise<unknown>[] = [];
      if (showEmail) calls.push(authApi.sendOtp({ identifier: userIdentifier, type: "LOGIN" }));
      if (showPhone) calls.push(authApi.sendOtp({ identifier: userIdentifier, type: "LOGIN" }));
      if (calls.length) await Promise.all(calls);
    },
    onSuccess: () => {
      setStep("verify");
    },
    onError: (error) => {
      toast.error(formatApiError(error, "Failed to send verification code."));
    },
  });

  const { countdown: resendCountdown, start: startCooldown } = useOtpCountdown();

  const resendMutation = useMutation({
    mutationFn: (channel: "email" | "phone") =>
      authApi.sendOtp({ identifier: userIdentifier, type: "BIND" }),
    onSuccess: (_data, channel) => {
      toast.success(channel === "email" ? "Email code resent." : "Phone code resent.");
      startCooldown();
    },
    onError: (error) => {
      toast.error(formatApiError(error, "Could not resend code."));
    },
  });

  const addPasskeyMutation = useMutation({
    mutationFn: async () => {
      // Step 1 — verify OTP(s) before registering the passkey.
      await authApi.verifyOtp({
        identifier: userIdentifier,
        purpose: "LOGIN",
        bindIp: false,
        ...(showEmail && isEmailComplete ? { emailOtp: emailOtp.join("") } : {}),
        ...(showPhone && isPhoneComplete ? { mobileOtp: phoneOtp.join("") } : {}),
        ...(showGa && isGaComplete ? { googleTotp: gaOtp.join("") } : {}),
      });

      // Step 2 — OTP accepted; launch WebAuthn device prompt.
      const { options } = await authApi.passkeyRegisterOptions();
      const attestation = await startRegistration({
        optionsJSON: options as unknown as Parameters<typeof startRegistration>[0]["optionsJSON"],
      });

      // Step 3 — send attestation to backend.
      return authApi.passkeyVerifyRegistration({
        response: attestation as unknown as Record<string, unknown>,
      });
    },
    onSuccess: (res) => {
      if (!res?.credentialId) {
        toast.error(res?.message ?? "Passkey could not be verified.");
        return;
      }
      toast.success("Passkey added. You can now use it to sign in.");
      navigate("/user_profile/security");
    },
    onError: (error) => {
      const err = error as { name?: string };
      if (err?.name === "NotAllowedError" || err?.name === "AbortError") {
        toast.error("Passkey prompt was cancelled.");
        return;
      }
      if (err?.name === "InvalidStateError") {
        toast.error("This authenticator is already registered.");
        return;
      }
      toast.error(formatApiError(error, "Could not add passkey."));
    },
  });

  const handleNext = () => {
    if (!canProceed || unsupported || addPasskeyMutation.isPending) return;
    addPasskeyMutation.mutate();
  };

  if (step === "verify") {
    return (
      <main className="passkey-page passkey-verify-page" aria-labelledby="pv-title">
        <div className="pv-wrap">
          <h1 id="pv-title" className="pv-title">Verify Your Identity</h1>
          <p className="pv-subtitle">Complete any one of the verification methods below.</p>

          {showEmail && (
            <section className="pv-section" aria-labelledby="pv-email-heading">
              <div className="pv-section-header">
                <span id="pv-email-heading" className="pv-section-label">Email OTP</span>
                <span className="pv-section-hint">Code sent to your email. Valid for 10 minutes.</span>
              </div>
              <OtpRow
                prefix="pk-email-otp"
                values={emailOtp}
                onChange={emailHandlers.onChange}
                onKeyDown={emailHandlers.onKeyDown}
              />
              <div className="pv-links">
                <button
                  type="button"
                  className="pv-link"
                  disabled={resendMutation.isPending || resendCountdown > 0}
                  onClick={() => resendMutation.mutate("email")}
                >
                  {resendCountdown > 0 ? `Resend (${resendCountdown}s)` : "Resend"}
                </button>
                <button type="button" className="pv-link">
                  Paste <i className="ri-file-copy-fill" aria-hidden="true" />
                </button>
              </div>
            </section>
          )}

          {showPhone && (
            <section className="pv-section" aria-labelledby="pv-phone-heading">
              <div className="pv-section-header">
                <span id="pv-phone-heading" className="pv-section-label">Phone Verification</span>
                <span className="pv-section-hint">Code sent to your registered phone number. Valid for 10 minutes.</span>
              </div>
              <OtpRow
                prefix="pk-phone-otp"
                values={phoneOtp}
                onChange={phoneHandlers.onChange}
                onKeyDown={phoneHandlers.onKeyDown}
              />
              <div className="pv-links">
                <button
                  type="button"
                  className="pv-link"
                  disabled={resendMutation.isPending || resendCountdown > 0}
                  onClick={() => resendMutation.mutate("phone")}
                >
                  {resendCountdown > 0 ? `Resend (${resendCountdown}s)` : "Resend"}
                </button>
                <button type="button" className="pv-link">
                  Paste <i className="ri-file-copy-fill" aria-hidden="true" />
                </button>
              </div>
            </section>
          )}

          {showGa && (
            <section className="pv-section" aria-labelledby="pv-ga-heading">
              <div className="pv-section-header">
                <span id="pv-ga-heading" className="pv-section-label">Google Authenticator</span>
                <span className="pv-section-hint">Enter the 6-digit code from your authenticator app.</span>
              </div>
              <OtpRow
                prefix="pk-ga-otp"
                values={gaOtp}
                onChange={gaHandlers.onChange}
                onKeyDown={gaHandlers.onKeyDown}
              />
              <div className="pv-links pv-links--end">
                <button type="button" className="pv-link">
                  Paste <i className="ri-file-copy-fill" aria-hidden="true" />
                </button>
              </div>
            </section>
          )}

          {!showEmail && !showPhone && !showGa && (
            <p className="pv-no-methods">
              No verification methods are enabled. Please enable at least one from your{" "}
              <button type="button" className="pv-link" onClick={() => navigate("/user_profile/security")}>
                security settings
              </button>
              .
            </p>
          )}

          <button
            type="button"
            className="pv-next"
            disabled={!canProceed || unsupported || addPasskeyMutation.isPending}
            onClick={handleNext}
          >
            {addPasskeyMutation.isPending ? "Verifying…" : "Next"}
          </button>

          <button type="button" className="pv-back" onClick={() => setStep("intro")}>
            ← Back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="passkey-page" aria-labelledby="passkey-title">
      <SecurityBreadcrumb label="Passkey" />

      <div className="passkey-page__header">
        <h1 className="passkey-page__title">Passkey</h1>
        <p className="passkey-page__subtitle">
          Passkey keeps your account safe by protecting it from threats like phishing attacks. It also provides a more
          secure and convenient way to log in.{" "}
          <span className="passkey-page__learn">Learn More &gt;</span>
        </p>
      </div>

      <section className="passkey-page__content" aria-label="Passkey benefits">
        <div className="passkey-page__artWrap" aria-hidden="true">
          <img className="passkey-page__art" src="/images/passkey_vector.svg" alt="" />
        </div>

        <ul className="passkey-page__benefits">
          <li className="passkey-page__benefit">
            <span className="passkey-page__benefitIcon" aria-hidden="true">
              <img src="/images/security/passkey_icon.svg" alt="" />
            </span>
            <div className="passkey-page__benefitText">
              <div className="passkey-page__benefitTitle">High Security</div>
              <div className="passkey-page__benefitDesc">Protect accounts from traditional password theft risks</div>
            </div>
          </li>
          <li className="passkey-page__benefit">
            <span className="passkey-page__benefitIcon" aria-hidden="true">
              <img src="/images/security/passkey_icon2.svg" alt="" />
            </span>
            <div className="passkey-page__benefitText">
              <div className="passkey-page__benefitTitle">Easy Verification</div>
              <div className="passkey-page__benefitDesc">Verify in one tap, free from remembering complex passwords</div>
            </div>
          </li>
          <li className="passkey-page__benefit">
            <span className="passkey-page__benefitIcon" aria-hidden="true">
              <img src="/images/security/passkey_icon3.svg" alt="" />
            </span>
            <div className="passkey-page__benefitText">
              <div className="passkey-page__benefitTitle">Multi-Device</div>
              <div className="passkey-page__benefitDesc">Use passkey across devices seamlessly</div>
            </div>
          </li>
        </ul>

        <button
          type="button"
          className="passkey-page__cta"
          disabled={sendOtpMutation.isPending}
          onClick={() => sendOtpMutation.mutate()}
        >
          {sendOtpMutation.isPending ? "Sending code…" : "Add a Passkey"}
        </button>
      </section>
    </main>
  );
};

export default PasskeyPage;
