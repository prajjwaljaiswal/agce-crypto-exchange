import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "../../../../../providers/AuthProvider.js";
import { authApi } from "../../../../../lib/auth-api.js";
import { formatApiError } from "../../../../../lib/errors.js";
import "./smsVerification.css";

interface CountryOption {
  flag: string;
  code: string;
  label: string;
}

const COUNTRY_OPTIONS: CountryOption[] = [
  { flag: "🇮🇳", code: "+91", label: "India" },
  { flag: "🇺🇸", code: "+1", label: "United States" },
  { flag: "🇬🇧", code: "+44", label: "United Kingdom" },
  { flag: "🇦🇪", code: "+971", label: "UAE" },
  { flag: "🇸🇦", code: "+966", label: "Saudi Arabia" },
  { flag: "🇵🇰", code: "+92", label: "Pakistan" },
  { flag: "🇧🇩", code: "+880", label: "Bangladesh" },
];

const RESEND_COOLDOWN = 60;

function maskEmail(email?: string) {
  if (!email || !email.includes("@")) return email ?? "";
  const [u, d] = email.split("@");
  if (u.length <= 2) return `${u[0]}***@${d}`;
  return `${u[0]}***${u.slice(-1)}@${d}`;
}

type Step = "email-verify" | "phone-link";

