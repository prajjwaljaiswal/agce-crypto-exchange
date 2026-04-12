import { LegalLayout } from '../LegalLayout.js'

export function TermsOfUsePage() {
  return (
    <LegalLayout
      title="Terms of Use"
      lastUpdated="1 January 2025"
      intro="These Terms of Use govern your access to and use of the Arab Global Crypto Exchange (AGCE) platform, including all associated websites, mobile applications, APIs, and services. By creating an account or using any part of the platform, you agree to be bound by these terms in full. Please read them carefully before proceeding."
      sections={[
        {
          heading: 'Eligibility and Account Registration',
          body: 'You must be at least 18 years of age and legally permitted to use cryptocurrency services in your jurisdiction to register for an AGCE account. By registering, you represent that all information provided is accurate and that you will maintain its accuracy. AGCE reserves the right to refuse service, close accounts, or restrict access at its sole discretion where required by law or internal policy.',
        },
        {
          heading: 'Permitted and Prohibited Uses',
          body: 'You may use the AGCE platform for lawful trading, earning, and portfolio management activities. You may not use the platform for money laundering, terrorist financing, market manipulation, wash trading, spoofing, phishing, or any other illegal or fraudulent activity. Automated access via bots or scrapers is prohibited without prior written consent from AGCE.',
        },
        {
          heading: 'Intellectual Property',
          body: 'All content, branding, software, and technology on the AGCE platform is the exclusive property of Arab Global Crypto Exchange LLC or its licensors. Nothing in these Terms grants you any licence to reproduce, distribute, modify, or commercialise any part of the platform without prior written authorisation.',
        },
        {
          heading: 'Limitation of Liability and Indemnification',
          body: 'AGCE provides the platform on an "as is" basis. To the maximum extent permitted by law, AGCE shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform, including loss of profits or data. You agree to indemnify and hold harmless AGCE, its officers, directors, employees, and agents from any claims arising out of your breach of these Terms.',
        },
      ]}
    />
  )
}
