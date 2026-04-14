import type { ProfileSnapshot } from '../types.js'

interface Props {
  profile: ProfileSnapshot
}

export function WalletSnapshot({ profile }: Props) {
  return (
    <div className="wallet_snapshot_bl">
      <div className="wallet_snapshot_bl_left">
        <span>WALLET SNAPSHOT</span>
        <p className="copycode">
          {profile.walletBalanceUsd} USD {profile.walletBalanceBnb} BNB
          <i className="ri-eye-off-line" />
        </p>
      </div>

      <div className="wallet_snapshot_bl_right d-flex gap-4 align-items-center">
        <button type="button" className="withdraw_btn">
          <i className="ri-arrow-right-up-line" />
          Withdraw
        </button>
        <button type="button">
          <i className="ri-arrow-right-down-line" /> Deposit
        </button>
      </div>
    </div>
  )
}