const SmsVerification = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [step, setStep] = useState<Step>("email-verify");

  // ── Step 1: email OTP ─────────────────────────────────────────────────────
  const [emailCode, setEmailCode] = useState("");
  const [emailCountdown, setEmailCountdown] = useState(0);
  const emailCountdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const emailSentRef = useRef(false);

  // ── Step 2: phone link ────────────────────────────────────────────────────
  const [country, setCountry] = useState<CountryOption>(COUNTRY_OPTIONS[0]);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [smsCountdown, setSmsCountdown] = useState(0);
  const smsCountdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countryRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => () => {
    if (emailCountdownRef.current) clearInterval(emailCountdownRef.current);
    if (smsCountdownRef.current) clearInterval(smsCountdownRef.current);
  }, []);

  // Auto-send email OTP when page mounts (step 1)
  useEffect(() => {
    if (emailSentRef.current || !user?.email) return;
    emailSentRef.current = true;
    sendEmailOtpMutation.mutate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  useEffect(() => {
    if (!isCountryOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onPointerDown = (e: MouseEvent) => {
      if (countryRef.current?.contains(e.target as Node)) return;
      setIsCountryOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isCountryOpen]);

  const startEmailCooldown = () => {
    setEmailCountdown(RESEND_COOLDOWN);
    emailCountdownRef.current = setInterval(() => {
      setEmailCountdown((prev) => {
        if (prev <= 1) { clearInterval(emailCountdownRef.current!); emailCountdownRef.current = null; return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const startSmsCooldown = () => {
    setSmsCountdown(RESEND_COOLDOWN);
    smsCountdownRef.current = setInterval(() => {
      setSmsCountdown((prev) => {
        if (prev <= 1) { clearInterval(smsCountdownRef.current!); smsCountdownRef.current = null; return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const sendEmailOtpMutation = useMutation({
    mutationFn: () =>
      authApi.sendOtp({ identifier: user?.email ?? "", type: "LOGIN" }),
    onSuccess: () => {
      toast.success("Verification code sent to your email.");
      startEmailCooldown();
    },
    onError: (error) => {
      toast.error(formatApiError(error, "Failed to send email code."));
    },
  });

  const verifyEmailOtpMutation = useMutation({
    mutationFn: () =>
      authApi.verifyOtp({
        identifier: user?.email ?? "",
        purpose: "LOGIN",
        bindIp: false,
        emailOtp: emailCode,
      }),
    onSuccess: () => {
      setStep("phone-link");
    },
    onError: (error) => {
      toast.error(formatApiError(error, "Invalid email code. Please try again."));
    },
  });

  const fullIdentifier = `${country.code}${phoneNumber.replace(/\D/g, "")}`;

  const sendSmsMutation = useMutation({
    mutationFn: () =>
      authApi.sendOtp({ identifier: fullIdentifier, type: "BIND" }),
    onSuccess: () => {
      toast.success("SMS code sent.");
      startSmsCooldown();
    },
    onError: (error) => {
      toast.error(formatApiError(error, "Failed to send SMS code."));
    },
  });

  const confirmMutation = useMutation({
    mutationFn: () =>
      authApi.bindMfa({
        target: "mobile",
        identifier: fullIdentifier,
        otp: smsCode,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      toast.success("Phone verification enabled.");
      navigate("/user_profile/security");
    },
    onError: (error) => {
      toast.error(formatApiError(error, "Verification failed. Please try again."));
    },
  });

  const canNextStep = emailCode.length >= 4 && !verifyEmailOtpMutation.isPending;
  const canSendSms = phoneNumber.replace(/\D/g, "").length >= 7 && !sendSmsMutation.isPending && smsCountdown === 0;
  const canConfirm = smsCode.length >= 4 && !confirmMutation.isPending;

  return (
    <main className="smsv-page" aria-labelledby="smsv-title">
      <nav className="smsv-page__crumbs" aria-label="Breadcrumb">
        <ol className="smsv-page__crumbList">
          <li className="smsv-page__crumbItem">
            <button type="button" className="smsv-page__crumbLink" onClick={() => navigate("/user_profile/security")}>
              Security
            </button>
          </li>
          <li className="smsv-page__crumbSep" aria-hidden="true">›</li>
          <li className="smsv-page__crumbItem smsv-page__crumbItem--active" aria-current="page">
            SMS verification
          </li>
        </ol>
      </nav>

      {step === "email-verify" ? (
        <section className="smsv-form" aria-label="Email verification form">
          <h1 id="smsv-title" className="smsv-page__title">
            Security Verification
          </h1>
          <p className="smsv-page__subtitle">
            To protect your account, please verify your identity before linking a phone number.
          </p>

          <label className="smsv-field">
            <span className="smsv-label">Email Verification Code</span>
            <div className="smsv-page__emailHint">
              Code sent to <strong>{maskEmail(user?.email)}</strong>
            </div>
            <div className="smsv-smsRow">
              <input
                className="smsv-input smsv-input--sms"
                placeholder="Enter the code sent to your email"
                inputMode="numeric"
                value={emailCode}
                onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ""))}
              />
              <button
                type="button"
                className="smsv-sendBtn"
                disabled={sendEmailOtpMutation.isPending || emailCountdown > 0}
                onClick={() => sendEmailOtpMutation.mutate()}
              >
                {sendEmailOtpMutation.isPending
                  ? "Sending…"
                  : emailCountdown > 0
                  ? `${emailCountdown}s`
                  : "Resend"}
              </button>
            </div>
            <div className="smsv-hint">Valid for 10 minutes</div>
          </label>

          <button
            type="button"
            className="smsv-confirmBtn"
            disabled={!canNextStep}
            onClick={() => verifyEmailOtpMutation.mutate()}
          >
            {verifyEmailOtpMutation.isPending ? "Verifying…" : "Next"}
          </button>
        </section>
      ) : (
        <section className="smsv-form" aria-label="SMS verification form">
          <h1 id="smsv-title" className="smsv-page__title">
            Link mobile phone verification
          </h1>

          <label className="smsv-field">
            <span className="smsv-label">Phone</span>
            <div className="smsv-phoneRow">
              <div className="smsv-countrySelect" ref={countryRef}>
                <button
                  type="button"
                  className="smsv-countryBtn"
                  aria-haspopup="listbox"
                  aria-expanded={isCountryOpen}
                  onClick={() => setIsCountryOpen((v) => !v)}
                >
                  <span className="smsv-flag" aria-hidden="true">{country.flag}</span>
                  <span className="smsv-code">{country.code}</span>
                  <span className="smsv-caret" aria-hidden="true">▾</span>
                </button>

                {isCountryOpen && (
                  <div className="smsv-countryMenu" role="listbox" aria-label="Select country code">
                    {COUNTRY_OPTIONS.map((opt) => (
                      <button
                        key={opt.code}
                        type="button"
                        className={`smsv-countryOption${opt.code === country.code ? " is-active" : ""}`}
                        role="option"
                        aria-selected={opt.code === country.code}
                        onClick={() => { setCountry(opt); setIsCountryOpen(false); }}
                      >
                        <span className="smsv-flag" aria-hidden="true">{opt.flag}</span>
                        <span className="smsv-countryLabel">{opt.label}</span>
                        <span className="smsv-countryCode">{opt.code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input
                className="smsv-input"
                placeholder="Enter phone number"
                inputMode="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </label>

          <label className="smsv-field">
            <span className="smsv-label">SMS Code</span>
            <div className="smsv-smsRow">
              <input
                className="smsv-input smsv-input--sms"
                placeholder="Enter the code sent to your phone"
                inputMode="numeric"
                value={smsCode}
                onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, ""))}
              />
              <button
                type="button"
                className="smsv-sendBtn"
                disabled={!canSendSms}
                onClick={() => sendSmsMutation.mutate()}
              >
                {sendSmsMutation.isPending
                  ? "Sending…"
                  : smsCountdown > 0
                  ? `${smsCountdown}s`
                  : "Send"}
              </button>
            </div>
            <div className="smsv-hint">Valid for 10 minutes</div>
          </label>

          <button
            type="button"
            className="smsv-confirmBtn"
            disabled={!canConfirm}
            onClick={() => confirmMutation.mutate()}
          >
            {confirmMutation.isPending ? "Verifying…" : "Confirm"}
          </button>
        </section>
      )}
    </main>
  );
};

export default SmsVerification;
