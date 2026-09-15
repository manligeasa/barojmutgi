// Created: 2026-09-15 09:08
import { describe, expect, it } from 'vitest'
import source from './PhotoPreviewInput.tsx?raw'

describe('PhotoPreviewInput', () => {
  it('선택한 사진을 네트워크로 전송하는 코드를 포함하지 않는다 (미리보기 전용)', () => {
    expect(source).not.toMatch(/fetch\(/)
    expect(source).not.toMatch(/FormData/)
    expect(source).not.toMatch(/XMLHttpRequest/)
    expect(source).not.toMatch(/axios/)
    expect(source).toContain('URL.createObjectURL')
  })
})
