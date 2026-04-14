import { TablePagination } from '@agce/ui'
import { useDisclosure } from '@agce/hooks'
import { DesktopOrderRow } from './spot-orders/DesktopOrderRow.js'
import { MobileOrderCard } from './spot-orders/MobileOrderCard.js'
import { ExportTradeHistoryModal } from './spot-orders/ExportTradeHistoryModal.js'
import { SAMPLE_ORDERS } from './spot-orders/sampleOrders.js'
import { TABLE_HEADERS } from './spot-orders/types.js'

function SearchBar() {
  return (
    <div className="searchBar custom-tabs">
      <i className="ri-search-2-line" />
      <input
        type="search"
        className="custom_search"
        placeholder="Search Crypto"
        defaultValue=""
      />
    </div>
  )
}

function ExportButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="searchBar custom-tabs"
      onClick={onClick}
      title="Export Trade History"
      style={{ cursor: 'pointer' }}
    >
      <i className="ri-download-2-line" />
    </button>
  )
}

export function SpotOrders() {
  const paginationLabel = `1-${SAMPLE_ORDERS.length} of ${SAMPLE_ORDERS.length}`
  const exportModal = useDisclosure()

  return (
    <div className="dashboard_right">
      <div className="dashboard_listing_section Overview_mid">
        <div className="listing_left_outer full_width transaction_history_t desktop_view2">
          <div className="market_section spotorderhist">
            <div className="top_heading">
              <h4>Spot orders</h4>
              <div className="coin_right">
                <SearchBar />
                <ExportButton onClick={exportModal.open} />
                <label className="checkbox">
                  <input type="checkbox" />
                  Hide cancelled trades
                </label>
              </div>
            </div>
            <div className="dashboard_summary">
              <div className="table-responsive">
                <table className=" ">
                  <thead>
                    <tr>
                      {TABLE_HEADERS.map((header) => (
                        <th key={header}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE_ORDERS.map((order) => (
                      <DesktopOrderRow key={order.id} order={order} />
                    ))}
                  </tbody>
                </table>
              </div>
              <TablePagination label={paginationLabel} />
            </div>
          </div>
        </div>

        <div className="order_history_mobile_view">
          <div className="coin_right d-flex flex-row justify-content-between align-items-center p-0">
            <h5>Spot orders </h5>
            <div className="d-flex flex-row justify-content-end align-items-center gap-2">
              <SearchBar />
              <ExportButton onClick={exportModal.open} />
            </div>
          </div>

          <div className="d-flex">
            {SAMPLE_ORDERS.map((order) => (
              <MobileOrderCard key={order.id} order={order} />
            ))}
          </div>

          <TablePagination label={paginationLabel} className="mt-3" />
        </div>

        <ExportTradeHistoryModal
          isOpen={exportModal.isOpen}
          onClose={exportModal.close}
        />
      </div>
    </div>
  )
}
