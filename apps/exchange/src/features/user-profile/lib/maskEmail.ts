// Two masking strategies used across the security UI:
// - maskEmail: single-char prefix + last char (e.g. j***e@gmail.com). Used
//   in contextual chips next to row actions.
// - maskEmailForDisplay: first three chars (e.g. jan***@gmail.com). Used in
//   verification modals where a longer prefix is easier to recognize.
// Both are kept because their outputs are user-facing and already shipped.

export function maskEmail(email?: string | null): string {
  if (!email || !email.includes('@')) return email ?? ''
  const [local, domain] = email.split('@')
  if (local.length <= 2) return `${local[0]}***@${domain}`
  return `${local[0]}***${local.slice(-1)}@${domain}`
}

export function maskEmailForDisplay(raw?: string | null): string {
  if (!raw || typeof raw !== 'string') return 'you***@email.com'
  const at = raw.indexOf('@')
  if (at <= 0) return '***'
  const local = raw.slice(0, at)
  const domain = raw.slice(at + 1)
  const visible = Math.min(3, local.length)
  return `${local.slice(0, visible)}***@${domain}`
}
