// Created: 2026-09-15 08:38
import { NavLink } from 'react-router-dom'
import { IconLabelButton } from '../components/ui/IconLabelButton'

const TABS = [
  { to: '/', label: '홈', icon: '🏠', end: true },
  { to: '/find', label: '찾기', icon: '🔍', end: false },
  { to: '/library', label: '보관함', icon: '⭐', end: false },
  { to: '/help', label: 'AI 도움말', icon: '💡', end: false },
] as const

export function BottomTabNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-10 flex border-t border-slate-200 bg-white"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="주요 메뉴"
    >
      {TABS.map((tab) => (
        <NavLink key={tab.to} to={tab.to} end={tab.end} className="flex-1">
          {({ isActive }) => <IconLabelButton icon={tab.icon} label={tab.label} active={isActive} />}
        </NavLink>
      ))}
    </nav>
  )
}
