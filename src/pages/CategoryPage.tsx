// Created: 2026-09-15 08:50
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TemplateCard } from '../features/categories/components/TemplateCard'
import { categories, templates } from '../lib/data'
import { searchTemplates } from '../lib/search'
import type { CategoryId } from '../lib/types'

export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const [query, setQuery] = useState('')

  const category = categories.find((c) => c.id === categoryId)
  const results = useMemo(
    () => searchTemplates(templates, query, categoryId as CategoryId | undefined),
    [query, categoryId],
  )

  if (!category) {
    return (
      <div className="px-4 py-6">
        <p className="text-lg text-slate-600">카테고리를 찾을 수 없어요.</p>
        <Link to="/" className="mt-4 inline-block text-lg text-primary underline">
          홈으로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <div className="px-4 py-6">
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        <span aria-hidden="true">{category.icon}</span>
        {category.title}
      </h1>
      <p className="mt-1 text-lg text-slate-600">{category.description}</p>

      {category.id === 'my-prompt' && (
        <Link
          to="/improve"
          className="mt-4 block rounded-2xl border-2 border-primary bg-white p-4 text-primary shadow-sm"
        >
          <span className="text-xl font-bold">✏️ 내가 쓴 질문 진단·개선하기</span>
          <p className="mt-1 text-lg">직접 쓴 질문을 붙여넣으면 빠진 부분을 확인하고 다듬어 드려요.</p>
        </Link>
      )}

      <label className="mt-4 block">
        <span className="sr-only">이 카테고리 안에서 검색</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="상황을 검색해 보세요"
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
