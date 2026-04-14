type OrderStatus = 'EXECUTED' | 'CANCELLED' | 'PARTIALLY EXECUTED'
type OrderSide = 'BUY' | 'SELL'
type OrderType = 'LIMIT' | 'MARKET'

interface ExecutedTrade {
  price: string
  executed: string
  fee: string
  total: string
}

interface SpotOrder {
  id: string
  date: string
  time: string
  pair: string
  side: OrderSide
  price: string
  average: string
  quantity: string
  remaining: string
  total: string
  fee: string
  type: OrderType
  status: OrderStatus
  trades?: ExecutedTrade[]
}

const STATUS_CLASS: Record<OrderStatus, string> = {
  EXECUTED: 'text-success',
  CANCELLED: 'text-danger',
  'PARTIALLY EXECUTED': 'text-warning',
}

const ORDERS: SpotOrder[] = [
  {
    id: '1',
    date: '09/04/2026',
    time: '10:30:00',
    pair: 'BTC/USDT',
    side: 'BUY',
    price: '67250.123456789',
    average: '67100.5',
    quantity: '0.05',
    remaining: '0',
    total: '3355.025',
    fee: '0.0001 BTC',
    type: 'LIMIT',
    status: 'EXECUTED',
    trades: [
      { price: '67100 USDT', executed: '0.02 BTC', fee: '0.00004 BTC', total: '1342' },
      { price: '67101 USDT', executed: '0.03 BTC', fee: '0.00006 BTC', total: '2013.03' },
    ],
  },
  {
    id: '2',
    date: '08/04/2026',
    time: '14:22:00',
    pair: 'ETH/USDT',
    side: 'SELL',
    price: '3250.8',
    average: '3248.25',
    quantity: '2.5',
    remaining: '0',
    total: '8120.625',
    fee: '0.0025 ETH',
    type: 'MARKET',
    status: 'EXECUTED',
  },
  {
    id: '3',
    date: '07/04/2026',
    time: '09:15:00',
    pair: 'SOL/USDT',
    side: 'BUY',
    price: '145.75',
    average: '0',
    quantity: '100',
    remaining: '100',
    total: '0',
    fee: '0 SOL',
    type: 'LIMIT',
    status: 'CANCELLED',
  },
  {
    id: '4',
    date: '06/04/2026',
    time: '18:45:00',
    pair: 'BNB/USDT',
    side: 'BUY',
    price: '580.25',
    average: '579.9',
    quantity: '10',
    remaining: '4',
    total: '3479.4',
    fee: '0.01 BNB',
    type: 'LIMIT',
    status: 'PARTIALLY EXECUTED',
  },
]

const TABLE_HEADERS = [
  'Date',
  'Trading Pair',
  'Side',
  'Price',
  'Average',
  'Quantity',
  'Remaining',
  'Total',
  'Fee',
  'Order Type',
  'Status',
]

const EXPORT_PRESETS = ['Last 24 hours', '2 Weeks', '1 Month', '3 Months', '6 Months', 'Customize']
const EXPORT_FORMATS = ['PDF', 'Excel']

function SearchBar() {
  return (
    <div className="searchBar custom-tabs">
      <i className="ri-search-2-line"></i>
      <input type="search" className="custom_search" placeholder="Search Crypto" defaultValue="" />
    </div>
  )
}

function ExportButton() {
  return (
    <button
      type="button"
      className="searchBar custom-tabs"
      data-bs-toggle="modal"
      data-bs-target="#exportTradeHistoryModal"
      title="Export Trade History"
      style={{ cursor: 'pointer' }}
    >
      <i className="ri-download-2-line"></i>
    </button>
  )
}

function Pagination({ label, className = 'hVPalX gap-2' }: { label: string; className?: string }) {
  return (
    <div className={className}>
      <span>{label}</span>
      <div className="sc-eAKtBH gVtWSU">
        <button type="button" aria-label="First Page" className="sc-gjLLEI kuPCgf">
          <i className="ri-skip-back-fill text-white"></i>
        </button>
        <button type="button" aria-label="Previous Page" className="sc-gjLLEI kuPCgf">
          <i className="ri-arrow-left-s-line text-white"></i>
        </button>
        <button type="button" aria-label="Next Page" className="sc-gjLLEI kuPCgf">
          <i className="ri-arrow-right-s-line text-white"></i>
        </button>
        <button type="button" aria-label="Last Page" className="sc-gjLLEI kuPCgf">
          <i className="ri-skip-forward-fill text-white"></i>
        </button>
      </div>
    </div>
  )
}

