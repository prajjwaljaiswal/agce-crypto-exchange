import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "../../../../../providers/AuthProvider.js";
import { authApi } from "../../../../../lib/auth-api.js";
import { formatApiError } from "../../../../../lib/errors.js";
import "./setFundPassword.css";

function maskEmail(email?: string) {
  if (!email || !email.includes("@")) return email ?? "";
  const [u, d] = email.split("@");
  if (u.length <= 2) return `${u[0]}***@${d}`;
  return `${u[0]}***${u.slice(-1)}@${d}`;
}

const RESEND_COOLDOWN = 60;

type Mode = "set" | "change" | "remove";

const SetFundPassword = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const isFundPasswordSet = Boolean(user?.isFundPasswordSet);
  const identifier = user?.email ?? user?.phone ?? "";
  const maskedEmail = maskEmail(user?.email);

  const [mode, setMode] = useState<Mode>(isFundPasswordSet ? "change" : "set");

  // shared OTP field
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // set mode
  const [fundPassword, setFundPassword] = useState("");
  const [showFundPwd, setShowFundPwd] = useState(false);

  // change mode
  const [currentFundPassword, setCurrentFundPassword] = useState("");
  const [newFundPassword, setNewFundPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // remove mode
  const [removeFundPassword, setRemoveFundPassword] = useState("");
  const [showRemovePwd, setShowRemovePwd] = useState(false);

  const resetFields = () => {
    setOtp("");
    setFundPassword("");
    setCurrentFundPassword("");
    setNewFundPassword("");
    setRemoveFundPassword("");
    setCountdown(0);
    if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null; }
  };

  const switchMode = (m: Mode) => { resetFields(); setMode(m); };

  const startCooldown = () => {
    setCountdown(RESEND_COOLDOWN);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(countdownRef.current!); countdownRef.current = null; return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const sendOtpMutation = useMutation({
    mutationFn: () => authApi.sendOtp({ identifier, type: "FUND_PASSWORD" }),
    onSuccess: () => { toast.success("Verification code sent to your email."); startCooldown(); },
    onError: (error) => toast.error(formatApiError(error, "Failed to send verification code.")),
  });

  const onSuccess = (verb: string) => {
    queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    toast.success(`Fund password ${verb} successfully.`);
    navigate("/user_profile/security");
  };

  const setMutation = useMutation({
    mutationFn: () => authApi.setFundPassword({ identifier, otp, fundPassword }),
    onSuccess: () => onSuccess("set"),
    onError: (error) => toast.error(formatApiError(error, "Failed to set fund password.")),
  });

  const changeMutation = useMutation({
    mutationFn: () => authApi.changeFundPassword({ identifier, otp, currentFundPassword, newFundPassword }),
    onSuccess: () => onSuccess("changed"),
    onError: (error) => toast.error(formatApiError(error, "Failed to change fund password.")),
  });

  const removeMutation = useMutation({
    mutationFn: () => authApi.removeFundPassword({ identifier, otp, fundPassword: removeFundPassword }),
    onSuccess: () => onSuccess("removed"),
    onError: (error) => toast.error(formatApiError(error, "Failed to remove fund password.")),
  });

  const isSetEnabled = fundPassword.trim().length > 0 && otp.length >= 4;
  const isChangeEnabled = currentFundPassword.trim().length > 0 && newFundPassword.trim().length > 0 && otp.length >= 4;
  const isRemoveEnabled = removeFundPassword.trim().length > 0 && otp.length >= 4;

  const isPending = setMutation.isPending || changeMutation.isPending || removeMutation.isPending;

  const breadcrumbLabel =
    mode === "set" ? "Set Fund Password" :
    mode === "change" ? "Change Fund Password" :
    "Remove Fund Password";

  return (
    <main className="sfp-page" aria-labelledby="sfp-title">
      <nav className="sfp-page__crumbs" aria-label="Breadcrumb">
        <ol className="sfp-page__crumbList">
          <li className="sfp-page__crumbItem">
            <button type="button" className="sfp-page__crumbLink" onClick={() => navigate("/user_profile/security")}>
              Security
            </button>
          </li>
          <li className="sfp-page__crumbSep" aria-hidden="true">›</li>
          <li className="sfp-page__crumbItem sfp-page__crumbItem--active" aria-current="page">
            {breadcrumbLabel}
          </li>
        </ol>
      </nav>

      <div className="set_fundform_outer">
        <h1 id="sfp-title" className="sfp-page__title">{breadcrumbLabel}</h1>

        {/* Mode tabs when fund password is already set */}
        {isFundPasswordSet && (
          <div className="sfp-tabs">
            <button
              type="button"
              className={`sfp-tab ${mode === "change" ? "is-active" : ""}`}
              onClick={() => switchMode("change")}
            >
              Change
            </button>
            <button
              type="button"
              className={`sfp-tab sfp-tab--danger ${mode === "remove" ? "is-active" : ""}`}
              onClick={() => switchMode("remove")}
            >
              Remove
            </button>
          </div>
        )}

        {/* ── Set ── */}
        {mode === "set" && (
          <form className="sfp-form" onSubmit={(e) => { e.preventDefault(); if (isSetEnabled && !isPending) setMutation.mutate(); }}>
            <div className="sfp-field">
              <label className="sfp-label" htmlFor="sfp-fund-pwd">Fund Password</label>
              <div className="sfp-inputWrap">
                <input
                  id="sfp-fund-pwd"
                  className="sfp-input"
                  type={showFundPwd ? "text" : "password"}
                  placeholder="Please Enter"
                  value={fundPassword}
                  onChange={(e) => setFundPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button type="button" className="sfp-togglePw" onClick={() => setShowFundPwd((v) => !v)}>
                  <i className={showFundPwd ? "ri-eye-line" : "ri-eye-off-line"} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="sfp-field">
              <label className="sfp-label" htmlFor="sfp-otp-set">Email Verification Code</label>
              <div className="sfp-inputWrap">
                <input
                  id="sfp-otp-set"
                  className="sfp-input sfp-input--code"
                  placeholder="Please Enter"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                />
                <button type="button" className="sfp-send" disabled={sendOtpMutation.isPending || countdown > 0} onClick={() => sendOtpMutation.mutate()}>
                  {sendOtpMutation.isPending ? "Sending…" : countdown > 0 ? `${countdown}s` : "Send"}
                </button>
              </div>
              <p className="sfp-hint">Code sent to {maskedEmail}. Valid for 10 minutes.</p>
            </div>

            <button type="submit" className={`sfp-confirm ${isSetEnabled ? "is-enabled" : ""}`} disabled={!isSetEnabled || isPending}>
              {setMutation.isPending ? "Saving…" : "Confirm"}
            </button>
          </form>
        )}

        {/* ── Change ── */}
        {mode === "change" && (
          <form className="sfp-form" onSubmit={(e) => { e.preventDefault(); if (isChangeEnabled && !isPending) changeMutation.mutate(); }}>
            <div className="sfp-field">
              <label className="sfp-label" htmlFor="sfp-current-pwd">Current Fund Password</label>
              <div className="sfp-inputWrap">
                <input
                  id="sfp-current-pwd"
                  className="sfp-input"
                  type={showCurrent ? "text" : "password"}
                  placeholder="Please Enter"
                  value={currentFundPassword}
                  onChange={(e) => setCurrentFundPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button type="button" className="sfp-togglePw" onClick={() => setShowCurrent((v) => !v)}>
                  <i className={showCurrent ? "ri-eye-line" : "ri-eye-off-line"} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="sfp-field">
              <label className="sfp-label" htmlFor="sfp-new-pwd">New Fund Password</label>
              <div className="sfp-inputWrap">
                <input
                  id="sfp-new-pwd"
                  className="sfp-input"
                  type={showNew ? "text" : "password"}
                  placeholder="Please Enter"
                  value={newFundPassword}
                  onChange={(e) => setNewFundPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button type="button" className="sfp-togglePw" onClick={() => setShowNew((v) => !v)}>
                  <i className={showNew ? "ri-eye-line" : "ri-eye-off-line"} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="sfp-field">
              <label className="sfp-label" htmlFor="sfp-otp-change">Email Verification Code</label>
              <div className="sfp-inputWrap">
                <input
                  id="sfp-otp-change"
                  className="sfp-input sfp-input--code"
                  placeholder="Please Enter"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                />
                <button type="button" className="sfp-send" disabled={sendOtpMutation.isPending || countdown > 0} onClick={() => sendOtpMutation.mutate()}>
                  {sendOtpMutation.isPending ? "Sending…" : countdown > 0 ? `${countdown}s` : "Send"}
                </button>
              </div>
              <p className="sfp-hint">Code sent to {maskedEmail}. Valid for 10 minutes.</p>
            </div>

            <button type="submit" className={`sfp-confirm ${isChangeEnabled ? "is-enabled" : ""}`} disabled={!isChangeEnabled || isPending}>
              {changeMutation.isPending ? "Saving…" : "Confirm"}
            </button>
          </form>
        )}

        {/* ── Remove ── */}
        {mode === "remove" && (
          <form className="sfp-form" onSubmit={(e) => { e.preventDefault(); if (isRemoveEnabled && !isPending) removeMutation.mutate(); }}>
            <div className="sfp-field">
              <label className="sfp-label" htmlFor="sfp-remove-pwd">Current Fund Password</label>
              <div className="sfp-inputWrap">
                <input
                  id="sfp-remove-pwd"
                  className="sfp-input"
                  type={showRemovePwd ? "text" : "password"}
                  placeholder="Please Enter"
                  value={removeFundPassword}
                  onChange={(e) => setRemoveFundPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button type="button" className="sfp-togglePw" onClick={() => setShowRemovePwd((v) => !v)}>
                  <i className={showRemovePwd ? "ri-eye-line" : "ri-eye-off-line"} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="sfp-field">
              <label className="sfp-label" htmlFor="sfp-otp-remove">Email Verification Code</label>
              <div className="sfp-inputWrap">
                <input
                  id="sfp-otp-remove"
                  className="sfp-input sfp-input--code"
                  placeholder="Please Enter"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                />
                <button type="button" className="sfp-send" disabled={sendOtpMutation.isPending || countdown > 0} onClick={() => sendOtpMutation.mutate()}>
                  {sendOtpMutation.isPending ? "Sending…" : countdown > 0 ? `${countdown}s` : "Send"}
                </button>
              </div>
              <p className="sfp-hint">Code sent to {maskedEmail}. Valid for 10 minutes.</p>
            </div>

            <button
              type="submit"
              className={`sfp-confirm sfp-confirm--danger ${isRemoveEnabled ? "is-enabled" : ""}`}
              disabled={!isRemoveEnabled || isPending}
            >
              {removeMutation.isPending ? "Removing…" : "Remove Fund Password"}
            </button>
          </form>
        )}

        <button type="button" className="sfp-unable">
          Unable to verify?
        </button>
      </div>
    </main>
  );
};

export default SetFundPassword;
