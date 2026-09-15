// Created: 2026-09-15 09:14
import { describe, expect, it } from 'vitest'
import { containsEmergencyKeyword } from './safety'

describe('containsEmergencyKeyword', () => {
  it('응급 가능 증상 표현이 있으면 true를 반환한다', () => {
    expect(containsEmergencyKeyword('갑자기 가슴 통증이 있어요')).toBe(true)
    expect(containsEmergencyKeyword('숨쉬기 힘들어요')).toBe(true)
    expect(containsEmergencyKeyword('할머니가 갑자기 의식을 잃었어요')).toBe(true)
  })

  it('평범한 증상 표현에는 false를 반환한다', () => {
    expect(containsEmergencyKeyword('며칠 전부터 무릎이 살짝 아파요')).toBe(false)
    expect(containsEmergencyKeyword('가벼운 감기 기운이 있어요')).toBe(false)
  })

  it('빈 문자열에는 false를 반환한다', () => {
    expect(containsEmergencyKeyword('')).toBe(false)
  })
})
