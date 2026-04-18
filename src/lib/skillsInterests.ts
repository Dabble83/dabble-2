import { InterestOrSkill, adventureInterests, creativeInterests, homeImprovementInterests } from '../../lib/interestsAndSkillsData'

export interface SkillOrInterest {
  id: string
  name: string
  category: string
  theme: string
  type: 'skill' | 'interest'
}

function toSkillOrInterest(item: InterestOrSkill, type: 'skill' | 'interest'): SkillOrInterest {
  return {
    id: item.name.toLowerCase().replace(/\s+/g, '-'),
    name: item.name,
    category: item.category,
    theme: item.theme,
    type,
  }
}

export const allSkills: SkillOrInterest[] = [
  ...adventureInterests.map(i => toSkillOrInterest(i, 'skill')),
  ...creativeInterests.map(i => toSkillOrInterest(i, 'skill')),
  ...homeImprovementInterests.map(i => toSkillOrInterest(i, 'skill')),
]

export const allInterests: SkillOrInterest[] = [
  ...adventureInterests.map(i => toSkillOrInterest(i, 'interest')),
  ...creativeInterests.map(i => toSkillOrInterest(i, 'interest')),
  ...homeImprovementInterests.map(i => toSkillOrInterest(i, 'interest')),
]

export function searchItems(query: string, type: 'skill' | 'interest'): SkillOrInterest[] {
  const pool = type === 'skill' ? allSkills : allInterests
  const q = query.toLowerCase().trim()
  if (!q) return pool
  return pool
    .filter(item => item.name.toLowerCase().includes(q) || item.theme.toLowerCase().includes(q))
    .sort((a, b) => a.name.localeCompare(b.name))
}
