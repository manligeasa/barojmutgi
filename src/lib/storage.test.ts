// Created: 2026-09-15 09:01
import { beforeEach, describe, expect, it } from 'vitest'
import {
  addFavorite,
  clearAllStorage,
  clearWizardDraft,
  getFavorites,
  getRecent,
  isFavorite,
  loadWizardDraft,
  pushRecent,
  removeFavorite,
  saveWizardDraft,
  type SavedPromptItem,
} from './storage'

function makeItem(overrides: Partial<SavedPromptItem> = {}): SavedPromptItem {
  return {
    id: 'item-1',
    templateId: 'template-1',
    templateTitle: '테스트 템플릿',
    categoryId: 'my-prompt',
    values: {},
    finalPrompt: '완성된 프롬프트',
    createdAt: Date.now(),
    ...overrides,
  }
}

beforeEach(() => {
  localStorage.clear()
})

describe('favorites', () => {
  it('추가하면 목록에 나타나고 isFavorite가 true를 반환한다', () => {
    addFavorite(makeItem())
    expect(isFavorite('item-1')).toBe(true)
    expect(getFavorites()).toHaveLength(1)
  })

  it('같은 id로 다시 추가하면 중복 없이 최신 내용으로 갱신된다', () => {
    addFavorite(makeItem({ finalPrompt: '첫 번째' }))
    addFavorite(makeItem({ finalPrompt: '두 번째' }))
    const favorites = getFavorites()
    expect(favorites).toHaveLength(1)
    expect(favorites[0].finalPrompt).toBe('두 번째')
  })

  it('삭제하면 목록에서 사라진다', () => {
    addFavorite(makeItem())
    removeFavorite('item-1')
    expect(isFavorite('item-1')).toBe(false)
    expect(getFavorites()).toHaveLength(0)
  })
})

describe('recent', () => {
  it('추가하면 최근 목록 맨 앞에 쌓인다', () => {
    pushRecent(makeItem({ id: 'a', templateId: 't-a' }))
    pushRecent(makeItem({ id: 'b', templateId: 't-b' }))
    expect(getRecent().map((r) => r.id)).toEqual(['b', 'a'])
  })

  it('같은 템플릿을 다시 쓰면 중복 없이 맨 앞으로 이동한다', () => {
    pushRecent(makeItem({ id: 'a', templateId: 't-a' }))
    pushRecent(makeItem({ id: 'b', templateId: 't-b' }))
    pushRecent(makeItem({ id: 'a2', templateId: 't-a' }))
    const recent = getRecent()
    expect(recent.map((r) => r.templateId)).toEqual(['t-a', 't-b'])
    expect(recent).toHaveLength(2)
  })

  it('최대 20개까지만 유지한다', () => {
    for (let i = 0; i < 25; i += 1) {
      pushRecent(makeItem({ id: `id-${i}`, templateId: `t-${i}` }))
    }
    expect(getRecent()).toHaveLength(20)
  })
})

describe('wizard draft', () => {
  it('저장한 값을 다시 불러올 수 있다', () => {
    saveWizardDraft('template-1', { topic: '텃밭' })
    expect(loadWizardDraft('template-1')).toEqual({ topic: '텃밭' })
  })

  it('저장된 값이 없으면 null을 반환한다', () => {
    expect(loadWizardDraft('no-such-template')).toBeNull()
  })

  it('지우면 다시 null을 반환한다', () => {
    saveWizardDraft('template-1', { topic: '텃밭' })
    clearWizardDraft('template-1')
    expect(loadWizardDraft('template-1')).toBeNull()
  })
})

describe('clearAllStorage', () => {
  it('barojmutgi 프리픽스가 붙은 키만 지우고 다른 키는 남긴다', () => {
    addFavorite(makeItem())
    pushRecent(makeItem())
    localStorage.setItem('other-app:setting', 'keep-me')

    clearAllStorage()

    expect(getFavorites()).toHaveLength(0)
    expect(getRecent()).toHaveLength(0)
    expect(localStorage.getItem('other-app:setting')).toBe('keep-me')
  })
})
