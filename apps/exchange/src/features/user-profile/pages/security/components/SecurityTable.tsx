import type { ReactNode } from 'react'
// Reuses the table styles defined in securityLogs.css until Phase 4 moves
// them to security-shared.css.
import '../TwofactorPage/securityLogs.css'

interface SecurityTableProps<TRow> {
  columns: string[]
  rows: TRow[]
  renderCells: (row: TRow) => ReactNode[]
  // Rendered below the empty illustration. securityLogs/authorizedDevices
  // omit it; thirdPartyAccess shows "No data".
  emptyLabel?: string
  // Stable key for each row; falls back to index when absent.
  getRowKey?: (row: TRow, idx: number) => string | number
}

export function SecurityTable<TRow>({
  columns,
  rows,
  renderCells,
  emptyLabel,
  getRowKey,
}: SecurityTableProps<TRow>) {
  const colCount = columns.length
  const isEmpty = rows.length === 0

  return (
    <div className="slg-tableWrap">
      <div className="slg-tableScroll">
        <table className="slg-table">
          <thead>
            <tr>
              {columns.map((label) => (
                <th key={label} scope="col">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isEmpty ? (
              <tr className="slg-table__emptyRow">
                <td colSpan={colCount}>
                  <div className="slg-empty" aria-live="polite">
                    <img
                      src="/images/no-data.svg"
                      alt=""
                      width={120}
                      height={144}
                      className="spot_orders_empty_telescope"
                    />
                    {emptyLabel ? <p className="slg-empty__text">{emptyLabel}</p> : null}
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => {
                const cells = renderCells(row)
                const key = getRowKey ? getRowKey(row, idx) : idx
                return (
                  <tr key={key}>
                    {cells.map((cell, i) => (
                      <td key={i}>{cell}</td>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
