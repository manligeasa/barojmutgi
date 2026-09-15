// Created: 2026-09-15 09:14
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { WizardProvider } from '../../features/prompt-builder/WizardContext'
import { ResultPage } from '../ResultPage'

function renderResult(templateId: string, values: Record<string, string>) {
  return render(
    <MemoryRouter initialEntries={[`/template/${templateId}/result`]}>
      <WizardProvider templateId={templateId} initialValues={values}>
        <Routes>
          <Route path="/template/:templateId/result" element={<ResultPage />} />
        </Routes>
      </WizardProvider>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  localStorage.clear()
})

describe('ResultPage', () => {
  it('일반 템플릿에는 전문가 확인 안내가 보이지 않는다', () => {
    renderResult('my-prompt-freeform', { request: '텃밭 가꾸기 계획을 세워줘' })
    expect(screen.getByText(/텃밭 가꾸기 계획을 세워줘/)).toBeInTheDocument()
    expect(screen.queryByText(/진단이나 처방이 아닙니다/)).not.toBeInTheDocument()
    expect(screen.queryByText(/법률 자문이 아닙니다/)).not.toBeInTheDocument()
  })

  it('건강 관련 템플릿에는 전문가 확인 안내가 보인다', () => {
    renderResult('health-symptom-summary', { symptom: '무릎이 아파요', duration: '3일 전부터' })
    expect(screen.getByText(/진단이나 처방이 아닙니다/)).toBeInTheDocument()
  })

  it('전체 복사하기를 누르면 클립보드에 완성된 프롬프트가 복사된다', async () => {
    // userEvent.setup()이 navigator.clipboard의 in-memory 에뮬레이션을 구성하므로,
    // 그 뒤에 spyOn으로 호출 여부만 확인한다 (동작은 user-event의 실제 구현을 그대로 쓴다).
    const user = userEvent.setup()
    const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText')
    renderResult('my-prompt-freeform', { request: '은퇴 후 텃밭 가꾸기' })

    await user.click(screen.getByRole('button', { name: '전체 복사하기' }))

    expect(writeTextSpy).toHaveBeenCalledWith(expect.stringContaining('은퇴 후 텃밭 가꾸기'))
    expect(await screen.findByText(/복사했어요/)).toBeInTheDocument()
  })
})
