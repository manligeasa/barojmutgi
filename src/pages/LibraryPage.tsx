// Created: 2026-09-15 08:38
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { SavedPromptListItem } from '../features/favorites/components/SavedPromptListItem'
import { getFavorites, getRecent, removeFavorite, type SavedPromptItem } from '../lib/storage'

type Tab = 'favorites' | 'recent'

export function LibraryPage() {
  const [tab, setTab] = useState<Tab>('favorites')
  const [favorites, setFavorites] = useState<SavedPromptItem[]>(() => getFavorites())
  const [recent] = useState<SavedPromptItem[]>(() => getRecent())

  const handleRemoveFavorite = (id: string) => {
    removeFavorite(id)
    setFavorites((items) => items.filter((item) => item.id !== id))
  }

  const items = tab === 'favorites' ? favorites : recent

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold">보관함</h1>

      <div className="mt-4 flex gap-2" role="tablist" aria-label="보관함 탭">
        <Button
          type="button"
          variant={tab === 'favorites' ? 'primary' : 'secondary'}
          onClick={() => setTab('favorites')}
          className="flex-1"
          aria-pressed={tab === 'favorites'}
        >
          즐겨찾기
        </Button>
        <Button
          type="button"
          variant={tab === 'recent' ? 'primary' : 'secondary'}
          onClick={() => setTab('recent')}
          className="flex-1"
          aria-pressed={tab === 'recent'}
        >
          최근 사용
        </Button>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {items.length === 0 ? (
          <p className="text-lg text-slate-500">
            {tab === 'favorites' ? '아직 즐겨찾기한 질문이 없어요.' : '아직 최근 사용한 질문이 없어요.'}
          </p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-start gap-2">
              <div className="flex-1">
                <SavedPromptListItem item={item} />
              </div>
              {tab === 'favorites' && (
                <Button type="button" variant="secondary" onClick={() => handleRemoveFavorite(item.id)}>
                  삭제
                </Button>
              )}
            </div>
          ))
        )}
      </div>

      <Link to="/safety" className="mt-8 inline-block text-lg text-primary underline">
        개인정보·안전 안내 보기
      </Link>
    </div>
  )
}
