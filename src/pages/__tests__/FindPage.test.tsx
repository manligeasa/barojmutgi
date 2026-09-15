// Created: 2026-09-15 09:14
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { templates } from '../../lib/data'
import { FindPage } from '../FindPage'

describe('FindPage', () => {
  it('처음에는 전체 템플릿을 보여준다', () => {
    render(
      <MemoryRouter>
        <FindPage />
      </MemoryRouter>,
    )
    expect(screen.getAllByRole('link')).toHaveLength(templates.length)
  })

  it('검색어를 입력하면 관련 없는 템플릿은 사라진다', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <FindPage />
      </MemoryRouter>,
    )

    const input = screen.getByPlaceholderText('상황이나 키워드로 검색해 보세요')
    await user.type(input, '회의록')

    expect(screen.getByText('회의록 정리')).toBeInTheDocument()
    expect(screen.queryByText('여행 일정 짜기')).not.toBeInTheDocument()
  })

  it('일치하는 템플릿이 없으면 안내 문구를 보여준다', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <FindPage />
      </MemoryRouter>,
    )

    const input = screen.getByPlaceholderText('상황이나 키워드로 검색해 보세요')
    await user.type(input, '존재하지않는검색어입니다')

    expect(screen.getByText('검색 결과가 없어요.')).toBeInTheDocument()
  })
})
