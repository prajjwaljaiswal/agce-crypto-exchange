interface WithdrawSummaryBarProps {
  receiveAmount: string
  networkFee: string
  coin: string
  disabled?: boolean
  onSubmit: () => void
}

export function WithdrawSummaryBar({
  receiveAmount,
  networkFee,
  coin,
  disabled,
  onSubmit,
}: WithdrawSummaryBarProps) {
  return (
    <div className="total_amount">
      <div className="amount_cnt_l">
        <div className="price_tag_top">Receive amount</div>
        <div className="price_tag">
          {receiveAmount} {coin}
        </div>
        <div className="net_fee_t">
          Network Fee {networkFee} {coin}
        </div>
      </div>
      <div className="withdraw_btn">
        <button type="button" onClick={onSubmit} disabled={disabled}>
          Withdraw
        </button>
      </div>
    </div>
  )
}
