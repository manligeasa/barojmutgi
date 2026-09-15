// Created: 2026-09-15 08:47
import { z } from 'zod'
import type { Category, GlossaryTerm, Template } from './types'

const categoryIdSchema = z.enum([
  'writing-sns',
  'work-report',
  'relationship',
  'learning-ai-terms',
  'health-life-log',
  'travel-event',
  'image-generation',
  'my-prompt',
])

const wizardStepSchema = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)])

const fieldBaseSchema = {
  key: z.string().min(1),
  label: z.string().min(1),
  required: z.boolean(),
  step: wizardStepSchema,
  placeholder: z.string().optional(),
  helpText: z.string().optional(),
}

export const fieldSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('text'),
    ...fieldBaseSchema,
    maxLength: z.number().positive().optional(),
  }),
  z.object({
    type: z.literal('choice'),
    ...fieldBaseSchema,
    options: z
      .array(z.object({ value: z.string().min(1), label: z.string().min(1) }))
      .min(1),
    allowCustom: z.boolean().optional(),
  }),
])

export const revisionCommandIdSchema = z.enum([
  'shorter',
  'more_detailed',
  'warmer',
  'more_professional',
  'simpler',
])

export const categorySchema = z.object({
  id: categoryIdSchema,
  title: z.string().min(1),
  icon: z.string().min(1),
  description: z.string().min(1),
})

export const templateSchema = z.object({
  id: z.string().min(1),
  category: categoryIdSchema,
  title: z.string().min(1),
  searchKeywords: z.array(z.string().min(1)),
  description: z.string().min(1),
  fields: z.array(fieldSchema).min(1),
  promptPattern: z.string().min(1),
  safetyType: z.enum(['general', 'health', 'legal']),
  revisionCommands: z.array(revisionCommandIdSchema),
  supportsImage: z.boolean().optional(),
})

export const glossaryTermSchema = z.object({
  term: z.string().min(1),
  english: z.string().optional(),
  oneLine: z.string().min(1),
  analogy: z.string().min(1),
  action: z.string().min(1),
  related: z.array(z.string()).optional(),
})

export const categoriesFileSchema = z.array(categorySchema)
export const templatesFileSchema = z.array(templateSchema)
export const glossaryFileSchema = z.array(glossaryTermSchema)

/**
 * zod 스키마만으로는 promptPattern의 {key} 토큰이 fields에 실제로 선언돼 있는지 검증할 수 없어
 * 별도 교차검증 함수로 확인한다. 선언되지 않은 placeholder가 있으면 에러를 던진다.
 */
export function assertPlaceholdersMatchFields(template: Template): void {
  const usedKeys = [...template.promptPattern.matchAll(/\{(\w+)\}/g)].map((m) => m[1])
  const declaredKeys = new Set(template.fields.map((f) => f.key))
  const missing = usedKeys.filter((key) => !declaredKeys.has(key))
  if (missing.length > 0) {
    throw new Error(
      `템플릿 "${template.id}"의 promptPattern이 선언되지 않은 필드를 참조합니다: ${missing.join(', ')}`,
    )
  }
}

export function validateCategories(data: unknown): Category[] {
  return categoriesFileSchema.parse(data)
}

export function validateTemplates(data: unknown): Template[] {
  const templates = templatesFileSchema.parse(data)
  templates.forEach(assertPlaceholdersMatchFields)
  return templates
}

export function validateGlossary(data: unknown): GlossaryTerm[] {
  return glossaryFileSchema.parse(data)
}
