// Created: 2026-09-15 09:08
export type ElementKey =
  | 'role'
  | 'situation'
  | 'audience'
  | 'purpose'
  | 'format'
  | 'tone'
  | 'length'
  | 'caution'

/**
 * AI API를 호출하지 않으므로 완전한 의미 이해가 아닌 키워드/패턴 기반 근사치다.
 * 오탐·미탐이 있을 수 있음을 화면에도 "간단 점검이에요"로 안내한다.
 */
const ELEMENT_PATTERNS: Record<ElementKey, RegExp[]> = {
  role: [/너는|당신은|역할은|전문가처럼|로서/],
  situation: [/상황은|배경은|현재|지금/],
  audience: [/에게|대상으로|독자는|고객은|사람들에게/],
  purpose: [/목적은|위해서|하려고|하고\s*싶/],
  format: [/표로|목록으로|글머리|이메일\s*형식|보고서\s*형식|형식으로/],
  tone: [/정중하게|친근하게|공손히|격식|캐주얼|따뜻하게/],
  length: [/\d+\s*(자|문장|줄)|간단히|짧게|길게|분량/],
  caution: [/주의|제외하고|하지\s*말|피해줘|빼고/],
}

const ELEMENT_LABEL: Record<ElementKey, string> = {
  role: '역할',
  situation: '상황',
  audience: '대상',
  purpose: '목적',
  format: '형식',
  tone: '말투',
  length: '분량',
  caution: '주의사항',
}

export interface ElementCheck {
  key: ElementKey
  label: string
  present: boolean
}

export function checkPromptElements(text: string): ElementCheck[] {
  return (Object.keys(ELEMENT_PATTERNS) as ElementKey[]).map((key) => ({
    key,
    label: ELEMENT_LABEL[key],
    present: ELEMENT_PATTERNS[key].some((pattern) => pattern.test(text)),
  }))
}

/**
 * 문장을 다시 쓰는 대신, 미충족 요소에 대해 사용자가 채운 값을 "요소: 값" 형태로
 * 원문 끝에 보강한다. AI 없이도 안전하고 예측 가능하게 구현할 수 있는 방식이다.
 */
export function buildImprovedPrompt(original: string, answers: Partial<Record<ElementKey, string>>): string {
  const additions = (Object.entries(answers) as [ElementKey, string][])
    .filter(([, value]) => value?.trim())
    .map(([key, value]) => `${ELEMENT_LABEL[key]}: ${value.trim()}`)

  const trimmedOriginal = original.trim()
  if (additions.length === 0) return trimmedOriginal
  return `${trimmedOriginal}\n\n${additions.join('\n')}`
}
