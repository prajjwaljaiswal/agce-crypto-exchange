import { useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
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
import { useAuth } from '../../../providers/index.js'
import { authApi } from '../../../lib/auth-api.js'
import { formatApiError } from '../../../lib/errors.js'

export function WithdrawPage() {
  const { user } = useAuth()
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

  const showError = (msg: string) => alert(msg)
  const showSuccess = (msg: string) => alert(msg)

  const identifier = user?.identifier ?? null

  const sendOtpMutation = useMutation({
    mutationFn: (id: string) => authApi.sendOtp({ identifier: id, type: 'WITHDRAWAL' }),
    onSuccess: () => showSuccess('Verification code sent.'),
    onError: (error) => showError(formatApiError(error, 'Could not send code.')),
  })

  const verifyOtpMutation = useMutation({
    mutationFn: (id: string) =>
      authApi.verifyOtp({ identifier: id, otp, purpose: 'WITHDRAWAL' }),
    onSuccess: () => {
      // TODO(phase-4): the auth-service only verifies the OTP. The actual
      // withdrawal-execution endpoint lives in a separate wallet/withdrawal
      // service that isn't in the AGCE Auth Service Postman collection. Wire
      // that call here once the backend ships it.
      showSuccess(
        'Code verified. (Withdrawal execution endpoint is not yet available — no funds were moved.)',
      )
      setOtp('')
    },
    onError: (error) => showError(formatApiError(error, 'Invalid verification code.')),
  })

  const handleRequestOtp = () => {
    if (!identifier) {
      showError('You need to be signed in to request a withdrawal code.')
      return
    }
    sendOtpMutation.mutate(identifier)
  }

  const handleSubmit = () => {
    if (!identifier) {
      showError('You need to be signed in to withdraw.')
      return
    }
    if (otp.replace(/\D/g, '').length < 6) {
      showError('Please enter the 6-digit verification code.')
      return
    }
    verifyOtpMutation.mutate(identifier)
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
            disabled={verifyOtpMutation.isPending}
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
