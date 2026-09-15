// Created: 2026-09-15 08:38
import { useMemo, useState } from 'react'
import { GlossarySearchBox } from '../features/glossary/components/GlossarySearchBox'
import { GlossaryTermCard } from '../features/glossary/components/GlossaryTermCard'
import { glossaryTerms } from '../lib/data'

export function GlossaryPage() {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return glossaryTerms
    return glossaryTerms.filter(
      (term) =>
        term.term.toLowerCase().includes(q) ||
        term.english?.toLowerCase().includes(q) ||
        term.oneLine.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold">AI 도움말</h1>
      <p className="mt-1 text-lg text-slate-600">헷갈리는 AI 용어를 쉬운 말로 설명해 드려요.</p>

      <div className="mt-4">
        <GlossarySearchBox value={query} onChange={setQuery} />
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {results.length === 0 ? (
          <p className="text-lg text-slate-500">검색 결과가 없어요.</p>
        ) : (
          results.map((term) => <GlossaryTermCard key={term.term} term={term} />)
        )}
      </div>
    </div>
  )
}
