// Created: 2026-09-15 08:57
import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ExpertDisclaimer } from '../components/safety/ExpertDisclaimer'
import { FavoriteButton } from '../features/favorites/components/FavoriteButton'
import { CopyPromptButton } from '../features/prompt-builder/components/CopyPromptButton'
import { RevisionCommandBar } from '../features/prompt-builder/components/RevisionCommandBar'
import { useWizard } from '../features/prompt-builder/WizardContext'
import { templates } from '../lib/data'
import { applyRevisionCommand, fillPrompt } from '../lib/prompt-engine'
import { clearWizardDraft, pushRecent, type SavedPromptItem } from '../lib/storage'
import type { RevisionCommandId } from '../lib/types'

export function ResultPage() {
  const { templateId } = useParams<{ templateId: string }>()
  const { values } = useWizard()
  const template = templates.find((t) => t.id === templateId)
  const [activeRevision, setActiveRevision] = useState<RevisionCommandId | null>(null)
  const [showUsageGuide, setShowUsageGuide] = useState(false)

  const basePrompt = useMemo(() => (template ? fillPrompt(template, values) : ''), [template, values])
  const finalPrompt = useMemo(
    () => (activeRevision ? applyRevisionCommand(basePrompt, activeRevision) : basePrompt),
    [basePrompt, activeRevision],
  )

  // 같은 템플릿·같은 입력값 조합은 항상 같은 id를 가지게 해, 보관함을 다시 열었을 때도
  // 즐겨찾기 상태와 최근 사용 중복 제거가 올바르게 동작하게 한다.
  const itemId = useMemo(() => (template ? `${template.id}::${JSON.stringify(values)}` : ''), [template, values])
  const savedItem = useMemo<SavedPromptItem | null>(() => {
    if (!template) return null
    return {
      id: itemId,
      templateId: template.id,
      templateTitle: template.title,
      categoryId: template.category,
      values,
      finalPrompt: basePrompt,
      createdAt: Date.now(),
    }
  }, [template, itemId, values, basePrompt])

  useEffect(() => {
    if (!template || !savedItem) return
    pushRecent(savedItem)
    // 이 시점에는 위저드가 끝나 완성된 질문이 최근/즐겨찾기로 넘어갔으므로 임시 저장은 더 필요 없다.
    clearWizardDraft(template.id)
  }, [template, savedItem])

  if (!template || !savedItem) return <Navigate to="/find" replace />

  const handleSelectRevision = (id: RevisionCommandId) => {
    setActiveRevision((current) => (current === id ? null : id))
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold">완성된 질문</h1>

      <p className="mt-4 whitespace-pre-wrap rounded-2xl border-2 border-slate-200 bg-white p-4 text-xl leading-relaxed">
        {finalPrompt}
      </p>

      <div className="mt-4">
        <ExpertDisclaimer safetyType={template.safetyType} />
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <CopyPromptButton text={finalPrompt} />
        <FavoriteButton item={savedItem} />
      </div>

      <div className="mt-8">
        <RevisionCommandBar
          allowedCommands={template.revisionCommands}
          active={activeRevision}
          onSelect={handleSelectRevision}
        />
      </div>

      <div className="mt-8 border-t-2 border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => setShowUsageGuide((v) => !v)}
          className="text-lg font-semibold text-primary underline"
        >
          AI에서 사용하기
        </button>
        {showUsageGuide && (
          <p className="mt-2 text-lg text-slate-600">
            위 질문을 복사한 뒤, 평소 쓰시는 AI 서비스(챗GPT, 클로드 등)의 대화창에 붙여넣어 보세요. 이 앱은
            결과를 직접 만들어주지 않고, 좋은 질문을 완성하는 것까지 도와드려요.
          </p>
        )}
      </div>

      <Link to={`/category/${template.category}`} className="mt-8 inline-block text-lg text-primary underline">
        다른 상황 보기
      </Link>
    </div>
  )
}
