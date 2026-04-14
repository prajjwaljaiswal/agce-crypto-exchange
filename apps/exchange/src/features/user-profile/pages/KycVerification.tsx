export function KycVerification() {
  return (
    <div className="dashboard_right">
      <div className="kyc_verif_bnr_wrapper">
        <div className="profile_sections">
          <div className="row">
            <div className="col-md-12">
              <h2 className="mb-0 pb-0"> KYC Verification </h2>
            </div>
          </div>
        </div>

        <div className="kyc_verif_bnr">
          <div className="kysbnr_cnt">
            <h5>KYC</h5>
            <p>
              Finish your KYC in just a few minutes and enjoy a seamless experience. Submit your basic details once and get instant access to
              withdrawals, rewards, and every feature without any delays or limitations.
            </p>

            <h6>KYC Verification Requirements</h6>

            <ul className="kyclist">
              <li><img src="/images/staricon.png" alt="star" /> ID Document</li>
              <li><img src="/images/staricon.png" alt="star" /> Tax Document</li>
              <li><img src="/images/staricon.png" alt="star" /> Live Selfie (Camera Required)</li>
            </ul>

            <button type="button" className="kyc btn" data-bs-toggle="modal" data-bs-target="#kycModal">Verify </button>
          </div>
          <div className="kycvector">
            <img src="/images/kyc_verification_vector.svg" alt="kyc" />
          </div>
        </div>

        <div className="kyc_account d-flex">
          <div className="account_benifits">
            <h5>Account Benefits</h5>

            <div className="row">
              <div className="col-sm-4">
                <h6>Level</h6>
                <ul className="kyclist">
                  <li><img src="/images/staricon.png" alt="star" /> KYC Level</li>
                  <li><img src="/images/staricon.png" alt="star" /> Crypto Deposit</li>
                  <li><img src="/images/staricon.png" alt="star" /> Crypto Withdrawal</li>
                  <li><img src="/images/staricon.png" alt="star" /> Crypto Swap</li>
                  <li><img src="/images/staricon.png" alt="star" /> Spot/Futures Trading</li>
                  <li><img src="/images/staricon.png" alt="star" /> Platform Events</li>
                </ul>
              </div>

              <div className="col-sm-4">
                <h6>Unverified</h6>
                <ul className="kyclist">
                  <li>Unlimited</li>
                  <li>1 BTC per day</li>
                  <li><img src="/images/closebtn2.svg" alt="star" /></li>
                  <li><img src="/images/closebtn2.svg" alt="star" /></li>
                  <li><img src="/images/closebtn2.svg" alt="star" /></li>
                  <li><img src="/images/rightbtn2.svg" alt="star" /></li>
                </ul>
              </div>

              <div className="col-sm-4">
                <h6>Advanced KYC</h6>
                <ul className="kyclist">
                  <li>Unlimited</li>
                  <li>100 BTC per day*</li>
                  <li>30,000 USD per day*</li>
                  <li><img src="/images/rightbtn2.svg" alt="star" /></li>
                  <li><img src="/images/rightbtn2.svg" alt="star" /></li>
                  <li><img src="/images/rightbtn2.svg" alt="star" /></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="faq_section">
            <h4>Faq</h4>
            <div className="table-responsive">
              <div className="faq_item active">
                <button type="button" className="faq_question">
                  How long does KYC take?
                  <span className="icon"><i className="ri-arrow-down-s-line"></i></span>
                </button>
                <div className="faq_answer">
                  <p>KYC verification usually takes 24-48 hours after submission.</p>
                </div>
              </div>
              <div className="faq_item">
                <button type="button" className="faq_question">
                  What documents do I need for KYC?
                  <span className="icon"><i className="ri-arrow-down-s-line"></i></span>
                </button>
                <div className="faq_answer">
                  <p>A valid government-issued ID and tax document are required.</p>
                </div>
              </div>
              <div className="faq_item">
                <button type="button" className="faq_question">
                  Can I use the app without completing KYC?
                  <span className="icon"><i className="ri-arrow-down-s-line"></i></span>
                </button>
                <div className="faq_answer">
                  <p>Limited features are available, but full access requires KYC.</p>
                </div>
              </div>
              <div className="faq_item">
                <button type="button" className="faq_question">
                  Is my personal information secure in the KYC process?
                  <span className="icon"><i className="ri-arrow-down-s-line"></i></span>
                </button>
                <div className="faq_answer">
                  <p>Your data is encrypted and handled according to strict security standards.</p>
                </div>
              </div>
              <div className="faq_item">
                <button type="button" className="faq_question">
                  Can I resubmit my KYC if it gets rejected?
                  <span className="icon"><i className="ri-arrow-down-s-line"></i></span>
                </button>
                <div className="faq_answer">
                  <p>Yes, if your KYC is rejected or partially rejected, you can reupload the requested documents and resubmit.</p>
                </div>
              </div>
              <div className="faq_item">
                <button type="button" className="faq_question">
                  Do I need to upload both front and back of my ID?
                  <span className="icon"><i className="ri-arrow-down-s-line"></i></span>
                </button>
                <div className="faq_answer">
                  <p>Some ID documents require both front and back images. The upload fields will appear based on the selected document type.</p>
                </div>
              </div>
              <div className="faq_item">
                <button type="button" className="faq_question">
                  Is live selfie mandatory for KYC?
                  <span className="icon"><i className="ri-arrow-down-s-line"></i></span>
                </button>
                <div className="faq_answer">
                  <p>Yes, a live selfie captured through your device camera is required to complete KYC verification.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade kyc_modal" id="kycModal" tabIndex={-1} data-bs-backdrop="static">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="kycTitle">Select Country and ID Type</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              <div className="kyc_step active" data-title="Select Country and ID Type">
                <label className="label">🌟 Country/Region (Please select the issuing country of the document) <span className="text-danger">*</span></label>
                <div className="select_box">
                  <select id="kycCountry" defaultValue="IN">
                    <option value="">Select Country</option>
                    <option value="IN">🇮🇳 India</option>
                    <option value="US">🇺🇸 United States</option>
                    <option value="AE">🇦🇪 United Arab Emirates</option>
                  </select>
                </div>
                <small className="text-danger d-none" id="countryError">Please select a country</small>

                <label className="label mt-4">ID Type <span className="text-danger">*</span></label>
                <div className="id_grid">
                  <label className="id_item selected">
                    <input type="radio" name="kycIdTypeStatic" value="AADHAAR" defaultChecked />
                    Aadhaar
                  </label>
                  <label className="id_item">
                    <input type="radio" name="kycIdTypeStatic" value="PAN" />
                    PAN Card
                  </label>
                  <label className="id_item">
                    <input type="radio" name="kycIdTypeStatic" value="PASSPORT" />
                    Passport
                  </label>
                </div>
                <small className="text-danger d-none" id="idTypeError">Please select an ID type</small>

                <button type="button" className="primary_btn nextStep">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade kyc_modal" id="kycResubmitModal" tabIndex={-1} data-bs-backdrop="static">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="kycResubmitTitle">Resubmit Documents</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="kyc_step active" data-title="Resubmit Documents">
                <label className="label">The following documents were rejected and need to be uploaded again:</label>
                <div className="alert alert-danger mt-3">
                  <ul className="mb-0" style={{ listStyle: "none", paddingLeft: 0 }}>
                    <li className="mb-2">
                      <strong><i className="ri-close-circle-line me-2"></i>Aadhaar:</strong> Document image was unclear. Please upload a sharper photo.
                    </li>
                    <li className="mb-2">
                      <strong><i className="ri-close-circle-line me-2"></i>PAN Card:</strong> Name mismatch with ID document.
                    </li>
                  </ul>
                </div>
                <button type="button" className="primary_btn nextStep">Continue</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="kycSubmitModal" tabIndex={-1} aria-labelledby="kycSubmitModalLabel" aria-hidden="true" data-bs-backdrop="static">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content kyc_modal">
            <div className="modal-header">
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body text-center">
              <div className="mb-4">
                <div className="success_icon_wrapper mb-3">
                  <img src="/images/verifing_vector.png" alt="Verifying" />
                </div>
                <h4 className="mb-3">Verifying</h4>
                <p className="text-muted mb-2">
                  Hang tight, your review will be completed within the next 48 hours.
                </p>
                <p className="text-muted mb-2">
                  Continue exploring Exchange while you wait. We&apos;ll notify you once
                  verification is complete.
                </p>
              </div>
              <div className="d-flex gap-3 justify-content-center mt-4">
                <button type="button" className="primary_btn" style={{ width: "auto", padding: "10px 30px" }} data-bs-dismiss="modal">
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade search_form" id="kycVerificationModal" tabIndex={-1} aria-labelledby="kycVerificationModalLabel" aria-hidden="true" data-bs-backdrop="static">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="kycVerificationModalLabel">Enter Email Verification Code</h5>
              <p>We&apos;ll send a verification code to dem***@example.com</p>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="verify_authenticator_form">
                <form className="profile_form">
                  <div className="emailinput">
                    <label>Enter 6-digit Code</label>
                    <div className="d-flex">
                      <input type="text" placeholder="Enter code here..." maxLength={6} defaultValue="" />
                      <button type="button" className="getotp otp-button-enabled getotp_mobile">GET OTP</button>
                    </div>
                  </div>
                  <button type="button" className="submit">Verify & Submit KYC</button>
                  <div className="cursor-pointer">
                    <small className="text-white">Switch to Another Verification Option <i className="ri-external-link-line"></i></small>
                  </div>
                  <div>
                    <button type="button" className="primary_btn prevStep" style={{ width: "100%" }}>
                      Back to Review
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade search_form" id="kycVerifyOptionsModal" tabIndex={-1} aria-hidden="true" data-bs-backdrop="static">
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
                  <div className="d-flex align-items-center justify-content-between text-white cursor-pointer" role="button" style={{ padding: "15px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    <div className="d-flex align-items-center">
                      <i className="ri-mail-line me-3" style={{ fontSize: "24px" }}></i>
                      <div>
                        <strong>Email OTP</strong>
                        <p className="mb-0 small text-white">Send code to demo.user@example.com</p>
                      </div>
                    </div>
                    <i className="ri-arrow-right-s-line"></i>
                  </div>
                </div>
                <div className="">
                  <div className="d-flex align-items-center justify-content-between text-white cursor-pointer" role="button" style={{ padding: "15px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    <div className="d-flex align-items-center">
                      <i className="ri-shield-keyhole-line me-3" style={{ fontSize: "24px" }}></i>
                      <div>
                        <strong>Google Authenticator</strong>
                        <p className="mb-0 small text-white">Use your authenticator app</p>
                      </div>
                    </div>
                    <i className="ri-arrow-right-s-line"></i>
                  </div>
                </div>
                <div className="">
                  <div className="d-flex align-items-center justify-content-between text-white cursor-pointer" role="button" style={{ padding: "15px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    <div className="d-flex align-items-center">
                      <i className="ri-smartphone-line me-3" style={{ fontSize: "24px" }}></i>
                      <div>
                        <strong>Mobile OTP</strong>
                        <p className="mb-0 small text-white">Send code to +91 98765 43210</p>
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
    </div>
  )
}
