// Follow STYLE_GUIDE.md for any UI changes.
// Design: minimal, editorial, calm. No loud colors. No marketplace language.
'use client'

import { useState } from 'react'

interface ProfileAIWidgetProps {
  onApplySuggestions: (suggestions: {
    interestsIntro: string
    skillsIntro: string
    suggestedInterests: string[]
    suggestedSkills: {
      adventure: string[]
      creative: string[]
      homeImprovement: string[]
    }
    profilePicIdeas: string[]
  }) => void
  existingInterestsIntro?: string
  existingSkillsIntro?: string
  existingSkills?: {
    adventure: string[]
    creative: string[]
    homeImprovement: string[]
  }
}

interface AIResponse {
  interestsIntro: string
  skillsIntro: string
  suggestedOffers: string[]
  suggestedWants: string[]
  suggestedOffersWithIds?: Array<{ id: string; name: string; category: string | null }>
  suggestedWantsWithIds?: Array<{ id: string; name: string; category: string | null }>
  suggestedInterests: string[]
  profilePicIdeas: string[]
}

export default function ProfileAIWidget({
  onApplySuggestions,
  existingInterestsIntro = '',
  existingSkillsIntro = '',
  existingSkills = {
    adventure: [],
    creative: [],
    homeImprovement: [],
  },
}: ProfileAIWidgetProps) {
  const [userDescription, setUserDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<AIResponse | null>(null)
  const [applied, setApplied] = useState(false)

  const handleGenerate = async () => {
    if (!userDescription.trim()) {
      setError('Please describe yourself to get suggestions')
      return
    }

    setLoading(true)
    setError(null)
    setSuggestions(null)
    setApplied(false)

    try {
      // Get existing skill names for context
      const existingOffers: string[] = []
      const existingWants: string[] = []

      // We'll need to fetch skill names from IDs - for now, just pass empty arrays
      // The API will work with the user description

      const response = await fetch('/api/ai/profile-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          curiosityText: userDescription,
          helpText: '', // Can be enhanced later
          existingOffers,
          existingWants,
          existingInterests: [],
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate suggestions')
      }

      const data = await response.json()
      setSuggestions(data)
    } catch (err: any) {
      console.error('AI suggestion error:', err)
      setError(err.message || 'Failed to generate suggestions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleApply = () => {
    if (!suggestions) return

    // Organize suggested skills by category using the IDs from the API
    const adventure: string[] = []
    const creative: string[] = []
    const homeImprovement: string[] = []

    // Process suggested offers (skills they can teach)
    if (suggestions.suggestedOffersWithIds) {
      suggestions.suggestedOffersWithIds.forEach(skill => {
        if (skill.category === 'Adventure') {
          adventure.push(skill.id)
        } else if (skill.category === 'Creative') {
          creative.push(skill.id)
        } else if (skill.category === 'HomeImprovement') {
          homeImprovement.push(skill.id)
        }
      })
    }

    // Process suggested wants (skills they want to learn) - add to appropriate categories
    if (suggestions.suggestedWantsWithIds) {
      suggestions.suggestedWantsWithIds.forEach(skill => {
        if (skill.category === 'Adventure' && !adventure.includes(skill.id)) {
          adventure.push(skill.id)
        } else if (skill.category === 'Creative' && !creative.includes(skill.id)) {
          creative.push(skill.id)
        } else if (skill.category === 'HomeImprovement' && !homeImprovement.includes(skill.id)) {
          homeImprovement.push(skill.id)
        }
      })
    }

    onApplySuggestions({
      interestsIntro: suggestions.interestsIntro,
      skillsIntro: suggestions.skillsIntro,
      suggestedInterests: suggestions.suggestedInterests || [],
      suggestedSkills: {
        adventure,
        creative,
        homeImprovement,
      },
      profilePicIdeas: suggestions.profilePicIdeas || [],
    })

    setApplied(true)
  }

  const handleRegenerate = () => {
    setSuggestions(null)
    setApplied(false)
    handleGenerate()
  }

  return (
    <div style={{
      padding: '24px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
    }}>
      <h2 style={{
        fontSize: '20px',
        marginBottom: '8px',
        color: '#1F2A37',
        fontWeight: 600
      }}>
        AI Profile Helper
      </h2>
      <p style={{
        color: '#6B7280',
        fontSize: '14px',
        marginBottom: '24px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}>
        Describe yourself, your interests, and what you can help others with. We'll generate personalized suggestions for your profile.
      </p>

      {!suggestions ? (
        <div>
          <textarea
            value={userDescription}
            onChange={(e) => setUserDescription(e.target.value)}
            placeholder="E.g., I'm a graphic designer who loves hiking and cooking. Friends often ask me for help with design projects and meal planning. I'm interested in learning photography and woodworking..."
            rows={6}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '16px',
              border: '2px solid #D1D5DB',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              resize: 'vertical',
              marginBottom: '16px',
            }}
            disabled={loading}
          />

          {error && (
            <div style={{
              padding: '12px',
              backgroundColor: '#FEE2E2',
              border: '1px solid #EF4444',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <p style={{ color: '#991B1B', fontSize: '14px', margin: 0 }}>{error}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !userDescription.trim()}
            className="btn-primary"
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              opacity: loading || !userDescription.trim() ? 0.6 : 1,
              cursor: loading || !userDescription.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Generating suggestions...' : 'Generate Suggestions'}
          </button>
        </div>
      ) : (
        <div>
          {/* Profile Summary */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 600,
              marginBottom: '12px',
              color: '#1F2A37',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
            }}>
              Profile Summary
            </h3>
            <div style={{
              padding: '16px',
              backgroundColor: '#F9FAFB',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
            }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#6B7280',
                  marginBottom: '8px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  About Your Interests
                </label>
                <textarea
                  value={suggestions.interestsIntro}
                  onChange={(e) => setSuggestions({ ...suggestions, interestsIntro: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '14px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    backgroundColor: '#ffffff',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    resize: 'vertical',
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#6B7280',
                  marginBottom: '8px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  About Your Skills
                </label>
                <textarea
                  value={suggestions.skillsIntro}
                  onChange={(e) => setSuggestions({ ...suggestions, skillsIntro: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '14px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    backgroundColor: '#ffffff',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    resize: 'vertical',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Suggested Interests */}
          {suggestions.suggestedInterests && suggestions.suggestedInterests.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                marginBottom: '12px',
                color: '#1F2A37',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }}>
                Suggested Interests
              </h3>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
              }}>
                {suggestions.suggestedInterests.map((interest, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: 'inline-block',
                      padding: '6px 12px',
                      backgroundColor: '#E5E7EB',
                      color: '#374151',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    }}
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Skills */}
          {(suggestions.suggestedOffers?.length > 0 || suggestions.suggestedWants?.length > 0) && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                marginBottom: '12px',
                color: '#1F2A37',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }}>
                Suggested Skills
              </h3>
              {suggestions.suggestedOffers && suggestions.suggestedOffers.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                  <p style={{
                    fontSize: '12px',
                    color: '#6B7280',
                    marginBottom: '8px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    fontWeight: 500,
                  }}>
                    Skills you can offer:
                  </p>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}>
                    {suggestions.suggestedOffers.map((skill, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: 'inline-block',
                          padding: '6px 12px',
                          backgroundColor: '#D1FAE5',
                          color: '#065F46',
                          borderRadius: '16px',
                          fontSize: '12px',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {suggestions.suggestedWants && suggestions.suggestedWants.length > 0 && (
                <div>
                  <p style={{
                    fontSize: '12px',
                    color: '#6B7280',
                    marginBottom: '8px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    fontWeight: 500,
                  }}>
                    Skills you want to learn:
                  </p>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}>
                    {suggestions.suggestedWants.map((skill, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: 'inline-block',
                          padding: '6px 12px',
                          backgroundColor: '#DBEAFE',
                          color: '#1E40AF',
                          borderRadius: '16px',
                          fontSize: '12px',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Profile Picture Ideas */}
          {suggestions.profilePicIdeas && suggestions.profilePicIdeas.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                marginBottom: '12px',
                color: '#1F2A37',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }}>
                Profile Picture Ideas
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
              }}>
                {suggestions.profilePicIdeas.map((idea, idx) => (
                  <li
                    key={idx}
                    style={{
                      padding: '8px 0',
                      fontSize: '14px',
                      color: '#374151',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                      borderBottom: idx < suggestions.profilePicIdeas!.length - 1 ? '1px solid #E5E7EB' : 'none',
                    }}
                  >
                    • {idea}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div style={{
            display: 'flex',
            gap: '12px',
            paddingTop: '16px',
            borderTop: '1px solid #E5E7EB',
          }}>
            <button
              type="button"
              onClick={handleApply}
              disabled={applied}
              className="btn-primary"
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                opacity: applied ? 0.6 : 1,
                cursor: applied ? 'not-allowed' : 'pointer',
              }}
            >
              {applied ? 'Applied ✓' : 'Apply Suggestions'}
            </button>
            <button
              type="button"
              onClick={handleRegenerate}
              disabled={loading}
              className="btn-secondary"
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              }}
            >
              Regenerate
            </button>
            <button
              type="button"
              onClick={() => {
                setSuggestions(null)
                setApplied(false)
                setUserDescription('')
              }}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                backgroundColor: 'transparent',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                color: '#374151',
                cursor: 'pointer',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              }}
            >
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
