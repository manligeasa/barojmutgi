// Created: 2026-09-15 09:14
import { SAFETY_MESSAGES } from '../../lib/safety'
import type { SafetyType } from '../../lib/types'

interface ExpertDisclaimerProps {
  safetyType: SafetyType
}

export function ExpertDisclaimer({ safetyType }: ExpertDisclaimerProps) {
  if (safetyType === 'general') return null

  return (
    <div role="note" className="rounded-xl border-2 border-danger bg-red-50 px-4 py-3 text-lg text-danger">
      {SAFETY_MESSAGES[safetyType]}
    </div>
  )
}
