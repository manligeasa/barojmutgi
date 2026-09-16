// Created: 2026-09-15 08:54
import type { Field, RevisionCommandId, Template, WizardStep } from './types'

export type FieldValues = Record<string, string>

export function fieldsForStep(template: Template, step: WizardStep): Field[] {
  return template.fields.filter((f) => f.step === step)
}

/** '건너뛰기'나 'AI가 적절히 정하기'로 값을 채우지 않았을 때 쓰는 필드 타입별 중립 대체 문구. */
const TEXT_FIELD_DEFAULTS: Record<string, string> = {
  tone: '상황에 맞는 자연스럽고 정중한 말투로',
  length: '적절한 분량으로',
  subject: '감정에 어울리는 인물이나 소품을 자연스럽게 골라서',
}

export function applyAutoFill(field: Field): string {
  if (field.type === 'choice') {
    return field.options[0]?.label ?? '상황에 맞게'
  }
  return TEXT_FIELD_DEFAULTS[field.key] ?? '상황에 맞게 자연스럽게'
}

export function fillPrompt(template: Template, values: FieldValues): string {
  return template.promptPattern.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = values[key]?.trim()
    if (value) return value
    const field = template.fields.find((f) => f.key === key)
    return field ? applyAutoFill(field) : ''
  })
}

/** 필수인데 비어 있는 필드 중 최대 3개까지만 반환한다 (확인 화면 재질문 대상). */
export function computeMissingRequiredFields(template: Template, values: FieldValues): Field[] {
  return template.fields.filter((f) => f.required && !values[f.key]?.trim()).slice(0, 3)
}

const REVISION_SUFFIX: Record<RevisionCommandId, string> = {
  shorter: '\n\n위 요청에 대해 더 짧고 간결하게 다시 답해줘.',
  more_detailed: '\n\n위 요청에 대해 더 자세히 설명해줘.',
  warmer: '\n\n위 요청에 대해 더 따뜻하고 다정한 말투로 다시 답해줘.',
  more_professional: '\n\n위 요청에 대해 더 전문적인 표현으로 다시 답해줘.',
  simpler: '\n\n위 요청에 대해 쉬운 말로 다시 설명해줘.',
}

/** 이미 붙어 있는 수정 명령 접미사가 있으면 먼저 제거한 뒤 새 접미사를 붙여 중첩을 막는다. */
export function applyRevisionCommand(finalPrompt: string, id: RevisionCommandId): string {
  const base = Object.values(REVISION_SUFFIX).reduce(
    (text, suffix) => text.split(suffix).join(''),
    finalPrompt,
  )
  return base + REVISION_SUFFIX[id]
}
