import type { SpotOrder } from './types.js'
import { STATUS_CLASS } from './types.js'

export function MobileOrderCard({ order }: { order: SpotOrder }) {
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
    {
      label: 'Status',
      value: order.status,
      className: STATUS_CLASS[order.status],
    },
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
            <i className="ri-arrow-drop-down-line rotated" />
            Executed Trades
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
