// Created: 2026-09-15 08:47
import categoriesJson from '../data/categories.json'
import glossaryJson from '../data/glossary.json'
import templatesJson from '../data/templates.json'
import { validateCategories, validateGlossary, validateTemplates } from './validation'

/**
 * 앱 부팅 시 1회만 실행되는 검증. 실패하면 콘솔에 에러를 남기고 빈 배열로 대체해
 * 화면이 완전히 깨지는 대신 데이터 없이 렌더링되게 한다.
 */
function safeValidate<T>(label: string, fn: () => T[]): T[] {
  try {
    return fn()
  } catch (error) {
    console.error(`[data] ${label} 검증 실패`, error)
    return []
  }
}

export const categories = safeValidate('categories.json', () => validateCategories(categoriesJson))
export const templates = safeValidate('templates.json', () => validateTemplates(templatesJson))
export const glossaryTerms = safeValidate('glossary.json', () => validateGlossary(glossaryJson))
