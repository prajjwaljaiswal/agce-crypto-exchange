import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useInstanceConfig } from '@agce/hooks'

// ─── Types ───────────────────────────────────────────────────────────────────

interface FooterLink {
  label: string
  href: string
  isNew?: boolean
}

interface FooterSection {
  key: string
  title: string
  links: FooterLink[]
}

// ─── Static data ─────────────────────────────────────────────────────────────

const FOOTER_SECTIONS: FooterSection[] = [
  {
    key: 'about',
    title: 'About',
    links: [
      { label: 'About Us',            href: '#' },
      { label: 'Careers',             href: '#' },
      { label: 'Newsroom',            href: '#' },
      { label: 'User Agreement',      href: '#' },
      { label: 'Risk Warning',        href: '#' },
      { label: 'Privacy Policy',      href: '#' },
      { label: 'Cookie Policy',       href: '#' },
      { label: 'Proof of Reserves',   href: '#' },
      { label: 'License',             href: '#' },
      { label: 'Security',            href: '#' },
    ],
  },
  {
    key: 'products',
    title: 'Products',
    links: [
      { label: 'Buy Crypto',              href: '#', isNew: true },
      { label: 'P2P',                     href: '#' },
      { label: 'Convert & Block Trading', href: '#' },
      { label: 'Spot Trading',            href: '#' },
      { label: 'Margin',                  href: '#' },
      { label: 'Earn Center',             href: '#' },
      { label: 'Futures',                 href: '#' },
      { label: 'OTC',                     href: '#' },
    ],
  },
  {
    key: 'services',
    title: 'Services',
    links: [
      { label: 'VIP Benefits',              href: '#' },
      { label: 'Institutional',             href: '#' },
      { label: 'User Feedback',             href: '#' },
      { label: 'Announcement',              href: '#' },
      { label: 'Fees',                      href: '#' },
      { label: 'Help Center',               href: '#' },
      { label: 'Submit a Request',          href: '#' },
      { label: 'Listing',                   href: '#' },
      { label: 'Developers',                href: '#' },
      { label: 'Affiliate Program',         href: '#' },
    ],
  },
  {
    key: 'learn',
    title: 'Learn',
    links: [
      { label: 'Learn',                    href: '#' },
      { label: 'Crypto Market',            href: '#' },
      { label: 'Big Data',                 href: '#' },
      { label: 'Crypto Price',             href: '#', isNew: true },
      { label: 'How to Buy Crypto',        href: '#', isNew: true },
      { label: 'Crypto Price Prediction',  href: '#', isNew: true },
      { label: 'Crypto to Fiat',           href: '#', isNew: true },
      { label: 'Crypto Encyclopedia',      href: '#' },
    ],
  },
]

const SOCIAL_LINKS = [
  { img: '/images/email_icon.svg',     label: 'Email',     href: 'mailto:support@agce.com' },
  { img: '/images/facebook.svg',       label: 'Facebook',  href: 'https://facebook.com' },
  { img: '/images/twitter.png',        label: 'Twitter',   href: 'https://twitter.com' },
  { img: '/images/telegramicon.svg',   label: 'Telegram',  href: 'https://t.me' },
  { img: '/images/instagram.svg',      label: 'Instagram', href: 'https://instagram.com' },
  { img: '/images/linkdin.svg',        label: 'LinkedIn',  href: 'https://linkedin.com' },
  { img: '/images/youtube.svg',        label: 'YouTube',   href: 'https://youtube.com' },
]

// ─── AccordionSection sub-component ──────────────────────────────────────────

function AccordionSection({
  section,
  isOpen,
  onToggle,
}: {
  section: FooterSection
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div>
      <div
        className="flex items-center justify-between mb-4 lg:cursor-default cursor-pointer"
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle() }
        }}
      >
        <h3 className="text-base font-medium" style={{ color: '#ffffff' }}>
          {section.title}
        </h3>
        <ChevronDown
          size={14}
          className={`lg:hidden transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: '#84888c' }}
        />
      </div>

      <ul className={`space-y-[17px] ${isOpen ? 'block' : 'hidden'} lg:block`}>
        {section.links.map(({ label, href }) => (
          <li key={label}>
            <a
              href={href}
              className="text-sm transition-colors hover:text-white no-underline"
              style={{ color: '#a0a3a7' }}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── Main Footer component ────────────────────────────────────────────────────

export function Footer() {
  const config = useInstanceConfig()
  const [openSection, setOpenSection] = useState<string | null>(null)

  const toggleSection = (key: string) => {
    setOpenSection((prev) => (prev === key ? null : key))
  }

  return (
    <footer style={{ backgroundColor: '#131516' }}>
      <div className="mx-auto max-w-[1400px] px-6 py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-6">

          {/* ── Brand column ── */}
          <div className="lg:col-span-2">
            {/* Tagline */}
            <p
              className="font-semibold mb-4"
              style={{ fontSize: '19px', color: '#ffffff', lineHeight: '26px' }}
            >
              Trade Crypto Anywhere<br />Anytime
            </p>

            {/* QR + download text */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className="rounded-xl overflow-hidden shrink-0"
                style={{
                  width: '116px',
                  height: '116px',
                  border: '1px solid #dfe0e2',
                  padding: '4px',
                  backgroundColor: '#ffffff',
                }}
              >
                <img
                  src="/images/scanqr_code.svg"
                  alt="QR code"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <p className="text-xs" style={{ color: '#84888c' }}>
                Scan to download&nbsp; App
              </p>
            </div>

            {/* Community */}
            <p
              className="font-semibold mb-3"
              style={{ fontSize: '19px', color: '#ffffff' }}
            >
              Community
            </p>
            <div className="flex flex-wrap gap-3">
              {SOCIAL_LINKS.map(({ img, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center justify-center no-underline"
                  style={{ width: '24px', height: '24px' }}
                >
                  <img
                    src={img}
                    alt={label}
                    style={{ width: '24px', height: '24px', objectFit: 'contain', filter: 'brightness(0.7) invert(1)' }}
                  />
                </a>
              ))}
            </div>

            {/* Regulatory badge */}
            <p className="text-xs mt-4" style={{ color: '#84888c' }}>
              Regulated by {config.compliance.regulator}
            </p>
          </div>

          {/* ── Accordion link columns ── */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
            {FOOTER_SECTIONS.map((section) => (
              <AccordionSection
                key={section.key}
                section={section}
                isOpen={openSection === section.key}
                onToggle={() => toggleSection(section.key)}
              />
            ))}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="mt-10 border-t pt-6 flex flex-col items-center justify-center"
          style={{ borderColor: 'rgba(31,32,35,0.6)' }}
        >
          <p className="text-sm text-center" style={{ color: '#84888c' }}>
            Copyright © 2026 <strong style={{ color: '#84888c' }}>AGCE</strong> . All rights reserved
          </p>
        </div>
      </div>
    </footer>
  )
}
