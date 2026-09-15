// Created: 2026-09-15 08:38
import { Outlet } from 'react-router-dom'
import { BottomTabNav } from './BottomTabNav'

export function AppShell() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-surface-muted">
      <main className="flex-1 overflow-y-auto pb-24">
        <Outlet />
      </main>
      <BottomTabNav />
    </div>
  )
}
