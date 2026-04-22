import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "../../../../../providers/AuthProvider.js";
import { useOtpCountdown } from "../../../hooks/useOtpCountdown.js";
import { maskEmail } from "../../../lib/maskEmail.js";
import { authApi } from "../../../../../lib/auth-api.js";
import { formatApiError } from "../../../../../lib/errors.js";
import { SecurityBreadcrumb } from "../components/SecurityBreadcrumb.js";
import "./antiPhishing.css";

type Step = "settings" | "reset" | "bind";

const AntiPhishing = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [step, setStep] = useState<Step>("settings");

  const [antiCode, setAntiCode] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const { countdown, start: startCooldown } = useOtpCountdown();

  const [resetMethod, setResetMethod] = useState<"" | "email">("");
  const [newEmail, setNewEmail] = useState("");
  const [newEmailCode, setNewEmailCode] = useState("");

  const antiCodeClean = useMemo(() => antiCode.replace(/[^a-zA-Z0-9]/g, "").slice(0, 20), [antiCode]);
  const isAntiCodeValid = antiCodeClean.length > 0 && antiCodeClean.length <= 20;
  const isSettingsConfirmEnabled = isAntiCodeValid && emailCode.trim().length >= 4;
  const isResetConfirmEnabled = resetMethod !== "";
  const isEmailValid = newEmail.trim().length > 3 && newEmail.includes("@") && newEmail.includes(".");
  const isBindNextEnabled = isEmailValid && newEmailCode.trim().length >= 4;

  const maskedEmail = maskEmail(user?.email);

  const sendOtpMutation = useMutation({
    mutationFn: () =>
      authApi.sendOtp({ identifier: user?.email ?? user?.phone ?? "", type: "ANTI_PHISHING" }),
    onSuccess: () => {
      toast.success("Verification code sent to your email.");
      startCooldown();
    },
    onError: (error) => {
      toast.error(formatApiError(error, "Failed to send verification code."));
    },
  });

  const setCodeMutation = useMutation({
    mutationFn: () =>
      authApi.setAntiPhishingCode({ code: antiCodeClean, otp: emailCode }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      toast.success("Anti-phishing code saved.");
      navigate("/user_profile/security");
    },
    onError: (error) => {
      toast.error(formatApiError(error, "Failed to save anti-phishing code."));
    },
  });

  return (
    <main className="apc-page" aria-labelledby="apc-title">
      <SecurityBreadcrumb
        label={step === "settings" ? "Anti-Phishing Code Settings" : step === "reset" ? "Reset Verification Method" : "Bind New Email"}
      />

      {step === "settings" ? (
        <section className="apc-card" aria-label="Anti-Phishing Code form">
          <h1 id="apc-title" className="apc-page__title">
            Anti-Phishing Code Settings
          </h1>

          <div className="apc-field">
            <label className="apc-label">Anti-Phishing Code</label>
            <input
              className="apc-input"
              placeholder="Please Enter"
              value={antiCodeClean}
              onChange={(e) => setAntiCode(e.target.value)}
            />
            <div className="apc-hint">Up to 20 characters. Letters and numbers only</div>
          </div>

          <div className="apc-field">
            <label className="apc-label">Email Verification Code</label>
            <div className="apc-inputRow">
              <input
                className="apc-input apc-input--row"
                placeholder="Please Enter"
                inputMode="numeric"
                value={emailCode}
                onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ""))}
              />
              <button
                type="button"
                className="apc-send"
                disabled={sendOtpMutation.isPending || countdown > 0}
                onClick={() => sendOtpMutation.mutate()}
              >
                {sendOtpMutation.isPending ? "Sending…" : countdown > 0 ? `${countdown}s` : "Send"}
              </button>
            </div>
            <div className="apc-note">
              Send the verification code to {maskedEmail}, and the code will be valid for 10 minutes
            </div>
          </div>

          <button
            type="button"
            className={`apc-primary ${isSettingsConfirmEnabled ? "is-enabled" : ""}`}
            disabled={!isSettingsConfirmEnabled || setCodeMutation.isPending}
            onClick={() => setCodeMutation.mutate()}
          >
            {setCodeMutation.isPending ? "Saving…" : "Confirm"}
          </button>

          <button type="button" className="apc-link" onClick={() => setStep("reset")}>
            Unable to verify?
          </button>
        </section>
      ) : step === "reset" ? (
        <section className="apc-card apc-card--reset" aria-label="Reset verification method">
          <h1 id="apc-title" className="apc-page__title">
            Reset Verification Method
          </h1>
          <p className="apc-page__subtitle">Please select the verification method you need to reset</p>

          <button
            type="button"
            className={`apc-choice ${resetMethod === "email" ? "is-selected" : ""}`}
            onClick={() => setResetMethod("email")}
          >
            <span className="apc-choice__left">
              <span className="apc-choice__icon" aria-hidden="true">
                <img src="/images/email_vector2.svg" alt="" />
              </span>
              <span className="apc-choice__text">
                <span className="apc-choice__title">Email unavailable?</span>
                <span className="apc-choice__sub">Reset {maskedEmail}</span>
              </span>
            </span>
            <span className="apc-choice__radio" aria-hidden="true" />
          </button>

          <button
            type="button"
            className={`apc-primary ${isResetConfirmEnabled ? "is-enabled" : ""}`}
            disabled={!isResetConfirmEnabled}
            onClick={() => setStep("bind")}
          >
            Confirm
          </button>
        </section>
      ) : (
        <section className="apc-card" aria-label="Bind new email">
          <h1 id="apc-title" className="apc-page__title">
            Bind New Email
          </h1>

          <div className="apc-field">
            <label className="apc-label">Email</label>
            <input
              className="apc-input"
              placeholder="Enter the new email address"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>

          <div className="apc-field">
            <label className="apc-label">Email Verification Code</label>
            <div className="apc-inputRow">
              <input
                className="apc-input apc-input--row"
                placeholder="Enter Verification Code"
                inputMode="numeric"
                value={newEmailCode}
                onChange={(e) => setNewEmailCode(e.target.value.replace(/\D/g, ""))}
              />
              <button
                type="button"
                className="apc-send"
                disabled={!isEmailValid || sendOtpMutation.isPending || countdown > 0}
                onClick={() => sendOtpMutation.mutate()}
              >
                {sendOtpMutation.isPending ? "Sending…" : countdown > 0 ? `${countdown}s` : "Send"}
              </button>
            </div>
            <div className="apc-hint">Valid for 10 minutes</div>
          </div>

          <button
            type="button"
            className={`apc-primary ${isBindNextEnabled ? "is-enabled" : ""}`}
            disabled={!isBindNextEnabled}
            onClick={() => navigate("/user_profile/security")}
          >
            Next
          </button>
        </section>
      )}
    </main>
  );
};

export default AntiPhishing;
