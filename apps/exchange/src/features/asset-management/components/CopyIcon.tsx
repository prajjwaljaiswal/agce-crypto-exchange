interface CopyIconProps {
  size?: number
}

export function CopyIcon({ size = 18 }: CopyIconProps) {
  return (
    <svg
      className="bn-svg icon-small-pointer"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: size, cursor: 'pointer', flexShrink: 0 }}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 3h11v13h-3V6H9V3zM4 8v13h11V8.02L4 8z"
        fill="currentColor"
      />
    </svg>
  )
}
