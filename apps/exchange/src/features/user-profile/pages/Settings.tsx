export function Settings() {
  return (
    <div className="dashboard_right">
      <div className="twofactor_outer_s">
        <h5>Profile</h5>
        <p>To protect your account, we recommend that you enable at least one 2FA</p>
        <div className="two_factor_list">
          <div className="factor_bl active">
            <div className="lftcnt">
              <h6><img src="/images/lock_icon.svg" alt="Authenticator App" /> Name & Avatar</h6>
              <p>Update your name and avatar to personalize your profile. Save changes to keep your account up to date.</p>
              <input
                type="file"
                id="avatarFileInput"
                accept="image/png,image/jpeg,image/jpg"
                style={{ display: "none" }}
              />
            </div>

            <div className="enable">
              <img src="/images/user.png" alt="user" />
              Demo User
            </div>
            <button type="button" className="btn" data-bs-toggle="modal" data-bs-target="#profilepop">Change</button>
          </div>
        </div>
      </div>

      <div className="twofactor_outer_s">
        <h5>Currency Preference</h5>
        <p>Select your preferred display currency for all markets</p>

        <div className="two_factor_list">
          <div className="currency_list_b">
            <ul>
              <li className="active">
                <div className="currency_bit"><img src="/images/icon/tether.png" className="img-fluid" alt="Tether" /></div>
                <h6>Tether USD (USDT)</h6>
                <div className="vector_bottom">
                  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="52" viewBox="0 0 60 52" fill="none">
                    <path d="M59.6296 0L60 52H0L59.6296 0Z" fill="#3B3B3B"></path>
                  </svg>
                </div>
              </li>
              <li className="">
                <div className="currency_bit"><img src="/images/icon/btc copy.png" className="img-fluid" alt="BTC" width="50px" /></div>
                <h6>BTC</h6>
                <div className="vector_bottom">
                  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="52" viewBox="0 0 60 52" fill="none">
                    <path d="M59.6296 0L60 52H0L59.6296 0Z" fill="#3B3B3B"></path>
                  </svg>
                </div>
              </li>
              <li className="">
                <div className="currency_bit"><img src="/images/icon/bnb copy.png" className="img-fluid" alt="BNB" /></div>
                <h6>BNB</h6>
                <div className="vector_bottom">
                  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="52" viewBox="0 0 60 52" fill="none">
                    <path d="M59.6296 0L60 52H0L59.6296 0Z" fill="#3B3B3B"></path>
                  </svg>
                </div>
              </li>
            </ul>
            <div className="savebtn">
              <button type="button">Save Currency Preference</button>
            </div>
          </div>
        </div>
      </div>

      <div className="twofactor_outer_s">
        <h5>Security Settings</h5>
        <p>Manage your account security and password settings</p>

        <div className="two_factor_list">
          <div className="factor_bl active">
            <div className="lftcnt">
              <h6><img src="/images/lock_icon.svg" alt="Login Password" /> Login Password</h6>
              <p>Change your account password. You will need to verify with OTP sent to your registered email.</p>
            </div>

            <button type="button" className="btn" data-bs-toggle="modal" data-bs-target="#security_verification">
              Change Password
            </button>
          </div>

          <div className="factor_bl active">
            <div className="lftcnt">
              <h6><i className="ri-shield-check-line anti-phishing-icon-spaced"></i>Anti-phishing Code</h6>
              <p>Set a unique 5-8 digit code that will appear in legitimate emails and notifications. This helps you identify real communications from phishing attempts.</p>
            </div>
            <button type="button" className="btn" data-bs-toggle="modal" data-bs-target="#antiPhishingInfoModal">
              <i className="ri-add-line anti-phishing-icon-tight"></i>Set Code
            </button>
          </div>
        </div>
      </div>

      <div className="modal fade search_form" id="antiPhishingInfoModal" tabIndex={-1} aria-hidden="true" data-bs-backdrop="static">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="ri-shield-check-line anti-phishing-icon-spaced"></i>
                Anti-Phishing Code
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form className="profile_form">
                <div className="anti-phishing-info-content">
                  <section className="anti-phishing-section">
                    <h6 className="anti-phishing-heading"><i className="ri-information-line anti-phishing-icon-spaced"></i>What is an anti-phishing code?</h6>
                    <p className="anti-phishing-paragraph">
                      An anti-phishing code is a personalised identifier that enhances your account security. Once successfully set, you will see this code in all official emails sent to you by our exchange. It helps you verify whether an email is genuine and protects you from scams.
                    </p>
                  </section>
                  <section className="anti-phishing-section">
                    <h6 className="anti-phishing-heading"><i className="ri-mail-check-line anti-phishing-icon-spaced"></i>How to Identify Phishing Emails Effectively?</h6>
                    <p className="anti-phishing-paragraph">
                      You can create a custom anti-phishing code unique to you. This code will appear in all emails sent to you by our exchange. If you receive an email without your anti-phishing code, or the displayed code is different from the one you set, be cautious, as the email may be a phishing attempt impersonating our exchange.
                    </p>
                  </section>
                  <section className="anti-phishing-section anti-phishing-section-last">
                    <h6 className="anti-phishing-heading"><i className="ri-alert-line anti-phishing-icon-spaced"></i>Reminder:</h6>
                    <p className="anti-phishing-paragraph">
                      After successfully setting your code, all official emails sent to your secure email address by our exchange will include this security identifier. Always compare the anti-phishing code in the email with the one you set to verify its authenticity. The anti-phishing code is a personal security identifier. Keep it safe and never share it with anyone, including our exchange staff.
                    </p>
                  </section>
                </div>
                <button
                  type="button"
                  className="submit"
                  data-bs-dismiss="modal"
                  data-bs-toggle="modal"
                  data-bs-target="#antiPhishingSetCodeModal"
                >
                  <i className="ri-arrow-right-line anti-phishing-icon-tight"></i>Get Started
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade search_form" id="antiPhishingSetCodeModal" tabIndex={-1} aria-hidden="true" data-bs-backdrop="static">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title"><i className="ri-shield-keyhole-line anti-phishing-icon-spaced"></i>Set the Code</h5>
              <p>We&apos;ll send a verification code to de***o@example.com</p>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="anti-phishing-info-content anti-phishing-info-block">
                <section className="anti-phishing-warning-section">
                  <div className="anti-phishing-warning-box">
                    <p className="anti-phishing-warning-text">
                      <i className="ri-error-warning-line anti-phishing-warning-icon"></i>
                      Please do not reveal your password or Google/SMS verification code to anyone, including our exchange Customer Service.
                    </p>
                  </div>
                </section>
                <section className="anti-phishing-section anti-phishing-section-no-margin">
                  <h6 className="anti-phishing-heading anti-phishing-heading-tight"><i className="ri-lock-line anti-phishing-icon-spaced"></i>Enable Anti-Phishing Code</h6>
                  <p className="anti-phishing-paragraph">
                    Please enter 5 to 8 digits. Do not use commonly used passwords.
                  </p>
                </section>
              </div>
              <form className="profile_form">
                <div className="emailinput">
                  <label>Anti-phishing Code (5-8 digits)</label>
                  <input type="text" placeholder="Enter your code" maxLength={8} defaultValue="" />
                </div>
                <div className="emailinput">
                  <label>Verification Code</label>
                  <div className="d-flex">
                    <input type="text" placeholder="Enter 6-digit code" maxLength={6} defaultValue="" />
                    <button type="button" className="getotp otp-button-enabled getotp_mobile">GET OTP</button>
                  </div>
                </div>
                <div>
                  <p className="small anti-phishing-muted-text">We&apos;ll send a verification code to de***o@example.com</p>
                  <div className="cursor-pointer">
                    <small className="text-white">Switch to Another Verification Option <i className="ri-external-link-line"></i></small>
                  </div>
                </div>
                <button type="button" className="submit">
                  <i className="ri-check-line anti-phishing-icon-tight"></i>Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade search_form" id="antiPhishingVerifyOptionsModal" tabIndex={-1} aria-hidden="true" data-bs-backdrop="static">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title"><i className="ri-fingerprint-2-line anti-phishing-icon-spaced"></i>Select a Verification Option</h5>
              <p>Choose how you want to verify your identity</p>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form className="profile_form">
                <div>
                  <div className="d-flex align-items-center justify-content-between text-white" role="button">
                    <div className="d-flex align-items-center">
                      <i className="ri-mail-line me-3"></i>
                      <div>
                        <strong>Email</strong>
                        <p className="mb-0 small">Send code to de***o@example.com</p>
                      </div>
                    </div>
                    <i className="ri-arrow-right-s-line"></i>
                  </div>
                </div>
                <div>
                  <div className="d-flex align-items-center justify-content-between text-white" role="button">
                    <div className="d-flex align-items-center">
                      <i className="ri-shield-keyhole-line me-3"></i>
                      <div>
                        <strong>Google Authenticator</strong>
                        <p className="mb-0 small">Use your authenticator app</p>
                      </div>
                    </div>
                    <i className="ri-arrow-right-s-line"></i>
                  </div>
                </div>
                <div>
                  <div className="d-flex align-items-center justify-content-between text-white" role="button">
                    <div className="d-flex align-items-center">
                      <i className="ri-smartphone-line me-3"></i>
                      <div>
                        <strong>Mobile</strong>
                        <p className="mb-0 small">Send code to ****3210</p>
                      </div>
                    </div>
                    <i className="ri-arrow-right-s-line"></i>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade search_form" id="antiPhishingRemoveModal" tabIndex={-1} aria-hidden="true" data-bs-backdrop="static">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title"><i className="ri-shield-cross-line anti-phishing-icon-spaced"></i>Remove Anti-phishing Code</h5>
              <p>Verify your identity to remove the anti-phishing code</p>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="anti-phishing-info-content anti-phishing-info-block">
                <section className="anti-phishing-warning-section">
                  <h6 className="anti-phishing-heading anti-phishing-heading-tight"><i className="ri-information-line anti-phishing-icon-spaced"></i>What happens when you remove?</h6>
                  <p className="anti-phishing-paragraph">
                    Once removed, your anti-phishing code will no longer appear in official emails sent to you by our exchange. You will lose this additional layer of protection that helps you verify authentic communications and identify phishing attempts.
                  </p>
                </section>
                <section className="anti-phishing-section anti-phishing-section-no-margin">
                  <h6 className="anti-phishing-heading anti-phishing-heading-tight"><i className="ri-alert-line anti-phishing-icon-spaced"></i>Reminder:</h6>
                  <p className="anti-phishing-paragraph">
                    You can set a new anti-phishing code anytime from Security Settings. We recommend keeping this feature enabled to protect your account from phishing scams.
                  </p>
                </section>
              </div>
              <form className="profile_form">
                <p className="small anti-phishing-muted-text anti-phishing-remove-desc">We&apos;ll send a verification code to de***o@example.com</p>
                <div className="emailinput">
                  <label>Verification Code</label>
                  <div className="d-flex">
                    <input type="text" placeholder="Enter 6-digit code" maxLength={6} defaultValue="" />
                    <button type="button" className="getotp otp-button-enabled getotp_mobile">GET OTP</button>
                  </div>
                </div>
                <div className="cursor-pointer anti-phishing-switch-option">
                  <small className="text-white">Switch to Another Verification Option <i className="ri-external-link-line"></i></small>
                </div>
                <button type="button" className="submit anti-phishing-danger-submit">
                  <i className="ri-delete-bin-line anti-phishing-icon-tight"></i>Remove
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade search_form" id="antiPhishingRemoveVerifyOptionsModal" tabIndex={-1} aria-hidden="true" data-bs-backdrop="static">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title"><i className="ri-fingerprint-2-line anti-phishing-icon-spaced"></i>Select a Verification Option</h5>
              <p>Choose how you want to verify your identity</p>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form className="profile_form">
                <div>
                  <div className="d-flex align-items-center justify-content-between text-white" role="button">
                    <div className="d-flex align-items-center">
                      <i className="ri-mail-line me-3"></i>
                      <div>
                        <strong>Email</strong>
                        <p className="mb-0 small">Send code to de***o@example.com</p>
                      </div>
                    </div>
                    <i className="ri-arrow-right-s-line"></i>
                  </div>
                </div>
                <div>
                  <div className="d-flex align-items-center justify-content-between text-white" role="button">
                    <div className="d-flex align-items-center">
                      <i className="ri-shield-keyhole-line me-3"></i>
                      <div>
                        <strong>Google Authenticator</strong>
                        <p className="mb-0 small">Use your authenticator app</p>
                      </div>
                    </div>
                    <i className="ri-arrow-right-s-line"></i>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade search_form" id="editAvatarModal" tabIndex={-1} aria-labelledby="editAvatarModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editAvatarModalLabel">Preview Avatar</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body avatar-modal-body">
              <p className="text-center mb-3">Review your new avatar before applying</p>
              <div className="avatar-preview-wrapper">
                <div className="avatar-preview-container">
                  <img
                    className="profileimg avatar-preview-img"
                    src="/images/user.png"
                    alt="Avatar Preview"
                  />
                </div>
              </div>

              <div className="avatar-modal-actions" style={{ marginTop: "20px" }}>
                <button type="button" className="btn-cancel-avatar" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="button" className="btn-apply-avatar">
                  Apply Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade search_form" id="security_verification" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static">
        <div className="modal-dialog modal-dialog-centered ">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Enter Email Verification Code</h5>
              <p>We&apos;ll send a verification code to dem***@example.com</p>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form className="profile_form">
                <div className="emailinput">
                  <label>Enter 6-digit Code</label>
                  <div className="d-flex">
                    <input type="text" placeholder="Enter code here..." maxLength={6} defaultValue="" />
                    <button type="button" className="getotp otp-button-enabled getotp_mobile">GET OTP</button>
                  </div>
                </div>

                <div className="cursor-pointer">
                  <small className="text-white">Switch to Another Verification Option<i className="ri-external-link-line"></i></small>
                </div>

                <div className="emailinput">
                  <label>New Password</label>
                  <div className="d-flex">
                    <input type="password" placeholder="Enter new password" autoComplete="new-password" defaultValue="" />
                    <div className="password-eye-btn"><i className="ri-eye-close-line"></i></div>
                  </div>
                </div>
                <div className="error_text">
                  <span>8-30 characters</span>
                  <span>At least one uppercase, lowercase, and number.</span>
                  <span>Does not contain any spaces.</span>
                </div>
                <div className="emailinput">
                  <label>Confirm Password</label>
                  <div className="d-flex">
                    <input type="password" placeholder="Confirm new password" autoComplete="new-password" defaultValue="" />
                    <div className="password-eye-btn"><i className="ri-eye-close-line"></i></div>
                  </div>
                </div>

                <button type="button" className="submit">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade search_form" id="passwordVerificationOptionsModal" tabIndex={-1} aria-hidden="true" data-bs-backdrop="static">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Select a Verification Option</h5>
              <p>Choose how you want to verify your identity</p>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form className="profile_form">
                <div className="">
                  <div className="d-flex align-items-center justify-content-between text-white" role="button">
                    <div className="d-flex align-items-center">
                      <i className="ri-mail-line me-3"></i>
                      <div>
                        <strong>Email</strong>
                        <p className="mb-0 small">Receive verification code via email</p>
                      </div>
                    </div>
                    <i className="ri-arrow-right-s-line"></i>
                  </div>
                </div>
                <div className="">
                  <div className="d-flex align-items-center justify-content-between text-white" role="button">
                    <div className="d-flex align-items-center">
                      <i className="ri-shield-keyhole-line me-3"></i>
                      <div>
                        <strong>Google Authenticator</strong>
                        <p className="mb-0 small">Use your Google Authenticator app</p>
                      </div>
                    </div>
                    <i className="ri-arrow-right-s-line"></i>
                  </div>
                </div>
                <div className="">
                  <div className="d-flex align-items-center justify-content-between text-white" role="button">
                    <div className="d-flex align-items-center">
                      <i className="ri-smartphone-line me-3"></i>
                      <div>
                        <strong>Mobile</strong>
                        <p className="mb-0 small">Receive verification code via SMS</p>
                      </div>
                    </div>
                    <i className="ri-arrow-right-s-line"></i>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade search_form" id="profilepop" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered ">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Edit Profile</h5>
              <p>Avatar and nickname will also be applied to your profile. Abusing them might lead to community penalties.</p>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form className="profile_form">
                <div className="user_img">
                  <img src="/images/user.png" alt="user" />
                  <label htmlFor="profileImageUpload" className="edit_user">
                    <img src="/images/edit_icon.svg" alt="edit" />
                  </label>
                  <input
                    type="file"
                    id="profileImageUpload"
                    accept="image/png,image/jpeg,image/jpg"
                    className="hidden-file-input"
                  />
                </div>

                <div className="emailinput">
                  <label>First Name</label>
                  <div className="d-flex">
                    <input type="text" placeholder="Enter first name" maxLength={50} defaultValue="Demo" />
                  </div>
                </div>

                <div className="emailinput">
                  <label>Last Name</label>
                  <div className="d-flex">
                    <input type="text" placeholder="Enter last name" maxLength={50} defaultValue="User" />
                  </div>
                </div>

                <button type="button" className="submit">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
