import type { ExecutedTrade, SpotOrder } from './types.js'
import { STATUS_CLASS, TABLE_HEADERS } from './types.js'

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

export function DesktopOrderRow({ order }: { order: SpotOrder }) {
  const { trades } = order
  return (
    <>
      <tr className="cursor-pointer">
        <td>
          <div className="c_view justify-content-start">
            {trades && (
              <p className="ms-2 mx-2 text-xl d-inline text-success">▾</p>
            )}
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
