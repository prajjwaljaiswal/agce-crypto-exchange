import { useMemo, useState } from 'react'
import { SAMPLE_WITHDRAW_ADDRESS } from '../constants.js'
import { WithdrawCoinSelect } from '../components/WithdrawCoinSelect.js'
import { WithdrawNetworkSelect } from '../components/WithdrawNetworkSelect.js'
import { WithdrawAmountInput } from '../components/WithdrawAmountInput.js'
import { WithdrawOtpInput } from '../components/WithdrawOtpInput.js'
import { WithdrawSummaryBar } from '../components/WithdrawSummaryBar.js'
import { WithdrawFaq } from '../components/WithdrawFaq.js'
import { RecentWithdrawals } from '../components/RecentWithdrawals.js'

const AVAILABLE_BALANCE = 1250
const WITHDRAWAL_FEE = 0.5
const MAX_WITHDRAWAL = 1000000

export function WithdrawPage() {
  const [selectedCoin] = useState('USDT')
  const [selectedNetwork] = useState('ERC20')
  const [address, setAddress] = useState(SAMPLE_WITHDRAW_ADDRESS)
  const [amount, setAmount] = useState('100')
  const [otp, setOtp] = useState('')

  const receiveAmount = useMemo(() => {
    const parsed = Number(amount)
    if (!Number.isFinite(parsed) || parsed <= 0) return '0'
    const received = parsed - WITHDRAWAL_FEE
    return received > 0 ? received.toString() : '0'
  }, [amount])

  const handleMax = () => {
    setAmount(String(Math.min(AVAILABLE_BALANCE, MAX_WITHDRAWAL)))
  }

  const handleRequestOtp = () => {
    // TODO: wire to backend OTP endpoint
  }

  const handleSubmit = () => {
    // TODO: wire to backend withdrawal endpoint
  }

  return (
    <div className="dashboard_right">
      <div className="deposit_crypto_block_coin">
        <div className="deposit_crypto_left withdrawal_outer">
          <WithdrawCoinSelect selectedCoin={selectedCoin} />

          <WithdrawNetworkSelect
            selectedNetwork={selectedNetwork}
            address={address}
            onAddressChange={setAddress}
          />

          <WithdrawAmountInput
            amount={amount}
            coin={selectedCoin}
            availableBalance={AVAILABLE_BALANCE.toString()}
            withdrawalFee={WITHDRAWAL_FEE.toString()}
            maximumWithdrawal={MAX_WITHDRAWAL.toString()}
            onAmountChange={setAmount}
            onMax={handleMax}
          />

          <WithdrawOtpInput
            otp={otp}
            onOtpChange={setOtp}
            onRequest={handleRequestOtp}
          />

          <WithdrawSummaryBar
            receiveAmount={receiveAmount}
            networkFee={WITHDRAWAL_FEE.toString()}
            coin={selectedCoin}
            onSubmit={handleSubmit}
          />
        </div>

        <div className="deposit_crypto_right">
          <WithdrawFaq />
        </div>
      </div>

      <RecentWithdrawals />
    </div>
  )
}
