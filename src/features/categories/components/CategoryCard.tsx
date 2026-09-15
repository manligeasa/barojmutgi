// Created: 2026-09-15 08:47
import { Link } from 'react-router-dom'
import type { Category } from '../../../lib/types'

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to={`/category/${category.id}`}
      className="flex items-center gap-4 rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-primary"
    >
      <span className="text-3xl" aria-hidden="true">
        {category.icon}
      </span>
      <div>
        <h2 className="text-xl font-bold">{category.title}</h2>
        <p className="mt-1 text-lg text-slate-600">{category.description}</p>
      </div>
    </Link>
  )
}
