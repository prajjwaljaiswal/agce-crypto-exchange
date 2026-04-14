interface CopyFieldProps {
  label: string
  value: string
  onCopy?: () => void
}

export function CopyField({ label, value, onCopy }: CopyFieldProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      onCopy?.()
    } catch {
      /* noop */
    }
  }

  return (
    <div className="deposit_field_row">
      <div className="deposit_field_head">
        <span>{label}</span>
      </div>
      <div className="deposit_field_input">
        <input type="text" readOnly value={value} />
        <button type="button" className="deposit_copy_btn" onClick={handleCopy}>
          <span className="deposit_copy_ico" aria-hidden>
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9 3h11v13h-3V6H9V3zM4 8v13h11V8.02L4 8z"
                fill="currentColor"
              />
            </svg>
          </span>
          Copy
        </button>
      </div>
    </div>
  )
}
