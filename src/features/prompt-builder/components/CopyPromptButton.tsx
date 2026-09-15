// Created: 2026-09-15 08:57
import { useState } from 'react'
import { Button } from '../../../components/ui/Button'

interface CopyPromptButtonProps {
  text: string
}

export function CopyPromptButton({ text }: CopyPromptButtonProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setStatus('copied')
    } catch {
      setStatus('error')
    }
    setTimeout(() => setStatus('idle'), 2000)
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <Button onClick={handleCopy} className="w-full">
        전체 복사하기
      </Button>
      <p aria-live="polite" className="min-h-8 text-lg font-medium">
        {status === 'copied' && (
          <span className="text-primary">복사했어요! 원하는 AI 서비스에 붙여넣어 보세요.</span>
        )}
        {status === 'error' && (
          <span className="text-danger">복사에 실패했어요. 문장을 길게 눌러 직접 복사해 주세요.</span>
        )}
      </p>
    </div>
  )
}
