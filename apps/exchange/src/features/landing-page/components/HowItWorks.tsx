import { HOW_IT_WORKS_STEPS } from '../data.js'

export function HowItWorks() {
  return (
    <div className="howwork_bl">
      <div className="container">
        <h2>How it works</h2>
        <p>A powerful crypto platform designed for speed, security</p>

        <ul className="howwork_list">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <li key={step.step}>
              <div className="howwork_icon">
                <img src={step.icon} alt={step.title} />
              </div>
              <span className="steps">{step.step}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
