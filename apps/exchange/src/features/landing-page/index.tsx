import { Hero } from './components/Hero.js'
import { PromoBanners } from './components/PromoBanners.js'
import { TrendingCrypto } from './components/TrendingCrypto.js'
import { TradeAnywhere } from './components/TradeAnywhere.js'
import { PlatformFeatures } from './components/PlatformFeatures.js'
import { TradingProducts } from './components/TradingProducts.js'
import { TrustFeatures } from './components/TrustFeatures.js'
import { HowItWorks } from './components/HowItWorks.js'

export function LandingPage() {
  return (
    <>
      <Hero />
      <PromoBanners />
      <TrendingCrypto />
      <TradeAnywhere />
      <PlatformFeatures />
      <TradingProducts />
      <TrustFeatures />
      <HowItWorks />
    </>
  )
}
