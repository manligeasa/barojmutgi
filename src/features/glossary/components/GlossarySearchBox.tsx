// Created: 2026-09-15 09:08
interface GlossarySearchBoxProps {
  value: string
  onChange: (value: string) => void
}

export function GlossarySearchBox({ value, onChange }: GlossarySearchBoxProps) {
  return (
    <label className="block">
      <span className="sr-only">용어 검색</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="용어를 검색해 보세요"
        className="w-full rounded-xl border-2 border-slate-300 px-4 py-3 text-lg"
      />
    </label>
  )
}
