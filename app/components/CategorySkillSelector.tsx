// Follow STYLE_GUIDE.md for any UI changes.
// Design: minimal, editorial, calm. No loud colors. No marketplace language.
'use client'

import { useState, useEffect } from 'react'

type SkillCategory = 'Adventure' | 'HomeImprovement' | 'Creative'

interface Skill {
  id: string
  name: string
  category: string | null
}

interface CategorySkillSelectorProps {
  category: SkillCategory
  selectedSkillIds: string[]
  onSelectionChange: (skillIds: string[]) => void
  label: string
}

const categoryLabels: Record<SkillCategory, string> = {
  Adventure: 'Adventure',
  HomeImprovement: 'Home Improvement',
  Creative: 'Hobbies and Creative',
}

export default function CategorySkillSelector({
  category,
  selectedSkillIds,
  onSelectionChange,
  label,
}: CategorySkillSelectorProps) {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  // Load skills for this category
  useEffect(() => {
    const loadSkills = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/skills/by-category?category=${category}`)
        
        if (!response.ok) {
          throw new Error('Failed to load skills')
        }

        const data = await response.json()
        setSkills(data || [])
      } catch (err: any) {
        console.error('Error loading skills:', err)
        setError(err.message || 'Failed to load skills')
      } finally {
        setLoading(false)
      }
    }

    loadSkills()
  }, [category])

  const handleToggleSkill = (skillId: string) => {
    if (selectedSkillIds.includes(skillId)) {
      onSelectionChange(selectedSkillIds.filter(id => id !== skillId))
    } else {
      onSelectionChange([...selectedSkillIds, skillId])
    }
  }

  const selectedSkills = skills.filter(s => selectedSkillIds.includes(s.id))
  const selectedNames = selectedSkills.map(s => s.name).join(', ')

  return (
    <div>
      <label className="label" style={{
        display: 'block',
        fontSize: '14px',
        fontWeight: 500,
        marginBottom: '8px',
        color: '#374151',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}>
        {label || categoryLabels[category]}
      </label>

      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: '16px',
            border: '2px solid #D1D5DB',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            textAlign: 'left',
            cursor: 'pointer',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            color: selectedNames ? '#1F2A37' : '#6B7280',
            minHeight: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#9CA3AF'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#D1D5DB'
          }}
        >
          <span style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
          }}>
            {selectedNames || `Select ${categoryLabels[category].toLowerCase()}...`}
          </span>
          <span style={{
            marginLeft: '12px',
            color: '#6B7280',
            fontSize: '12px',
          }}>
            {selectedSkillIds.length > 0 && `(${selectedSkillIds.length})`}
            <span style={{ marginLeft: '8px' }}>
              {isOpen ? '▲' : '▼'}
            </span>
          </span>
        </button>

        {isOpen && (
          <>
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 10,
              }}
              onClick={() => setIsOpen(false)}
            />
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '4px',
                backgroundColor: '#ffffff',
                border: '2px solid #D1D5DB',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                zIndex: 20,
                maxHeight: '300px',
                overflowY: 'auto',
              }}
            >
              {loading ? (
                <div style={{
                  padding: '16px',
                  textAlign: 'center',
                  color: '#6B7280',
                  fontSize: '14px',
                }}>
                  Loading skills...
                </div>
              ) : error ? (
                <div style={{
                  padding: '16px',
                  color: '#DC2626',
                  fontSize: '14px',
                }}>
                  {error}
                </div>
              ) : skills.length === 0 ? (
                <div style={{
                  padding: '16px',
                  textAlign: 'center',
                  color: '#6B7280',
                  fontSize: '14px',
                }}>
                  No skills found in this category
                </div>
              ) : (
                <div style={{
                  padding: '8px',
                }}>
                  {skills.map(skill => {
                    const isSelected = selectedSkillIds.includes(skill.id)
                    return (
                      <label
                        key={skill.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px 12px',
                          cursor: 'pointer',
                          borderRadius: '6px',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                          fontSize: '14px',
                          transition: 'background-color 150ms ease-in-out',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#F9FAFB'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSkill(skill.id)}
                          style={{
                            width: '18px',
                            height: '18px',
                            cursor: 'pointer',
                            accentColor: '#7A8F6A',
                          }}
                        />
                        <span style={{
                          color: isSelected ? '#1F2A37' : '#374151',
                          fontWeight: isSelected ? 500 : 400,
                        }}>
                          {skill.name}
                        </span>
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {selectedSkills.length > 0 && (
        <div style={{
          marginTop: '12px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
        }}>
          {selectedSkills.map(skill => (
            <span
              key={skill.id}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                backgroundColor: '#E5E7EB',
                color: '#374151',
                borderRadius: '16px',
                fontSize: '12px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              }}
            >
              {skill.name}
              <button
                type="button"
                onClick={() => handleToggleSkill(skill.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6B7280',
                  cursor: 'pointer',
                  fontSize: '16px',
                  lineHeight: 1,
                  padding: 0,
                  marginLeft: '4px',
                }}
                title="Remove"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
