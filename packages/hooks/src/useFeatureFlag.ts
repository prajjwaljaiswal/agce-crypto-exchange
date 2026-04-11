import type { FeatureFlags } from '@agce/types'
import { useInstanceConfig } from './useInstanceConfig.js'

/**
 * Returns true if the given feature is enabled for the current exchange instance.
 */
export function useFeatureFlag(flag: keyof FeatureFlags): boolean {
  const config = useInstanceConfig()
  return config.features[flag]
}
