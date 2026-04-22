import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../../providers/AuthProvider.js";
import { maskEmailForDisplay } from "../../../lib/maskEmail.js";
import { SecurityBreadcrumb } from "../components/SecurityBreadcrumb.js";
import { OtpVerifyModal } from "../components/OtpVerifyModal.js";
import "./disableAccount.css";

const IMPACT_INTRO = "Please be aware of the following impacts on your account once it is disabled:";

const IMPACT_ITEMS = [
  "Any pending withdrawal requests will be canceled.",
  "All trading features on your account will be disabled.",
  "All API keys linked to your account will be removed.",
  "Your identity verification details will be retained and not deleted.",
];

const DisableAccount = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const maskedEmail = useMemo(
    () => maskEmailForDisplay(user?.email),
    [user?.email]
  );

  const [emailVerifyOpen, setEmailVerifyOpen] = useState(false);

  const goSecurity = () => navigate("/user_profile/security");

  return (
    <main className="da-page" aria-labelledby="da-title">
      <SecurityBreadcrumb label="Disable Account" />

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

      {emailVerifyOpen && (
        <OtpVerifyModal
          onClose={() => setEmailVerifyOpen(false)}
          description={`Enter the 6-digit verification code sent to ${maskedEmail}`}
          onSubmit={() => {
            setEmailVerifyOpen(false);
            goSecurity();
          }}
        />
      )}
    </main>
  );
};

export default DisableAccount;
