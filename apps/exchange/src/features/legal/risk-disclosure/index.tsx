import { LegalLayout } from '../LegalLayout.js'

export function RiskDisclosurePage() {
  return (
    <LegalLayout
      title="Risk Disclosure"
      lastUpdated="1 January 2025"
      intro="Trading and investing in cryptocurrency and digital assets involves substantial risk. Before using the AGCE platform, you should carefully consider whether trading is appropriate for you in light of your financial situation, objectives, and risk tolerance. This Risk Disclosure Statement does not cover all risks associated with digital asset trading."
      sections={[
        {
          heading: 'Market Volatility',
          body: 'Cryptocurrency markets are highly volatile. The value of digital assets can fluctuate dramatically over short periods due to market sentiment, regulatory developments, macroeconomic factors, and other unpredictable events. You may lose all or a substantial portion of your invested capital. Past performance is not indicative of future results.',
        },
        {
          heading: 'Leverage and Liquidation Risk',
          body: 'Futures and margin trading products offered on AGCE allow users to trade with leverage, which magnifies both potential gains and potential losses. A small adverse market movement can result in the total loss of your margin and trigger forced liquidation of your position. Only trade with leverage if you fully understand the risks involved.',
        },
        {
          heading: 'Regulatory and Legal Risk',
          body: 'The regulatory environment for digital assets is evolving rapidly. Changes in laws, regulations, or government policies in any jurisdiction may adversely affect the value of digital assets, your ability to trade, or AGCE\'s ability to operate in your jurisdiction. You are responsible for ensuring that your use of the platform complies with all applicable laws.',
        },
        {
          heading: 'Technology and Cybersecurity Risk',
          body: 'Blockchain networks, smart contracts, and digital wallets are subject to technological risks including software bugs, network outages, forks, and cybersecurity attacks. Although AGCE employs industry-leading security measures, no system is completely immune to technical failure. You should take independent steps to secure your account credentials and private keys.',
        },
      ]}
    />
  )
}
