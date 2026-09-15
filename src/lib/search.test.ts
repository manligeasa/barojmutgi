// Created: 2026-09-15 08:50
import { describe, expect, it } from 'vitest'
import { searchTemplates } from './search'
import type { Template } from './types'

const sample: Template[] = [
  {
    id: 't1',
    category: 'writing-sns',
    title: '블로그 글 초안',
    searchKeywords: ['블로그', '글쓰기'],
    description: '블로그에 올릴 글을 만듭니다.',
    fields: [],
    promptPattern: '',
    safetyType: 'general',
    revisionCommands: [],
  },
  {
    id: 't2',
    category: 'work-report',
    title: '회의록 정리',
    searchKeywords: ['회의', '정리'],
    description: '회의 내용을 요약합니다.',
    fields: [],
    promptPattern: '',
    safetyType: 'general',
    revisionCommands: [],
  },
  {
    id: 't3',
    category: 'writing-sns',
    title: 'SNS 캡션',
    searchKeywords: ['SNS', '캡션'],
    description: '짧은 글을 블로그처럼 다듬어 씁니다.',
    fields: [],
    promptPattern: '',
    safetyType: 'general',
    revisionCommands: [],
  },
]

describe('searchTemplates', () => {
  it('검색어가 없으면 전체 풀을 반환한다', () => {
    expect(searchTemplates(sample, '')).toHaveLength(3)
  })

  it('categoryId가 있으면 해당 카테고리만 대상으로 한다', () => {
    const result = searchTemplates(sample, '', 'writing-sns')
    expect(result.map((t) => t.id).sort()).toEqual(['t1', 't3'])
  })

  it('제목 일치가 키워드/설명 일치보다 높은 점수를 받아 먼저 나온다', () => {
    const result = searchTemplates(sample, '블로그')
    expect(result[0].id).toBe('t1')
  })

  it('공백과 대소문자를 무시하고 매칭한다', () => {
    const result = searchTemplates(sample, ' 회 의 ')
    expect(result.map((t) => t.id)).toEqual(['t2'])
  })

  it('아무 것도 일치하지 않으면 빈 배열을 반환한다', () => {
    expect(searchTemplates(sample, '존재하지않는검색어')).toEqual([])
  })
})
