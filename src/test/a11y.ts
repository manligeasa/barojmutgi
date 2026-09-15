// Created: 2026-09-15 09:14
import type { AxeResults } from 'axe-core'

/**
 * vitest-axe@0.1.0의 toHaveNoViolations matcher는 타입 선언이 버전이 맞지 않아
 * (vitest의 Assertion 제네릭과 충돌) 대신 이 간단한 단언 헬퍼를 쓴다.
 */
export function expectNoAxeViolations(results: AxeResults): void {
  if (results.violations.length === 0) return
  const details = results.violations
    .map((v) => `- [${v.impact ?? 'unknown'}] ${v.id}: ${v.help} (${v.helpUrl})`)
    .join('\n')
  throw new Error(`접근성 위반 ${results.violations.length}건 발견:\n${details}`)
}
