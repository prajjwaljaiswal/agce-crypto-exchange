import type { ReactNode } from 'react'
import type { FeatureFlags } from '@agce/types'
import { useFeatureFlag } from '@agce/hooks'

interface FeatureGateProps {
  flag: keyof FeatureFlags
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Renders children only when the feature flag is enabled for the current instance.
 * Use this to conditionally show sections that aren't available in all jurisdictions.
 */
export function FeatureGate({ flag, children, fallback = null }: FeatureGateProps) {
  const enabled = useFeatureFlag(flag)
  return enabled ? <>{children}</> : <>{fallback}</>
}
