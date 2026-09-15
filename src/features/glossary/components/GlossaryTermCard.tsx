// Created: 2026-09-15 09:08
import { Link } from 'react-router-dom'
import type { GlossaryTerm } from '../../../lib/types'

interface GlossaryTermCardProps {
  term: GlossaryTerm
}

export function GlossaryTermCard({ term }: GlossaryTermCardProps) {
  return (
    <Link
      to={`/help/${encodeURIComponent(term.term)}`}
      className="block rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-primary"
    >
      <h3 className="text-xl font-bold">
        {term.term}
        {term.english && <span className="ml-2 text-lg font-normal text-slate-500">({term.english})</span>}
      </h3>
      <p className="mt-1 text-lg text-slate-600">{term.oneLine}</p>
    </Link>
  )
}
