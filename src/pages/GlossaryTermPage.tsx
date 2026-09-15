// Created: 2026-09-15 09:08
import { Link, Navigate, useParams } from 'react-router-dom'
import { glossaryTerms } from '../lib/data'

export function GlossaryTermPage() {
  const { term: termParam } = useParams<{ term: string }>()
  const term = glossaryTerms.find((t) => t.term === termParam)

  if (!term) return <Navigate to="/help" replace />

  const relatedTerms = (term.related ?? [])
    .map((name) => glossaryTerms.find((t) => t.term === name))
    .filter((t): t is (typeof glossaryTerms)[number] => Boolean(t))

  return (
    <div className="px-4 py-6">
      <Link to="/help" className="text-lg text-primary underline">
        ← 용어 목록으로
      </Link>

      <h1 className="mt-4 text-2xl font-bold">
        {term.term}
        {term.english && <span className="ml-2 text-xl font-normal text-slate-500">({term.english})</span>}
      </h1>

      <div className="mt-4 flex flex-col gap-4 text-lg">
        <section>
          <h2 className="font-semibold text-slate-500">한 줄 뜻</h2>
          <p className="mt-1">{term.oneLine}</p>
        </section>
        <section>
          <h2 className="font-semibold text-slate-500">일상 비유</h2>
          <p className="mt-1">{term.analogy}</p>
        </section>
        <section>
          <h2 className="font-semibold text-slate-500">언제 쓰는 말인가</h2>
          <p className="mt-1">{term.action}</p>
        </section>
      </div>

      {relatedTerms.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-slate-500">관련 용어</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {relatedTerms.map((related) => (
              <Link
                key={related.term}
                to={`/help/${encodeURIComponent(related.term)}`}
                className="rounded-full border-2 border-slate-300 px-3 py-1 text-lg text-primary"
              >
                {related.term}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
