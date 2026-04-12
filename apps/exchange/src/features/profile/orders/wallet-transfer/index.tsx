import { ArrowRight } from 'lucide-react'

type WalletType = 'Spot' | 'Futures' | 'P2P' | 'Earning'

interface WalletTransfer {
  id: string
  date: string
  fromWallet: WalletType
  toWallet: WalletType
  currency: string
  amount: number
}

const MOCK_TRANSFERS: WalletTransfer[] = [
  { id: 'WT-001', date: '2026-04-11 12:00:00', fromWallet: 'Spot', toWallet: 'Futures', currency: 'USDT', amount: 500 },
  { id: 'WT-002', date: '2026-04-10 17:30:00', fromWallet: 'Futures', toWallet: 'Spot', currency: 'USDT', amount: 200 },
  { id: 'WT-003', date: '2026-04-10 09:15:00', fromWallet: 'Spot', toWallet: 'Earning', currency: 'BNB', amount: 5 },
  { id: 'WT-004', date: '2026-04-09 14:00:00', fromWallet: 'Spot', toWallet: 'P2P', currency: 'USDT', amount: 1000 },
  { id: 'WT-005', date: '2026-04-08 11:45:00', fromWallet: 'Earning', toWallet: 'Spot', currency: 'ETH', amount: 0.5 },
  { id: 'WT-006', date: '2026-04-07 08:20:00', fromWallet: 'P2P', toWallet: 'Spot', currency: 'USDT', amount: 750 },
]

const WALLET_COLORS: Record<WalletType, string> = {
  Spot: '#3b82f6',
  Futures: '#f59e0b',
  P2P: '#8b5cf6',
  Earning: 'var(--color-green)',
}

function WalletBadge({ wallet }: { wallet: WalletType }) {
  return (
    <span
      className="rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: `${WALLET_COLORS[wallet]}22`, color: WALLET_COLORS[wallet] }}
    >
      {wallet}
    </span>
  )
}

export function WalletTransferHistoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[var(--color-text)]">Wallet Transfer History</h1>

      <div
        className="rounded-xl border border-[var(--color-border)] overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface-2)' }}>
                {['Date', 'From Wallet', '', 'To Wallet', 'Currency', 'Amount'].map((h, i) => (
                  <th key={i} className="px-5 py-3.5 text-left font-medium text-[var(--color-text-muted)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {MOCK_TRANSFERS.map((t) => (
                <tr key={t.id} className="hover:bg-[var(--color-surface-2)] transition-colors">
                  <td className="px-5 py-4 text-[var(--color-text-muted)] whitespace-nowrap">{t.date}</td>
                  <td className="px-5 py-4"><WalletBadge wallet={t.fromWallet} /></td>
                  <td className="px-3 py-4">
                    <ArrowRight size={14} className="text-[var(--color-text-muted)]" />
                  </td>
                  <td className="px-5 py-4"><WalletBadge wallet={t.toWallet} /></td>
                  <td className="px-5 py-4 font-medium text-[var(--color-text)]">{t.currency}</td>
                  <td className="px-5 py-4 font-medium text-[var(--color-text)]">{t.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
