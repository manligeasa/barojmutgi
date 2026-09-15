// Created: 2026-09-15 09:14
import { render } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { configureAxe } from 'vitest-axe'
import { beforeEach, describe, it } from 'vitest'
import { WizardProvider } from '../../features/prompt-builder/WizardContext'
import { expectNoAxeViolations } from '../../test/a11y'
import { HomePage } from '../HomePage'
import { ResultPage } from '../ResultPage'
import { WizardStepPage } from '../WizardStepPage'

// jsdom은 canvas를 지원하지 않아 color-contrast 규칙을 자동으로 채점할 수 없다.
// 대비는 디자인 단계에서 수동으로 WCAG AA 기준에 맞춰 골랐으므로 이 규칙만 끈다.
const axe = configureAxe({ rules: { 'color-contrast': { enabled: false } } })

beforeEach(() => {
  localStorage.clear()
})

describe('접근성 스모크 테스트 (axe)', () => {
  it('홈 화면에 자동으로 검출되는 접근성 위반이 없다', async () => {
    const { container } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )
    expectNoAxeViolations(await axe(container))
  })

  it('위저드 단계 화면에 자동으로 검출되는 접근성 위반이 없다', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/template/my-prompt-freeform/step/1']}>
        <WizardProvider templateId="my-prompt-freeform">
          <Routes>
            <Route path="/template/:templateId/step/:step" element={<WizardStepPage />} />
          </Routes>
        </WizardProvider>
      </MemoryRouter>,
    )
    expectNoAxeViolations(await axe(container))
  })

  it('완성 화면에 자동으로 검출되는 접근성 위반이 없다', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/template/my-prompt-freeform/result']}>
        <WizardProvider templateId="my-prompt-freeform" initialValues={{ request: '텃밭 가꾸기 계획' }}>
          <Routes>
            <Route path="/template/:templateId/result" element={<ResultPage />} />
          </Routes>
        </WizardProvider>
      </MemoryRouter>,
    )
    expectNoAxeViolations(await axe(container))
  })
})
