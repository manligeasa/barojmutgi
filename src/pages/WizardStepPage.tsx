// Created: 2026-09-15 08:54
import { useMemo } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { EmergencyAlert } from '../components/safety/EmergencyAlert'
import { PrivacyNoticeBanner } from '../components/safety/PrivacyNoticeBanner'
import { PhotoPreviewInput } from '../features/image-helper/components/PhotoPreviewInput'
import { ChoiceFieldInput } from '../features/prompt-builder/components/ChoiceFieldInput'
import { TextFieldInput } from '../features/prompt-builder/components/TextFieldInput'
import { WizardProgress } from '../features/prompt-builder/components/WizardProgress'
import { useWizard } from '../features/prompt-builder/WizardContext'
import { templates } from '../lib/data'
import { fieldsForStep } from '../lib/prompt-engine'
import { containsEmergencyKeyword } from '../lib/safety'
import type { WizardStep } from '../lib/types'

const TOTAL_STEPS = 4

export function WizardStepPage() {
  const { templateId, step: stepParam } = useParams<{ templateId: string; step: string }>()
  const navigate = useNavigate()
  const { values, setValue } = useWizard()

  const template = templates.find((t) => t.id === templateId)
  const step = Number(stepParam)

  const fields = useMemo(
    () => (template && isWizardStep(step) ? fieldsForStep(template, step) : []),
    [template, step],
  )

  if (!template) return <Navigate to="/find" replace />
  if (!isWizardStep(step)) {
    return <Navigate to={`/template/${template.id}/step/1`} replace />
  }

  const goNext = () => {
    if (step < TOTAL_STEPS) {
      navigate(`/template/${template.id}/step/${step + 1}`)
    } else {
      navigate(`/template/${template.id}/confirm`)
    }
  }

  const goBack = () => {
    if (step > 1) {
      navigate(`/template/${template.id}/step/${step - 1}`)
    } else {
      navigate(`/category/${template.category}`)
    }
  }

  return (
    <div className="px-4 py-6">
      <WizardProgress current={step} total={TOTAL_STEPS} />
      <h1 className="mt-4 text-2xl font-bold">{template.title}</h1>

      <div className="mt-4">
        <PrivacyNoticeBanner />
      </div>

      {template.supportsImage && step === 1 && (
        <div className="mt-4">
          <PhotoPreviewInput />
        </div>
      )}

      <div className="mt-4 flex flex-col gap-6">
        {fields.length === 0 ? (
          <p className="text-lg text-slate-500">이 단계에서는 물어볼 것이 없어요.</p>
        ) : (
          fields.map((field) =>
            field.type === 'text' ? (
              <div key={field.key}>
                <TextFieldInput
                  field={field}
                  value={values[field.key] ?? ''}
                  onChange={(v) => setValue(field.key, v)}
                />
                {template.safetyType === 'health' && containsEmergencyKeyword(values[field.key] ?? '') && (
                  <div className="mt-2">
                    <EmergencyAlert />
                  </div>
                )}
              </div>
            ) : (
              <ChoiceFieldInput
                key={field.key}
                field={field}
                value={values[field.key] ?? ''}
                onChange={(v) => setValue(field.key, v)}
              />
            ),
          )
        )}
      </div>

      <div className="mt-8 flex gap-3">
        <Button variant="secondary" onClick={goBack}>
          이전
        </Button>
        <Button onClick={goNext} className="flex-1">
          {step < TOTAL_STEPS ? '다음' : '확인하러 가기'}
        </Button>
      </div>
    </div>
  )
}

function isWizardStep(value: number): value is WizardStep {
  return Number.isInteger(value) && value >= 1 && value <= TOTAL_STEPS
}
