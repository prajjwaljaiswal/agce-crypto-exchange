import type { HTMLAttributes } from 'react'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)]',
  success: 'bg-green-500/10 text-green-400',
  warning: 'bg-yellow-500/10 text-yellow-400',
  danger: 'bg-red-500/10 text-red-400',
  info: 'bg-blue-500/10 text-blue-400',
}

export function Badge({ variant = 'default', className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={['inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', variantClasses[variant], className].join(' ')}
      {...props}
    >
      {children}
    </span>
  )
}
