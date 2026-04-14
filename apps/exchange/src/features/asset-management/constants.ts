export interface DepositNetwork {
  code: string
  name: string
  eta: string
  minDeposit: string
}

export interface DepositCoin {
  code: string
  name: string
  icon: string
  balance: string
  usdValue: string
}

export const SAMPLE_DEPOSIT_ADDRESS = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
export const SAMPLE_MEMO = '103845762'

export const DEPOSIT_NETWORK_OPTIONS: DepositNetwork[] = [
  { code: 'ERC20', name: 'Ethereum (ETH)', eta: '≈ 3 min', minDeposit: '1' },
  { code: 'BEP20', name: 'BNB Smart Chain(bsc)', eta: '≈ 3 min', minDeposit: '0.1' },
  { code: 'TRC20', name: 'Tron(trx)', eta: '≈ 1 min', minDeposit: '1' },
  { code: 'PLASMA', name: 'Plasma (plasma)', eta: '≈ 1 min', minDeposit: '—' },
  {
    code: 'TON',
    name: 'TON (The Open Network) with Memo(ton)',
    eta: '≈ 3 min',
    minDeposit: '0.1',
  },
]

export const DEPOSIT_COIN_OPTIONS: DepositCoin[] = [
  {
    code: 'USDT',
    name: 'TetherUS',
    icon: '/images/tether_icon.png',
    balance: '12.65387893',
    usdValue: '≈ $12.66',
  },
  {
    code: 'BTC',
    name: 'Bitcoin',
    icon: '/images/bitcoin_icon.png',
    balance: '12.65387893',
    usdValue: '≈ $12.66',
  },
  {
    code: 'ETH',
    name: 'Ethereum',
    icon: '/images/eth_currency_img.png',
    balance: '12.65387893',
    usdValue: '≈ $12.66',
  },
  {
    code: 'BNB',
    name: 'BNB',
    icon: '/images/AnnouncementImg/bnb_icon.svg',
    balance: '12.65387893',
    usdValue: '≈ $12.66',
  },
]

export const DEPOSIT_HISTORY_COLUMNS = [
  'Date',
  'Network',
  'Address',
  'TxID',
  'Deposit Wallet',
  'Action',
] as const

export interface WithdrawNetwork {
  code: string
  range: string
  eta: string
}

export const WITHDRAW_NETWORK_OPTIONS: WithdrawNetwork[] = [
  { code: 'ERC20', range: '10 - 1000000 USDT', eta: '≈ 2 mins' },
  { code: 'BEP20', range: '10 - 500000 USDT', eta: '≈ 2 mins' },
]

export const SAMPLE_WITHDRAW_ADDRESS =
  '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
export const SAMPLE_WITHDRAW_TX_HASH =
  '0x3e8f9a4b7c12d5e8f6a9b3c7d4e1f2a8b6c9d7e5f4a3b2c1d9e8f7a6b5c4d3e2'

export interface WithdrawalRecord {
  id: string
  amount: string
  coin: string
  status: string
  date: string
  network: string
  address: string
  txHash: string
  icon: string
  timeline: { label: string; at: string }[]
}

export const RECENT_WITHDRAWALS: WithdrawalRecord[] = [
  {
    id: 'wd-001',
    amount: '250',
    coin: 'USDT',
    status: 'COMPLETED',
    date: '08-04-2026  02:30 PM',
    network: 'ERC20',
    address: SAMPLE_WITHDRAW_ADDRESS,
    txHash: SAMPLE_WITHDRAW_TX_HASH,
    icon: '/images/tether_icon.png',
    timeline: [
      { label: 'Withdrawal order submitted', at: '08-04-2026  02:30 PM' },
      { label: 'System processing', at: '08-04-2026  02:31 PM' },
      { label: 'COMPLETED', at: '08-04-2026  02:45 PM' },
    ],
  },
]

export function shortenHash(value: string, head = 6, tail = 6): string {
  if (!value || value.length <= head + tail) return value
  return `${value.slice(0, head)}...${value.slice(-tail)}`
}
