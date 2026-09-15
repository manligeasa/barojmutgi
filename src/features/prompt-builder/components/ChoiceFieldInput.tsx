// Created: 2026-09-15 08:54
import { Button } from '../../../components/ui/Button'
import type { ChoiceField } from '../../../lib/types'

interface ChoiceFieldInputProps {
  field: ChoiceField
  value: string
  onChange: (value: string) => void
}

/** 선택한 옵션의 label(사람이 읽는 문구)을 그대로 값으로 저장해 프롬프트에 바로 쓰일 수 있게 한다. */
export function ChoiceFieldInput({ field, value, onChange }: ChoiceFieldInputProps) {
  return (
    <fieldset>
      <legend className="text-lg font-semibold">{field.label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {field.options.map((option) => (
          <Button
            key={option.value}
            type="button"
            variant={value === option.label ? 'primary' : 'secondary'}
            onClick={() => onChange(option.label)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </fieldset>
  )
}
