// Created: 2026-09-15 09:01
import type { FieldValues } from './prompt-engine'
import type { CategoryId } from './types'

const PREFIX = 'barojmutgi:v1:'

const KEYS = {
  favorites: `${PREFIX}favorites`,
  recent: `${PREFIX}recent`,
  draft: (templateId: string) => `${PREFIX}draft:${templateId}`,
} as const

const RECENT_MAX = 20

export interface SavedPromptItem {
  id: string
  templateId: string
  templateTitle: string
  categoryId: CategoryId
  values: FieldValues
  finalPrompt: string
  createdAt: number
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch (error) {
    console.error(`[storage] "${key}" 읽기 실패`, error)
    return fallback
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`[storage] "${key}" 저장 실패`, error)
  }
}

// 즐겨찾기 ---------------------------------------------------------------

export function getFavorites(): SavedPromptItem[] {
  return readJson<SavedPromptItem[]>(KEYS.favorites, [])
}

export function isFavorite(id: string): boolean {
  return getFavorites().some((item) => item.id === id)
}

/** 같은 id가 이미 있으면 최신 내용으로 덮어쓰고 목록 맨 앞으로 올린다. */
export function addFavorite(item: SavedPromptItem): void {
  const rest = getFavorites().filter((existing) => existing.id !== item.id)
  writeJson(KEYS.favorites, [item, ...rest])
}

export function removeFavorite(id: string): void {
  writeJson(
    KEYS.favorites,
    getFavorites().filter((item) => item.id !== id),
  )
}

// 최근 사용 ---------------------------------------------------------------

export function getRecent(): SavedPromptItem[] {
  return readJson<SavedPromptItem[]>(KEYS.recent, [])
}

/** 같은 템플릿을 다시 쓰면 중복 없이 맨 앞으로 올리고, 최대 RECENT_MAX개까지만 유지한다. */
export function pushRecent(item: SavedPromptItem): void {
  const withoutSameTemplate = getRecent().filter((existing) => existing.templateId !== item.templateId)
  writeJson(KEYS.recent, [item, ...withoutSameTemplate].slice(0, RECENT_MAX))
}

// 위저드 임시 저장 (뒤로 가도 입력 유지) ------------------------------------

export function saveWizardDraft(templateId: string, values: FieldValues): void {
  writeJson(KEYS.draft(templateId), values)
}

export function loadWizardDraft(templateId: string): FieldValues | null {
  return readJson<FieldValues | null>(KEYS.draft(templateId), null)
}

export function clearWizardDraft(templateId: string): void {
  try {
    localStorage.removeItem(KEYS.draft(templateId))
  } catch (error) {
    console.error('[storage] 임시 저장 삭제 실패', error)
  }
}

// 전체 삭제 ---------------------------------------------------------------

/** 이 앱이 저장한 키(barojmutgi: 프리픽스)만 지우고, 다른 사이트/앱의 저장값은 건드리지 않는다. */
export function clearAllStorage(): void {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(PREFIX))
      .forEach((key) => localStorage.removeItem(key))
  } catch (error) {
    console.error('[storage] 전체 삭제 실패', error)
  }
}
