// Created: 2026-09-15 08:54
import { describe, expect, it } from 'vitest'
import {
  applyAutoFill,
  applyRevisionCommand,
  computeMissingRequiredFields,
  fieldsForStep,
  fillPrompt,
} from './prompt-engine'
import type { Template } from './types'

const template: Template = {
  id: 'test-template',
  category: 'my-prompt',
  title: '테스트 템플릿',
  searchKeywords: [],
  description: '',
  fields: [
    { key: 'topic', label: '무엇에 대해?', type: 'text', required: true, step: 1, placeholder: '예: 텃밭' },
    { key: 'detail', label: '추가 설명', type: 'text', required: false, step: 2 },
    {
      key: 'tone',
      label: '말투',
      type: 'choice',
      required: true,
      step: 3,
      options: [
        { value: 'friendly', label: '친근하게' },
        { value: 'formal', label: '정중하게' },
      ],
    },
    {
      key: 'length',
      label: '길이',
      type: 'choice',
      required: false,
      step: 4,
      options: [{ value: 'short', label: '짧게' }],
    },
  ],
  promptPattern: '주제: {topic}. 설명: {detail}. 말투: {tone}. 길이: {length}.',
  safetyType: 'general',
  revisionCommands: ['shorter', 'warmer'],
}

describe('fieldsForStep', () => {
  it('해당 단계에 속한 필드만 반환한다', () => {
    expect(fieldsForStep(template, 1).map((f) => f.key)).toEqual(['topic'])
    expect(fieldsForStep(template, 3).map((f) => f.key)).toEqual(['tone'])
  })
})

describe('fillPrompt', () => {
  it('입력된 값으로 placeholder를 채운다', () => {
    const result = fillPrompt(template, { topic: '텃밭 가꾸기', detail: '베란다', tone: '친근하게', length: '짧게' })
    expect(result).toBe('주제: 텃밭 가꾸기. 설명: 베란다. 말투: 친근하게. 길이: 짧게.')
  })

  it('비어 있는 필드는 자동 대체 문구로 채운다', () => {
    const result = fillPrompt(template, { topic: '텃밭 가꾸기' })
    expect(result).toContain('설명: 상황에 맞게 자연스럽게')
    expect(result).toContain('말투: 친근하게') // choice 필드는 첫 옵션 label로 대체
    expect(result).toContain('길이: 짧게')
  })

  it('공백만 있는 값은 비어 있는 것으로 취급한다', () => {
    const result = fillPrompt(template, { topic: '   ' })
    expect(result).toContain('주제: 상황에 맞게 자연스럽게')
  })
})

describe('computeMissingRequiredFields', () => {
  it('필수이면서 비어 있는 필드만 반환한다', () => {
    const missing = computeMissingRequiredFields(template, { topic: '텃밭' })
    expect(missing.map((f) => f.key)).toEqual(['tone'])
  })

  it('최대 3개까지만 반환한다', () => {
    const manyRequiredTemplate: Template = {
      ...template,
      fields: [
        { key: 'a', label: 'a', type: 'text', required: true, step: 1 },
        { key: 'b', label: 'b', type: 'text', required: true, step: 1 },
        { key: 'c', label: 'c', type: 'text', required: true, step: 1 },
        { key: 'd', label: 'd', type: 'text', required: true, step: 1 },
      ],
    }
    const missing = computeMissingRequiredFields(manyRequiredTemplate, {})
    expect(missing).toHaveLength(3)
  })
})

describe('applyAutoFill', () => {
  it('choice 필드는 첫 번째 옵션의 label을 반환한다', () => {
    const field = template.fields.find((f) => f.key === 'tone')!
    expect(applyAutoFill(field)).toBe('친근하게')
  })

  it('알려진 text 필드 key는 사전 정의된 문구를 반환한다', () => {
    const toneTextField = { key: 'tone', label: '', type: 'text' as const, required: false, step: 1 as const }
    expect(applyAutoFill(toneTextField)).toBe('상황에 맞는 자연스럽고 정중한 말투로')

    const subjectTextField = { key: 'subject', label: '', type: 'text' as const, required: false, step: 2 as const }
    expect(applyAutoFill(subjectTextField)).toBe('감정에 어울리는 인물이나 소품을 자연스럽게 골라서')
  })

  it('알려지지 않은 text 필드는 범용 문구를 반환한다', () => {
    const field = template.fields.find((f) => f.key === 'detail')!
    expect(applyAutoFill(field)).toBe('상황에 맞게 자연스럽게')
  })
})

describe('applyRevisionCommand', () => {
  it('수정 명령 접미사를 끝에 붙인다', () => {
    const result = applyRevisionCommand('완성된 프롬프트', 'shorter')
    expect(result.startsWith('완성된 프롬프트')).toBe(true)
    expect(result).toContain('더 짧고 간결하게')
  })

  it('다른 수정 명령을 다시 적용하면 이전 접미사를 제거하고 새로 붙인다 (중첩 방지)', () => {
    const once = applyRevisionCommand('완성된 프롬프트', 'shorter')
    const twice = applyRevisionCommand(once, 'warmer')
    expect(twice).not.toContain('더 짧고 간결하게')
    expect(twice).toContain('더 따뜻하고 다정한')
    expect(twice.startsWith('완성된 프롬프트')).toBe(true)
  })
})
