import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Country } from '@agce/types'
import { authApi } from '../../lib/auth-api.js'
import './country-code-select.css'

interface CountryCodeSelectProps {
  value: string
  onChange: (dialCode: string, country?: Country) => void
  disabled?: boolean
  className?: string
  id?: string
}

// Flag emoji don't render on Windows Chrome/Edge (no regional-indicator glyphs in Segoe UI Emoji).
// Render PNG flags from flagcdn.com keyed by iso2; fall back to the emoji string on network error.
function FlagIcon({ country }: { country?: Country }) {
  const [failed, setFailed] = useState(false)
  if (!country) return <span className="country-code-select__flag" aria-hidden>🌐</span>
  const iso = country.iso2.toLowerCase()
  if (failed) {
    return <span className="country-code-select__flag" aria-hidden>{country.flag}</span>
  }
  return (
    <img
      className="country-code-select__flag-img"
      src={`https://flagcdn.com/w40/${iso}.png`}
      srcSet={`https://flagcdn.com/w80/${iso}.png 2x`}
      width={22}
      height={16}
      alt=""
      aria-hidden
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}

// Fallback used until the API responds (and if the request fails).
// Keeps the dropdown interactive offline and during initial render.
const FALLBACK_COUNTRIES: Country[] = [
  { iso2: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { iso2: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪' },
  { iso2: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
  { iso2: 'QA', name: 'Qatar', dialCode: '+974', flag: '🇶🇦' },
  { iso2: 'KW', name: 'Kuwait', dialCode: '+965', flag: '🇰🇼' },
  { iso2: 'BH', name: 'Bahrain', dialCode: '+973', flag: '🇧🇭' },
  { iso2: 'OM', name: 'Oman', dialCode: '+968', flag: '🇴🇲' },
  { iso2: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { iso2: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
]

export function CountryCodeSelect({
  value,
  onChange,
  disabled,
  className = '',
  id,
}: CountryCodeSelectProps) {
  const { data } = useQuery({
    queryKey: ['auth', 'countries'],
    queryFn: () => authApi.countries(),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
    retry: 1,
  })

  const countries = data && data.length > 0 ? data : FALLBACK_COUNTRIES

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  // Match by iso2 first (unique); fall back to dialCode (some share +1).
  const selected = useMemo(() => {
    return (
      countries.find((c) => c.iso2 === value) ??
      countries.find((c) => c.dialCode === value) ??
      countries[0]
    )
  }, [countries, value])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return countries
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.includes(q) ||
        c.iso2.toLowerCase().includes(q),
    )
  }, [countries, query])

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    const t = window.setTimeout(() => searchRef.current?.focus(), 30)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
      window.clearTimeout(t)
    }
  }, [open])

  const handleSelect = (c: Country) => {
    onChange(c.dialCode, c)
    setOpen(false)
    setQuery('')
  }

  return (
    <div ref={rootRef} className={`country-code-select ${className}`}>
      <button
        id={id}
        type="button"
        className="input_filed country-code-select__trigger"
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <FlagIcon country={selected} />
        <span className="country-code-select__dial">{selected?.dialCode ?? '+'}</span>
        <span className="country-code-select__name">{selected?.name ?? ''}</span>
        <i className="ri-arrow-down-s-line country-code-select__caret" aria-hidden />
      </button>

      {open && (
        <div className="country-code-select__panel" role="listbox">
          <div className="country-code-select__search">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search country or code"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <ul className="country-code-select__list">
            {filtered.length === 0 ? (
              <li className="country-code-select__empty">No matches</li>
            ) : (
              filtered.map((c) => {
                const isSelected = selected?.iso2 === c.iso2
                return (
                  <li
                    key={c.iso2}
                    role="option"
                    aria-selected={isSelected}
                    className={`country-code-select__option ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => handleSelect(c)}
                  >
                    <FlagIcon country={c} />
                    <span className="country-code-select__option-name">{c.name}</span>
                    <span className="country-code-select__option-dial">{c.dialCode}</span>
                  </li>
                )
              })
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
