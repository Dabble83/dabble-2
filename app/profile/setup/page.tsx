// Follow STYLE_GUIDE.md for any UI changes.
// Design: minimal, editorial, calm. No loud colors. No marketplace language.
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSupabaseClient } from '@/src/lib/supabaseClient'
import { useSupabaseAuth } from '@/src/hooks/useSupabaseAuth'

interface Skill {
  id: string
  name: string
  category: string | null
}

interface ProfileData {
  username: string
  bio_interests: string
  bio_skills: string
  skills: string[] // Array of skill names (strings) stored as jsonb
  is_discoverable: boolean
  location_label: string
  lat: number | null
  lng: number | null
}

/**
 * Profile Setup Page - Map discoverability support
 * 
 * Loads session and existing profile, allows editing all profile fields
 * including location and discoverability settings.
 */
export default function ProfileSetupPage() {
  const { user, loading: authLoading } = useSupabaseAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([])
  const [customSkillName, setCustomSkillName] = useState('')
  const [locationLoading, setLocationLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiInput, setAiInput] = useState('')
  const [aiConfigured, setAiConfigured] = useState(false)

  const [formData, setFormData] = useState<ProfileData>({
    username: '',
    bio_interests: '',
    bio_skills: '',
    skills: [],
    is_discoverable: false,
    location_label: '',
    lat: null,
    lng: null,
  })

  // Load profile data and available skills
  useEffect(() => {
    if (authLoading || !user) return

    const loadData = async () => {
      try {
        const client = getSupabaseClient()

        // Load available skills
        const { data: skillsData, error: skillsError } = await client
          .from('skills')
          .select('id, name, category')
          .order('name')

        if (skillsError) {
          console.error('Error loading skills:', skillsError)
        } else {
          setAvailableSkills(skillsData || [])
        }

        // Load existing profile
        const { data: profileData, error: profileError } = await client
          .from('profiles')
          .select(`
            id,
            display_name,
            username,
            interests_intro,
            skills_intro,
            is_discoverable,
            location_label,
            lat,
            lng,
            skills
          `)
          .eq('id', user.id)
          .single()

        if (profileError && profileError.code !== 'PGRST116') {
          // PGRST116 = not found, which is fine for new profiles
          console.error('Error loading profile:', profileError)
        } else if (profileData) {
          // Parse skills from jsonb array
          let skillsArray: string[] = []
          if (profileData.skills) {
            if (Array.isArray(profileData.skills)) {
              skillsArray = profileData.skills
            } else if (typeof profileData.skills === 'string') {
              try {
                skillsArray = JSON.parse(profileData.skills)
              } catch {
                skillsArray = []
              }
            }
          }

          setFormData({
            display_name: profileData.display_name || '',
            username: profileData.username || '',
            bio_interests: profileData.interests_intro || '',
            bio_skills: profileData.skills_intro || '',
            skills: skillsArray, // Now using array of skill names (strings) instead of IDs
            is_discoverable: profileData.is_discoverable || false,
            location_label: profileData.location_label || '',
            lat: profileData.lat || null,
            lng: profileData.lng || null,
          })
        }
      } catch (err: any) {
        console.error('Error loading data:', err)
        setError(err.message || 'Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user, authLoading])

  // Check if OpenAI is configured
  useEffect(() => {
    const checkAiStatus = async () => {
      try {
        const response = await fetch('/api/ai/status')
        const data = await response.json()
        setAiConfigured(data.configured || false)
      } catch (err) {
        console.error('Error checking AI status:', err)
        setAiConfigured(false)
      }
    }
    
    checkAiStatus()
  }, [])

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSkillToggle = (skillName: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skillName)
        ? prev.skills.filter(name => name !== skillName)
        : [...prev.skills, skillName],
    }))
  }

  const handleAddCustomSkill = async () => {
    if (!customSkillName.trim()) return

    try {
      const skillName = customSkillName.trim()
      
      // Add directly to skills array (stored as jsonb)
      if (!formData.skills.includes(skillName)) {
        handleSkillToggle(skillName)
      }

      // Optionally create skill in skills table for future reference
      try {
        const client = getSupabaseClient()
        await client
          .from('skills')
          .upsert({ name: skillName }, { onConflict: 'name' })
        
        // Refresh skills list
        const { data: skillsData } = await client
          .from('skills')
          .select('id, name, category')
          .order('name')
        setAvailableSkills(skillsData || [])
      } catch (err) {
        // Non-critical - skill will still be added to profile
        console.warn('Could not create skill in skills table:', err)
      }

      setCustomSkillName('')
    } catch (err: any) {
      setError(err.message || 'Failed to add custom skill')
    }
  }

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    setLocationLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }))
        setLocationLoading(false)
      },
      (err) => {
        setError('Failed to get location: ' + err.message)
        setLocationLoading(false)
      }
    )
  }

  const handleAISuggestions = async () => {
    if (!aiInput.trim()) {
      setError('Please enter some text about yourself to get AI suggestions')
      return
    }

    setAiLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/profile-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          curiosityText: aiInput,
          helpText: '',
          existingOffers: formData.skills,
          existingWants: [],
          existingInterests: [],
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to get AI suggestions')
      }

      const suggestions = await response.json()

      // Apply suggestions to form
      setFormData(prev => ({
        ...prev,
        bio_interests: suggestions.interestsIntro || prev.bio_interests,
        bio_skills: suggestions.skillsIntro || prev.bio_skills,
        skills: [
          ...prev.skills,
          ...(suggestions.suggestedOffers || []).filter((s: string) => !prev.skills.includes(s))
        ].slice(0, 20), // Limit to 20 skills
      }))

      setAiInput('')
    } catch (err: any) {
      setError(err.message || 'Failed to get AI suggestions')
    } finally {
      setAiLoading(false)
    }
  }

  // Jitter coordinates by 200-400m if discoverable
  const jitterCoordinates = (lat: number, lng: number): [number, number] => {
    // Random offset between 200-400 meters
    const offsetMeters = 200 + Math.random() * 200
    // Convert meters to degrees (approximate: 1 degree ≈ 111km)
    const offsetDegrees = offsetMeters / 111000
    
    // Random direction
    const angle = Math.random() * 2 * Math.PI
    
    const jitteredLat = lat + offsetDegrees * Math.cos(angle)
    const jitteredLng = lng + offsetDegrees * Math.sin(angle)
    
    return [jitteredLat, jitteredLng]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      if (!user) {
        throw new Error('Not authenticated')
      }

      const client = getSupabaseClient()

      // Prepare location data with jittering if discoverable
      let finalLat = formData.lat
      let finalLng = formData.lng
      if (formData.is_discoverable && formData.lat !== null && formData.lng !== null) {
        const [jitteredLat, jitteredLng] = jitterCoordinates(formData.lat, formData.lng)
        finalLat = jitteredLat
        finalLng = jitteredLng
      }

      // Upsert profile with location fields and skills as jsonb array
      const { error: profileError } = await client
        .from('profiles')
        .upsert({
          id: user.id,
          display_name: formData.username, // Use username as display_name
          username: formData.username,
          interests_intro: formData.bio_interests || null,
          skills_intro: formData.bio_skills || null,
          is_discoverable: formData.is_discoverable,
          location_label: formData.location_label || null,
          lat: finalLat,
          lng: finalLng,
          skills: formData.skills, // Store as jsonb array
          updated_at: new Date().toISOString(),
        })

      if (profileError) throw profileError

      setSuccess(true)
      setTimeout(() => {
        router.push('/explore')
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f6f1e8',
        fontFamily: 'Georgia, serif'
      }}>
        <p style={{ color: '#4B5563' }}>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f6f1e8',
        fontFamily: 'Georgia, serif'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '500px', padding: '24px' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '16px', color: '#1F2A37', fontWeight: 700 }}>
            Sign in required
          </h1>
          <p style={{ color: '#4B5563', fontSize: '18px', marginBottom: '24px' }}>
            Please sign in to set up your profile.
          </p>
          <Link
            href="/dabble/signin"
            className="btn-primary"
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            Sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      padding: '48px 24px',
      backgroundColor: '#f6f1e8',
      minHeight: '100vh',
      fontFamily: 'Georgia, serif'
    }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: '32px',
          marginBottom: '8px',
          color: '#1F2A37',
          fontWeight: 700
        }}>
          Complete Your Profile
        </h1>
        <p style={{
          color: '#6B7280',
          marginBottom: '32px',
          fontSize: '16px'
        }}>
          Set up your profile to start connecting with people near you.
        </p>

        {error && (
          <div style={{
            padding: '16px',
            backgroundColor: '#FEE2E2',
            border: '1px solid #EF4444',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <p style={{ color: '#991B1B', fontSize: '14px', margin: 0 }}>{error}</p>
          </div>
        )}

        {success && (
          <div style={{
            padding: '16px',
            backgroundColor: '#D1FAE5',
            border: '1px solid #10B981',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <p style={{ color: '#065F46', fontSize: '14px', margin: 0 }}>
              Profile saved successfully!
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '32px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            {/* AI Suggestions Widget */}
            <div style={{
              padding: '20px',
              backgroundColor: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              marginBottom: '8px'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                marginBottom: '12px',
                color: '#1F2A37',
                fontFamily: '-apple-system, sans-serif'
              }}>
                AI Profile Assistant
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6B7280',
                marginBottom: '12px',
                fontFamily: '-apple-system, sans-serif'
              }}>
                Describe yourself, your interests, or what you can help with, and we'll suggest profile content.
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <textarea
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="e.g., I love cooking, especially Italian food. I can help with home repairs and I'm learning Spanish."
                  rows={3}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    fontSize: '14px',
                    border: '2px solid #D1D5DB',
                    borderRadius: '6px',
                    fontFamily: '-apple-system, sans-serif',
                    resize: 'vertical'
                  }}
                />
                <button
                  type="button"
                  onClick={handleAISuggestions}
                  disabled={aiLoading || !aiInput.trim()}
                  className="btn-primary"
                  style={{
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontFamily: '-apple-system, sans-serif',
                    alignSelf: 'flex-start',
                    opacity: aiLoading || !aiInput.trim() ? 0.6 : 1,
                    cursor: aiLoading || !aiInput.trim() ? 'not-allowed' : 'pointer'
                  }}
                >
                  {aiLoading ? 'Generating...' : 'Get Suggestions'}
                </button>
              </div>
              {!aiConfigured && (
                <p style={{
                  fontSize: '12px',
                  color: '#DC2626',
                  marginTop: '8px',
                  fontFamily: '-apple-system, sans-serif'
                }}>
                  ⚠️ OpenAI API key not configured. AI suggestions will not work. Set OPENAI_API_KEY in .env.local
                </p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="label" style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '8px',
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }}>
                Username
              </label>
              <input
                type="text"
                className="input"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  border: '2px solid #D1D5DB',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                }}
              />
            </div>

            {/* Bio Interests */}
            <div>
              <label className="label" style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '8px',
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }}>
                Bio: Interests
              </label>
              <textarea
                className="input"
                value={formData.bio_interests}
                onChange={(e) => handleInputChange('bio_interests', e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  border: '2px solid #D1D5DB',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Bio Skills */}
            <div>
              <label className="label" style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '8px',
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }}>
                Bio: Skills
              </label>
              <textarea
                className="input"
                value={formData.bio_skills}
                onChange={(e) => handleInputChange('bio_skills', e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  border: '2px solid #D1D5DB',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Skills */}
            <div>
              <label className="label" style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '8px',
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }}>
                Skills
              </label>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                maxHeight: '200px',
                overflowY: 'auto',
                padding: '12px',
                border: '2px solid #D1D5DB',
                borderRadius: '8px',
                backgroundColor: '#ffffff'
              }}>
                {availableSkills.map(skill => (
                  <label key={skill.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    fontSize: '14px'
                  }}>
                    <input
                      type="checkbox"
                      checked={formData.skills.includes(skill.name)}
                      onChange={() => handleSkillToggle(skill.name)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>{skill.name}</span>
                  </label>
                ))}
              </div>
              
              {/* Add Custom Skill */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <input
                  type="text"
                  placeholder="Add custom skill"
                  value={customSkillName}
                  onChange={(e) => setCustomSkillName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddCustomSkill()
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    fontSize: '14px',
                    border: '2px solid #D1D5DB',
                    borderRadius: '8px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddCustomSkill}
                  className="btn-secondary"
                  style={{
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                  }}
                >
                  Add
                </button>
              </div>
            </div>

            {/* Location Section */}
            <div style={{
              paddingTop: '24px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <h3 style={{
                fontSize: '20px',
                marginBottom: '16px',
                color: '#1F2A37',
                fontWeight: 600
              }}>
                Location & Discoverability
              </h3>

              {/* Location Label */}
              <div style={{ marginBottom: '16px' }}>
                <label className="label" style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  marginBottom: '8px',
                  color: '#374151',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                }}>
                  Location Label (e.g., neighborhood)
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.location_label}
                  onChange={(e) => handleInputChange('location_label', e.target.value)}
                  placeholder="e.g., Park Slope, Brooklyn"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '16px',
                    border: '2px solid #D1D5DB',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                  }}
                />
              </div>

              {/* Use My Location Button */}
              <div style={{ marginBottom: '16px' }}>
                <button
                  type="button"
                  onClick={handleUseLocation}
                  disabled={locationLoading}
                  className="btn-secondary"
                  style={{
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                  }}
                >
                  {locationLoading ? 'Getting location...' : 'Use my location'}
                </button>
                {formData.lat !== null && formData.lng !== null && (
                  <p style={{
                    color: '#6B7280',
                    fontSize: '12px',
                    marginTop: '8px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                  }}>
                    Location set: {formData.lat.toFixed(4)}, {formData.lng.toFixed(4)}
                  </p>
                )}
              </div>

              {/* Is Discoverable Toggle */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: '14px'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.is_discoverable}
                    onChange={(e) => handleInputChange('is_discoverable', e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span>Make me discoverable on the map</span>
                </label>
              </div>

              {/* Privacy Note */}
              <p style={{
                color: '#6B7280',
                fontSize: '12px',
                fontStyle: 'italic',
                marginTop: '8px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }}>
                Approximate only. You control discoverability.
              </p>
            </div>

            {/* Submit Button */}
            <div style={{
              paddingTop: '24px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              gap: '12px'
            }}>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary"
                style={{
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                }}
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}