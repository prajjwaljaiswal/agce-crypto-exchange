import type { ReactNode } from 'react'

interface FaqEntry {
  id: string
  question: string
  body: ReactNode
}

const FAQ_ENTRIES: FaqEntry[] = [
  {
    id: 'withdraw-faq-one',
    question: 'How to Withdraw Crypto?',
    body: (
      <>
        To withdraw crypto, go to the withdrawal section, select your cryptocurrency, enter
        the recipient wallet address, choose the correct network, and specify the amount.
        Review the details carefully before confirming the withdrawal. Processing time may
        vary based on network congestion and withdrawal policies.
      </>
    ),
  },
  {
    id: 'withdraw-faq-two',
    question: 'How to Withdraw Crypto Step-by-step Guide',
    body: (
      <ul>
        <li>
          <strong>Go to the Withdrawal Section</strong> – Navigate to the withdrawal page.
        </li>
        <li>
          <strong>Select Your Crypto</strong> – Choose the cryptocurrency you want to
          withdraw.
        </li>
        <li>
          <strong>Enter the Wallet Address</strong> – Make sure the address is correct and
          belongs to the selected blockchain network.
        </li>
        <li>
          <strong>Choose the Network</strong> – Select the correct blockchain network
          (e.g., BEP20, ERC20, TRC20, Polygon).
        </li>
        <li>
          <strong>Enter the Amount</strong> – Specify the amount you want to withdraw,
          ensuring it meets the minimum withdrawal limit.
        </li>
        <li>
          <strong>Confirm &amp; Submit</strong> – Review all details carefully and confirm
          the withdrawal.
        </li>
        <li>
          <strong>Wait for Processing</strong> – Withdrawals are processed based on network
          congestion and request approval.
        </li>
      </ul>
    ),
  },
  {
    id: 'withdraw-faq-three',
    question: "Withdrawal hasn't arrived?",
    body: (
      <ul>
        <li>
          <strong>Check Transaction Status</strong> – Use a blockchain explorer to track
          the transaction.
        </li>
        <li>
          <strong>Verify the Wallet Address</strong> – Ensure the recipient address is
          correct.
        </li>
        <li>
          <strong>Confirm Network Selection</strong> – The chosen network should match the
          recipient&apos;s wallet.
        </li>
        <li>
          <strong>Check for Pending Processing</strong> – Some withdrawals require manual
          approval.
        </li>
      </ul>
    ),
  },
]

export function WithdrawFaq() {
  return (
    <>
      <h2>FAQ</h2>
      <div className="accordion accordion-flush" id="withdrawFaqAccordion">
        {FAQ_ENTRIES.map((entry) => (
          <div key={entry.id} className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#${entry.id}`}
                aria-expanded="false"
                aria-controls={entry.id}
              >
                {entry.question}
              </button>
            </h2>
            <div
              id={entry.id}
              className="accordion-collapse collapse"
              data-bs-parent="#withdrawFaqAccordion"
            >
              <div className="accordion-body">{entry.body}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
