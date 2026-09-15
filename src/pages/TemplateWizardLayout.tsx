// Created: 2026-09-15 08:54
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom'
import { WizardProvider } from '../features/prompt-builder/WizardContext'
import type { FieldValues } from '../lib/prompt-engine'
import { templates } from '../lib/data'
import { loadWizardDraft } from '../lib/storage'

interface WizardLocationState {
  values?: FieldValues
}

export function TemplateWizardLayout() {
  const { templateId } = useParams<{ templateId: string }>()
  const location = useLocation()
  const template = templates.find((t) => t.id === templateId)

  if (!template) {
    return <Navigate to="/find" replace />
  }

  const state = location.state as WizardLocationState | null
  // 보관함에서 값을 들고 들어온 경우가 아니면, 이전에 쓰다 만 임시 저장 값을 복원한다.
  const initialValues = state?.values ?? loadWizardDraft(template.id) ?? undefined

  return (
    // templateId가 바뀔 때마다 강제로 새로 마운트해, 보관함에서 다른 템플릿을 열었을 때
    // 이전 템플릿의 입력값이 남아있지 않게 한다.
    <WizardProvider key={template.id} templateId={template.id} initialValues={initialValues}>
      <Outlet />
    </WizardProvider>
  )
}