function ExecutedTradesRow({ trades }: { trades: ExecutedTrade[] }) {
  return (
    <tr>
      <td colSpan={TABLE_HEADERS.length + 1}>
        <div className="table-responsive bg-dark">
          <table className="table table_home   ">
            <thead>
              <tr>
                <th>#</th>
                <th>Trading price	</th>
                <th>Executed</th>
                <th>Trading Fee</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{trade.price}</td>
                  <td>{trade.executed}</td>
                  <td>{trade.fee}</td>
                  <td>{trade.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </td>
    </tr>
  )
}

function DesktopOrderRow({ order }: { order: SpotOrder }) {
  const { trades } = order
  return (
    <>
      <tr className="cursor-pointer">
        <td>
          <div className="c_view justify-content-start">
            {trades && <p className="ms-2 mx-2 text-xl d-inline text-success">▾</p>}
            <span>
              {order.date}
              <small>{order.time.slice(0, 5)}</small>
            </span>
          </div>
        </td>
        <td>{order.pair}</td>
        <td>{order.side}</td>
        <td>{order.price}</td>
        <td>{order.average}</td>
        <td>{order.quantity}</td>
        <td>{order.remaining}</td>
        <td>{order.total}</td>
        <td>{order.fee}</td>
        <td>{order.type}</td>
        <td className={STATUS_CLASS[order.status]}>{order.status}</td>
      </tr>
      {trades && <ExecutedTradesRow trades={trades} />}
    </>
  )
}

function MobileOrderCard({ order }: { order: SpotOrder }) {
  const fields: Array<{ label: string; value: string; className?: string }> = [
    { label: 'Currency Pair', value: order.pair },
    { label: 'Side', value: order.side },
    { label: 'Price', value: order.price },
    { label: 'Average', value: order.average },
    { label: 'Quantity', value: order.quantity },
    { label: 'Remaining', value: order.remaining },
    { label: 'Total', value: order.total },
    { label: 'Fee', value: order.fee },
    { label: 'Order Type', value: order.type },
    { label: 'Status', value: order.status, className: STATUS_CLASS[order.status] },
  ]

  return (
    <div className="order_datalist">
      <ul className="listdata">
        <li>
          <span className="date">Date</span>
          <span className="date_light">{order.date}</span>
        </li>
        <li>
          <span>Time</span>
          <span>{order.time}</span>
        </li>
        {fields.map((field) => (
          <li key={field.label}>
            <span>{field.label}</span>
            <span className={field.className}>{field.value}</span>
          </li>
        ))}
      </ul>

      {order.trades && (
        <div className="executed_trades_list active">
          <button type="button">
            <i className="ri-arrow-drop-down-line rotated"></i>Executed Trades
          </button>
          <div className="executed_trades_list_items">
            {order.trades.map((trade, index) => (
              <ul key={index}>
                <li>Trade #{index + 1}:</li>
                <li>
                  Trading Price: <span>{trade.price}</span>
                </li>
                <li>
                  Executed: <span>{trade.executed}</span>
                </li>
                <li>
                  Trading Fee: <span>{trade.fee}</span>
                </li>
                <li>
                  Total: <span>{trade.total}</span>
                </li>
              </ul>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ExportModal() {
  return (
    <div
      className="modal fade search_form export_modal"
      id="exportTradeHistoryModal"
      tabIndex={-1}
      aria-labelledby="exportTradeHistoryModalLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exportTradeHistoryModalLabel">Export Trade History</h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body export_modal_body">
            <div className="export_section">
              <label className="export_label">Select Time Period</label>
              <div className="export_btn_group export_presets">
                {EXPORT_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className={`export_btn${preset === 'Customize' ? ' active' : ''}`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
              <div className="export_date_range">
                <input type="date" className="export_date_input" defaultValue="2026-03-09" />
                <span className="export_date_arrow">
                  <i className="ri-arrow-right-line"></i>
                </span>
                <input type="date" className="export_date_input" defaultValue="2026-04-09" />
              </div>
              <small className="export_note">* Up to 10,000 data can be generated each time.</small>
            </div>

            <div className="export_section">
              <label className="export_label">Format</label>
              <div className="export_btn_group">
                {EXPORT_FORMATS.map((format) => (
                  <button
                    key={format}
                    type="button"
                    className={`export_btn${format === 'PDF' ? ' active' : ''}`}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>

            <div className="export_section export_actions">
              <button type="button" className="export_submit_btn">Export</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SpotOrders() {
  const paginationLabel = `1-${ORDERS.length} of ${ORDERS.length}`

  return (
    <div className="dashboard_right">
      <div className="dashboard_listing_section Overview_mid">
        <div className="listing_left_outer full_width transaction_history_t desktop_view2">
          <div className="market_section spotorderhist">
            <div className="top_heading">
              <h4>Spot orders</h4>
              <div className="coin_right">
                <SearchBar />
                <ExportButton />
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
                    {ORDERS.map((order) => (
                      <DesktopOrderRow key={order.id} order={order} />
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination label={paginationLabel} />
            </div>
          </div>
        </div>

        <div className="order_history_mobile_view">
          <div className="coin_right d-flex flex-row justify-content-between align-items-center p-0">
            <h5>Spot orders </h5>
            <div className="d-flex flex-row justify-content-end align-items-center gap-2">
              <SearchBar />
              <ExportButton />
            </div>
          </div>

          <div className="d-flex">
            {ORDERS.map((order) => (
              <MobileOrderCard key={order.id} order={order} />
            ))}
          </div>

          <Pagination label={paginationLabel} className="hVPalX gap-2 mt-3" />
        </div>

        <ExportModal />
      </div>
    </div>
  )
}
