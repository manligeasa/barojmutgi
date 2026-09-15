// Created: 2026-09-15 08:47
import { describe, expect, it } from 'vitest'
import categoriesData from '../data/categories.json'
import glossaryData from '../data/glossary.json'
import templatesData from '../data/templates.json'
import type { CategoryId } from './types'
import {
  assertPlaceholdersMatchFields,
  validateCategories,
  validateGlossary,
  validateTemplates,
} from './validation'

describe('categories.json', () => {
  it('스키마를 통과하고 정확히 8개의 카테고리를 포함한다', () => {
    const categories = validateCategories(categoriesData)
    expect(categories).toHaveLength(8)
  })

  it('카테고리 id가 중복되지 않는다', () => {
    const categories = validateCategories(categoriesData)
    const ids = categories.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('templates.json', () => {
  it('스키마를 통과한다', () => {
    expect(() => validateTemplates(templatesData)).not.toThrow()
  })

  it('모든 promptPattern의 {key} 토큰이 fields에 선언돼 있다', () => {
    const templates = validateTemplates(templatesData)
    templates.forEach((t) => {
      expect(() => assertPlaceholdersMatchFields(t)).not.toThrow()
    })
  })

  it('템플릿 id가 중복되지 않는다', () => {
    const templates = validateTemplates(templatesData)
    const ids = templates.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('모든 템플릿의 category가 실제 존재하는 카테고리를 가리킨다', () => {
    const categories = validateCategories(categoriesData)
    const validIds = new Set<CategoryId>(categories.map((c) => c.id))
    const templates = validateTemplates(templatesData)
    templates.forEach((t) => {
      expect(validIds.has(t.category)).toBe(true)
    })
  })

  it('health 또는 image 지원 템플릿을 최소 1개씩 포함한다', () => {
    const templates = validateTemplates(templatesData)
    expect(templates.some((t) => t.safetyType === 'health')).toBe(true)
    expect(templates.some((t) => t.supportsImage)).toBe(true)
  })
})

describe('glossary.json', () => {
  it('스키마를 통과한다', () => {
    expect(() => validateGlossary(glossaryData)).not.toThrow()
  })

  it('용어가 중복되지 않는다', () => {
    const terms = validateGlossary(glossaryData)
    const names = terms.map((t) => t.term)
    expect(new Set(names).size).toBe(names.length)
  })
})
