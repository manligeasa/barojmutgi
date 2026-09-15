// Created: 2026-09-15 08:54
import { useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { EmergencyAlert } from '../components/safety/EmergencyAlert'
import { PrivacyNoticeBanner } from '../components/safety/PrivacyNoticeBanner'
import { ChoiceFieldInput } from '../features/prompt-builder/components/ChoiceFieldInput'
import { TextFieldInput } from '../features/prompt-builder/components/TextFieldInput'
import { useWizard } from '../features/prompt-builder/WizardContext'
import { templates } from '../lib/data'
import { applyAutoFill, computeMissingRequiredFields } from '../lib/prompt-engine'
import { containsEmergencyKeyword } from '../lib/safety'

export function ConfirmPage() {
  const { templateId } = useParams<{ templateId: string }>()
  const navigate = useNavigate()
  const { values, setValue } = useWizard()
  const template = templates.find((t) => t.id === templateId)
  const [index, setIndex] = useState(0)

  // 확인 화면에 진입한 시점의 누락 목록을 고정한다. values가 바뀔 때마다 다시 계산하면
  // 방금 채운 필드가 목록에서 사라지며 index가 흔들리므로 template이 바뀔 때만 재계산한다.
  const missingFields = useMemo(() => (template ? computeMissingRequiredFields(template, values) : []), [template])

  if (!template) return <Navigate to="/find" replace />

  if (missingFields.length === 0 || index >= missingFields.length) {
    return <Navigate to={`/template/${template.id}/result`} replace />
  }

  const field = missingFields[index]
  const goToNext = () => setIndex((i) => i + 1)

  return (
    <div className="px-4 py-6">
      <p className="text-lg text-slate-500">
        {index + 1}/{missingFields.length} · 빠진 정보를 확인할게요
      </p>
      <h1 className="mt-2 text-2xl font-bold">{field.label}</h1>

      <div className="mt-4">
        <PrivacyNoticeBanner />
      </div>

      <div className="mt-4">
        {field.type === 'text' ? (
          <TextFieldInput field={field} value={values[field.key] ?? ''} onChange={(v) => setValue(field.key, v)} />
        ) : (
          <ChoiceFieldInput field={field} value={values[field.key] ?? ''} onChange={(v) => setValue(field.key, v)} />
        )}
        {field.type === 'text' && template.safetyType === 'health' && containsEmergencyKeyword(values[field.key] ?? '') && (
          <div className="mt-2">
            <EmergencyAlert />
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button variant="secondary" onClick={goToNext}>
          건너뛰기
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            setValue(field.key, applyAutoFill(field))
            goToNext()
          }}
        >
          AI가 적절히 정하기
        </Button>
        <Button onClick={goToNext} className="flex-1">
          다음
        </Button>
      </div>
      <button
        type="button"
        onClick={() => navigate(`/template/${template.id}/step/4`)}
        className="mt-4 text-lg text-primary underline"
      >
        이전 단계로 돌아가기
      </button>
    </div>
  )
}
