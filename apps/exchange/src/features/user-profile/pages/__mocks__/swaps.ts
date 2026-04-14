export interface MockSwap {
  id: number
  date: string
  pair: string
  pay: string
  get: string
  fee: string
  rate: string
  status: 'SUCCESS' | 'PENDING' | 'FAILED'
}

export const MOCK_RECENT_SWAPS: MockSwap[] = [
  {
    id: 1,
    date: '2026-04-14 11:20:44',
    pair: 'USDT → BTC',
    pay: '1000.00 USDT',
    get: '0.01487 BTC',
    fee: '1.00 USDT',
    rate: '1 BTC = 67250.12 USDT',
    status: 'SUCCESS',
  },
  {
    id: 2,
    date: '2026-04-13 08:44:12',
    pair: 'USDT → ETH',
    pay: '500.00 USDT',
    get: '0.1449 ETH',
    fee: '0.50 USDT',
    rate: '1 ETH = 3450.45 USDT',
    status: 'SUCCESS',
  },
]
