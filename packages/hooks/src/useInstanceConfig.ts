import { indiaConfig, abudhabiConfig, dubaiConfig, globalConfig } from '@agce/config'
import type { InstanceConfig, InstanceId } from '@agce/types'

const configs: Record<InstanceId, InstanceConfig> = {
  india: indiaConfig,
  abudhabi: abudhabiConfig,
  dubai: dubaiConfig,
  global: globalConfig,
}

/**
 * Returns the InstanceConfig for the current build target.
 * The instance is set at build time via VITE_INSTANCE env var.
 * Defaults to 'global' if unset.
 */
export function useInstanceConfig(): InstanceConfig {
  const id = (import.meta.env as Record<string, string>)['VITE_INSTANCE'] as InstanceId | undefined

  return configs[id ?? 'global']
}
