// Follow STYLE_GUIDE.md for any UI changes.
// Design: minimal, editorial, calm. No loud colors. No marketplace language.
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabaseAuth } from '@/src/hooks/useSupabaseAuth'
import { getSupabaseClient } from '@/src/lib/supabaseClient'

interface FormData {
  fullName: string
  email: string
  username: string
  address: string
  isDiscoverable: boolean
}

/**
 * Quick Profile Onboarding Page
 * 
 * Simple form to collect essential profile information:
 * - Full name (optional)
 * - Email (prefilled from auth)
 * - Username (required, unique)
 * - Address (required, will be geocoded)
 * - Discoverable toggle (neighborhood level)
 * 
 * On submit: geocodes address, saves profile, sets hasOnboarded=true, redirects to /profile-builder
 */
export default function QuickProfilePage() {
  const { user, loading: authLoading } = useSupabaseAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    username: '',
    address: '',
    isDiscoverable: false,
  })

  // Prefill email from auth when user loads
  useEffect(() => {
    if (!authLoading && user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
      }))
      setLoading(false)
    } else if (!authLoading && !user) {
      // Not authenticated - redirect to signin
      router.push('/dabble/signin')
    }
  }, [user, authLoading, router])

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      if (!user) {
        throw new Error('Not authenticated')
      }

      // Validation: username and address are required
      if (!formData.username.trim()) {
        setError('Username is required')
        setSaving(false)
        return
      }

      if (!formData.address.trim()) {
        setError('Address is required')
        setSaving(false)
        return
      }

      // Geocode the address
      let lat: number | null = null
      let lng: number | null = null

      try {
        const geocodeResponse = await fetch('/api/geocode', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: formData.address.trim(),
          }),
        })

        if (!geocodeResponse.ok) {
          const errorData = await geocodeResponse.json()
          throw new Error(errorData.error || 'Failed to geocode address')
        }

        const geocodeData = await geocodeResponse.json()
        lat = geocodeData.lat
        lng = geocodeData.lng
      } catch (geocodeError: any) {
        console.error('Geocoding error:', geocodeError)
        // Continue even if geocoding fails - we'll store the address label
        // but lat/lng may be null
      }

      const client = getSupabaseClient()

      // Check if username is already taken by another user
      const { data: existingProfile } = await client
        .from('profiles')
        .select('id, username')
        .eq('username', formData.username.trim())
        .maybeSingle()

      if (existingProfile && existingProfile.id !== user.id) {
        setError('Username is already taken')
        setSaving(false)
        return
      }

      // Upsert profile with has_onboarded=true
      const { error: profileError } = await client
        .from('profiles')
        .upsert({
          id: user.id,
          display_name: formData.fullName.trim() || formData.username.trim(),
          username: formData.username.trim(),
          has_onboarded: true,
          updated_at: new Date().toISOString(),
        })

      if (profileError) {
        // Check if it's a unique constraint violation
        if (profileError.code === '23505' || profileError.message?.includes('unique')) {
          setError('Username is already taken')
          setSaving(false)
          return
        }
        throw profileError
      }

      // Upsert profile location
      const { error: locationError } = await client
        .from('profile_locations')
        .upsert({
          profile_id: user.id,
          address_label: formData.address.trim(),
          is_discoverable: formData.isDiscoverable,
          precision: 'neighborhood',
          lat: lat,
          lng: lng,
          updated_at: new Date().toISOString(),
        })

      if (locationError) {
        console.error('Location error:', locationError)
        // Continue even if location save fails - profile is saved
      }

      // Success - redirect to profile builder
      router.push('/profile-builder')
    } catch (err: any) {
      console.error('Save error:', err)
      setError(err.message || 'Failed to save profile. Please try again.')
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

  return (
    <div style={{
      padding: '48px 24px',
      backgroundColor: '#f6f1e8',
      minHeight: '100vh',
      fontFamily: 'Georgia, serif'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: '32px',
          marginBottom: '8px',
          color: '#1F2A37',
          fontWeight: 700
        }}>
          Quick Profile
        </h1>
        <p style={{
          color: '#6B7280',
          marginBottom: '32px',
          fontSize: '16px'
        }}>
          Let's set up your profile. We'll use this information to connect you with others nearby.
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
            {/* Full Name */}
            <div>
              <label className="label" style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '8px',
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }}>
                Full Name
              </label>
              <input
                type="text"
                className="input"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Your full name"
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

            {/* Email */}
            <div>
              <label className="label" style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '8px',
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }}>
                Email
              </label>
              <input
                type="email"
                className="input"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your@email.com"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  border: '2px solid #D1D5DB',
                  borderRadius: '8px',
                  backgroundColor: '#F9FAFB',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  color: '#6B7280'
                }}
                readOnly
                disabled
              />
              <p style={{
                fontSize: '12px',
                color: '#6B7280',
                marginTop: '4px',
                margin: 0,
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }}>
                This is your account email (from signup)
              </p>
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
                placeholder="username"
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
              <p style={{
                fontSize: '12px',
                color: '#6B7280',
                marginTop: '4px',
                margin: 0,
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }}>
                Your unique display handle (required)
              </p>
            </div>

            {/* Address */}
            <div>
              <label className="label" style={{
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
                className="input"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="e.g., Park Slope, Brooklyn, NY"
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
              <p style={{
                fontSize: '12px',
                color: '#6B7280',
                marginTop: '4px',
                margin: 0,
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }}>
                We'll use this to connect you with others nearby (required)
              </p>
            </div>

            {/* Discoverable Toggle */}
            <div style={{
              padding: '16px',
              backgroundColor: '#F9FAFB',
              borderRadius: '8px',
              border: '1px solid #E5E7EB'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }}>
                <input
                  type="checkbox"
                  checked={formData.isDiscoverable}
                  onChange={(e) => handleInputChange('isDiscoverable', e.target.checked)}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    accentColor: '#7A8F6A'
                  }}
                />
                <div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#374151',
                    marginBottom: '4px'
                  }}>
                    Discoverable at neighborhood level
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6B7280'
                  }}>
                    Allow others to find you on the map when exploring nearby
                  </div>
                </div>
              </label>
            </div>

            {/* Submit Button */}
            <div style={{
              paddingTop: '8px',
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
            }}>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary"
                style={{
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.6 : 1
                }}
              >
                {saving ? 'Saving...' : 'Save & Continue'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
