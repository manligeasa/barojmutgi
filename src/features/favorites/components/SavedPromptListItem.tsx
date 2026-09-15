// Created: 2026-09-15 09:01
import { Link } from 'react-router-dom'
import type { SavedPromptItem } from '../../../lib/storage'

interface SavedPromptListItemProps {
  item: SavedPromptItem
}

export function SavedPromptListItem({ item }: SavedPromptListItemProps) {
  return (
    <Link
      to={`/template/${item.templateId}/result`}
      state={{ values: item.values }}
      className="block rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-primary"
    >
      <h3 className="text-xl font-bold">{item.templateTitle}</h3>
      <p className="mt-1 line-clamp-2 text-lg text-slate-600">{item.finalPrompt}</p>
    </Link>
  )
}
