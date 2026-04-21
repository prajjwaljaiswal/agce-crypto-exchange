import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useEstimatedBalance } from '../hooks/useEstimatedBalance.js'

function formatAmount(raw: string | undefined, maxDecimals = 8): string {
  if (!raw) return '0'
  const n = Number(raw)
  if (!Number.isFinite(n)) return '0'
  const abs = Math.abs(n)
  const decimals = abs >= 1 ? Math.min(maxDecimals, 4) : maxDecimals
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  })
}

export function WalletSnapshot() {
  const { data, isLoading, error } = useEstimatedBalance()
  const [hidden, setHidden] = useState(false)

  const total = formatAmount(data?.totalValue)
  const currency = data?.preferredCurrency ?? 'USDT'

  const displayValue = isLoading
    ? '—'
    : error
      ? 'Unavailable'
      : hidden
        ? '••••••'
        : `${total} ${currency}`

  return (
    <div className="wallet_snapshot_bl">
      <div className="wallet_snapshot_bl_left">
        <span>WALLET SNAPSHOT</span>
        <p className="copycode">
          {displayValue}
          <i
            className={hidden ? 'ri-eye-line' : 'ri-eye-off-line'}
            role="button"
            tabIndex={0}
            onClick={() => setHidden((v) => !v)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setHidden((v) => !v)
            }}
            style={{ cursor: 'pointer' }}
            aria-label={hidden ? 'Show balance' : 'Hide balance'}
          />
        </p>
      </div>

      <div className="wallet_snapshot_bl_right d-flex gap-4 align-items-center">
        <Link to="/asset_management/withdraw">
          <button type="button" className="withdraw_btn">
            <i className="ri-arrow-right-up-line" />
            Withdraw
          </button>
        </Link>
        <Link to="/asset_management/deposit">
          <button type="button" className="">
            <i className="ri-arrow-right-down-line" />
            Deposit
          </button>
        </Link>
      </div>
    </div>
  )
}
