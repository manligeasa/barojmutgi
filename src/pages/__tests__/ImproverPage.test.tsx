// Created: 2026-09-15 09:14
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ImproverPage } from '../ImproverPage'

describe('ImproverPage', () => {
  it('원문을 붙여넣기 전에는 점검·비교 영역이 보이지 않는다', () => {
    render(<ImproverPage />)
    expect(screen.queryByText('간단 점검이에요 (완벽하지 않을 수 있어요)')).not.toBeInTheDocument()
  })

  it('원문을 입력하면 역할 표현 유무에 따라 점검 배지가 달라진다', async () => {
    const user = userEvent.setup()
    render(<ImproverPage />)

    const textarea = screen.getByLabelText('평소에 쓰던 질문을 붙여넣어 보세요')
    await user.type(textarea, '너는 친절한 선생님이다. 블로그 글을 써줘.')

    expect(screen.getByText('간단 점검이에요 (완벽하지 않을 수 있어요)')).toBeInTheDocument()
    expect(screen.getByText('역할')).toHaveTextContent('✔')
  })

  it('빠진 요소를 채우면 개선된 질문에 반영된다', async () => {
    const user = userEvent.setup()
    render(<ImproverPage />)

    const textarea = screen.getByLabelText('평소에 쓰던 질문을 붙여넣어 보세요')
    await user.type(textarea, '블로그 글 하나 써줘')

    const lengthInput = screen.getByLabelText('분량')
    await user.type(lengthInput, '300자 이내')

    expect(screen.getByText('처음 질문').closest('div')).toHaveTextContent('블로그 글 하나 써줘')
    expect(screen.getByText('개선된 질문').closest('div')).toHaveTextContent('분량: 300자 이내')
  })
})
