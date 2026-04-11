import { Hero } from '../components/home/Hero.js'
import { Stats } from '../components/home/Stats.js'
import { ProductsGrid } from '../components/home/ProductsGrid.js'
import { TrustBadges } from '../components/home/TrustBadges.js'
import { CTA } from '../components/home/CTA.js'

export function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <ProductsGrid />
      <TrustBadges />
      <CTA />
    </>
  )
}
