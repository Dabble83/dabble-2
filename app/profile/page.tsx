// Follow STYLE_GUIDE.md for any UI changes.
// Design: minimal, editorial, calm. No loud colors. No marketplace language.
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSupabaseClient } from '@/src/lib/supabaseClient'
import { useSupabaseAuth } from '@/src/hooks/useSupabaseAuth'
import ProfilePictureUpload from '@/app/components/ProfilePictureUpload'
import CategorySkillSelector from '@/app/components/CategorySkillSelector'
import ProfileAIWidget from '@/app/components/ProfileAIWidget'

interface ProfileData {
  display_name: string
  username: string
  profile_image_url: string | null
  interests_intro: string
  skills_intro: string
  adventure_skills: string[]
  creative_skills: string[]
  home_improvement_skills: string[]
}

/**
 * Profile Builder Page - Main profile completion page after signup
 * 
 * Helps users complete their profile with:
 * - Profile picture upload
 * - Skills selection by category (Adventure, Hobbies & Creative, Home Improvement)
 * - Profile intro text
 * - AI-powered suggestions (coming in Phase 2)
 */
export default function ProfilePage() {
  const { user, loading: authLoading } = useSupabaseAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState<ProfileData>({
    display_name: '',
    username: '',
    profile_image_url: null,
    interests_intro: '',
    skills_intro: '',
    adventure_skills: [],
    creative_skills: [],
    home_improvement_skills: [],
  })

  // Load existing profile data
  useEffect(() => {
    if (authLoading || !user) return

    const loadProfile = async () => {
      try {
        setLoading(true)
        const client = getSupabaseClient()

        // Load profile
        const { data: profileData, error: profileError } = await client
          .from('profiles')
          .select(`
            id,
            display_name,
            username,
            profile_image_url,
            interests_intro,
            skills_intro,
            profile_skills (
              skill_id,
              skills (
                id,
                name,
                category
              )
            )
          `)
          .eq('id', user.id)
          .single()

        if (profileError && profileError.code !== 'PGRST116') {
          // PGRST116 = not found, which is fine for new profiles
          console.error('Error loading profile:', profileError)
        } else if (profileData) {
          // Organize skills by category
          const adventure: string[] = []
          const creative: string[] = []
          const homeImprovement: string[] = []

          if (profileData.profile_skills) {
            profileData.profile_skills.forEach((ps: any) => {
              const skillId = ps.skill_id
              const category = ps.skills?.category
              if (category === 'Adventure') {
                adventure.push(skillId)
              } else if (category === 'Creative') {
                creative.push(skillId)
              } else if (category === 'HomeImprovement') {
                homeImprovement.push(skillId)
              }
            })
          }

          setFormData({
            display_name: profileData.display_name || '',
            username: profileData.username || '',
            profile_image_url: profileData.profile_image_url || null,
            interests_intro: profileData.interests_intro || '',
            skills_intro: profileData.skills_intro || '',
            adventure_skills: adventure,
            creative_skills: creative,
            home_improvement_skills: homeImprovement,
          })
        }
      } catch (err: any) {
        console.error('Error loading profile:', err)
        setError(err.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [user, authLoading])

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUploaded = (url: string) => {
    setFormData(prev => ({ ...prev, profile_image_url: url }))
  }

  const handleImageRemoved = () => {
    setFormData(prev => ({ ...prev, profile_image_url: null }))
  }

  const handleApplyAISuggestions = (suggestions: {
    interestsIntro: string
    skillsIntro: string
    suggestedInterests: string[]
    suggestedSkills: {
      adventure: string[]
      creative: string[]
      homeImprovement: string[]
    }
    profilePicIdeas: string[]
  }) => {
    setFormData(prev => ({
      ...prev,
      interests_intro: suggestions.interestsIntro || prev.interests_intro,
      skills_intro: suggestions.skillsIntro || prev.skills_intro,
      adventure_skills: [...new Set([...prev.adventure_skills, ...suggestions.suggestedSkills.adventure])],
      creative_skills: [...new Set([...prev.creative_skills, ...suggestions.suggestedSkills.creative])],
      home_improvement_skills: [...new Set([...prev.home_improvement_skills, ...suggestions.suggestedSkills.homeImprovement])],
    }))
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

      // Basic validation
      if (!formData.display_name.trim()) {
        setError('Display name is required')
        setSaving(false)
        return
      }

      if (!formData.username.trim()) {
        setError('Username is required')
        setSaving(false)
        return
      }

      const client = getSupabaseClient()

      // Upsert profile
      const { error: profileError } = await client
        .from('profiles')
        .upsert({
          id: user.id,
          display_name: formData.display_name,
          username: formData.username,
          profile_image_url: formData.profile_image_url || null,
          interests_intro: formData.interests_intro || null,
          skills_intro: formData.skills_intro || null,
          updated_at: new Date().toISOString(),
        })

      if (profileError) throw profileError

      // Update profile skills
      // First, delete existing skills
      const { error: deleteError } = await client
        .from('profile_skills')
        .delete()
        .eq('profile_id', user.id)

      if (deleteError) throw deleteError

      // Combine all selected skills
      const allSkillIds = [
        ...formData.adventure_skills,
        ...formData.creative_skills,
        ...formData.home_improvement_skills,
      ]

      // Then insert new skills
      if (allSkillIds.length > 0) {
        const profileSkills = allSkillIds.map(skillId => ({
          profile_id: user.id,
          skill_id: skillId,
          type: 'offers', // Default to offers for now
        }))

        const { error: skillsError } = await client
          .from('profile_skills')
          .insert(profileSkills)

        if (skillsError) throw skillsError
      }

      setSuccess(true)
      setTimeout(() => {
        router.push(`/profile/${formData.username}`)
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
            Please sign in to build your profile.
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

  // Calculate completion percentage
  const totalFields = 7
  const completedFields = [
    formData.display_name,
    formData.username,
    formData.profile_image_url,
    formData.interests_intro,
    formData.skills_intro,
    formData.adventure_skills.length > 0 || formData.creative_skills.length > 0 || formData.home_improvement_skills.length > 0,
    true, // Always count form submission as complete
  ].filter(Boolean).length
  const completionPercentage = Math.round((completedFields / totalFields) * 100)

  return (
    <div style={{
      padding: '48px 24px',
      backgroundColor: '#f6f1e8',
      minHeight: '100vh',
      fontFamily: 'Georgia, serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
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
          marginBottom: '8px',
          fontSize: '16px'
        }}>
          Build your profile to start connecting with others in your community.
        </p>

        {/* Progress indicator */}
        <div style={{
          marginBottom: '32px',
          padding: '16px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }}>
            <span style={{
              fontSize: '14px',
              color: '#374151',
              fontWeight: 500,
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
            }}>
              Profile Completion
            </span>
            <span style={{
              fontSize: '14px',
              color: '#7A8F6A',
              fontWeight: 600,
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
            }}>
              {completionPercentage}%
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#E5E7EB',
            borderRadius: '4px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${completionPercentage}%`,
              height: '100%',
              backgroundColor: '#7A8F6A',
              transition: 'width 300ms ease-in-out',
            }} />
          </div>
        </div>

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
              Profile saved successfully! Redirecting...
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
            gap: '32px'
          }}>
            {/* Profile Picture */}
            <ProfilePictureUpload
              currentImageUrl={formData.profile_image_url}
              onImageUploaded={handleImageUploaded}
              onImageRemoved={handleImageRemoved}
            />

            {/* Display Name */}
            <div>
              <label className="label" style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '8px',
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }}>
                Display Name <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="text"
                className="input"
                value={formData.display_name}
                onChange={(e) => handleInputChange('display_name', e.target.value)}
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
                Username <span style={{ color: '#DC2626' }}>*</span>
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

            {/* Skills by Category */}
            <div>
              <h2 style={{
                fontSize: '20px',
                marginBottom: '16px',
                color: '#1F2A37',
                fontWeight: 600
              }}>
                Select Your Interests & Skills
              </h2>
              <p style={{
                color: '#6B7280',
                fontSize: '14px',
                marginBottom: '24px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }}>
                Choose skills and interests from each category that you'd like to share or learn.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <CategorySkillSelector
                  category="Adventure"
                  selectedSkillIds={formData.adventure_skills}
                  onSelectionChange={(skillIds) => handleInputChange('adventure_skills', skillIds)}
                  label="Adventure"
                />

                <CategorySkillSelector
                  category="Creative"
                  selectedSkillIds={formData.creative_skills}
                  onSelectionChange={(skillIds) => handleInputChange('creative_skills', skillIds)}
                  label="Hobbies and Creative"
                />

                <CategorySkillSelector
                  category="HomeImprovement"
                  selectedSkillIds={formData.home_improvement_skills}
                  onSelectionChange={(skillIds) => handleInputChange('home_improvement_skills', skillIds)}
                  label="Home Improvement"
                />
              </div>
            </div>

            {/* Profile Intro - Interests */}
            <div>
              <label className="label" style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '8px',
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }}>
                About Your Interests
              </label>
              <textarea
                className="input"
                value={formData.interests_intro}
                onChange={(e) => handleInputChange('interests_intro', e.target.value)}
                rows={4}
                placeholder="Tell others about your interests and what you're curious about..."
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

            {/* Profile Intro - Skills */}
            <div>
              <label className="label" style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '8px',
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }}>
                About Your Skills
              </label>
              <textarea
                className="input"
                value={formData.skills_intro}
                onChange={(e) => handleInputChange('skills_intro', e.target.value)}
                rows={4}
                placeholder="Share what you can teach or help others with..."
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

            {/* AI Widget */}
            <ProfileAIWidget
              onApplySuggestions={handleApplyAISuggestions}
              existingInterestsIntro={formData.interests_intro}
              existingSkillsIntro={formData.skills_intro}
              existingSkills={{
                adventure: formData.adventure_skills,
                creative: formData.creative_skills,
                homeImprovement: formData.home_improvement_skills,
              }}
            />

            {/* Submit Button */}
            <div style={{
              paddingTop: '24px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              gap: '12px',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Link
                href="/profile/setup"
                style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  textDecoration: 'none',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                }}
              >
                Advanced settings →
              </Link>
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
