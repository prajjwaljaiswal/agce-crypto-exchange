import { Hero } from '../components/home/Hero.js'
import { PromoBanners } from '../components/home/PromoBanners.js'
import { TrendingCrypto } from '../components/home/TrendingCrypto.js'
import { TradeAnywhere } from '../components/home/TradeAnywhere.js'
import { PlatformFeatures } from '../components/home/PlatformFeatures.js'
import { TradingProducts } from '../components/home/TradingProducts.js'
import { TrustFeatures } from '../components/home/TrustFeatures.js'
import { HowItWorks } from '../components/home/HowItWorks.js'

export function HomePage() {
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
