// Created: 2026-09-15 09:08
import type { ElementCheck } from '../../../lib/prompt-improver'

interface ElementChecklistProps {
  checks: ElementCheck[]
}

export function ElementChecklist({ checks }: ElementChecklistProps) {
  return (
    <div>
      <p className="text-lg font-semibold">간단 점검이에요 (완벽하지 않을 수 있어요)</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {checks.map((check) => (
          <li
            key={check.key}
            className={`rounded-full border-2 px-3 py-1 text-lg font-medium ${
              check.present ? 'border-primary bg-primary/10 text-primary' : 'border-slate-300 text-slate-500'
            }`}
          >
            <span aria-hidden="true">{check.present ? '✔' : '·'}</span> {check.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
