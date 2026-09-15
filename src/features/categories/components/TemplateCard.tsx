// Created: 2026-09-15 08:50
import { Link } from 'react-router-dom'
import type { Template } from '../../../lib/types'

interface TemplateCardProps {
  template: Template
}

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Link
      to={`/template/${template.id}`}
      className="block rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-primary"
    >
      <h3 className="text-xl font-bold">{template.title}</h3>
      <p className="mt-1 text-lg text-slate-600">{template.description}</p>
    </Link>
  )
}
