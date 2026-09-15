// Created: 2026-09-15 09:08
interface BeforeAfterCompareProps {
  original: string
  improved: string
}

export function BeforeAfterCompare({ original, improved }: BeforeAfterCompareProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="flex-1 rounded-2xl border-2 border-slate-200 bg-white p-4">
        <h3 className="text-lg font-bold text-slate-500">처음 질문</h3>
        <p className="mt-2 whitespace-pre-wrap text-lg leading-relaxed">{original}</p>
      </div>
      <div className="flex-1 rounded-2xl border-2 border-primary bg-white p-4">
        <h3 className="text-lg font-bold text-primary">개선된 질문</h3>
        <p className="mt-2 whitespace-pre-wrap text-lg leading-relaxed">{improved}</p>
      </div>
    </div>
  )
}
