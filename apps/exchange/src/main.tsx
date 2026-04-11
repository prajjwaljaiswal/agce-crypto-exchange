import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Phase 2 — Exchange trading platform
// Routes: /trade/:symbol, /futures/:symbol, /margin/:symbol,
//         /wallet, /account, /p2p, /earn, /auth/login, /auth/register

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'system-ui', color: '#888' }}>
      Exchange app — Phase 2
    </div>
  </StrictMode>,
)
