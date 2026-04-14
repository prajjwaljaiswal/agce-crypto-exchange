interface WithdrawOtpInputProps {
  otp: string
  onOtpChange: (value: string) => void
  onRequest: () => void
}

export function WithdrawOtpInput({ otp, onOtpChange, onRequest }: WithdrawOtpInputProps) {
  return (
    <div className="select_network_s">
      <h2>OTP Verification</h2>
      <div className="withdraw_input">
        <input
          type="text"
          placeholder="Get Code"
          value={otp}
          onChange={(e) => onOtpChange(e.target.value)}
        />
        <div
          className="amount_sysmble get_otp2"
          role="button"
          tabIndex={0}
          onClick={onRequest}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onRequest()
            }
          }}
        >
          GET OTP
        </div>
      </div>
    </div>
  )
}
