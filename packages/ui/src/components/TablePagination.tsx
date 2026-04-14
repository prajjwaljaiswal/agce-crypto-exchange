interface TablePaginationProps {
  label: string
  onFirst?: () => void
  onPrev?: () => void
  onNext?: () => void
  onLast?: () => void
  className?: string
}

export function TablePagination({
  label,
  onFirst,
  onPrev,
  onNext,
  onLast,
  className = '',
}: TablePaginationProps) {
  return (
    <div className={`hVPalX gap-2 ${className}`.trim()}>
      <span>{label}</span>
      <div className="sc-eAKtBH gVtWSU">
        <button
          type="button"
          aria-label="First Page"
          className="sc-gjLLEI kuPCgf"
          onClick={onFirst}
        >
          <i className="ri-skip-back-fill text-white" />
        </button>
        <button
          type="button"
          aria-label="Previous Page"
          className="sc-gjLLEI kuPCgf"
          onClick={onPrev}
        >
          <i className="ri-arrow-left-s-line text-white" />
        </button>
        <button
          type="button"
          aria-label="Next Page"
          className="sc-gjLLEI kuPCgf"
          onClick={onNext}
        >
          <i className="ri-arrow-right-s-line text-white" />
        </button>
        <button
          type="button"
          aria-label="Last Page"
          className="sc-gjLLEI kuPCgf"
          onClick={onLast}
        >
          <i className="ri-skip-forward-fill text-white" />
        </button>
      </div>
    </div>
  )
}
