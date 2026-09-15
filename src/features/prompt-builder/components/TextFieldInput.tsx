// Created: 2026-09-15 08:54
import type { TextField } from '../../../lib/types'

interface TextFieldInputProps {
  field: TextField
  value: string
  onChange: (value: string) => void
}

export function TextFieldInput({ field, value, onChange }: TextFieldInputProps) {
  const inputId = `field-${field.key}`
  const exampleId = field.placeholder ? `${inputId}-example` : undefined

  return (
    <div>
      <label htmlFor={inputId} className="block text-lg font-semibold">
        {field.label}
      </label>
      <input
        id={inputId}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        maxLength={field.maxLength}
        aria-describedby={exampleId}
        className="mt-2 w-full rounded-xl border-2 border-slate-300 px-4 py-3 text-lg"
      />
      {field.placeholder && (
        <span id={exampleId} className="mt-1 block text-base text-slate-500">
          예시: {field.placeholder}
        </span>
      )}
    </div>
  )
}
