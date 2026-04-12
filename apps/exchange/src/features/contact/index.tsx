import { useState } from 'react'
import { Mail, Send, MapPin, ChevronRight } from 'lucide-react'

export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  const subjects = [
    'General Inquiry',
    'Technical Support',
    'Account Issues',
    'Trading Questions',
    'Partnership',
    'Press / Media',
    'Other',
  ]

  const contactInfo = [
    {
      icon: <Mail size={20} />,
      label: 'Email',
      value: 'support@agce.com',
      href: 'mailto:support@agce.com',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.932z" />
        </svg>
      ),
      label: 'Telegram',
      value: '@AGCESupport',
      href: 'https://t.me/AGCESupport',
    },
    {
      icon: <MapPin size={20} />,
      label: 'Office',
      value: 'ADGM Square, Al Maryah Island, Abu Dhabi, UAE',
      href: null,
    },
  ]

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div
        className="py-14 px-6"
        style={{
          background: 'linear-gradient(135deg, #0d0d0d 0%, #161210 100%)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm mb-4">
            <span>Home</span>
            <ChevronRight size={14} />
            <span className="text-[var(--color-primary)]">Contact</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Contact Us</h1>
          <p className="text-[var(--color-text-muted)] text-lg">Our team is available 24/7 to help you.</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <Send size={28} className="text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">Message Sent!</h3>
                <p className="text-[var(--color-text-muted)]">
                  Thank you for reaching out. We'll respond within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-[var(--color-text-muted)] mb-1.5">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--color-text-muted)] mb-1.5">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[var(--color-text-muted)] mb-1.5">Subject</label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] transition-colors"
                  >
                    <option value="" disabled>Select a subject</option>
                    {subjects.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-[var(--color-text-muted)] mb-1.5">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Describe your inquiry in detail..."
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-primary)] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 bg-[var(--color-primary)] text-black font-semibold px-8 py-3.5 rounded-xl hover:opacity-90 transition-opacity"
                >
                  <Send size={16} />
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Get in Touch</h2>
            {contactInfo.map((info) => (
              <div
                key={info.label}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 flex items-start gap-4"
              >
                <span className="text-[var(--color-primary)] mt-0.5 flex-shrink-0">{info.icon}</span>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)] mb-0.5">{info.label}</p>
                  {info.href ? (
                    <a
                      href={info.href}
                      className="text-sm text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-sm text-[var(--color-text)]">{info.value}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 p-5">
              <p className="text-sm text-[var(--color-text-muted)]">
                <span className="text-[var(--color-primary)] font-semibold">Support Hours:</span> 24/7 for critical issues. General inquiries are handled Monday–Friday, 9:00 AM – 6:00 PM (GST).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
