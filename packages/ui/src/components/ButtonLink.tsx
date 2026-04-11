import type { AnchorHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant
  size?: Size
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white',
  secondary: 'bg-[var(--color-surface-2)] hover:bg-[var(--color-surface-3)] text-[var(--color-text)]',
  ghost: 'hover:bg-[var(--color-surface-2)] text-[var(--color-text-muted)]',
  outline: 'border border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-text)]',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function ButtonLink({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonLinkProps) {
  return (
    <a
      className={[
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </a>
  )
}
