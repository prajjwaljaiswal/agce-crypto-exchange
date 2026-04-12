import { useState } from 'react'

export const COIN_NAMES: Record<string, string> = {
  BTC: 'Bitcoin', ETH: 'Ethereum', BNB: 'Binance', SOL: 'Solana', XRP: 'Ripple',
  DOGE: 'Dogecoin', ADA: 'Cardano', AVAX: 'Avalanche', DOT: 'Polkadot', MATIC: 'Polygon',
  SHIB: 'Shiba Inu', LTC: 'Litecoin', TRX: 'TRON', LINK: 'Chainlink', UNI: 'Uniswap',
  PEPE: 'Pepe', FLOKI: 'FLOKI', TURBO: 'Turbo', USDC: 'USD Coin', TST: 'TEST',
  APT: 'Aptos', ARB: 'Arbitrum', OP: 'Optimism', NEAR: 'NEAR', FIL: 'Filecoin',
  ATOM: 'Cosmos', ICP: 'Internet Computer', IMX: 'Immutable', SAND: 'Sandbox', MANA: 'Decentraland',
}

export const COIN_COLORS: Record<string, string> = {
  BTC: '#f7931a', ETH: '#627eea', BNB: '#f0b90b', SOL: '#9945ff', XRP: '#00aae4',
  DOGE: '#c2a633', ADA: '#0033ad', AVAX: '#e84142', DOT: '#e6007a', MATIC: '#8247e5',
  SHIB: '#ffa409', LTC: '#bfbbbb', TRX: '#ff0013', LINK: '#2a5ada', UNI: '#ff007a',
  PEPE: '#00b84d', FLOKI: '#d4640a', TURBO: '#4ecdc4', USDC: '#2775ca', TST: '#6c757d',
  APT: '#4de8c5', ARB: '#28a0f0', OP: '#ff0420', NEAR: '#00c08b', FIL: '#0090ff',
  ATOM: '#2e3148', ICP: '#29abe2', SAND: '#00adef', MANA: '#ff2d55', SUI: '#4da2ff', SEI: '#9b1422',
}

export const COINGECKO_IDS: Record<string, string> = {
  BTC: 'bitcoin', ETH: 'ethereum', BNB: 'binancecoin', SOL: 'solana', XRP: 'ripple',
  DOGE: 'dogecoin', ADA: 'cardano', AVAX: 'avalanche-2', DOT: 'polkadot', MATIC: 'matic-network',
  SHIB: 'shiba-inu', LTC: 'litecoin', TRX: 'tron', LINK: 'chainlink', UNI: 'uniswap',
  PEPE: 'pepe', USDC: 'usd-coin', APT: 'aptos', ARB: 'arbitrum', OP: 'optimism',
  NEAR: 'near', FIL: 'filecoin', ATOM: 'cosmos', ICP: 'internet-computer', IMX: 'immutable-x',
  SAND: 'the-sandbox', MANA: 'decentraland', BCH: 'bitcoin-cash', TON: 'the-open-network',
  SUI: 'sui', AAVE: 'aave', INJ: 'injective-protocol', FET: 'fetch-ai', TAO: 'bittensor',
  HBAR: 'hedera-hashgraph', ETC: 'ethereum-classic', ALGO: 'algorand', AXS: 'axie-infinity',
  XLM: 'stellar', FTM: 'fantom', VET: 'vechain', GRT: 'the-graph', CRV: 'curve-dao-token',
  COMP: 'compound-governance-token', MKR: 'maker', SNX: 'havven', CAKE: 'pancakeswap-token',
  JUP: 'jupiter-exchange-solana', WLD: 'worldcoin-wld', SEI: 'sei-network', TIA: 'celestia',
  RENDER: 'render-token',
}

export const QUOTE_TABS = ['USDT', 'BTC', 'BNB', 'ETH'] as const

/** Get coin icon path — falls back to colored circle */
export function coinIconPath(symbol: string): string {
  return `/images/coins/${symbol.toLowerCase()}.svg`
}

export function CoinIcon({ symbol, size = 24 }: { symbol: string; size?: number }) {
  const [err, setErr] = useState(false)
  const color = COIN_COLORS[symbol] ?? '#888'
  if (err) {
    return (
      <div className="rounded-full flex items-center justify-center font-bold shrink-0" style={{ width: size, height: size, background: color + '22', color, fontSize: size * 0.4 }}>
        {symbol[0]}
      </div>
    )
  }
  return <img src={coinIconPath(symbol)} alt={symbol} className="rounded-full object-contain shrink-0" style={{ width: size, height: size }} onError={() => setErr(true)} />
}
