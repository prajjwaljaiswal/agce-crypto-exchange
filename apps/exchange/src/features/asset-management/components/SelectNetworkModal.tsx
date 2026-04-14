import { useEffect, useMemo, useState } from 'react'
import { DEPOSIT_NETWORK_OPTIONS } from '../constants.js'

interface SelectNetworkModalProps {
  open: boolean
  selectedNetwork: string
  onClose: () => void
  onSelect: (code: string) => void
}

export function SelectNetworkModal({
  open,
  selectedNetwork,
  onClose,
  onSelect,
}: SelectNetworkModalProps) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return DEPOSIT_NETWORK_OPTIONS
    return DEPOSIT_NETWORK_OPTIONS.filter(
      (n) => n.code.toLowerCase().includes(q) || n.name.toLowerCase().includes(q),
    )
  }, [search])

  useEffect(() => {
    if (!open) {
      setSearch('')
      return
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="deposit_select_network_overlay"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="deposit_select_network_dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="deposit-select-network-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="deposit_select_network_head">
          <h2 id="deposit-select-network-title" className="deposit_select_network_title">
            Select Network
          </h2>
          <button
            type="button"
            className="deposit_select_network_close"
            aria-label="Close"
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="deposit_select_network_note">
          <span className="deposit_select_network_note_ico" aria-hidden="true">
            !
          </span>
          <p>
            Ensure that the selected deposit network is the same as the network. Otherwise,
            you&apos;ll not be able to withdraw later. Want help to choose a network?
          </p>
        </div>

        <div className="deposit_select_network_search_wrap">
          <i className="ri-search-line" aria-hidden="true" />
          <input
            type="search"
            className="deposit_select_network_search_input"
            placeholder="Select Network"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
            autoFocus
          />
        </div>

        <div className="deposit_select_network_list" role="listbox" aria-label="Networks">
          {filtered.length === 0 ? (
            <p className="deposit_select_network_empty">No network found</p>
          ) : (
            filtered.map((n) => (
              <button
                key={n.code}
                type="button"
                role="option"
                aria-selected={selectedNetwork === n.code}
                className="deposit_select_network_card"
                onClick={() => onSelect(n.code)}
              >
                <span className="deposit_select_network_card_lft">
                  <span className="deposit_select_network_code">{n.code}</span>
                  <span className="deposit_select_network_name">{n.name}</span>
                </span>
                <span className="deposit_select_network_card_rgt">
                  <span className="deposit_select_network_eta">{n.eta}</span>
                  <span className="deposit_select_network_min">
                    {n.minDeposit === '—' ? ' ' : `Min Deposit: ${n.minDeposit}`}
                  </span>
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
