import { LegalLayout } from '../LegalLayout.js'

export function GeneralDisclaimerPage() {
  return (
    <LegalLayout
      title="General Disclaimer"
      lastUpdated="1 January 2025"
      intro="This General Disclaimer applies to all content, data, tools, and services provided by Arab Global Crypto Exchange (AGCE) through its website, mobile applications, and API. By accessing any part of the AGCE platform, you acknowledge and accept the limitations set out below."
      sections={[
        {
          heading: 'No Financial Advice',
          body: 'Nothing on the AGCE platform constitutes financial, investment, legal, or tax advice. Market data, price charts, analysis tools, blog content, and any other information published by AGCE are provided for informational purposes only. You should consult a qualified financial adviser before making any investment decision.',
        },
        {
          heading: 'Accuracy of Information',
          body: 'While AGCE makes reasonable efforts to ensure that information on the platform is accurate and up to date, we make no representations or warranties of any kind — express or implied — regarding the completeness, accuracy, reliability, or suitability of the information provided. Market data may be delayed and should not be relied upon for time-sensitive trading decisions.',
        },
        {
          heading: 'Third-Party Content and Links',
          body: 'The AGCE platform may include links to third-party websites, tools, or services. These are provided for convenience only. AGCE does not endorse and is not responsible for the content, privacy practices, or accuracy of any third-party sites. Accessing third-party content is at your own risk.',
        },
        {
          heading: 'No Warranty and Limitation of Liability',
          body: 'The AGCE platform is provided on an "as is" and "as available" basis without warranties of any kind. AGCE does not warrant that the platform will be uninterrupted, error-free, or free of viruses or other harmful components. To the fullest extent permitted by applicable law, AGCE expressly disclaims all liability for any loss or damage arising from your reliance on the platform or its content.',
        },
      ]}
    />
  )
}
