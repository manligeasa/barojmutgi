// Created: 2026-09-15 08:38
import { CategoryCard } from '../features/categories/components/CategoryCard'
import { categories } from '../lib/data'

export function HomePage() {
  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold">오늘 AI로 무엇을 하고 싶으세요?</h1>
      <div className="mt-4 flex flex-col gap-3">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  )
}
