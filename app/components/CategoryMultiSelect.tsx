// Follow STYLE_GUIDE.md for any UI changes.
// Design: minimal, editorial, calm. No loud colors. No marketplace language.
'use client'

// SkillCategory type: 'Adventure' | 'HomeImprovement' | 'Creative'
type SkillCategory = 'Adventure' | 'HomeImprovement' | 'Creative'

interface CategoryMultiSelectProps {
  categories: SkillCategory[]
  selectedCategories: SkillCategory[]
  onChange: (categories: SkillCategory[]) => void
  label: string
}

const categoryLabels: Record<SkillCategory, string> = {
  Adventure: 'Adventure',
  HomeImprovement: 'Home Improvement',
  Creative: 'Creative / Hobbies',
}

export default function CategoryMultiSelect({
  categories,
  selectedCategories,
  onChange,
  label,
}: CategoryMultiSelectProps) {
  const handleToggle = (category: SkillCategory) => {
    if (selectedCategories.includes(category)) {
      onChange(selectedCategories.filter((c) => c !== category))
    } else {
      onChange([...selectedCategories, category])
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => handleToggle(category)}
            className={`px-4 py-2 rounded-lg border-2 transition-all ${
              selectedCategories.includes(category)
                ? 'border-[#2d5016] bg-[#a8d5a3] bg-opacity-30 text-[#2d5016]'
                : 'border-gray-300 bg-white text-gray-700 hover:border-[#2d5016] hover:bg-[#a8d5a3] hover:bg-opacity-10'
            }`}
          >
            {categoryLabels[category]}
          </button>
        ))}
      </div>
    </div>
  )
}

