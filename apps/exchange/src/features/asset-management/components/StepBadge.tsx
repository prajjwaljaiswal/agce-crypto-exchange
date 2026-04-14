interface StepBadgeProps {
  step: number
  done: boolean
}

export function StepBadge({ step, done }: StepBadgeProps) {
  if (done) {
    return (
      <span className="deposit_step_badge is-done" aria-label={`Step ${step} completed`}>
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M16.7 5.8L8.4 14.1L3.3 9"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    )
  }

  return (
    <span className="deposit_step_badge" aria-label={`Step ${step}`}>
      {step}
    </span>
  )
}
