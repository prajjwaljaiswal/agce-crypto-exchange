import { LegalLayout } from '../LegalLayout.js'

export function ComplaintsPage() {
  return (
    <LegalLayout
      title="Complaints Policy"
      lastUpdated="1 January 2025"
      intro="Arab Global Crypto Exchange (AGCE) is committed to providing a high standard of service to all users. We take complaints seriously and aim to resolve all issues fairly, thoroughly, and promptly. This policy outlines how to submit a complaint and what you can expect from our resolution process."
      sections={[
        {
          heading: 'How to Submit a Complaint',
          body: 'Complaints may be submitted via email to complaints@agce.com, through the in-app support chat, or by writing to our registered office address. Please include your full name, registered email address, account ID, a clear description of the issue, any relevant transaction IDs or screenshots, and the outcome you are seeking. This information helps us investigate your complaint efficiently.',
        },
        {
          heading: 'Acknowledgement and Investigation',
          body: 'We will acknowledge receipt of your complaint within 2 business days. A dedicated complaints officer will be assigned to investigate the matter. You may be contacted for additional information during the investigation. We aim to resolve all complaints within 15 business days of acknowledgement. For complex cases, we will notify you if more time is required and provide a revised timeline.',
        },
        {
          heading: 'Resolution and Appeals',
          body: 'Upon completion of our investigation, we will provide you with a written response outlining our findings and any remedial action we have taken or propose to take. If you are not satisfied with our response, you may escalate the matter to the relevant financial regulator in your jurisdiction — ADGM Financial Services Regulatory Authority, VARA, or the applicable authority in your country of residence.',
        },
        {
          heading: 'Record Keeping',
          body: 'AGCE maintains records of all complaints received, investigations conducted, and outcomes reached for a minimum of 5 years. These records are reviewed periodically by our compliance team to identify systemic issues and drive continuous improvement in our products and services.',
        },
      ]}
    />
  )
}
