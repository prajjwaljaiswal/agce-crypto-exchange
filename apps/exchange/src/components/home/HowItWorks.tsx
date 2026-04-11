const steps = [
  {
    number: 'Step 1',
    icon: '/images/work_icon.svg',
    title: 'Login & Register',
    description: 'Enter your email address and create a strong password.',
  },
  {
    number: 'Step 2',
    icon: '/images/work_icon2.svg',
    title: 'Complete KYC',
    description:
      'Complete the two-factor authentication process (2FA). Wait for your account to be verified and approved.',
  },
  {
    number: 'Step 3',
    icon: '/images/work_icon3.svg',
    title: 'Start Trading',
    description: 'Once approved, login to your account and start trading.',
  },
]

export function HowItWorks() {
  return (
    <section style={{ backgroundColor: '#ffffff' }}>
      {/* Cream bottom stripe */}
      <div style={{ backgroundColor: '#fcf5ea', paddingBottom: '80px', paddingTop: '0' }}>
        <div className="mx-auto max-w-[1400px] px-6">
          {/* Header */}
          <div className="text-center pt-16 pb-12">
            <h2
              style={{
                fontSize: '52px',
                fontWeight: 600,
                lineHeight: '1.05',
                color: '#1d1d1d',
                marginBottom: '16px',
              }}
            >
              How it works
            </h2>
            <p style={{ fontSize: '18px', color: '#353945', lineHeight: '24px' }}>
              A powerful crypto platform designed for speed, security
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map(({ number, icon, title, description }) => (
              <div
                key={number}
                className="flex flex-col items-center text-center rounded-[20px] pt-10 pb-10 px-6"
                style={{ backgroundColor: '#ffffff' }}
              >
                <div
                  className="flex items-center justify-center mb-5"
                  style={{ width: '200px', height: '200px' }}
                >
                  <img src={icon} alt={title} style={{ width: '180px', height: '180px', objectFit: 'contain' }} />
                </div>

                <p style={{ fontSize: '14px', color: '#2c3131', marginBottom: '8px', lineHeight: '1.25' }}>
                  {number}
                </p>
                <h3
                  style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    color: '#2c3131',
                    marginBottom: '12px',
                    lineHeight: '1.25',
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    fontSize: '16px',
                    color: '#777e90',
                    lineHeight: '1.5',
                    maxWidth: '335px',
                  }}
                >
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
