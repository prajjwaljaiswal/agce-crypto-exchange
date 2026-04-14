import type { Jurisdiction } from './auth.js'

export type DiditStatus =
  | 'Not Started'
  | 'In Progress'
  | 'In Review'
  | 'Approved'
  | 'Declined'
  | 'Resubmitted'
  | 'Expired'
  | 'Abandoned'

export type KycLevel = 'none' | 'standard' | 'advanced'

export interface KycDecision {
  id_verified?: boolean
  liveness_passed?: boolean
  face_match_passed?: boolean
  aml_flagged?: boolean
  decline_reason?: string
}

export interface KycStartSessionPayload {
  jurisdiction?: Jurisdiction
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
}

export interface KycSessionResponse {
  sessionId: string
  diditUrl: string
  status: DiditStatus
  level: KycLevel
  jurisdiction?: Jurisdiction
}

export interface KycStatusResponse {
  status: DiditStatus
  level: KycLevel
  sessionId?: string
  jurisdiction?: Jurisdiction
  decision?: KycDecision
  updatedAt?: string
}
