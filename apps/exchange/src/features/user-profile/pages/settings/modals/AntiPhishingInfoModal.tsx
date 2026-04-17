import { Modal } from '@agce/ui'

interface AntiPhishingInfoModalProps {
  isOpen: boolean
  onClose: () => void
  onGetStarted: () => void
}

interface Section {
  icon: string
  title: string
  body: string
}

const SECTIONS: Section[] = [
  {
    icon: 'ri-information-line',
    title: 'What is an anti-phishing code?',
    body: 'An anti-phishing code is a personalised identifier that enhances your account security. Once successfully set, you will see this code in all official emails sent to you by our exchange. It helps you verify whether an email is genuine and protects you from scams.',
  },
  {
    icon: 'ri-mail-check-line',
    title: 'How to identify phishing emails effectively?',
    body: 'You can create a custom anti-phishing code unique to you. This code will appear in all emails sent to you by our exchange. If you receive an email without your anti-phishing code, or the displayed code is different from the one you set, be cautious — the email may be a phishing attempt.',
  },
  {
    icon: 'ri-alert-line',
    title: 'Reminder',
    body: 'After successfully setting your code, all official emails sent to your secure email address will include this security identifier. Always compare the anti-phishing code in the email with the one you set to verify its authenticity. Keep it safe and never share it with anyone, including our exchange staff.',
  },
]

export function AntiPhishingInfoModal({
  isOpen,
  onClose,
  onGetStarted,
}: AntiPhishingInfoModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      staticBackdrop
      showHeader={false}
      contentClassName="anti-phishing-modal"
    >
      {/* Header */}
      <div
        style={{
          position: 'relative',
          padding: '26px 26px 22px',
          background:
            'linear-gradient(135deg, color-mix(in srgb, var(--color-primary, #D1AA67) 24%, transparent) 0%, color-mix(in srgb, var(--color-primary, #D1AA67) 6%, transparent) 100%)',
          borderBottom:
            '1px solid color-mix(in srgb, var(--color-primary, #D1AA67) 28%, transparent)',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div
          aria-hidden
          style={{
            flex: '0 0 auto',
            width: 52,
            height: 52,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background:
              'radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--color-primary, #D1AA67) 55%, transparent), color-mix(in srgb, var(--color-primary, #D1AA67) 15%, transparent))',
            border:
              '1px solid color-mix(in srgb, var(--color-primary, #D1AA67) 45%, transparent)',
            boxShadow:
              '0 0 0 4px color-mix(in srgb, var(--color-primary, #D1AA67) 10%, transparent), 0 4px 16px color-mix(in srgb, var(--color-primary, #D1AA67) 30%, transparent)',
          }}
        >
          <i
            className="ri-shield-check-line"
            style={{
              fontSize: 26,
              color: 'var(--color-primary, #D1AA67)',
              lineHeight: 1,
            }}
          />
        </div>

        <div style={{ flex: '1 1 auto', minWidth: 0 }}>
          <h5
            className="anti-phishing-header-title"
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 0.2,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            Anti-Phishing Code
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 999,
                color: 'var(--color-primary, #D1AA67)',
                background:
                  'color-mix(in srgb, var(--color-primary, #D1AA67) 18%, transparent)',
                border:
                  '1px solid color-mix(in srgb, var(--color-primary, #D1AA67) 35%, transparent)',
                letterSpacing: 0.5,
                textTransform: 'uppercase',
              }}
            >
              Security
            </span>
          </h5>
          <p
            className="anti-phishing-header-subtitle"
            style={{
              margin: '4px 0 0',
              fontSize: 12.5,
            }}
          >
            A personal identifier to verify official emails from us.
          </p>
        </div>

        <button
          type="button"
          aria-label="Close"
          className="anti-phishing-header-close"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 30,
            height: 30,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            cursor: 'pointer',
            padding: 0,
            lineHeight: 1,
            transition: 'background-color 0.15s ease',
          }}
        >
          <i className="ri-close-line" style={{ fontSize: 16 }} />
        </button>
      </div>

      {/* Body */}
      <div
        style={{
          padding: '20px 24px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        {SECTIONS.map((s) => (
          <section
            key={s.title}
            style={{
              display: 'flex',
              gap: 12,
              padding: '14px 14px',
              borderRadius: 10,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div
              aria-hidden
              style={{
                flex: '0 0 auto',
                width: 34,
                height: 34,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background:
                  'color-mix(in srgb, var(--color-primary, #D1AA67) 14%, transparent)',
                border:
                  '1px solid color-mix(in srgb, var(--color-primary, #D1AA67) 28%, transparent)',
                color: 'var(--color-primary, #D1AA67)',
                fontSize: 16,
                lineHeight: 1,
              }}
            >
              <i className={s.icon} />
            </div>
            <div style={{ flex: '1 1 auto', minWidth: 0 }}>
              <h6
                className="anti-phishing-heading"
                style={{
                  margin: 0,
                  fontSize: 14,
                  fontWeight: 600,
                  lineHeight: 1.35,
                }}
              >
                {s.title}
              </h6>
              <p
                className="anti-phishing-paragraph"
                style={{
                  margin: '6px 0 0',
                  fontSize: 12.5,
                  lineHeight: 1.55,
                }}
              >
                {s.body}
              </p>
            </div>
          </section>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: '16px 24px 22px' }}>
        <button
          type="button"
          onClick={onGetStarted}
          style={{
            width: '100%',
            backgroundColor: 'var(--color-primary, #D1AA67)',
            color: '#000',
            fontWeight: 600,
            fontSize: 15,
            padding: '12px 20px',
            border: 'none',
            borderRadius: 50,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'filter 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = 'brightness(1.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = 'none'
          }}
        >
          Get Started
          <i className="ri-arrow-right-line" style={{ fontSize: 16 }} />
        </button>
      </div>
    </Modal>
  )
}
