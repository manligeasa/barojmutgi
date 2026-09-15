// Created: 2026-09-15 08:50
import type { CategoryId, Template } from './types'

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '')
}

/**
 * 제목(가중치 3) > 검색 키워드(2) > 설명(1) 순으로 점수를 매겨 정렬한다.
 * query가 비어 있으면 (카테고리 필터만 적용한) 전체 풀을 그대로 반환한다.
 */
export function searchTemplates(
  templates: Template[],
  query: string,
  categoryId?: CategoryId,
): Template[] {
  const pool = categoryId ? templates.filter((t) => t.category === categoryId) : templates
  const q = normalize(query.trim())
  if (!q) return pool

  return pool
    .map((template) => {
      let score = 0
      if (normalize(template.title).includes(q)) score += 3
      if (template.searchKeywords.some((keyword) => normalize(keyword).includes(q))) score += 2
      if (normalize(template.description).includes(q)) score += 1
      return { template, score }
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((result) => result.template)
}
