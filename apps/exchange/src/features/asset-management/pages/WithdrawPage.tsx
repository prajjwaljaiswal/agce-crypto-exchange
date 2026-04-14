import { useMemo, useState } from 'react'
import { SAMPLE_WITHDRAW_ADDRESS } from '../constants.js'
import { WithdrawCoinSelect } from '../components/WithdrawCoinSelect.js'
import { WithdrawNetworkSelect } from '../components/WithdrawNetworkSelect.js'
import { WithdrawAmountInput } from '../components/WithdrawAmountInput.js'
import { WithdrawOtpInput } from '../components/WithdrawOtpInput.js'
import { WithdrawSummaryBar } from '../components/WithdrawSummaryBar.js'
import { WithdrawFaq } from '../components/WithdrawFaq.js'
import { RecentWithdrawals } from '../components/RecentWithdrawals.js'
import {
  MOCK_AVAILABLE_BALANCE,
  MOCK_WITHDRAWAL_FEE,
  MOCK_MAX_WITHDRAWAL,
} from '../__mocks__/withdraw.js'

export function WithdrawPage() {
  const [selectedCoin] = useState('USDT')
  const [selectedNetwork] = useState('ERC20')
  const [address, setAddress] = useState(SAMPLE_WITHDRAW_ADDRESS)
  const [amount, setAmount] = useState('100')
  const [otp, setOtp] = useState('')

  const receiveAmount = useMemo(() => {
    const parsed = Number(amount)
    if (!Number.isFinite(parsed) || parsed <= 0) return '0'
    const received = parsed - MOCK_WITHDRAWAL_FEE
    return received > 0 ? received.toString() : '0'
  }, [amount])

  const handleMax = () => {
    setAmount(String(Math.min(MOCK_AVAILABLE_BALANCE, MOCK_MAX_WITHDRAWAL)))
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
            availableBalance={MOCK_AVAILABLE_BALANCE.toString()}
            withdrawalFee={MOCK_WITHDRAWAL_FEE.toString()}
            maximumWithdrawal={MOCK_MAX_WITHDRAWAL.toString()}
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
            networkFee={MOCK_WITHDRAWAL_FEE.toString()}
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
