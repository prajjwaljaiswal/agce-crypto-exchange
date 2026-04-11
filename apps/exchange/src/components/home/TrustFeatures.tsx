const trustItems = [
  {
    img: '/images/compliance_vector.png',
    title: 'Compliance Matrix',
    description:
      'Ready to trade? Login to your account and start buying and selling crypto currency today.',
  },
  {
    img: '/images/security_vector.png',
    title: 'Account Security',
    description:
      'Ready to trade? Login to your account and start buying and selling crypto currency today.',
  },
  {
    img: '/images/reserves_vector.png',
    title: '100% Reserves',
    description:
      'Ready to trade? Login to your account and start buying and selling crypto currency today.',
  },
]

export function TrustFeatures() {
  return (
    <section className="py-16 lg:py-24" style={{ backgroundColor: '#ffffff' }}>
      <div className="mx-auto max-w-[1400px] px-6">
        {/* Header */}
        <div className="mb-12">
          <p
            style={{
              fontSize: '40px',
              fontWeight: 700,
              color: '#050505',
              lineHeight: '54.6px',
              marginBottom: '0',
            }}
          >
            ARAB GLOBAL Trade
          </p>
          <p
            style={{
              fontSize: '40px',
              fontWeight: 600,
              color: '#1d1d1d',
              lineHeight: '54.6px',
            }}
          >
            Tour Safe and Trusted Crypto Exchange
          </p>
        </div>

        {/* Trust cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trustItems.map(({ img, title, description }) => (
            <div
              key={title}
              className="rounded-3xl overflow-hidden flex flex-col"
              style={{
                border: '1px solid rgba(29,29,29,0.12)',
                backgroundColor: '#ffffff',
                boxShadow: '0px 4px 20px 0px rgba(0,0,0,0.05)',
              }}
            >
              {/* Illustration */}
              <div
                className="flex items-center justify-center"
                style={{ height: '280px', overflow: 'hidden', padding: '24px 24px 0' }}
              >
                <img
                  src={img}
                  alt={title}
                  style={{
                    width: '100%',
                    maxHeight: '260px',
                    objectFit: 'contain',
                    objectPosition: 'center bottom',
                  }}
                />
              </div>

              {/* Text content */}
              <div className="px-8 pb-8 pt-4 text-center">
                <h3
                  style={{
                    fontSize: '30px',
                    fontWeight: 600,
                    color: '#000000',
                    marginBottom: '12px',
                    lineHeight: '48px',
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '24px',
                  }}
                >
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
