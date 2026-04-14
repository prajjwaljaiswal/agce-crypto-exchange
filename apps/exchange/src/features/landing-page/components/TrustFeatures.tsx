import { useState } from 'react'
import { HOW_IT_WORKS_STEPS, TRUST_CARDS } from '../data.js'

export function TrustFeatures() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="latest_resources">
      <div className="container">
        <div className="d-flex invest_tradetop">
          <div className="resourceslft">
            <h2>
              <span>ARAB GLOBAL Trade</span>
              Tour Safe and Trusted Crypto Exchange
            </h2>
          </div>
        </div>

        <div
          className="latest_resources_tabs"
          role="tablist"
          aria-label="Exchange highlights"
        >
          {TRUST_CARDS.map((card, index) => (
            <button
              key={card.id}
              type="button"
              role="tab"
              id={`latest-resources-tab-${card.id}`}
              aria-selected={activeTab === index}
              aria-controls={`latest-resources-panel-${card.id}`}
              className={activeTab === index ? 'active' : ''}
              onClick={() => setActiveTab(index)}
            >
              {card.tabLabel}
            </button>
          ))}
        </div>

        <div className="row latest_resources_cards_row">
          {TRUST_CARDS.map((card, index) => (
            <div
              key={card.id}
              id={`latest-resources-panel-${card.id}`}
              role="tabpanel"
              aria-labelledby={`latest-resources-tab-${card.id}`}
              className={`col-sm-4 latest_resources_col ${activeTab === index ? 'active' : ''}`}
            >
              <div className="resources_news">
                <div className="news_img">
                  <img className="blogimg dark_img" src={card.icon} alt={card.title} />
                </div>
                <div className="resources_cnt">
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
    </div>
  )
}
