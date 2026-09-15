// Created: 2026-09-15 08:38
import type { ReactNode } from 'react'

interface IconLabelButtonProps {
  icon: ReactNode
  label: string
  active?: boolean
}

/** 아이콘 단독 사용을 금지하기 위한 공용 아이콘+라벨 표시 컴포넌트. 내비게이션 링크 등의 자식으로 사용한다. */
export function IconLabelButton({ icon, label, active = false }: IconLabelButtonProps) {
  return (
    <span
      className={`flex flex-col items-center justify-center gap-1 px-2 py-1 ${
        active ? 'text-primary' : 'text-slate-500'
      }`}
    >
      <span className="text-2xl leading-none" aria-hidden="true">
        {icon}
      </span>
      <span className="text-base font-medium">{label}</span>
    </span>
  )
}
