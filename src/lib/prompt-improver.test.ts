// Created: 2026-09-15 09:08
import { describe, expect, it } from 'vitest'
import { buildImprovedPrompt, checkPromptElements } from './prompt-improver'

describe('checkPromptElements', () => {
  it('8개 요소를 모두 반환한다', () => {
    const checks = checkPromptElements('아무 내용 없는 문장')
    expect(checks).toHaveLength(8)
    expect(checks.map((c) => c.key)).toEqual([
      'role',
      'situation',
      'audience',
      'purpose',
      'format',
      'tone',
      'length',
      'caution',
    ])
  })

  it('역할 표현이 있으면 role을 충족으로 판단한다', () => {
    const checks = checkPromptElements('너는 친절한 선생님이다.')
    expect(checks.find((c) => c.key === 'role')?.present).toBe(true)
  })

  it('역할 표현이 없으면 role을 미충족으로 판단한다', () => {
    const checks = checkPromptElements('블로그 글 하나 써줘.')
    expect(checks.find((c) => c.key === 'role')?.present).toBe(false)
  })

  it('숫자+단위나 분량 관련 표현이 있으면 length를 충족으로 판단한다', () => {
    expect(checkPromptElements('300자 이내로 써줘.').find((c) => c.key === 'length')?.present).toBe(true)
    expect(checkPromptElements('짧게 써줘.').find((c) => c.key === 'length')?.present).toBe(true)
    expect(checkPromptElements('아무 조건 없이 써줘.').find((c) => c.key === 'length')?.present).toBe(false)
  })

  it('말투 관련 표현이 있으면 tone을 충족으로 판단한다', () => {
    expect(checkPromptElements('정중하게 작성해줘.').find((c) => c.key === 'tone')?.present).toBe(true)
    expect(checkPromptElements('그냥 작성해줘.').find((c) => c.key === 'tone')?.present).toBe(false)
  })

  it('제외/주의 관련 표현이 있으면 caution을 충족으로 판단한다', () => {
    expect(checkPromptElements('전문 용어는 빼고 써줘.').find((c) => c.key === 'caution')?.present).toBe(true)
    expect(checkPromptElements('편하게 써줘.').find((c) => c.key === 'caution')?.present).toBe(false)
  })
})

describe('buildImprovedPrompt', () => {
  it('채운 답이 없으면 원문을 그대로(trim만 해서) 반환한다', () => {
    expect(buildImprovedPrompt('  블로그 글 써줘  ', {})).toBe('블로그 글 써줘')
  })

  it('채운 답을 "요소: 값" 형태로 원문 끝에 보강한다', () => {
    const result = buildImprovedPrompt('블로그 글 써줘', { role: '친절한 작가', length: '500자 이내' })
    expect(result).toBe('블로그 글 써줘\n\n역할: 친절한 작가\n분량: 500자 이내')
  })

  it('빈 문자열이나 공백만 있는 답은 보강에서 제외한다', () => {
    const result = buildImprovedPrompt('블로그 글 써줘', { role: '   ', tone: '따뜻하게' })
    expect(result).toBe('블로그 글 써줘\n\n말투: 따뜻하게')
  })
})
