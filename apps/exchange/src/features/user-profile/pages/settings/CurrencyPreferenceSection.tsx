import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { authApi } from '../../../../lib/auth-api.js'
import { formatApiError } from '../../../../lib/errors.js'

interface CurrencyOption {
  code: string
  label: string
  icon: string
  iconWidth?: string
}

const CURRENCIES: CurrencyOption[] = [
  {
    code: 'USDT',
    label: 'Tether USD (USDT)',
    icon: '/images/icon/tether.png',
  },
  {
    code: 'BTC',
    label: 'BTC',
    icon: '/images/icon/btc copy.png',
    iconWidth: '50px',
  },
  { code: 'BNB', label: 'BNB', icon: '/images/icon/bnb copy.png' },
]

interface Props {
  initialCurrency?: string
  onSaved?: (currency: string) => void
}

export function CurrencyPreferenceSection({ initialCurrency = 'USDT', onSaved }: Props) {
  const queryClient = useQueryClient()
  const [selected, setSelected] = useState(initialCurrency)

  // /me loads async — when AuthProvider populates user.preferredCurrency,
  // initialCurrency will change and we need to resync the local state.
  useEffect(() => {
    setSelected(initialCurrency)
  }, [initialCurrency])

  const mutation = useMutation({
    mutationFn: (currency: string) => authApi.updatePreferredCurrency({ currency }),
    onSuccess: (_, currency) => {
      toast.success('Currency preference saved')
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
      onSaved?.(currency)
    },
    onError: (error) => toast.error(formatApiError(error, 'Could not save currency preference.')),
  })

  return (
    <div className="twofactor_outer_s">
      <h5>Currency Preference</h5>
      <p>Select your preferred display currency for all markets</p>

      <div className="two_factor_list">
        <div className="currency_list_b">
          <ul>
            {CURRENCIES.map((c) => {
              const isActive = c.code === selected
              return (
                <li
                  key={c.code}
                  className={isActive ? 'active' : ''}
                  onClick={() => setSelected(c.code)}
                  style={{ cursor: 'pointer' }}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isActive}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setSelected(c.code)
                    }
                  }}
                >
                  <div className="currency_bit">
                    <img
                      src={c.icon}
                      className="img-fluid"
                      alt={c.code}
                      width={c.iconWidth}
                    />
                  </div>
                  <h6>{c.label}</h6>
                  <div className="vector_bottom">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="60"
                      height="52"
                      viewBox="0 0 60 52"
                      fill="none"
                    >
                      <path d="M59.6296 0L60 52H0L59.6296 0Z" fill="#3B3B3B" />
                    </svg>
                  </div>
                </li>
              )
            })}
          </ul>
          <div className="savebtn">
            <button
              type="button"
              className="p-3"
              disabled={mutation.isPending || selected === initialCurrency}
              onClick={() => mutation.mutate(selected)}
            >
              {mutation.isPending ? 'Saving…' : 'Save Currency Preference'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
