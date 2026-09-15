// Created: 2026-09-15 09:01
import { useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { addFavorite, isFavorite, removeFavorite, type SavedPromptItem } from '../../../lib/storage'

interface FavoriteButtonProps {
  item: SavedPromptItem
}

export function FavoriteButton({ item }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(() => isFavorite(item.id))

  const toggle = () => {
    if (favorited) {
      removeFavorite(item.id)
    } else {
      addFavorite(item)
    }
    setFavorited((v) => !v)
  }

  return (
    <Button type="button" variant={favorited ? 'primary' : 'secondary'} onClick={toggle}>
      <span aria-hidden="true">{favorited ? '★' : '☆'}</span> {favorited ? '즐겨찾기 됨' : '즐겨찾기'}
    </Button>
  )
}
