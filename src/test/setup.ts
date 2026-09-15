// Created: 2026-09-15 09:14
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// vitest globals를 켜지 않으므로 Testing Library의 자동 정리가 감지되지 않는다.
// 테스트마다 직접 DOM을 정리해 이전 렌더 결과가 다음 테스트로 새지 않게 한다.
afterEach(() => {
  cleanup()
})
