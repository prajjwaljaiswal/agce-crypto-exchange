import { useNavigate } from 'react-router-dom'
import './security-shared.css'

interface SecurityBreadcrumbProps {
  label: string
  // Defaults to navigating back to the Security landing. Override for
  // multi-step flows that want to step back within the same page.
  onBack?: () => void
}

export function SecurityBreadcrumb({ label, onBack }: SecurityBreadcrumbProps) {
  const navigate = useNavigate()
  const handleBack = onBack ?? (() => navigate('/user_profile/security'))

  return (
    <nav className="sec-breadcrumb" aria-label="Breadcrumb">
      <ol className="sec-breadcrumb__list">
        <li>
          <button type="button" className="sec-breadcrumb__link" onClick={handleBack}>
            Security
          </button>
        </li>
        <li className="sec-breadcrumb__sep" aria-hidden="true">
          ›
        </li>
        <li className="sec-breadcrumb__item--active" aria-current="page">
          {label}
        </li>
      </ol>
    </nav>
  )
}
