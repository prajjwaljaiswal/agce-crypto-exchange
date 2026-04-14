import { useEffect } from 'react'
import './home.css'
import { Hero } from './components/Hero.js'
import { PromoBanners } from './components/PromoBanners.js'
import { TrendingCrypto } from './components/TrendingCrypto.js'
import { TradeAnywhere } from './components/TradeAnywhere.js'
import { FeatureHub } from './components/FeatureHub.js'
import { TradingProducts } from './components/TradingProducts.js'
import { TrustFeatures } from './components/TrustFeatures.js'

export function LandingPage() {
  useEffect(() => {
    document.title = 'Join AGCE Today – Trade Crypto + Get Exclusive Rewards'
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Hero />
      <PromoBanners />
      <TrendingCrypto />
      <TradeAnywhere />
      <FeatureHub />
      <TradingProducts />
      <TrustFeatures />
    </>
  )
}
