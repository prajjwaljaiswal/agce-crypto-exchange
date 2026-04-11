import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { useInstanceConfig } from '@agce/hooks'
import type { FooterSection } from './types/index.js'
import { FOOTER_SECTIONS, FOOTER_SOCIAL_LINKS } from './data/index.js'

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
        <h3 className="text-base font-medium text-white">{section.title}</h3>
        <ChevronDown
          size={14}
          className={`lg:hidden transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: '#84888c' }}
        />
      </div>

      <ul className={`space-y-[17px] ${isOpen ? 'block' : 'hidden'} lg:block`}>
        {section.links.map(({ label, href }) => (
          <li key={label}>
            <Link
              to={href}
              className="text-sm text-[#a0a3a7] transition-colors hover:text-white no-underline"
            >
              {label}
            </Link>
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
    <footer className="bg-[#131516]">
      <div className="mx-auto max-w-[1400px] px-6 py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-6">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <p className="font-semibold text-[19px] text-white leading-[26px] mb-4">
              Trade Crypto Anywhere<br />Anytime
            </p>

            {/* QR + download text */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className="rounded-xl overflow-hidden shrink-0 bg-white"
                style={{
                  width: '116px',
                  height: '116px',
                  border: '1px solid #dfe0e2',
                  padding: '4px',
                }}
              >
                <img
                  src="/images/scanqr_code.svg"
                  alt="QR code"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-xs text-[#84888c]">
                Scan to download&nbsp; App
              </p>
            </div>

            {/* Community */}
            <p className="font-semibold text-[19px] text-white mb-3">Community</p>
            <div className="flex flex-wrap gap-3">
              {FOOTER_SOCIAL_LINKS.map(({ img, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center justify-center no-underline w-6 h-6"
                >
                  <img
                    src={img}
                    alt={label}
                    className="w-6 h-6 object-contain"
                    style={{ filter: 'brightness(0.7) invert(1)' }}
                  />
                </a>
              ))}
            </div>

            <p className="text-xs text-[#84888c] mt-4">
              Regulated by {config.compliance.regulator}
            </p>
          </div>

          {/* Accordion link columns */}
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

        {/* Bottom bar */}
        <div
          className="mt-10 border-t pt-6 flex flex-col items-center justify-center"
          style={{ borderColor: 'rgba(31,32,35,0.6)' }}
        >
          <p className="text-sm text-center text-[#84888c]">
            Copyright © 2026 <strong className="text-[#84888c]">AGCE</strong> . All rights reserved
          </p>
        </div>
      </div>
    </footer>
  )
}
