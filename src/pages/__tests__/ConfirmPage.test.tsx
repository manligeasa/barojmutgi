// Created: 2026-09-15 09:14
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { WizardProvider } from '../../features/prompt-builder/WizardContext'
import { ConfirmPage } from '../ConfirmPage'

vi.mock('../../lib/data', () => ({
  templates: [
    {
      id: 'test-many-required',
      category: 'my-prompt',
      title: '테스트 템플릿',
      searchKeywords: [],
      description: '',
      fields: [
        { key: 'a', label: '필드 A', type: 'text', required: true, step: 1 },
        { key: 'b', label: '필드 B', type: 'text', required: true, step: 1 },
        { key: 'c', label: '필드 C', type: 'text', required: true, step: 2 },
        { key: 'd', label: '필드 D', type: 'text', required: true, step: 2 },
      ],
      promptPattern: '{a} {b} {c} {d}',
      safetyType: 'general',
      revisionCommands: [],
    },
  ],
  categories: [],
  glossaryTerms: [],
}))

function renderConfirmPage() {
  return render(
    <MemoryRouter initialEntries={['/template/test-many-required/confirm']}>
      <Routes>
        <Route
          path="/template/:templateId/confirm"
          element={
            <WizardProvider templateId="test-many-required">
              <ConfirmPage />
            </WizardProvider>
          }
        />
        <Route path="/template/:templateId/result" element={<div>결과 화면</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ConfirmPage', () => {
  it('필수 필드가 4개여도 최대 3개까지만 재질문한다', async () => {
    const user = userEvent.setup()
    renderConfirmPage()

    expect(screen.getByText('1/3 · 빠진 정보를 확인할게요')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '필드 A' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '건너뛰기' }))
    expect(screen.getByText('2/3 · 빠진 정보를 확인할게요')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '필드 B' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'AI가 적절히 정하기' }))
    expect(screen.getByText('3/3 · 빠진 정보를 확인할게요')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '필드 C' })).toBeInTheDocument()

    // 3개를 모두 처리하면 필드 D는 보여주지 않고 곧바로 결과 화면으로 이동한다.
    await user.click(screen.getByRole('button', { name: '건너뛰기' }))
    expect(await screen.findByText('결과 화면')).toBeInTheDocument()
    expect(screen.queryByText('필드 D')).not.toBeInTheDocument()
  })
})
