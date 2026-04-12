import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface FAQItem {
  q: string
  a: string
}

interface FAQSection {
  category: string
  items: FAQItem[]
}

const faqData: FAQSection[] = [
  {
    category: 'Getting Started',
    items: [
      {
        q: 'How do I create an account on AGCE?',
        a: 'Click "Sign Up" on the homepage, enter your email address and create a secure password. You will receive a verification email — click the link to activate your account. From there, complete your profile and optionally complete KYC to unlock full features.',
      },
      {
        q: 'What countries are supported?',
        a: 'AGCE operates across multiple jurisdictions including the UAE (Abu Dhabi & Dubai), India, and globally. Availability of features may vary by region based on local regulatory requirements.',
      },
      {
        q: 'Is AGCE regulated?',
        a: 'Yes. AGCE operates under licences from ADGM (Abu Dhabi Global Market), VARA (Virtual Assets Regulatory Authority in Dubai), and SEBI-aligned frameworks in India, ensuring full compliance with local financial regulations.',
      },
    ],
  },
  {
    category: 'Trading',
    items: [
      {
        q: 'What trading pairs are available?',
        a: 'AGCE offers 200+ spot trading pairs and a growing selection of futures pairs. You can trade major cryptocurrencies like BTC, ETH, SOL, BNB, as well as the native AGCE token.',
      },
      {
        q: 'What is the minimum trade size?',
        a: 'Minimum order sizes vary by trading pair. For most spot pairs, the minimum is $1 worth of the base currency. Futures contracts have their own minimum notional requirements shown on the trading page.',
      },
      {
        q: 'Does AGCE offer leverage trading?',
        a: 'Futures trading with leverage up to 100x is available on eligible accounts in supported jurisdictions. Leverage is not available to users in India per SEBI guidelines.',
      },
      {
        q: 'How do I place a limit order?',
        a: 'On the trading page, select "Limit" in the order type dropdown, enter your desired price and quantity, then click Buy or Sell. Your order will remain open until the market price reaches your specified level or you manually cancel it.',
      },
    ],
  },
  {
    category: 'Deposits & Withdrawals',
    items: [
      {
        q: 'How do I deposit crypto?',
        a: 'Navigate to Wallet > Deposit, select your asset and network, and copy your unique deposit address. Send funds from your external wallet to that address. Deposits are credited after the required number of network confirmations.',
      },
      {
        q: 'How long do withdrawals take?',
        a: 'Most withdrawals are processed within 30 minutes. During periods of high demand or for security reviews on large withdrawals, processing may take up to 24 hours. Network confirmation time is additional and depends on blockchain congestion.',
      },
      {
        q: 'Are there withdrawal fees?',
        a: 'Yes, withdrawal fees vary by asset and network. You can view all current fees on the Fees page. AGCE VIP users receive discounted or waived withdrawal fees depending on their tier.',
      },
    ],
  },
  {
    category: 'Security',
    items: [
      {
        q: 'How does AGCE protect my funds?',
        a: 'The majority of funds are held in cold storage (offline wallets) isolated from internet access. We employ multi-signature schemes, hardware security modules (HSMs), and regular third-party security audits.',
      },
      {
        q: 'How do I enable two-factor authentication (2FA)?',
        a: 'Go to Settings > Security and click "Enable 2FA". Scan the QR code with an authenticator app (Google Authenticator or Authy), then enter the 6-digit code to confirm. We strongly recommend enabling 2FA on all accounts.',
      },
      {
        q: 'What should I do if I suspect unauthorised account access?',
        a: 'Immediately change your password, disable any API keys, and contact our 24/7 security team at security@agce.com. Do not share your seed phrase or password with anyone — AGCE staff will never ask for these.',
      },
    ],
  },
  {
    category: 'KYC',
    items: [
      {
        q: 'Is KYC mandatory?',
        a: 'Basic account features are available without KYC. However, fiat deposits/withdrawals, higher crypto withdrawal limits, and participation in the Launchpad require KYC verification.',
      },
      {
        q: 'What documents are needed for KYC?',
        a: 'You will need a government-issued photo ID (passport or national ID card), a selfie holding the document, and proof of address (utility bill or bank statement dated within 3 months).',
      },
      {
        q: 'How long does KYC approval take?',
        a: 'Standard KYC verification is completed within 1–3 business days. Enhanced due diligence for higher-tier accounts may take up to 5 business days.',
      },
    ],
  },
]

function AccordionItem({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-[var(--color-border)] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left"
      >
        <span className={`text-sm font-medium ${open ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)]'}`}>
          {item.q}
        </span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-[var(--color-text-muted)] transition-transform ${open ? 'rotate-180 text-[var(--color-primary)]' : ''}`}
        />
      </button>
      {open && (
        <p className="pb-4 text-sm text-[var(--color-text-muted)] leading-relaxed">
          {item.a}
        </p>
      )}
    </div>
  )
}

export function FAQPage() {
  const [activeCategory, setActiveCategory] = useState(faqData[0].category)

  const activeSection = faqData.find((s) => s.category === activeCategory)

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div
        className="py-14 px-6"
        style={{
          background: 'linear-gradient(135deg, #0d0d0d 0%, #161210 100%)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm mb-4">
            <span>Home</span>
            <ChevronRight size={14} />
            <span className="text-[var(--color-primary)]">FAQ</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Frequently Asked Questions</h1>
          <p className="text-[var(--color-text-muted)] text-lg">Find answers to common questions about AGCE.</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Category sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1 sticky top-6">
              {faqData.map((section) => (
                <button
                  key={section.category}
                  onClick={() => setActiveCategory(section.category)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                    activeCategory === section.category
                      ? 'bg-[var(--color-primary)] text-black'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {section.category}
                  <ChevronRight
                    size={14}
                    className={activeCategory === section.category ? 'opacity-100' : 'opacity-40'}
                  />
                </button>
              ))}
            </nav>
          </div>

          {/* FAQ items */}
          <div className="lg:col-span-3">
            {activeSection && (
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-2">
                <h2 className="text-base font-bold text-[var(--color-text)] py-4 border-b border-[var(--color-border)]">
                  {activeSection.category}
                </h2>
                {activeSection.items.map((item, i) => (
                  <AccordionItem key={i} item={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
