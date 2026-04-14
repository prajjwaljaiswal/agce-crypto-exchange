interface Benefit {
  label: string
  unverified: string
  advanced: string
}

const BENEFITS: Benefit[] = [
  { label: 'Deposit', unverified: 'Limited', advanced: 'Unlimited' },
  { label: 'Withdrawal', unverified: '2,000 USDT / day', advanced: '1,000,000 USDT / day' },
  { label: 'Fiat', unverified: '—', advanced: 'Enabled' },
  { label: 'P2P Trading', unverified: 'Disabled', advanced: 'Enabled' },
]

const FAQS = [
  {
    q: 'Why do I need to complete KYC?',
    a: 'KYC verification is required by regulators to keep the platform compliant and your funds safe.',
  },
  {
    q: 'How long does verification take?',
    a: 'Most submissions are reviewed within a few hours. Complex cases can take up to 48 hours.',
  },
  {
    q: 'Which documents are accepted?',
    a: 'Passport, national ID card, or driver\u2019s license — plus a selfie for liveness verification.',
  },
]

export function KycVerification() {
  return (
    <div className="dashboard_right">
      <div className="kyc_verif_bnr">
        <div className="kysbnr_cnt">
          <h3>Identity Verification</h3>
          <p>
            Complete KYC to unlock the full feature set — deposits, withdrawals,
            fiat, and P2P trading.
          </p>
          <ul>
            <li>Government-issued ID</li>
            <li>Proof of address</li>
            <li>Live selfie check</li>
          </ul>
          <button type="button" className="btn btn-deposit px-4">
            Start Verification
          </button>
        </div>
      </div>

      <div className="account_benifits row mt-4">
        <div className="col-md-4">
          <h5>Feature</h5>
        </div>
        <div className="col-md-4">
          <h5>Unverified</h5>
        </div>
        <div className="col-md-4">
          <h5>Advanced KYC</h5>
        </div>
        {BENEFITS.map((b) => (
          <div className="row py-2" key={b.label}>
            <div className="col-md-4">{b.label}</div>
            <div className="col-md-4">{b.unverified}</div>
            <div className="col-md-4 text-success">{b.advanced}</div>
          </div>
        ))}
      </div>

      <div className="faq_section mt-5">
        <h4>Frequently asked questions</h4>
        {FAQS.map((f, i) => (
          <div className="faq_item" key={i}>
            <div className="faq_question">{f.q}</div>
            <div className="faq_answer">{f.a}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
