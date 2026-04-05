// Follow STYLE_GUIDE.md for any UI changes.
// Design: minimal, editorial, calm. No loud colors. No marketplace language.
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/src/lib/supabaseClient'
import { useSupabaseAuth } from '@/src/hooks/useSupabaseAuth'
import CategorySkillSelector from '@/app/components/CategorySkillSelector'

/**
 * Profile Builder Page - Split Screen Layout
 * 
 * Left: Explore map showing nearby discoverable users (including self if discoverable)
 * Right: "Your Profile" panel with editable fields
 * 
 * Requirements:
 * - User location/profile appears on map once saved (even with minimal info)
 * - Map shows other user dots nearby immediately
 * - Right panel edits update local state immediately
 * - Save persists to DB (non-blocking, only address required)
 */

interface DiscoverableProfile {
  id: string
  username: string
  display_name: string | null
  profile_image_url: string | null
  location_label: string | null
  lat: number
  lng: number
  skills: string[]
  interests: string[]
  is_discoverable?: boolean
}

interface ProfileData {
  display_name: string
  username: string
  profile_image_url: string | null
  about_intro: string
  interests: string[] // Array of interest strings
  adventure_skills: string[]
  creative_skills: string[]
  home_improvement_skills: string[]
  address: string
  lat: number | null
  lng: number | null
  is_discoverable: boolean
}

// Helper to normalize boolean env var values
function normalizeBooleanEnv(value: string | undefined): boolean {
  if (!value) return false
  const normalized = value.trim().toLowerCase()
  return normalized === 'true' || normalized === '1'
}

