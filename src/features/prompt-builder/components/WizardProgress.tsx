// Created: 2026-09-15 08:54
interface WizardProgressProps {
  current: number
  total: number
}

export function WizardProgress({ current, total }: WizardProgressProps) {
  const steps = Array.from({ length: total }, (_, i) => i + 1)
  return (
    <div className="flex items-center gap-2" role="status" aria-label={`${total}단계 중 ${current}단계`}>
      {steps.map((step) => (
        <span
          key={step}
          aria-hidden="true"
          className={`h-2 flex-1 rounded-full ${step <= current ? 'bg-primary' : 'bg-slate-200'}`}
        />
      ))}
      <span className="ml-2 whitespace-nowrap text-base text-slate-500">
        {current}/{total}
      </span>
    </div>
  )
}
