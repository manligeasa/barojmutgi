// Created: 2026-09-15 09:08
interface PasteBoxProps {
  value: string
  onChange: (value: string) => void
}

export function PasteBox({ value, onChange }: PasteBoxProps) {
  return (
    <label className="block">
      <span className="text-lg font-semibold">평소에 쓰던 질문을 붙여넣어 보세요</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        placeholder="예: 블로그에 올릴 글 하나 써줘"
        className="mt-2 w-full rounded-xl border-2 border-slate-300 px-4 py-3 text-lg"
      />
    </label>
  )
}
