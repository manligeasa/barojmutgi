// Created: 2026-09-15 08:38
import { useMemo, useState } from 'react'
import { TemplateCard } from '../features/categories/components/TemplateCard'
import { templates } from '../lib/data'
import { searchTemplates } from '../lib/search'

export function FindPage() {
  const [query, setQuery] = useState('')
  const results = useMemo(() => searchTemplates(templates, query), [query])

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold">찾기</h1>
      <label className="mt-4 block">
        <span className="sr-only">템플릿 검색</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="상황이나 키워드로 검색해 보세요"
          className="w-full rounded-xl border-2 border-slate-300 px-4 py-3 text-lg"
        />
      </label>
      <div className="mt-4 flex flex-col gap-3">
        {results.length === 0 ? (
          <p className="text-lg text-slate-500">검색 결과가 없어요.</p>
        ) : (
          results.map((template) => <TemplateCard key={template.id} template={template} />)
        )}
      </div>
    </div>
  )
}
