// Created: 2026-09-15 08:47

export type CategoryId =
  | 'writing-sns'
  | 'work-report'
  | 'relationship'
  | 'learning-ai-terms'
  | 'health-life-log'
  | 'travel-event'
  | 'image-generation'
  | 'my-prompt'

export interface Category {
  id: CategoryId
  title: string
  icon: string
  description: string
}

export type FieldType = 'text' | 'choice'

/** 4단계 위저드 중 이 필드를 어느 단계에서 물을지 명시한다. */
export type WizardStep = 1 | 2 | 3 | 4

interface FieldBase {
  key: string
  label: string
  required: boolean
  step: WizardStep
  placeholder?: string
  helpText?: string
}

export interface TextField extends FieldBase {
  type: 'text'
  maxLength?: number
}

export interface ChoiceOption {
  value: string
  label: string
}

export interface ChoiceField extends FieldBase {
  type: 'choice'
  options: ChoiceOption[]
  allowCustom?: boolean
}

export type Field = TextField | ChoiceField

export type SafetyType = 'general' | 'health' | 'legal'

export const REVISION_COMMANDS = [
  'shorter',
  'more_detailed',
  'warmer',
  'more_professional',
  'simpler',
] as const

export type RevisionCommandId = (typeof REVISION_COMMANDS)[number]

export interface Template {
  id: string
  category: CategoryId
  title: string
  searchKeywords: string[]
  description: string
  fields: Field[]
  promptPattern: string
  safetyType: SafetyType
  revisionCommands: RevisionCommandId[]
  /** 사진 미리보기 단계를 먼저 보여줘야 하는 이미지 프롬프트 템플릿인지 여부 */
  supportsImage?: boolean
}

export interface GlossaryTerm {
  term: string
  english?: string
  oneLine: string
  analogy: string
  action: string
  related?: string[]
}
