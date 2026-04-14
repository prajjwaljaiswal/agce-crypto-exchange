import type { PerkStep } from '../types.js'

interface Props {
  steps: PerkStep[]
}

export function NewcomerPerks({ steps }: Props) {
  return (
    <div className="new_steps_crypto">
      <h3>Newcomer Perks</h3>
      <div className="steps_block_dash_outer">
        {steps.map((step) => (
          <div
            key={step.step}
            className={`steps_block_dash${step.active ? ' active' : ''}`}
          >
            <div className="steps_cnt">
              <span className="step_number">Step {step.step}</span>
              <h5>
                {step.title}
                {step.highlight ? <> <span>{step.highlight}</span></> : null}
                {step.description ? null : '...'}
              </h5>
              {step.description ? <p>{step.description}</p> : null}
              {step.countdown?.length ? (
                <ul className="verifylist">
                  {step.countdown.map((value, i) => (
                    <li key={i}>{value}</li>
                  ))}
                </ul>
              ) : null}
              <button type="button" className="verify_btn">
                {step.ctaLabel}
              </button>
            </div>
            <div className="steps_block_dash_img">
              <img src={step.image} alt="Newcomer Perks" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
