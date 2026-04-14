export function formatLandingUsd(n: number | string | null | undefined): string {
  const num = typeof n === 'string' ? Number(n) : n
  if (typeof num !== 'number' || !Number.isFinite(num)) return '$0.00'
  const abs = Math.abs(num)
  const maxFrac = abs >= 1000 ? 2 : 8
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: maxFrac,
  }).format(num)
}

export function formatLandingPercent(p: number | string | null | undefined): string {
  const num = typeof p === 'string' ? Number(p) : p
  if (typeof num !== 'number' || !Number.isFinite(num)) return '0%'
  return `${Number(num.toFixed(2))}%`
}
