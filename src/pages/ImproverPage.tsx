// Created: 2026-09-15 09:08
import { useMemo, useState } from 'react'
import { PrivacyNoticeBanner } from '../components/safety/PrivacyNoticeBanner'
import { CopyPromptButton } from '../features/prompt-builder/components/CopyPromptButton'
import { BeforeAfterCompare } from '../features/prompt-improver/components/BeforeAfterCompare'
import { ElementChecklist } from '../features/prompt-improver/components/ElementChecklist'
import { PasteBox } from '../features/prompt-improver/components/PasteBox'
import { buildImprovedPrompt, checkPromptElements, type ElementKey } from '../lib/prompt-improver'

const ELEMENT_PLACEHOLDER: Record<ElementKey, string> = {
  role: '예: 친절한 안내문 작성자',
  situation: '예: 다음 주 금요일 모임을 앞두고 있어요',
  audience: '예: 동호회 회원들',
  purpose: '예: 참석 여부를 확인하려고',
  format: '예: 카카오톡 공지',
  tone: '예: 따뜻하고 예의 있게',
  length: '예: 300자 이내',
  caution: '예: 날짜는 절대 틀리면 안 돼요',
}

export function ImproverPage() {
  const [original, setOriginal] = useState('')
  const [answers, setAnswers] = useState<Partial<Record<ElementKey, string>>>({})

  const checks = useMemo(() => checkPromptElements(original), [original])
  const missing = useMemo(() => checks.filter((c) => !c.present), [checks])
  const improved = useMemo(() => buildImprovedPrompt(original, answers), [original, answers])

  const handleAnswerChange = (key: ElementKey, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold">질문 개선하기</h1>
      <p className="mt-1 text-lg text-slate-600">직접 쓴 질문을 붙여넣으면 빠진 부분을 확인해 드려요.</p>

      <div className="mt-4">
        <PrivacyNoticeBanner />
      </div>

      <div className="mt-4">
        <PasteBox value={original} onChange={setOriginal} />
      </div>

      {original.trim() && (
        <>
          <div className="mt-6">
            <ElementChecklist checks={checks} />
          </div>

          {missing.length > 0 && (
            <div className="mt-6 flex flex-col gap-4">
              <p className="text-lg font-semibold">빠진 부분을 짧게 채워 보세요 (선택 사항)</p>
              {missing.map((check) => (
                <label key={check.key} className="block">
                  <span className="text-lg font-semibold">{check.label}</span>
                  <input
                    type="text"
                    value={answers[check.key] ?? ''}
                    onChange={(e) => handleAnswerChange(check.key, e.target.value)}
                    placeholder={ELEMENT_PLACEHOLDER[check.key]}
                    className="mt-2 w-full rounded-xl border-2 border-slate-300 px-4 py-3 text-lg"
                  />
                </label>
              ))}
            </div>
          )}

          <div className="mt-6">
            <BeforeAfterCompare original={original} improved={improved} />
          </div>

          <div className="mt-4">
            <CopyPromptButton text={improved} />
          </div>
        </>
      )}
    </div>
  )
}
