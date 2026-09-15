// Created: 2026-09-15 08:57
import { Button } from '../../../components/ui/Button'
import { REVISION_COMMANDS, type RevisionCommandId } from '../../../lib/types'

const LABELS: Record<RevisionCommandId, string> = {
  shorter: '더 짧게',
  more_detailed: '더 자세히',
  warmer: '더 따뜻하게',
  more_professional: '더 전문적으로',
  simpler: '쉬운 말로',
}

interface RevisionCommandBarProps {
  allowedCommands: RevisionCommandId[]
  active: RevisionCommandId | null
  onSelect: (id: RevisionCommandId) => void
}

/** 다시 누르면 선택을 해제하도록 토글 형태로 동작한다. */
export function RevisionCommandBar({ allowedCommands, active, onSelect }: RevisionCommandBarProps) {
  const commands = REVISION_COMMANDS.filter((id) => allowedCommands.includes(id))
  if (commands.length === 0) return null

  return (
    <div>
      <p className="text-lg font-semibold">결과가 마음에 들지 않으세요?</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {commands.map((id) => (
          <Button
            key={id}
            type="button"
            variant={active === id ? 'primary' : 'secondary'}
            onClick={() => onSelect(id)}
          >
            {LABELS[id]}
          </Button>
        ))}
      </div>
    </div>
  )
}
