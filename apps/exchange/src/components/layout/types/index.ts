import type { LucideIcon } from 'lucide-react'

// ─── Navbar ──────────────────────────────────────────────────────────────────

export type DropdownKey = 'trade' | 'futures' | 'earn' | 'download'

export interface DropdownItem {
  icon: LucideIcon
  label: string
  desc: string
  href: string
}

export interface DemoPair {
  base: string
  quote: string
  name: string
  price: string
  change: string
  up: boolean
  color: string
}

// ─── Footer ──────────────────────────────────────────────────────────────────

export interface FooterLink {
  label: string
  href: string
  isNew?: boolean
}

export interface FooterSection {
  key: string
  title: string
  links: FooterLink[]
}

export interface FooterSocialLink {
  img: string
  label: string
  href: string
}