export default function ProfileBuilderPage() {
  const { user, loading: authLoading } = useSupabaseAuth()
  const router = useRouter()
  
  // Map state
  const ENABLE_MAPS = normalizeBooleanEnv(process.env.NEXT_PUBLIC_ENABLE_MAPS)
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const [dabblers, setDabblers] = useState<DiscoverableProfile[]>([])
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 40.6782, lng: -73.9442 })
  const [mapLoadStatus, setMapLoadStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle')
  const [mapError, setMapError] = useState<string | null>(null)

  // Profile state
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState<ProfileData>({
    display_name: '',
    username: '',
    profile_image_url: null,
    about_intro: '',
    interests: [],
    adventure_skills: [],
    creative_skills: [],
    home_improvement_skills: [],
    address: '',
    lat: null,
    lng: null,
    is_discoverable: false,
  })

  // Load user profile and nearby discoverable profiles
  useEffect(() => {
    if (authLoading || !user) {
      if (!authLoading && !user) {
        router.push('/dabble/signin')
      }
      return
    }

    const loadData = async () => {
      try {
        setLoading(true)
        const client = getSupabaseClient()

        // Load user profile
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
            ),
            profile_locations (
              address_label,
              lat,
              lng,
              is_discoverable,
              precision
            )
          `)
          .eq('id', user.id)
          .single()

        if (profileError && profileError.code !== 'PGRST116') {
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

          // Parse interests from JSON array or use interests_intro
          let interests: string[] = []
          if (profileData.interests) {
            try {
              interests = typeof profileData.interests === 'string' 
                ? JSON.parse(profileData.interests) 
                : profileData.interests
            } catch {
              interests = []
            }
          }

          const location = profileData.profile_locations?.[0]

          setFormData({
            display_name: profileData.display_name || '',
            username: profileData.username || '',
            profile_image_url: profileData.profile_image_url || null,
            about_intro: profileData.interests_intro || profileData.skills_intro || '',
            interests: interests,
            adventure_skills: adventure,
            creative_skills: creative,
            home_improvement_skills: homeImprovement,
            address: location?.address_label || '',
            lat: location?.lat || null,
            lng: location?.lng || null,
            is_discoverable: location?.is_discoverable || false,
          })

          // Update map center to user location if available
          if (location?.lat && location?.lng) {
            setMapCenter({ lat: location.lat, lng: location.lng })
          }
        }

        // Load nearby profiles with location (including non-discoverable for privacy-protected display)
        // Note: Non-discoverable users appear on map but with rounded coordinates and minimal info
        const { data: discoverableData, error: discoverableError } = await client
          .from('profile_locations')
          .select(`
            profile_id,
            address_label,
            lat,
            lng,
            is_discoverable,
            profiles (
              id,
              username,
              display_name,
              profile_image_url,
              interests,
              profile_skills (
                skills (
                  name
                )
              )
            )
          `)
          .not('lat', 'is', null)
          .not('lng', 'is', null)
          .limit(200)

        if (!discoverableError && discoverableData) {
          // Helper: Round coordinates for privacy (fewer decimals = less precise)
          const roundForPrivacy = (coord: number, isDiscoverable: boolean): number => {
            if (isDiscoverable) return coord
            // Round to 2 decimal places (approximately 1km precision)
            return Math.round(coord * 100) / 100
          }

          const transformed: DiscoverableProfile[] = discoverableData
            .filter((loc: any) => loc.lat !== null && loc.lng !== null)
            .map((loc: any) => {
              const profile = loc.profiles
              const isDiscoverable = loc.is_discoverable === true
              
              // Only show skills/interests if discoverable
              const skills = isDiscoverable
                ? (profile?.profile_skills || [])
                    .map((ps: any) => ps.skills?.name)
                    .filter(Boolean)
                : []

              // Parse interests from JSON array (can be IDs or names)
              let interests: string[] = []
              if (isDiscoverable && profile?.interests) {
                try {
                  const interestsData = typeof profile.interests === 'string'
                    ? JSON.parse(profile.interests)
                    : profile.interests
                  
                  if (Array.isArray(interestsData)) {
                    // Convert to names if they're IDs or objects
                    interests = interestsData.map((item: any) => {
                      if (typeof item === 'string') {
                        return item
                      }
                      return typeof item === 'object' ? item.name : String(item)
                    }).filter(Boolean)
                  }
                } catch {
                  interests = []
                }
              }

              return {
                id: profile.id,
                username: profile.username || '',
                display_name: isDiscoverable ? profile.display_name : null,
                profile_image_url: isDiscoverable ? (profile.profile_image_url || null) : null,
                location_label: isDiscoverable ? loc.address_label : null,
                lat: roundForPrivacy(loc.lat, isDiscoverable),
                lng: roundForPrivacy(loc.lng, isDiscoverable),
                skills: skills,
                interests: interests,
                is_discoverable: isDiscoverable,
              }
            })

          setDabblers(transformed)
        }
      } catch (err: any) {
        console.error('Error loading data:', err)
        setError(err.message || 'Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user, authLoading, router])

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear success message on any change
    setSuccess(false)
  }

  const handleSave = async () => {
    if (!user) {
      setError('Not authenticated')
      return
    }

    // Validation: address is required for map visibility
    // User can save profile even with empty About, Skills, Interests, profile picture
    // But to appear on map, they need geocoded location (lat/lng) and must press Save
    if (!formData.address.trim()) {
      setError('Address is required to appear on the map')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const client = getSupabaseClient()

      // Geocode address if lat/lng not set or address changed
      let lat = formData.lat
      let lng = formData.lng

      if (!lat || !lng) {
        try {
          const geocodeResponse = await fetch('/api/geocode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: formData.address.trim() }),
          })

          if (geocodeResponse.ok) {
            const geocodeData = await geocodeResponse.json()
            lat = geocodeData.lat
            lng = geocodeData.lng
            setFormData(prev => ({ ...prev, lat, lng }))
            // Update map center if user location
            if (lat && lng) {
              setMapCenter({ lat, lng })
            }
          }
        } catch (geocodeError) {
          console.error('Geocoding error:', geocodeError)
          // Continue even if geocoding fails
        }
      }

      // Upsert profile
      const { error: profileError } = await client
        .from('profiles')
        .upsert({
          id: user.id,
          display_name: formData.display_name || formData.username,
          username: formData.username,
          profile_image_url: formData.profile_image_url || null,
          interests_intro: formData.about_intro || null,
          skills_intro: formData.about_intro || null,
          updated_at: new Date().toISOString(),
        })

      if (profileError) throw profileError

      // Update profile skills
      const { error: deleteSkillsError } = await client
        .from('profile_skills')
        .delete()
        .eq('profile_id', user.id)

      if (deleteSkillsError) throw deleteSkillsError

      const allSkillIds = [
        ...formData.adventure_skills,
        ...formData.creative_skills,
        ...formData.home_improvement_skills,
      ]

      if (allSkillIds.length > 0) {
        const profileSkills = allSkillIds.map(skillId => ({
          profile_id: user.id,
          skill_id: skillId,
          type: 'offers',
        }))

        const { error: skillsError } = await client
          .from('profile_skills')
          .insert(profileSkills)

        if (skillsError) throw skillsError
      }

      // Save interests as JSON array
      const interestsIds = formData.interests
      const { error: updateInterestsError } = await client
        .from('profiles')
        .update({ interests: JSON.stringify(interestsIds) })
        .eq('id', user.id)

      if (updateInterestsError) throw updateInterestsError

      // Upsert profile location
      // Required for map visibility: lat/lng must be present
      // Note: Even if not discoverable, we still store location (it will be rounded for privacy)
      if (!lat || !lng) {
        throw new Error('Address could not be geocoded. Please enter a valid address.')
      }

      const { error: locationError } = await client
        .from('profile_locations')
        .upsert({
          profile_id: user.id,
          address_label: formData.address.trim(),
          lat: lat,
          lng: lng,
          is_discoverable: formData.is_discoverable,
          precision: formData.is_discoverable ? 'neighborhood' : 'approximate',
          updated_at: new Date().toISOString(),
        })

      if (locationError) throw locationError

      // Reload nearby profiles to include self if discoverable
      if (formData.is_discoverable && lat && lng) {
        const { data: updatedProfiles } = await client
          .from('profile_locations')
          .select(`
            profile_id,
            address_label,
            lat,
            lng,
            is_discoverable,
            profiles (
              id,
              username,
              display_name,
              profile_image_url,
              interests,
              profile_skills (
                skills (
                  name
                )
              )
            )
          `)
          .eq('is_discoverable', true)
          .not('lat', 'is', null)
          .not('lng', 'is', null)
          .limit(200)

        if (updatedProfiles) {
          const transformed: DiscoverableProfile[] = updatedProfiles
            .filter((loc: any) => loc.lat !== null && loc.lng !== null)
            .map((loc: any) => {
              const profile = loc.profiles
              const skills = (profile?.profile_skills || [])
                .map((ps: any) => ps.skills?.name)
                .filter(Boolean)

              // Parse interests from JSON array (can be IDs or names)
              let interests: string[] = []
              if (profile?.interests) {
                try {
                  const interestsData = typeof profile.interests === 'string'
                    ? JSON.parse(profile.interests)
                    : profile.interests
                  
                  if (Array.isArray(interestsData)) {
                    // Convert to names if they're IDs or objects
                    interests = interestsData.map((item: any) => {
                      if (typeof item === 'string') {
                        return item
                      }
                      return typeof item === 'object' ? item.name : String(item)
                    }).filter(Boolean)
                  }
                } catch {
                  interests = []
                }
              }

              return {
                id: profile.id,
                username: profile.username || '',
                display_name: profile.display_name,
                profile_image_url: profile.profile_image_url || null,
                location_label: loc.address_label,
                lat: loc.lat,
                lng: loc.lng,
                skills: skills,
                interests: interests,
              }
            })

          setDabblers(transformed)
        }
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      console.error('Save error:', err)
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
    return null // Will redirect via useEffect
  }

  // Load skill ID to name mapping for current user's selected skills
  const [skillIdToName, setSkillIdToName] = useState<Record<string, string>>({})
  
  useEffect(() => {
    const allSkillIds = [
      ...formData.adventure_skills,
      ...formData.creative_skills,
      ...formData.home_improvement_skills,
    ]

    if (allSkillIds.length === 0) {
      setSkillIdToName({})
      return
    }

    const loadSkillNames = async () => {
      try {
        const client = getSupabaseClient()
        const { data: skillsData } = await client
          .from('skills')
          .select('id, name')
          .in('id', allSkillIds)

        if (skillsData) {
          const mapping: Record<string, string> = {}
          skillsData.forEach(skill => {
            mapping[skill.id] = skill.name
          })
          setSkillIdToName(mapping)
        }
      } catch (err) {
        console.error('Error loading skill names:', err)
      }
    }

    loadSkillNames()
  }, [formData.adventure_skills, formData.creative_skills, formData.home_improvement_skills])

  // Get user skill names from IDs
  const userSkillNames = [
    ...formData.adventure_skills,
    ...formData.creative_skills,
    ...formData.home_improvement_skills,
  ].map(id => skillIdToName[id] || '').filter(Boolean)
  
  const userInterestNames = formData.interests

  // Helper: Round coordinates for privacy (fewer decimals = less precise)
  // When not discoverable, round to ~1km precision (0.01 degrees ≈ 1km)
  // When discoverable, use full precision
  const roundForPrivacy = (coord: number, isDiscoverable: boolean): number => {
    if (isDiscoverable) return coord
    // Round to 2 decimal places (approximately 1km precision)
    return Math.round(coord * 100) / 100
  }

  // Include user's own profile in map if discoverable
  // Update immediately when formData changes (skills/interests)
  const mapDabblers = formData.is_discoverable && formData.lat && formData.lng
    ? [
        ...dabblers.filter(d => d.id !== user.id),
        {
          id: user.id,
          username: formData.username,
          display_name: formData.display_name || formData.username,
          profile_image_url: formData.profile_image_url,
          location_label: formData.address,
          lat: formData.lat,
          lng: formData.lng,
          skills: userSkillNames,
          interests: userInterestNames,
        } as DiscoverableProfile,
      ]
    : dabblers.filter(d => d.id !== user.id)

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: '#f6f1e8',
      fontFamily: 'Georgia, serif',
      overflow: 'hidden'
    }}>
      {/* Left Side: Map */}
      <div style={{
        flex: '1 1 50%',
        position: 'relative',
        borderRight: '1px solid #e5e7eb'
      }}>
        {ENABLE_MAPS && GOOGLE_MAPS_API_KEY ? (
          <MapsComponent
            center={mapCenter}
            dabblers={mapDabblers}
            onError={(error) => {
              setMapError(error)
              setMapLoadStatus('error')
            }}
            onStatusChange={setMapLoadStatus}
          />
        ) : (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 24px',
            textAlign: 'center',
            color: '#6B7280'
          }}>
            <p style={{ fontSize: '14px' }}>
              {!ENABLE_MAPS 
                ? 'Maps disabled. Set NEXT_PUBLIC_ENABLE_MAPS=true in .env.local'
                : 'Google Maps API key is missing. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local'}
            </p>
          </div>
        )}
      </div>

      {/* Right Side: Profile Panel */}
      <div style={{
        flex: '0 0 400px',
        backgroundColor: '#ffffff',
        overflowY: 'auto',
        borderLeft: '1px solid #e5e7eb'
      }}>
        <div style={{ padding: '32px' }}>
          <h1 style={{
            fontSize: '24px',
            marginBottom: '24px',
            color: '#1F2A37',
            fontWeight: 700
          }}>
            Your Profile
          </h1>

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

          {success && (
            <div style={{
              padding: '12px',
              backgroundColor: '#D1FAE5',
              border: '1px solid #10B981',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <p style={{ color: '#065F46', fontSize: '14px', margin: 0 }}>
                Profile saved successfully!
              </p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Profile Picture Placeholder + Username */}
            <div>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#E5E7EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
              }}>
                {formData.profile_image_url ? (
                  <img
                    src={formData.profile_image_url}
                    alt="Profile"
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <span style={{ fontSize: '32px', color: '#9CA3AF' }}>👤</span>
                )}
              </div>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="username"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '16px',
                  border: '2px solid #D1D5DB',
                  borderRadius: '6px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                }}
              />
            </div>

            {/* About/Introduction */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '8px',
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }}>
                About / Introduction
              </label>
              <textarea
                value={formData.about_intro}
                onChange={(e) => handleInputChange('about_intro', e.target.value)}
                rows={4}
                placeholder="Tell others about yourself..."
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  border: '2px solid #D1D5DB',
                  borderRadius: '8px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Skills Multi-Select */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '12px',
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }}>
                Skills
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

            {/* Interests Multi-Select (Simple text input for now) */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '8px',
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }}>
                Interests
              </label>
              <input
                type="text"
                value={formData.interests.join(', ')}
                onChange={(e) => {
                  const interests = e.target.value
                    .split(',')
                    .map(i => i.trim())
                    .filter(Boolean)
                  handleInputChange('interests', interests)
                }}
                placeholder="e.g., hiking, cooking, photography"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  border: '2px solid #D1D5DB',
                  borderRadius: '8px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                }}
              />
              <p style={{
                fontSize: '12px',
                color: '#6B7280',
                marginTop: '4px',
                margin: 0,
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }}>
                Separate interests with commas
              </p>
            </div>

            {/* Address + Discoverability */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '8px',
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }}>
                Address <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="e.g., Park Slope, Brooklyn, NY"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  border: '2px solid #D1D5DB',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                }}
              />
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }}>
                <input
                  type="checkbox"
                  checked={formData.is_discoverable}
                  onChange={(e) => handleInputChange('is_discoverable', e.target.checked)}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    accentColor: '#7A8F6A'
                  }}
                />
                <div>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#374151',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    Discoverable at neighborhood level
                  </span>
                  <span style={{
                    fontSize: '12px',
                    color: '#6B7280',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                  }}>
                    {formData.is_discoverable
                      ? 'Your profile details will be visible to others on the map'
                      : 'Your location will appear rounded (~1km) with minimal info (username only)'}
                  </span>
                </div>
              </label>
            </div>

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !formData.address.trim()}
              className="btn-primary"
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                cursor: saving || !formData.address.trim() ? 'not-allowed' : 'pointer',
                opacity: saving || !formData.address.trim() ? 0.6 : 1
              }}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Maps Component - Reused from Explore page
 */
function MapsComponent({ 
  center, 
  dabblers,
  onError,
  onStatusChange
}: { 
  center: { lat: number; lng: number }
  dabblers: DiscoverableProfile[]
  onError?: (error: string) => void
  onStatusChange?: (status: 'idle' | 'loading' | 'loaded' | 'error') => void
}) {
  const router = useRouter()
  const [Maps, setMaps] = useState<{
    GoogleMap: any
    LoadScript: any
    Marker: any
    InfoWindow: any
  } | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null)
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null)

  const googleMapsApiKey = typeof window !== 'undefined' 
    ? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY 
    : undefined

  useEffect(() => {
    if (!googleMapsApiKey) {
      const errorMsg = 'Google Maps API key is missing. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local'
      onError?.(errorMsg)
      onStatusChange?.('error')
    }
  }, [googleMapsApiKey, onError, onStatusChange])

  useEffect(() => {
    if (mapError) {
      onError?.(mapError)
      onStatusChange?.('error')
    }
  }, [mapError, onError, onStatusChange])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!googleMapsApiKey) return

    let mounted = true
    onStatusChange?.('loading')

    const loadMaps = async () => {
      try {
        const googleMapsApi = await import('@react-google-maps/api')
        
        if (!mounted) return
        
        setMaps({
          GoogleMap: googleMapsApi.GoogleMap,
          LoadScript: googleMapsApi.LoadScript,
          Marker: googleMapsApi.Marker,
          InfoWindow: googleMapsApi.InfoWindow,
        })
      } catch (err: any) {
        if (!mounted) return
        console.error('Failed to load Google Maps library:', err)
        const errorMsg = err?.message || 'Failed to load Google Maps library'
        setMapError(errorMsg)
        onError?.(errorMsg)
        onStatusChange?.('error')
      }
    }

    loadMaps()

    return () => {
      mounted = false
    }
  }, [googleMapsApiKey, onError, onStatusChange])

  if (mapError) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ 
        padding: '48px 24px',
        textAlign: 'center',
        color: '#6B7280'
      }}>
        <p style={{ 
          fontSize: '14px',
          color: '#DC2626',
          fontFamily: '-apple-system, sans-serif',
          maxWidth: '500px'
        }}>
          {mapError}
        </p>
      </div>
    )
  }

  if (!Maps) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ 
        padding: '48px 24px',
        textAlign: 'center',
        color: '#6B7280'
      }}>
        <p style={{ 
          fontSize: '14px',
          color: '#6B7280',
          fontFamily: '-apple-system, sans-serif'
        }}>
          Loading map...
        </p>
      </div>
    )
  }

  const { GoogleMap, LoadScript, Marker, InfoWindow } = Maps
  const google = typeof window !== 'undefined' ? (window as any).google : null

  return (
    <LoadScript
      googleMapsApiKey={googleMapsApiKey}
      libraries={['places']}
      version="weekly"
      onLoad={() => {
        setMapLoaded(true)
        onStatusChange?.('loaded')
      }}
      onError={(err: Error) => {
        console.error('Google Maps LoadScript error:', err)
        let errorMsg = err.message || 'Failed to load Google Maps script'
        errorMsg = errorMsg.replace(/AIza[0-9A-Za-z_-]{35}/g, '[API_KEY]')
        errorMsg = errorMsg.replace(/key=[^&\s]+/gi, 'key=[API_KEY]')
        setMapError(errorMsg)
        onError?.(errorMsg)
        onStatusChange?.('error')
      }}
      loadingElement={
        <div className="absolute inset-0 flex items-center justify-center" style={{ 
          backgroundColor: '#E5E7EB',
          color: '#6B7280'
        }}>
          <p style={{ fontSize: '14px' }}>Loading map...</p>
        </div>
      }
    >
      <GoogleMap
        mapContainerStyle={{
          width: '100%',
          height: '100%',
        }}
        center={center}
        zoom={13}
        options={{
          styles: [
            {
              featureType: 'poi',
              stylers: [{ visibility: 'off' }]
            },
            {
              featureType: 'transit',
              stylers: [{ visibility: 'simplified' }]
            }
          ],
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        }}
        onLoad={() => {
          onStatusChange?.('loaded')
        }}
        onError={(error) => {
          console.error('Google Map error:', error)
          setMapError('Failed to load map')
          onError?.('Failed to load map')
          onStatusChange?.('error')
        }}
      >
        {dabblers.map((dabbler) => {
          // Create blue dot marker icon
          // Use Google Maps SymbolPath.CIRCLE if available, otherwise use SVG data URL
          const iconConfig = google?.maps?.SymbolPath?.CIRCLE
            ? {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#3B82F6',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2,
              }
            : {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="6" fill="#3B82F6" stroke="#FFFFFF" stroke-width="2"/>
                  </svg>
                `),
                scaledSize: google?.maps ? new google.maps.Size(16, 16) : undefined,
                anchor: google?.maps ? new google.maps.Point(8, 8) : undefined,
              }

          return (
            <Marker
              key={dabbler.id}
              position={{ lat: dabbler.lat, lng: dabbler.lng }}
              icon={iconConfig}
              onMouseOver={() => setHoveredMarker(dabbler.id)}
              onMouseOut={() => setHoveredMarker(null)}
              onClick={() => {
                setSelectedMarker(dabbler.id === selectedMarker ? null : dabbler.id)
              }}
            >
              {(selectedMarker === dabbler.id || hoveredMarker === dabbler.id) && (
                <InfoWindow
                  position={{ lat: dabbler.lat, lng: dabbler.lng }}
                  onCloseClick={() => setSelectedMarker(null)}
                >
                  <div style={{
                    padding: '12px',
                    minWidth: '220px',
                    maxWidth: '280px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                  }}>
                    {/* Privacy: When not discoverable, show minimal info */}
                    {dabbler.is_discoverable === false ? (
                      <div>
                        <div style={{
                          fontSize: '12px',
                          fontWeight: 500,
                          color: '#6B7280',
                          marginBottom: '6px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Nearby Dabbler
                        </div>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#1F2A37'
                        }}>
                          @{dabbler.username}
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Profile Picture + Username */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          marginBottom: '12px'
                        }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: '#E5E7EB',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            overflow: 'hidden'
                          }}>
                            {dabbler.profile_image_url ? (
                              <img
                                src={dabbler.profile_image_url}
                                alt={dabbler.username}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                            ) : (
                              <span style={{ fontSize: '20px', color: '#9CA3AF' }}>👤</span>
                            )}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <h3 style={{
                              fontSize: '14px',
                              fontWeight: 600,
                              margin: 0,
                              color: '#1F2A37',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              @{dabbler.username}
                            </h3>
                            {dabbler.display_name && (
                              <p style={{
                                fontSize: '12px',
                                color: '#6B7280',
                                margin: 0,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}>
                                {dabbler.display_name}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Skills */}
                        {dabbler.skills.length > 0 && (
                          <div style={{ marginBottom: '10px' }}>
                            <div style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '6px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}>
                              Skills
                            </div>
                            <div style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '4px'
                            }}>
                              {dabbler.skills.slice(0, 6).map((skill, idx) => (
                                <span
                                  key={idx}
                                  style={{
                                    fontSize: '11px',
                                    padding: '3px 8px',
                                    backgroundColor: '#E5E7EB',
                                    color: '#374151',
                                    borderRadius: '12px',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  {skill}
                                </span>
                              ))}
                              {dabbler.skills.length > 6 && (
                                <span style={{
                                  fontSize: '11px',
                                  color: '#6B7280',
                                  padding: '3px 8px'
                                }}>
                                  +{dabbler.skills.length - 6}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Interests */}
                        {dabbler.interests.length > 0 && (
                          <div style={{ marginBottom: '10px' }}>
                            <div style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: '6px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}>
                              Interests
                            </div>
                            <div style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '4px'
                            }}>
                              {dabbler.interests.slice(0, 6).map((interest, idx) => (
                                <span
                                  key={idx}
                                  style={{
                                    fontSize: '11px',
                                    padding: '3px 8px',
                                    backgroundColor: '#DBEAFE',
                                    color: '#1E40AF',
                                    borderRadius: '12px',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  {interest}
                                </span>
                              ))}
                              {dabbler.interests.length > 6 && (
                                <span style={{
                                  fontSize: '11px',
                                  color: '#6B7280',
                                  padding: '3px 8px'
                                }}>
                                  +{dabbler.interests.length - 6}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* View Profile Link */}
                        <a
                          href={`/profile/${dabbler.username}`}
                          style={{
                            display: 'block',
                            marginTop: '10px',
                            fontSize: '12px',
                            color: '#7A8F6A',
                            textDecoration: 'none',
                            fontWeight: 500,
                            paddingTop: '10px',
                            borderTop: '1px solid #E5E7EB'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.textDecoration = 'underline'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.textDecoration = 'none'
                          }}
                        >
                          View Profile →
                        </a>
                      </>
                    )}
                  </div>
                </InfoWindow>
              )}
            </Marker>
          )
        })}
      </GoogleMap>
    </LoadScript>
  )
}
