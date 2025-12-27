'use client'

import { SkillCategory, SkillLevel } from '@prisma/client'
import SkiLevelBadge from './SkiLevelBadge'

interface Skill {
  id: string
  name: string
  category: SkillCategory
}

interface SelectedSkill {
  skillId: string
  level: SkillLevel
}

interface SkillSelectorProps {
  skills: Skill[]
  selectedSkills: SelectedSkill[]
  onChange: (skillId: string, level: SkillLevel | null) => void
  category: SkillCategory
  label: string
}

const levels: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert']

export default function SkillSelector({
  skills,
  selectedSkills,
  onChange,
  category,
  label,
}: SkillSelectorProps) {
  const categorySkills = skills.filter((s) => s.category === category)

  if (categorySkills.length === 0) return null

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
      <div className="space-y-3 pl-4 border-l-2 border-gray-200">
        {categorySkills.map((skill) => {
          const selected = selectedSkills.find((s) => s.skillId === skill.id)
          return (
            <div key={skill.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">{skill.name}</label>
                <button
                  type="button"
                  onClick={() => onChange(skill.id, null)}
                  className={`text-xs px-2 py-1 rounded ${
                    selected
                      ? 'text-red-600 hover:bg-red-50'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {selected ? 'Remove' : 'Select'}
                </button>
              </div>
              {selected && (
                <div className="flex flex-wrap gap-3">
                  {levels.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => onChange(skill.id, level)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 transition-all ${
                        selected.level === level
                          ? 'border-[#2d5016] bg-[#a8d5a3] bg-opacity-30'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <SkiLevelBadge level={level} size="sm" />
                      <span className="text-xs text-gray-700">{level}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

