import type { InstanceId, Jurisdiction } from '@agce/types'

const INSTANCE_TO_JURISDICTION: Record<InstanceId, Jurisdiction> = {
  india: 'INDIA',
  abudhabi: 'ABU_DHABI',
  dubai: 'DUBAI',
  global: 'GLOBAL',
}

export function mapInstanceToJurisdiction(id: InstanceId): Jurisdiction {
  return INSTANCE_TO_JURISDICTION[id]
}
