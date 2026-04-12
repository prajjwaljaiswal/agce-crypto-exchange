import { useState } from 'react'
import { AlertCircle, ChevronDown } from 'lucide-react'

interface CryptoOption {
  symbol: string
  name: string
  balance: number
}

interface NetworkOption {
  id: string
  label: string
  fee: number
  minWithdraw: number
}

const CRYPTOS: CryptoOption[] = [
  { symbol: 'BTC', name: 'Bitcoin', balance: 0.4923 },
  { symbol: 'ETH', name: 'Ethereum', balance: 4.6523 },
  { symbol: 'USDT', name: 'Tether', balance: 1334.56 },
  { symbol: 'BNB', name: 'BNB', balance: 12.33 },
]

const NETWORKS: Record<string, NetworkOption[]> = {
  BTC: [{ id: 'BTC', label: 'Bitcoin Network', fee: 0.00005, minWithdraw: 0.001 }],
  ETH: [
    { id: 'ERC20', label: 'ERC20 (Ethereum)', fee: 0.005, minWithdraw: 0.01 },
    { id: 'ARB', label: 'Arbitrum One', fee: 0.0005, minWithdraw: 0.01 },
  ],
  USDT: [
    { id: 'TRC20', label: 'TRC20 (Tron)', fee: 1, minWithdraw: 10 },
    { id: 'ERC20', label: 'ERC20 (Ethereum)', fee: 10, minWithdraw: 20 },
    { id: 'BEP20', label: 'BEP20 (BSC)', fee: 0.5, minWithdraw: 10 },
  ],
  BNB: [{ id: 'BEP20', label: 'BEP20 (BSC)', fee: 0.001, minWithdraw: 0.01 }],
}

export function WithdrawPage() {
  const [selectedCrypto, setSelectedCrypto] = useState('')
  const [selectedNetwork, setSelectedNetwork] = useState('')
  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState('')

  const cryptoData = CRYPTOS.find((c) => c.symbol === selectedCrypto)
  const networks = selectedCrypto ? NETWORKS[selectedCrypto] ?? [] : []
  const networkData = networks.find((n) => n.id === selectedNetwork)

  const numAmount = parseFloat(amount) || 0
  const receive = networkData ? Math.max(0, numAmount - networkData.fee) : 0
  const isValid =
    selectedCrypto &&
    selectedNetwork &&
    address.trim().length > 10 &&
    numAmount > 0 &&
    networkData &&
    numAmount >= networkData.minWithdraw &&
    cryptoData &&
    numAmount <= cryptoData.balance

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold text-[var(--color-text)]">Withdraw Crypto</h1>

      <div
        className="rounded-xl p-6 border border-[var(--color-border)] space-y-5"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        {/* Select Crypto */}
        <div>
          <label className="block text-sm text-[var(--color-text-muted)] mb-1.5">Cryptocurrency</label>
          <div className="relative">
            <select
              value={selectedCrypto}
              onChange={(e) => {
                setSelectedCrypto(e.target.value)
                setSelectedNetwork('')
                setAmount('')
              }}
              className="w-full rounded-lg px-4 py-3 pr-9 text-sm border border-[var(--color-border)] bg-transparent outline-none focus:border-[var(--color-primary)] appearance-none"
              style={{ color: selectedCrypto ? 'var(--color-text)' : 'var(--color-text-muted)' }}
            >
              <option value="" style={{ backgroundColor: 'var(--color-surface)' }}>Select coin</option>
              {CRYPTOS.map((c) => (
                <option key={c.symbol} value={c.symbol} style={{ backgroundColor: 'var(--color-surface)' }}>
                  {c.symbol} — {c.name} (Balance: {c.balance})
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]" />
          </div>
        </div>

        {/* Select Network */}
        {selectedCrypto && (
          <div>
            <label className="block text-sm text-[var(--color-text-muted)] mb-1.5">Network</label>
            <div className="relative">
              <select
                value={selectedNetwork}
                onChange={(e) => setSelectedNetwork(e.target.value)}
                className="w-full rounded-lg px-4 py-3 pr-9 text-sm border border-[var(--color-border)] bg-transparent outline-none focus:border-[var(--color-primary)] appearance-none"
                style={{ color: selectedNetwork ? 'var(--color-text)' : 'var(--color-text-muted)' }}
              >
                <option value="" style={{ backgroundColor: 'var(--color-surface)' }}>Select network</option>
                {networks.map((n) => (
                  <option key={n.id} value={n.id} style={{ backgroundColor: 'var(--color-surface)' }}>
                    {n.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]" />
            </div>
          </div>
        )}

        {/* Withdrawal Address */}
        <div>
          <label className="block text-sm text-[var(--color-text-muted)] mb-1.5">Withdrawal Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter recipient wallet address"
            className="w-full rounded-lg px-4 py-3 text-sm text-[var(--color-text)] border border-[var(--color-border)] bg-transparent outline-none focus:border-[var(--color-primary)] font-mono"
          />
        </div>

        {/* Amount */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm text-[var(--color-text-muted)]">Amount</label>
            {cryptoData && (
              <span className="text-xs text-[var(--color-text-muted)]">
                Available: <span className="text-[var(--color-text)]">{cryptoData.balance} {selectedCrypto}</span>
              </span>
            )}
          </div>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              className="w-full rounded-lg px-4 py-3 pr-20 text-sm text-[var(--color-text)] border border-[var(--color-border)] bg-transparent outline-none focus:border-[var(--color-primary)]"
            />
            <button
              onClick={() => cryptoData && setAmount(cryptoData.balance.toString())}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold px-2 py-1 rounded"
              style={{ color: 'var(--color-primary)', backgroundColor: 'var(--color-surface-2)' }}
            >
              MAX
            </button>
          </div>
        </div>

        {/* Fee & Receive Summary */}
        {networkData && numAmount > 0 && (
          <div
            className="rounded-lg p-4 border border-[var(--color-border)] space-y-2.5"
            style={{ backgroundColor: 'var(--color-surface-2)' }}
          >
            {[
              { label: 'Network Fee', value: `${networkData.fee} ${selectedCrypto}` },
              { label: 'Minimum Withdrawal', value: `${networkData.minWithdraw} ${selectedCrypto}` },
              { label: 'You Will Receive', value: `${receive > 0 ? receive.toFixed(6) : '0'} ${selectedCrypto}`, highlight: true },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-text-muted)]">{row.label}</span>
                <span
                  className="text-sm font-medium"
                  style={{ color: row.highlight ? 'var(--color-primary)' : 'var(--color-text)' }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Warning */}
        <div
          className="flex items-start gap-3 rounded-lg p-4 border border-yellow-600/30"
          style={{ backgroundColor: '#d1aa6711' }}
        >
          <AlertCircle size={16} className="shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }} />
          <p className="text-xs text-[var(--color-text-muted)]">
            Ensure you are withdrawing to the correct address on the correct network. Withdrawals sent to the
            wrong address or network cannot be recovered.
          </p>
        </div>

        {/* Submit */}
        <button
          disabled={!isValid}
          className="w-full rounded-lg py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          Withdraw
        </button>
      </div>
    </div>
  )
}
