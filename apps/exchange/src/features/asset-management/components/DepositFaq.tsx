import type { ReactNode } from 'react'

interface FaqEntry {
  id: string
  question: string
  body: ReactNode
}

const FAQ_ENTRIES: FaqEntry[] = [
  {
    id: 'flush-collapseOne',
    question: 'How do I deposit crypto on AGCE?',
    body: (
      <>
        Select a coin and network, generate your deposit address, then send funds to that
        address from your external wallet. Always make sure the network you select on AGCE
        matches the network you use to send—wrong networks can result in loss of funds.
      </>
    ),
  },
  {
    id: 'flush-collapseTwo',
    question: 'Deposit crypto — step by step',
    body: (
      <ul>
        <li>
          <strong>Open Deposit</strong> – Go to <strong>Wallet</strong> →{' '}
          <strong>Deposit</strong>.
        </li>
        <li>
          <strong>Select coin</strong> – Pick the asset you want to deposit.
        </li>
        <li>
          <strong>Select network</strong> – Choose the same network you&apos;ll use to send
          (e.g., TRC20 / ERC20 / BEP20).
        </li>
        <li>
          <strong>Generate address</strong> – Tap <strong>Generate Address</strong> to view
          the address/QR.
        </li>
        <li>
          <strong>Send &amp; confirm</strong> – Send from your wallet and wait for
          blockchain confirmations.
        </li>
      </ul>
    ),
  },
  {
    id: 'flush-collapseThree',
    question: "My deposit hasn't arrived — what should I do?",
    body: (
      <ul>
        <li>
          <strong>Check TxID</strong> – Confirm the transaction is successful on a
          blockchain explorer.
        </li>
        <li>
          <strong>Verify network</strong> – The network you used to send must match the
          network selected on AGCE.
        </li>
        <li>
          <strong>Check address</strong> – Make sure the deposit address is correct (and
          memo/tag if required).
        </li>
        <li>
          <strong>Wait a bit</strong> – During congestion, confirmations can take longer
          than usual.
        </li>
        <li>
          <strong>Contact support</strong> – Share the coin, amount, network, and TxID if
          it&apos;s still not credited.
        </li>
      </ul>
    ),
  },
]

export function DepositFaq() {
  return (
    <div className="faq_container">
      <h2>FAQ</h2>
      <div className="accordion accordion-flush" id="accordionFlushExample">
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
              data-bs-parent="#accordionFlushExample"
            >
              <div className="accordion-body">{entry.body}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
