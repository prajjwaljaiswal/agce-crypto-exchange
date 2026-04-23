import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { GoogleAuthSetupResponse } from "@agce/types";
import { useAuth } from "../../../../../providers/AuthProvider.js";
import { useOtpCountdown } from "../../../hooks/useOtpCountdown.js";
import { authApi } from "../../../../../lib/auth-api.js";
import { formatApiError } from "../../../../../lib/errors.js";
import "./google-auth-page.css";

type Step = "verify" | "setup";

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
    <div className="gap-otp-row" aria-label="Verification code">
      {values.map((v, idx) => (
        <input
          key={idx}
          id={`${prefix}-${idx}`}
          className="gap-otp-input"
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

const GoogleAuthPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const security = user?.security;

  const showEmail = Boolean(security?.emailVerification);
  const showPhone = Boolean(security?.mobileVerification);
  const showGa = Boolean(security?.googleAuthenticatorEnabled);

  const [step, setStep] = useState<Step>("verify");
  const [emailOtp, setEmailOtp] = useState<string[]>(makeOtp());
  const [phoneOtp, setPhoneOtp] = useState<string[]>(makeOtp());
  const [gaOtp, setGaOtp] = useState<string[]>(makeOtp());
  const [gaData, setGaData] = useState<GoogleAuthSetupResponse | null>(null);
  const [copied, setCopied] = useState(false);

  // ── Setup step: bind fields ──────────────────────────────────────────────────
  const [setupEmailOtp, setSetupEmailOtp] = useState("");
  const [setupTotp, setSetupTotp] = useState("");
  const { countdown: setupResendCountdown, start: startSetupCooldown } = useOtpCountdown();

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

  const emailHandlers = makeHandlers(setEmailOtp, emailOtp, "gap-email-otp");
  const phoneHandlers = makeHandlers(setPhoneOtp, phoneOtp, "gap-phone-otp");
  const gaHandlers = makeHandlers(setGaOtp, gaOtp, "gap-ga-otp");

  const isEmailComplete = emailOtp.every((d) => d.length === 1);
  const isPhoneComplete = phoneOtp.every((d) => d.length === 1);
  const isGaComplete = gaOtp.every((d) => d.length === 1);
  const canProceed =
    (showEmail && isEmailComplete) ||
    (showPhone && isPhoneComplete) ||
    (showGa && isGaComplete);

  // ── Resend cooldown (verify step) ───────────────────────────────────────────
  const { countdown: resendCountdown, start: startCooldown } = useOtpCountdown();

  // email preferred; fall back to phone number when email is absent
  const userIdentifier = user?.email || user?.phone || "";

  // ── Send OTP once identifier is available ────────────────────────────────────
  const sendOtpMutation = useMutation({
    mutationFn: async (identifier: string) => {
      const calls: Promise<unknown>[] = [];
      if (showEmail) calls.push(authApi.sendOtp({ identifier, type: "LOGIN" }));
      if (showPhone) calls.push(authApi.sendOtp({ identifier, type: "LOGIN" }));
      if (calls.length) await Promise.all(calls);
    },
    onError: (error) => {
      toast.error(formatApiError(error, "Failed to send verification code."));
    },
  });

  const hasSentOtpRef = useRef(false);
  useEffect(() => {
    if (hasSentOtpRef.current || !userIdentifier) return;
    if (showEmail || showPhone) {
      hasSentOtpRef.current = true;
      sendOtpMutation.mutate(userIdentifier);
    }
  }, [userIdentifier, showEmail, showPhone]); // eslint-disable-line react-hooks/exhaustive-deps

  const resendMutation = useMutation({
    mutationFn: (channel: "email" | "phone") =>
      authApi.sendOtp({ identifier: userIdentifier, type: "LOGIN" }),
    onSuccess: (_data, channel) => {
      toast.success(channel === "email" ? "Email code resent." : "Phone code resent.");
      startCooldown();
    },
    onError: (error) => {
      toast.error(formatApiError(error, "Could not resend code."));
    },
  });

  // ── Setup step: send email OTP for bind ─────────────────────────────────────
  const sendSetupOtpMutation = useMutation({
    mutationFn: () => authApi.sendOtp({ identifier: userIdentifier, type: "BIND" }),
    onSuccess: () => { toast.success("Verification code sent to your email."); startSetupCooldown(); },
    onError: (error) => { toast.error(formatApiError(error, "Failed to send code.")); },
  });

  const hasSentSetupOtpRef = useRef(false);
  useEffect(() => {
    if (step !== "setup" || hasSentSetupOtpRef.current || !userIdentifier) return;
    hasSentSetupOtpRef.current = true;
    sendSetupOtpMutation.mutate();
  }, [step, userIdentifier]); // eslint-disable-line react-hooks/exhaustive-deps

  const bindGaMutation = useMutation({
    mutationFn: () =>
      authApi.bindMfa({
        target: "google",
        identifier: userIdentifier,
        otp: setupEmailOtp,
        totp: setupTotp,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      toast.success("Google Authenticator enabled.");
      navigate("/user_profile/security");
    },
    onError: (error) => {
      toast.error(formatApiError(error, "Failed to enable Google Authenticator."));
    },
  });

  const canBind = setupEmailOtp.length === 6 && setupTotp.length === 6 && !bindGaMutation.isPending;

  // ── Verify OTP then fetch GA setup ───────────────────────────────────────────
  const verifyMutation = useMutation({
    mutationFn: async () => {
      await authApi.verifyOtp({
        identifier: userIdentifier,
        purpose: "LOGIN",
        bindIp: false,
        ...(showEmail && isEmailComplete ? { emailOtp: emailOtp.join("") } : {}),
        ...(showPhone && isPhoneComplete ? { mobileOtp: phoneOtp.join("") } : {}),
        ...(showGa && isGaComplete ? { googleTotp: gaOtp.join("") } : {}),
      });
      return authApi.googleAuthSetup();
    },
    onSuccess: (res) => {
      setGaData(res);
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      setStep("setup");
    },
    onError: (error) => {
      toast.error(formatApiError(error, "Verification failed. Please try again."));
    },
  });

  const handleCopySecret = async () => {
    if (!gaData?.secret) return;
    try {
      await navigator.clipboard.writeText(gaData.secret);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy secret.");
    }
  };

  // ── Verify step ──────────────────────────────────────────────────────────────
  if (step === "verify") {
    return (
      <main className="gap-page gap-verify-page" aria-labelledby="gap-verify-title">
        <div className="gap-wrap">
          <h1 id="gap-verify-title" className="gap-title">Verify Your Identity</h1>
          <p className="gap-subtitle">Complete any one of the verification methods below.</p>

          {showEmail && (
            <section className="gap-section" aria-labelledby="gap-email-heading">
              <div className="gap-section-header">
                <span id="gap-email-heading" className="gap-section-label">Email OTP</span>
                <span className="gap-section-hint">Code sent to your email. Valid for 10 minutes.</span>
              </div>
              <OtpRow
                prefix="gap-email-otp"
                values={emailOtp}
                onChange={emailHandlers.onChange}
                onKeyDown={emailHandlers.onKeyDown}
              />
              <div className="gap-links">
                <button
                  type="button"
                  className="gap-link"
                  disabled={resendMutation.isPending || resendCountdown > 0}
                  onClick={() => resendMutation.mutate("email")}
                >
                  {resendCountdown > 0 ? `Resend (${resendCountdown}s)` : "Resend"}
                </button>
              </div>
            </section>
          )}

          {showPhone && (
            <section className="gap-section" aria-labelledby="gap-phone-heading">
              <div className="gap-section-header">
                <span id="gap-phone-heading" className="gap-section-label">Phone Verification</span>
                <span className="gap-section-hint">Code sent to your registered phone. Valid for 10 minutes.</span>
              </div>
              <OtpRow
                prefix="gap-phone-otp"
                values={phoneOtp}
                onChange={phoneHandlers.onChange}
                onKeyDown={phoneHandlers.onKeyDown}
              />
              <div className="gap-links">
                <button
                  type="button"
                  className="gap-link"
                  disabled={resendMutation.isPending || resendCountdown > 0}
                  onClick={() => resendMutation.mutate("phone")}
                >
                  {resendCountdown > 0 ? `Resend (${resendCountdown}s)` : "Resend"}
                </button>
              </div>
            </section>
          )}

          {showGa && (
            <section className="gap-section" aria-labelledby="gap-ga-heading">
              <div className="gap-section-header">
                <span id="gap-ga-heading" className="gap-section-label">Google Authenticator</span>
                <span className="gap-section-hint">Enter the 6-digit code from your authenticator app.</span>
              </div>
              <OtpRow
                prefix="gap-ga-otp"
                values={gaOtp}
                onChange={gaHandlers.onChange}
                onKeyDown={gaHandlers.onKeyDown}
              />
            </section>
          )}

          {!showEmail && !showPhone && !showGa && (
            <p className="gap-no-methods">
              No verification methods are enabled.{" "}
              <button type="button" className="gap-link" onClick={() => navigate("/user_profile/security")}>
                Go back to security settings
              </button>
              .
            </p>
          )}

          <button
            type="button"
            className="gap-next"
            disabled={!canProceed || verifyMutation.isPending}
            onClick={() => verifyMutation.mutate()}
          >
            {verifyMutation.isPending ? "Verifying…" : "Next"}
          </button>

          <button type="button" className="gap-back" onClick={() => navigate("/user_profile/security")}>
            ← Back
          </button>
        </div>
      </main>
    );
  }

  // ── Setup step ───────────────────────────────────────────────────────────────
  return (
    <main className="gap-page gap-setup-page" aria-labelledby="gap-setup-title">
      <div className="gap-wrap">
        <h1 id="gap-setup-title" className="gap-title">Set Up Google Authenticator</h1>
        <p className="gap-subtitle">
          Scan the QR code with your authenticator app, then use the 6-digit code when you log in.
        </p>

        {!gaData ? (
          <p className="gap-loading">Loading…</p>
        ) : (
          <>
            <div className="gap-qr-wrap">
              <img
                src={gaData.qrCode}
                alt="Google Authenticator QR code"
                className="gap-qr-img"
              />
            </div>

            <div className="gap-secret-wrap">
              <label className="gap-secret-label">
                Can&apos;t scan? Enter this secret manually:
              </label>
              <div className="gap-secret-row">
                <code className="gap-secret-code">{gaData.secret}</code>
                <button type="button" className="gap-secret-copy" onClick={handleCopySecret}>
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="gap-secret-hint">
                Keep this secret safe — you&apos;ll need it to recover access if you lose your device.
              </p>
            </div>

            <div className="gap-bind-fields">
              <div className="gap-bind-field">
                <label className="gap-bind-label">Email Verification Code</label>
                <div className="gap-bind-row">
                  <input
                    className="gap-bind-input"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Enter email code"
                    value={setupEmailOtp}
                    onChange={(e) => setSetupEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  />
                  <button
                    type="button"
                    className="gap-bind-resend"
                    disabled={sendSetupOtpMutation.isPending || setupResendCountdown > 0}
                    onClick={() => sendSetupOtpMutation.mutate()}
                  >
                    {sendSetupOtpMutation.isPending ? "Sending…" : setupResendCountdown > 0 ? `${setupResendCountdown}s` : "Resend"}
                  </button>
                </div>
              </div>

              <div className="gap-bind-field">
                <label className="gap-bind-label">Google Authenticator Code</label>
                <div className="gap-bind-row">
                  <input
                    className="gap-bind-input"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Enter 6-digit TOTP code"
                    value={setupTotp}
                    onChange={(e) => setSetupTotp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        <button
          type="button"
          className="gap-next"
          disabled={!gaData || !canBind}
          onClick={() => bindGaMutation.mutate()}
        >
          {bindGaMutation.isPending ? "Confirming…" : "I've scanned it"}
        </button>

        <button type="button" className="gap-back" onClick={() => setStep("verify")}>
          ← Back
        </button>
      </div>
    </main>
  );
};

export default GoogleAuthPage;
