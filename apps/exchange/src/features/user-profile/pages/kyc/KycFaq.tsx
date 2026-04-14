import { KYC_FAQS } from './faqData.js'

export function KycFaq() {
  return (
    <div className="faq_section">
      <h4>Faq</h4>
      <div className="table-responsive">
        {KYC_FAQS.map((faq) => (
          <div
            key={faq.question}
            className={`faq_item ${faq.defaultOpen ? 'active' : ''}`}
          >
            <button type="button" className="faq_question">
              {faq.question}
              <span className="icon">
                <i className="ri-arrow-down-s-line" />
              </span>
            </button>
            <div className="faq_answer">
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
