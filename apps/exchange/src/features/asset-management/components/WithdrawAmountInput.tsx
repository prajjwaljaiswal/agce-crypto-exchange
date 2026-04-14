interface WithdrawAmountInputProps {
  amount: string
  coin: string
  availableBalance: string
  withdrawalFee: string
  maximumWithdrawal: string
  onAmountChange: (value: string) => void
  onMax: () => void
}

export function WithdrawAmountInput({
  amount,
  coin,
  availableBalance,
  withdrawalFee,
  maximumWithdrawal,
  onAmountChange,
  onMax,
}: WithdrawAmountInputProps) {
  return (
    <div className="select_network_s select-option">
      <h2>Withdraw amount</h2>

      <div className="withdraw_input">
        <input
          type="text"
          placeholder="Minimal 10"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
        />
        <div className="amount_sysmble">
          {coin}{' '}
          <span
            className="max"
            role="button"
            tabIndex={0}
            onClick={onMax}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onMax()
              }
            }}
          >
            MAX
          </span>
        </div>
      </div>

      <div className="d-flex items-center top_space opt_cnt" />

      <div className="withdraw_amount_cnt">
        <div className="d-flex items-center justify-content-between top_space">
          <div className="typography-body3">Available Balance</div>
          <p>
            <strong>
              {availableBalance} {coin}
            </strong>
          </p>
        </div>
        <div className="d-flex items-center justify-content-between top_space">
          <div className="typography-body3">Withdrawal Fee</div>
          <p>
            <strong>
              {withdrawalFee} {coin}
            </strong>
          </p>
        </div>
        <div className="d-flex items-center justify-content-between top_space">
          <div className="typography-body3">Maximum Withdrawal</div>
          <p>
            <strong>
              {maximumWithdrawal} {coin}
            </strong>
          </p>
        </div>
      </div>
    </div>
  )
}
