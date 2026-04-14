const LEVELS = [
  'KYC Level',
  'Crypto Deposit',
  'Crypto Withdrawal',
  'Crypto Swap',
  'Spot/Futures Trading',
  'Platform Events',
]

export function AccountBenefits() {
  return (
    <div className="account_benifits">
      <h5>Account Benefits</h5>

      <div className="row">
        <div className="col-sm-4">
          <h6>Level</h6>
          <ul className="kyclist">
            {LEVELS.map((level) => (
              <li key={level}>
                <img src="/images/staricon.png" alt="star" /> {level}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-sm-4">
          <h6>Unverified</h6>
          <ul className="kyclist">
            <li>Unlimited</li>
            <li>1 BTC per day</li>
            <li>
              <img src="/images/closebtn2.svg" alt="unavailable" />
            </li>
            <li>
              <img src="/images/closebtn2.svg" alt="unavailable" />
            </li>
            <li>
              <img src="/images/closebtn2.svg" alt="unavailable" />
            </li>
            <li>
              <img src="/images/rightbtn2.svg" alt="available" />
            </li>
          </ul>
        </div>

        <div className="col-sm-4">
          <h6>Advanced KYC</h6>
          <ul className="kyclist">
            <li>Unlimited</li>
            <li>100 BTC per day*</li>
            <li>30,000 USD per day*</li>
            <li>
              <img src="/images/rightbtn2.svg" alt="available" />
            </li>
            <li>
              <img src="/images/rightbtn2.svg" alt="available" />
            </li>
            <li>
              <img src="/images/rightbtn2.svg" alt="available" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
