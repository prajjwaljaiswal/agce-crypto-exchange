import { SecurityBreadcrumb } from "../components/SecurityBreadcrumb.js";
import "./emergencyContact.css";

const EmergencyContact = () => {
  return (
    <main className="ec-page" aria-labelledby="ec-title">
      <SecurityBreadcrumb label="Emergency Contact" />

      <h1 id="ec-title" className="ec-page__title">
        Emergency Contact
      </h1>

      <div className="ec-page__art" aria-hidden="true">
        <img className="ec-page__artImg" src="/images/security/emergency_vector.svg" alt="" />
      </div>

      <p className="ec-page__body">
        At AGCE, your asset security is our highest priority. The Emergency Contact feature allows us to send email and SMS
        notifications to you or your selected contacts if your account stays inactive for a certain period. Your emergency contacts
        may also have the option to submit an inheritance request.
      </p>

      <section className="ec-how" aria-label="How emergency contact works">
        <span className="ec-how__icon" aria-hidden="true">
          <i className="ri-question-line" />
        </span>
        <div className="ec-how__text">
          <div className="ec-how__title">How Does Emergency Contact Work?</div>
          <button type="button" className="ec-how__learn">
            Learn More
          </button>
        </div>
      </section>

      <button type="button" className="ec-page__cta">
        Add Emergency Contact
      </button>
    </main>
  );
};

export default EmergencyContact;
