import { LegalLayout } from '../LegalLayout.js'

export function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated="1 January 2025"
      intro="This Privacy Policy explains how Arab Global Crypto Exchange (AGCE) collects, uses, stores, and shares your personal data when you use our platform. AGCE is committed to protecting your privacy and complying with applicable data protection laws, including UAE Federal Law No. 45 of 2021 on Personal Data Protection."
      sections={[
        {
          heading: 'Data We Collect',
          body: 'We collect information you provide directly, such as name, email address, phone number, identity documents, and financial information submitted during KYC verification. We also collect automatically generated data including IP addresses, device identifiers, browser types, and usage logs when you access our platform.',
        },
        {
          heading: 'How We Use Your Data',
          body: 'Your data is used to operate and improve the AGCE platform, verify your identity, prevent fraud and money laundering, comply with legal obligations, and communicate service updates. We may also use aggregated, anonymised data for analytics purposes. We do not sell your personal data to third parties.',
        },
        {
          heading: 'Data Sharing and Disclosure',
          body: 'We may share your data with KYC/AML service providers, payment processors, regulatory authorities, and law enforcement agencies where required by law. All third-party processors are contractually bound to handle your data in accordance with applicable data protection standards.',
        },
        {
          heading: 'Data Retention and Your Rights',
          body: 'We retain personal data for as long as necessary to fulfil legal and regulatory obligations, typically a minimum of 5 years after account closure. You have the right to access, correct, or request deletion of your data subject to applicable legal restrictions. Submit requests to privacy@agce.com.',
        },
      ]}
    />
  )
}
