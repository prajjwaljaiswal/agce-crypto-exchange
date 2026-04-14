export interface KycFaqItem {
  question: string
  answer: string
  defaultOpen?: boolean
}

export const KYC_FAQS: KycFaqItem[] = [
  {
    question: 'How long does KYC take?',
    answer: 'KYC verification usually takes 24-48 hours after submission.',
    defaultOpen: true,
  },
  {
    question: 'What documents do I need for KYC?',
    answer: 'A valid government-issued ID and tax document are required.',
  },
  {
    question: 'Can I use the app without completing KYC?',
    answer: 'Limited features are available, but full access requires KYC.',
  },
  {
    question: 'Is my personal information secure in the KYC process?',
    answer:
      'Your data is encrypted and handled according to strict security standards.',
  },
  {
    question: 'Can I resubmit my KYC if it gets rejected?',
    answer:
      'Yes, if your KYC is rejected or partially rejected, you can reupload the requested documents and resubmit.',
  },
  {
    question: 'Do I need to upload both front and back of my ID?',
    answer:
      'Some ID documents require both front and back images. The upload fields will appear based on the selected document type.',
  },
  {
    question: 'Is live selfie mandatory for KYC?',
    answer:
      'Yes, a live selfie captured through your device camera is required to complete KYC verification.',
  },
]
