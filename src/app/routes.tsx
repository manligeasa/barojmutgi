// Created: 2026-09-15 08:38
import { Navigate, createHashRouter } from 'react-router-dom'
import { CategoryPage } from '../pages/CategoryPage'
import { ConfirmPage } from '../pages/ConfirmPage'
import { FindPage } from '../pages/FindPage'
import { GlossaryPage } from '../pages/GlossaryPage'
import { GlossaryTermPage } from '../pages/GlossaryTermPage'
import { HomePage } from '../pages/HomePage'
import { ImproverPage } from '../pages/ImproverPage'
import { LibraryPage } from '../pages/LibraryPage'
import { ResultPage } from '../pages/ResultPage'
import { SafetyInfoPage } from '../pages/SafetyInfoPage'
import { TemplateWizardLayout } from '../pages/TemplateWizardLayout'
import { WizardStepPage } from '../pages/WizardStepPage'
import { AppShell } from './AppShell'

export const router = createHashRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'category/:categoryId', element: <CategoryPage /> },
      { path: 'find', element: <FindPage /> },
      {
        path: 'template/:templateId',
        element: <TemplateWizardLayout />,
        children: [
          { index: true, element: <Navigate to="step/1" replace /> },
          { path: 'step/:step', element: <WizardStepPage /> },
          { path: 'confirm', element: <ConfirmPage /> },
          { path: 'result', element: <ResultPage /> },
        ],
      },
      { path: 'improve', element: <ImproverPage /> },
      { path: 'library', element: <LibraryPage /> },
      { path: 'help', element: <GlossaryPage /> },
      { path: 'help/:term', element: <GlossaryTermPage /> },
      { path: 'safety', element: <SafetyInfoPage /> },
    ],
  },
])
