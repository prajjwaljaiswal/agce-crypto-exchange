import { useEffect, useState } from 'react'
import { OrderDetailsModal } from '../components/swap/OrderDetailsModal.js'
import { RecentSwapsTable } from '../components/swap/RecentSwapsTable.js'
import { SelectCoinModal } from '../components/swap/SelectCoinModal.js'
import { SwapForm } from '../components/swap/SwapForm.js'

export function Swap() {
  const [searchCoinOpen, setSearchCoinOpen] = useState(false)
  const [moreDetailsOpen, setMoreDetailsOpen] = useState(false)
  const anyOpen = searchCoinOpen || moreDetailsOpen

  useEffect(() => {
    if (!anyOpen) return
    document.body.classList.add('modal-open')
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setSearchCoinOpen(false)
      setMoreDetailsOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('modal-open')
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [anyOpen])

  return (
    <>
      <div className="dashboard_right">
        <SwapForm
          onPickCoin={() => setSearchCoinOpen(true)}
          onSwap={() => setMoreDetailsOpen(true)}
        />
        <RecentSwapsTable />
      </div>

      <SelectCoinModal open={searchCoinOpen} onClose={() => setSearchCoinOpen(false)} />
      <OrderDetailsModal open={moreDetailsOpen} onClose={() => setMoreDetailsOpen(false)} />

      {anyOpen && <div className="modal-backdrop fade show" />}
    </>
  )
}
