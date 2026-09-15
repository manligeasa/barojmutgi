// Created: 2026-09-15 09:14
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { WizardProvider } from '../../features/prompt-builder/WizardContext'
import { WizardStepPage } from '../WizardStepPage'

function renderWizard(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <WizardProvider templateId="my-prompt-freeform">
        <Routes>
          <Route path="/template/:templateId/step/:step" element={<WizardStepPage />} />
        </Routes>
      </WizardProvider>
    </MemoryRouter>,
  )
}

describe('WizardStepPage', () => {
  it('필수 필드를 채우지 않아도 다음 단계로 건너뛸 수 있다', async () => {
    const user = userEvent.setup()
    renderWizard('/template/my-prompt-freeform/step/1')

    expect(screen.getByRole('heading', { name: '나만의 프롬프트 직접 만들기' })).toBeInTheDocument()
    expect(screen.getByLabelText('AI에게 무엇을 부탁하고 싶으세요?')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '다음' }))

    expect(screen.getByLabelText('더 알려주고 싶은 내용이 있나요?')).toBeInTheDocument()
  })

  it('입력한 값은 다른 단계로 이동했다 돌아와도 유지된다', async () => {
    const user = userEvent.setup()
    renderWizard('/template/my-prompt-freeform/step/1')

    const requestInput = screen.getByLabelText('AI에게 무엇을 부탁하고 싶으세요?')
    await user.type(requestInput, '텃밭 가꾸기 계획을 세워줘')
    await user.click(screen.getByRole('button', { name: '다음' }))

    expect(screen.getByLabelText('더 알려주고 싶은 내용이 있나요?')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '이전' }))

    expect(screen.getByLabelText('AI에게 무엇을 부탁하고 싶으세요?')).toHaveValue('텃밭 가꾸기 계획을 세워줘')
  })
})
