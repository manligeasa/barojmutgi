// Created: 2026-09-15 08:54
import { createContext, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react'
import type { FieldValues } from '../../lib/prompt-engine'
import { saveWizardDraft } from '../../lib/storage'

const DRAFT_SAVE_DEBOUNCE_MS = 500

interface WizardState {
  values: FieldValues
}

type WizardAction = { type: 'SET_VALUE'; key: string; value: string }

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_VALUE':
      return { ...state, values: { ...state.values, [action.key]: action.value } }
    default:
      return state
  }
}

interface WizardContextValue {
  values: FieldValues
  setValue: (key: string, value: string) => void
}

const WizardContext = createContext<WizardContextValue | null>(null)

interface WizardProviderProps {
  children: ReactNode
  templateId: string
  initialValues?: FieldValues
}

export function WizardProvider({ children, templateId, initialValues }: WizardProviderProps) {
  const [state, dispatch] = useReducer(wizardReducer, { values: initialValues ?? {} })

  // 값이 바뀔 때마다 디바운스로 임시 저장해, 새로고침하거나 뒤로 갔다 돌아와도 입력이 남아있게 한다.
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(() => {
      saveWizardDraft(templateId, state.values)
    }, DRAFT_SAVE_DEBOUNCE_MS)
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    }
  }, [templateId, state.values])

  const value = useMemo<WizardContextValue>(
    () => ({
      values: state.values,
      setValue: (key, val) => dispatch({ type: 'SET_VALUE', key, value: val }),
    }),
    [state.values],
  )

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
}

export function useWizard(): WizardContextValue {
  const ctx = useContext(WizardContext)
  if (!ctx) throw new Error('useWizard는 WizardProvider 안에서만 사용할 수 있습니다.')
  return ctx
}
