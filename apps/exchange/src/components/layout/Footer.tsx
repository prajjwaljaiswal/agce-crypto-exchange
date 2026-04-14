import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BUY_CRYPTO_SUBMENU_ITEMS,
  EARNING_SUBMENU_ITEMS,
  FUTURES_SUBMENU_ITEMS,
  MORE_SUBMENU_ITEMS,
  TRADE_SUBMENU_ITEMS,
  type SubmenuItem,
} from './headerMenuData.js'

type FooterNavKey = 'buy_crypto' | 'trade' | 'futures' | 'earning' | 'more'

interface FooterNavDropdownProps {
  navKey: FooterNavKey
  openKey: FooterNavKey | null
  setOpenKey: (updater: (prev: FooterNavKey | null) => FooterNavKey | null) => void
  label: string
  idSlug: string
  items: SubmenuItem[]
  scrollTop: () => void
}

function FooterNavDropdown({
  navKey,
  openKey,
  setOpenKey,
  label,
  idSlug,
  items,
  scrollTop,
}: FooterNavDropdownProps) {
  const isOpen = openKey === navKey

  const close = () => {
    setOpenKey(() => null)
    scrollTop()
  }

  return (
    <li className={`footer_menu_has_sub${isOpen ? ' open' : ''}`}>
      <button
        type="button"
        className="footer_trade_crypto_toggle"
        aria-expanded={isOpen}
        aria-controls={`footer-nav-${idSlug}-sub`}
        id={`footer-nav-${idSlug}-trigger`}
        onClick={() => setOpenKey((prev) => (prev === navKey ? null : navKey))}
      >
        <span>{label}</span>
        <i className="ri-arrow-down-s-line footer_trade_crypto_chevron" aria-hidden />
      </button>
      <ul
        id={`footer-nav-${idSlug}-sub`}
        className="footer_menu_sub"
        hidden={!isOpen}
      >
        {items.map((item) => (
          <li key={item.id}>
            <Link to={item.to} onClick={close}>
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  )
}

export function Footer() {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [openFooterNavKey, setOpenFooterNavKey] = useState<FooterNavKey | null>(null)

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const toggleSection = (key: string) => (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault()
    setActiveSection((prev) => (prev === key ? null : key))
  }

  const onKeyToggle = (key: string) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleSection(key)(e)
    }
  }

  return (
    <footer className="p-0">
      <div className="container" />

      <div className="row main_footer_menu_s m-0">
        <div className="container">
          <div className="mobile_grid_list">

            {/* Left — scan + social. `order-last` pushes to bottom on mobile grid */}
            <div className="footer_section order-last">
              <div className="footer_left">
                <h3>Trade Crypto Anywhere Anytime</h3>
                <div className="scan_vector">
                  <img src="/images/scan2.svg" alt="Scan Vector" />
                </div>
                <span className="scan_text">Scan to download App</span>

                <div className="social_footer">
                  <h3>Community</h3>
                  <ul className="social_footer_icons" aria-label="Social media links">
                    <li>
                      <a href="mailto:support@agce.com" aria-label="Email">
                        <i className="ri-mail-line" aria-hidden />
                      </a>
                    </li>
                    <li>
                      <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                        <i className="ri-facebook-circle-fill" aria-hidden />
                      </a>
                    </li>
                    <li>
                      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X">
                        <i className="ri-twitter-x-fill" aria-hidden />
                      </a>
                    </li>
                    <li>
                      <a href="https://t.me" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                        <i className="ri-telegram-fill" aria-hidden />
                      </a>
                    </li>
                    <li>
                      <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                        <i className="ri-tiktok-fill" aria-hidden />
                      </a>
                    </li>
                    <li>
                      <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <i className="ri-instagram-fill" aria-hidden />
                      </a>
                    </li>
                    <li>
                      <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                        <i className="ri-youtube-fill" aria-hidden />
                      </a>
                    </li>
                    <li>
                      <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <i className="ri-linkedin-fill" aria-hidden />
                      </a>
                    </li>
                    <li>
                      <a href="https://www.warp.dev" target="_blank" rel="noopener noreferrer" aria-label="Warp">
                        <i className="ri-terminal-box-line" aria-hidden />
                      </a>
                    </li>
                    <li>
                      <a href="/announcement" aria-label="More">
                        <i className="ri-more-fill" aria-hidden />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* About Us */}
            <div className={`footer_section ${activeSection === 'about' ? 'active' : ''}`}>
              <div
                className="topheading_footer"
                onClick={toggleSection('about')}
                role="button"
                tabIndex={0}
                onKeyDown={onKeyToggle('about')}
                aria-expanded={activeSection === 'about'}
              >
                <h3>About Us</h3>
                <div className="icon_i">
                  <i className="ri-arrow-down-s-line" aria-hidden />
                  <i className="ri-arrow-up-s-line" aria-hidden />
                </div>
              </div>
              <ul className="menu">
                <li><Link to="/TermsofUse" onClick={scrollTop}>Terms of Use</Link></li>
                <li><Link to="/RiskDisclosure" onClick={scrollTop}>Risk Disclosure</Link></li>
                <li><Link to="/PrivacyDataProtectionPolicy" onClick={scrollTop}>Privacy &amp; KYC Policy</Link></li>
              </ul>
            </div>

            {/* Services — matches header nav */}
            <div className={`footer_section ${activeSection === 'services' ? 'active' : ''}`}>
              <div
                className="topheading_footer"
                onClick={toggleSection('services')}
                role="button"
                tabIndex={0}
                onKeyDown={onKeyToggle('services')}
                aria-expanded={activeSection === 'services'}
              >
                <h3>Services</h3>
                <div className="icon_i">
                  <i className="ri-arrow-down-s-line" aria-hidden />
                  <i className="ri-arrow-up-s-line" aria-hidden />
                </div>
              </div>
              <ul className="menu">
                <FooterNavDropdown
                  navKey="buy_crypto"
                  openKey={openFooterNavKey}
                  setOpenKey={setOpenFooterNavKey}
                  label="Buy Crypto"
                  idSlug="buy-crypto"
                  items={BUY_CRYPTO_SUBMENU_ITEMS}
                  scrollTop={scrollTop}
                />
                <li>
                  <Link to="/market" onClick={scrollTop}>Market</Link>
                </li>
                <FooterNavDropdown
                  navKey="trade"
                  openKey={openFooterNavKey}
                  setOpenKey={setOpenFooterNavKey}
                  label="Trade"
                  idSlug="trade"
                  items={TRADE_SUBMENU_ITEMS}
                  scrollTop={scrollTop}
                />
                <FooterNavDropdown
                  navKey="futures"
                  openKey={openFooterNavKey}
                  setOpenKey={setOpenFooterNavKey}
                  label="Futures"
                  idSlug="futures"
                  items={FUTURES_SUBMENU_ITEMS}
                  scrollTop={scrollTop}
                />
                <FooterNavDropdown
                  navKey="earning"
                  openKey={openFooterNavKey}
                  setOpenKey={setOpenFooterNavKey}
                  label="Earning"
                  idSlug="earning"
                  items={EARNING_SUBMENU_ITEMS}
                  scrollTop={scrollTop}
                />
                <FooterNavDropdown
                  navKey="more"
                  openKey={openFooterNavKey}
                  setOpenKey={setOpenFooterNavKey}
                  label="More"
                  idSlug="more"
                  items={MORE_SUBMENU_ITEMS}
                  scrollTop={scrollTop}
                />
                <li>
                  <Link to="/user_profile/square" onClick={scrollTop}>Square</Link>
                </li>
                <li>
                  <Link to="/rewards" onClick={scrollTop}>Rewards</Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className={`footer_section ${activeSection === 'support' ? 'active' : ''}`}>
              <div
                className="topheading_footer"
                onClick={toggleSection('support')}
                role="button"
                tabIndex={0}
                onKeyDown={onKeyToggle('support')}
                aria-expanded={activeSection === 'support'}
              >
                <h3>Support</h3>
                <div className="icon_i">
                  <i className="ri-arrow-down-s-line" aria-hidden />
                  <i className="ri-arrow-up-s-line" aria-hidden />
                </div>
              </div>
              <ul className="menu">
                <li><Link to="/contact" onClick={scrollTop}>Help Center</Link></li>
                <li><Link to="/FAQ" onClick={scrollTop}>FAQ&apos;s</Link></li>
                <li><Link to="/security_system" onClick={scrollTop}>Security</Link></li>
                <li><Link to="/user_profile/support" onClick={scrollTop}>Submit a Request</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div className={`footer_section ${activeSection === 'legal' ? 'active' : ''}`}>
              <div
                className="topheading_footer"
                onClick={toggleSection('legal')}
                role="button"
                tabIndex={0}
                onKeyDown={onKeyToggle('legal')}
                aria-expanded={activeSection === 'legal'}
              >
                <h3>Legal</h3>
                <div className="icon_i">
                  <i className="ri-arrow-down-s-line" aria-hidden />
                  <i className="ri-arrow-up-s-line" aria-hidden />
                </div>
              </div>
              <ul className="menu">
                <li><Link to="/aml-kyc-policy" onClick={scrollTop}>AML/KYC Policy</Link></li>
                <li><Link to="/complaints-handling-procedure" onClick={scrollTop}>Complaints Handling Procedure</Link></li>
                <li><Link to="/general-disclaimer" onClick={scrollTop}>General Disclaimer</Link></li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      <div className="col-sm-12">
        <div className="copyright_s">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-12 mt-4 text-center">
                <p className="copyright-text">
                  Copyright &copy; 2026{' '}
                  <b className="AGCE">
                    <a href="https://wrathcode.com/" target="_blank" rel="noopener noreferrer">
                      AGCE
                    </a>
                  </b>
                  . All rights reserved
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
