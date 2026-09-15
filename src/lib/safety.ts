// Created: 2026-09-15 09:14
import type { SafetyType } from './types'

export const SAFETY_MESSAGES: Record<Exclude<SafetyType, 'general'>, string> = {
  health:
    '이 결과는 진단이나 처방이 아닙니다. 증상 정리·병원 방문 준비용으로만 사용하고 반드시 의료 전문가와 상담하세요.',
  legal: '이 결과는 법률 자문이 아닙니다. 쟁점 정리용으로만 사용하고 반드시 법률 전문가의 확인을 받으세요.',
}

const EMERGENCY_KEYWORDS = [
  '가슴 통증',
  '가슴이 답답',
  '호흡곤란',
  '숨쉬기 힘들',
  '숨이 안 쉬어',
  '숨을 못 쉬',
  '의식을 잃',
  '의식이 없',
  '심한 출혈',
  '피가 멈추지',
  '마비',
  '쓰러졌',
  '말이 어눌',
  '갑자기 쓰러',
]

/** 응급 가능성이 있는 표현이 포함돼 있는지 간단히 확인한다. 완전한 의학적 판단이 아니다. */
export function containsEmergencyKeyword(text: string): boolean {
  return EMERGENCY_KEYWORDS.some((keyword) => text.includes(keyword))
}
