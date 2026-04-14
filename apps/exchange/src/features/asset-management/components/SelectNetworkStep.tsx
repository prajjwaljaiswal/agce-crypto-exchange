import type { KeyboardEvent } from 'react'
import { StepBadge } from './StepBadge.js'

interface SelectNetworkStepProps {
  selectedNetwork: string
  onOpen: () => void
}

export function SelectNetworkStep({ selectedNetwork, onOpen }: SelectNetworkStepProps) {
  const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onOpen()
    }
  }

  return (
    <div className="deposit_step_section select_network_s select-option">
      <div className="deposit_step_header">
        <StepBadge step={2} done={Boolean(selectedNetwork)} />
        <h2>Select a Network</h2>
      </div>
      <div
        className="search_icon_s deposit_select_network_trigger"
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={handleKey}
      >
        {selectedNetwork || 'Select Network'}
      </div>
    </div>
  )
}
