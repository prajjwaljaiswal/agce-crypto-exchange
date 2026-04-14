import { useState } from 'react'

/**
 * Generic sidebar UI state for dashboard layouts.
 * - `isActive` toggles the mobile slide-in panel
 * - `openSection` tracks which collapsible section is expanded
 */
export function useSidebarState<TSection extends string>() {
  const [isActive, setIsActive] = useState(false)
  const [openSection, setOpenSection] = useState<TSection | null>(null)

  const toggleActive = () => setIsActive((v) => !v)

  const toggleSection = (key: TSection) =>
    setOpenSection((cur) => (cur === key ? null : key))

  return {
    isActive,
    toggleActive,
    openSection,
    toggleSection,
  }
}
