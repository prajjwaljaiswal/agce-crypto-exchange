import { useState } from 'react'
import { Copy, QrCode, AlertCircle, ChevronDown, Check } from 'lucide-react'

interface CryptoOption {
  symbol: string
  name: string
}

interface NetworkOption {
  id: string
  label: string
  confirmations: number
  minDeposit: number
  arrivalTime: string
}

const CRYPTOS: CryptoOption[] = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'USDT', name: 'Tether' },
  { symbol: 'BNB', name: 'BNB' },
  { symbol: 'SOL', name: 'Solana' },
]

const NETWORKS: Record<string, NetworkOption[]> = {
  BTC: [{ id: 'BTC', label: 'Bitcoin Network', confirmations: 1, minDeposit: 0.0001, arrivalTime: '~10 min' }],
  ETH: [
    { id: 'ERC20', label: 'ERC20 (Ethereum)', confirmations: 12, minDeposit: 0.001, arrivalTime: '~2 min' },
    { id: 'ARB', label: 'Arbitrum One', confirmations: 15, minDeposit: 0.001, arrivalTime: '~1 min' },
  ],
  USDT: [
    { id: 'TRC20', label: 'TRC20 (Tron)', confirmations: 20, minDeposit: 1, arrivalTime: '~1 min' },
    { id: 'ERC20', label: 'ERC20 (Ethereum)', confirmations: 12, minDeposit: 1, arrivalTime: '~2 min' },
    { id: 'BEP20', label: 'BEP20 (BSC)', confirmations: 15, minDeposit: 1, arrivalTime: '~1 min' },
  ],
  BNB: [{ id: 'BEP20', label: 'BEP20 (BSC)', confirmations: 15, minDeposit: 0.01, arrivalTime: '~1 min' }],
  SOL: [{ id: 'SOL', label: 'Solana Network', confirmations: 32, minDeposit: 0.01, arrivalTime: '~30 sec' }],
}

const MOCK_ADDRESSES: Record<string, string> = {
  BTC_BTC: '1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf3N',
  ETH_ERC20: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  ETH_ARB: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  USDT_TRC20: 'TKVHbh5N8B7sGMYSjDHrQrCT4sNKqpjzFD',
  USDT_ERC20: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  USDT_BEP20: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  BNB_BEP20: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  SOL_SOL: '7nRkFbPNAqNjKTunwGEe6dC5huxJFiEjbx8wn1n1Gykg',
}

export function DepositPage() {
  const [selectedCrypto, setSelectedCrypto] = useState<string>('')
  const [selectedNetwork, setSelectedNetwork] = useState<string>('')
  const [copied, setCopied] = useState(false)

  const networks = selectedCrypto ? NETWORKS[selectedCrypto] ?? [] : []
  const addressKey = `${selectedCrypto}_${selectedNetwork}`
  const address = MOCK_ADDRESSES[addressKey] ?? ''

  function handleCopy() {
    if (!address) return
    navigator.clipboard.writeText(address).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const network = networks.find((n) => n.id === selectedNetwork)

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold text-[var(--color-text)]">Deposit Crypto</h1>

      <div
        className="rounded-xl p-6 border border-[var(--color-border)] space-y-5"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        {/* Select Crypto */}
        <div>
          <label className="block text-sm text-[var(--color-text-muted)] mb-1.5">Select Cryptocurrency</label>
          <div className="relative">
            <select
              value={selectedCrypto}
              onChange={(e) => {
                setSelectedCrypto(e.target.value)
                setSelectedNetwork('')
              }}
              className="w-full rounded-lg px-4 py-3 pr-9 text-sm border border-[var(--color-border)] bg-transparent outline-none focus:border-[var(--color-primary)] appearance-none"
              style={{ color: selectedCrypto ? 'var(--color-text)' : 'var(--color-text-muted)' }}
            >
              <option value="" style={{ backgroundColor: 'var(--color-surface)' }}>Select coin to deposit</option>
              {CRYPTOS.map((c) => (
                <option key={c.symbol} value={c.symbol} style={{ backgroundColor: 'var(--color-surface)' }}>
                  {c.symbol} — {c.name}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]" />
          </div>
        </div>

        {/* Select Network */}
        {selectedCrypto && (
          <div>
            <label className="block text-sm text-[var(--color-text-muted)] mb-1.5">Select Network</label>
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

        {/* Deposit Address */}
        {address && (
          <>
            {/* QR Code Placeholder */}
            <div className="flex flex-col items-center gap-4 py-2">
              <div
                className="w-40 h-40 rounded-xl flex flex-col items-center justify-center border border-[var(--color-border)] gap-2"
                style={{ backgroundColor: 'var(--color-surface-2)' }}
              >
                <QrCode size={56} className="text-[var(--color-text-muted)]" />
                <span className="text-xs text-[var(--color-text-muted)]">QR Code</span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] text-center max-w-xs">
                Scan the QR code with your wallet app to get the deposit address.
              </p>
            </div>

            {/* Address Display */}
            <div>
              <label className="block text-sm text-[var(--color-text-muted)] mb-1.5">Deposit Address</label>
              <div
                className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] p-3"
                style={{ backgroundColor: 'var(--color-surface-2)' }}
              >
                <p className="flex-1 text-sm text-[var(--color-text)] break-all font-mono">{address}</p>
                <button
                  onClick={handleCopy}
                  className="shrink-0 rounded-lg p-2 transition-colors hover:bg-[var(--color-border)]"
                  title="Copy address"
                >
                  {copied ? (
                    <Check size={16} style={{ color: 'var(--color-green)' }} />
                  ) : (
                    <Copy size={16} className="text-[var(--color-text-muted)]" />
                  )}
                </button>
              </div>
            </div>

            {/* Network Info */}
            {network && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Min. Deposit', value: `${network.minDeposit} ${selectedCrypto}` },
                  { label: 'Confirmations', value: network.confirmations.toString() },
                  { label: 'Arrival Time', value: network.arrivalTime },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg p-3 text-center border border-[var(--color-border)]"
                    style={{ backgroundColor: 'var(--color-surface-2)' }}
                  >
                    <p className="text-xs text-[var(--color-text-muted)]">{item.label}</p>
                    <p className="text-sm font-medium text-[var(--color-text)] mt-0.5">{item.value}</p>
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
                Only send <strong className="text-[var(--color-text)]">{selectedCrypto}</strong> to this address on the{' '}
                <strong className="text-[var(--color-text)]">{network?.label}</strong> network. Sending the wrong
                coin or using the wrong network will result in permanent loss of funds.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
