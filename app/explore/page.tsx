// Follow STYLE_GUIDE.md for any UI changes.
// Design: minimal, editorial, calm. No loud colors. No marketplace language.
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/src/lib/supabaseClient'
import { useSupabaseAuth } from '@/src/hooks/useSupabaseAuth'
import ChatPopover from '@/app/components/ChatPopover'

/**
 * Explore Page with Google Maps
 * 
 * Maps only load if NEXT_PUBLIC_ENABLE_MAPS=true
 * All map libraries are dynamically imported (never at import time)
 * No map scripts loaded in layout or landing page
 * Loads discoverable profiles from Supabase
 */

// Feature flag - read at runtime to ensure env vars are available
// Note: In Next.js, NEXT_PUBLIC_* vars are replaced at build time
// Restart dev server after adding/changing .env.local

interface DiscoverableProfile {
  id: string
  username: string
  display_name: string | null
  profile_image_url: string | null
  location_label: string | null
  lat: number
  lng: number
  skills: string[] // Array of skill names
  interests: string[] // Array of interest names
  is_discoverable?: boolean
}

// Helper to normalize boolean env var values
function normalizeBooleanEnv(value: string | undefined): boolean {
  if (!value) return false
  const normalized = value.trim().toLowerCase()
  return normalized === 'true' || normalized === '1'
}

export default function ExplorePage() {
  // Read env vars at runtime (client component)
  const ENABLE_MAPS = normalizeBooleanEnv(process.env.NEXT_PUBLIC_ENABLE_MAPS)
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  const { user, loading: authLoading } = useSupabaseAuth()
  const [selectedRadius, setSelectedRadius] = useState<number>(5)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [dabblers, setDabblers] = useState<DiscoverableProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [mapLoadStatus, setMapLoadStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle')
  const [userProfile, setUserProfile] = useState<{
    username: string
    is_discoverable: boolean
    skills: string[]
  } | null>(null)
  const [panelOpen, setPanelOpen] = useState(true)
  const [chatRecipient, setChatRecipient] = useState<{ id: string; username: string } | null>(null)

  // Load user profile if signed in
  useEffect(() => {
    if (!user || authLoading) return

    const loadUserProfile = async () => {
      try {
        const client = getSupabaseClient()
        const { data, error } = await client
          .from('profiles')
          .select('username, is_discoverable, skills')
          .eq('id', user.id)
          .single()

        if (!error && data) {
          let skillsArray: string[] = []
          if (data.skills) {
            if (Array.isArray(data.skills)) {
              skillsArray = data.skills
            } else if (typeof data.skills === 'string') {
              try {
                skillsArray = JSON.parse(data.skills)
              } catch {
                skillsArray = []
              }
            }
          }

          setUserProfile({
            username: data.username,
            is_discoverable: data.is_discoverable || false,
            skills: skillsArray,
          })
        }
      } catch (err) {
        console.error('Error loading user profile:', err)
      }
    }

    loadUserProfile()
  }, [user, authLoading])

  // Load discoverable profiles from Supabase (same storage as profile-builder)
  useEffect(() => {
    const loadProfiles = async () => {
      try {
        setLoading(true)
        setError(null)

        const client = getSupabaseClient()

        // Get current user's location if available (from profile_locations table)
        let profileLocation: { lat: number; lng: number } | null = null
        if (user) {
          const { data: userLocationData } = await client
            .from('profile_locations')
            .select('lat, lng')
            .eq('profile_id', user.id)
            .not('lat', 'is', null)
            .not('lng', 'is', null)
            .single()
          
          if (userLocationData?.lat && userLocationData?.lng) {
            profileLocation = {
              lat: userLocationData.lat,
              lng: userLocationData.lng,
            }
            // Update map center to user location if browser location not set
            if (!userLocation) {
              setUserLocation(profileLocation)
            }
          }
        }

        // Use browser location if available, otherwise use profile location, otherwise default
        // Browser location (from handleUseMyLocation) takes precedence
        const searchLocation = userLocation || profileLocation

        // Query profile_locations joined with profiles (same as profile-builder)
        let query = client
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

        // If we have a user location, filter to nearby profiles using bounding box
        // Simple approach: filter lat/lng within ~15 miles (approximately 0.22 degrees)
        if (searchLocation && selectedRadius) {
          // Convert radius from km to degrees (approximate: 1 degree ≈ 111 km)
          const radiusDegrees = selectedRadius / 111
          query = query
            .gte('lat', searchLocation.lat - radiusDegrees)
            .lte('lat', searchLocation.lat + radiusDegrees)
            .gte('lng', searchLocation.lng - radiusDegrees)
            .lte('lng', searchLocation.lng + radiusDegrees)
        }

        const { data: discoverableData, error: discoverableError } = await query
          .limit(200)

        if (discoverableError) {
          throw discoverableError
        }

        if (!discoverableData) {
          setDabblers([])
          return
        }

        // Helper: Round coordinates for privacy (for non-discoverable if any slip through)
        const roundForPrivacy = (coord: number, isDiscoverable: boolean): number => {
          if (isDiscoverable) return coord
          return Math.round(coord * 100) / 100
        }

        // Transform data to DiscoverableProfile format (same as profile-builder)
        const transformed: DiscoverableProfile[] = discoverableData
          .filter((loc: any) => loc.lat !== null && loc.lng !== null && loc.profiles)
          .map((loc: any) => {
            const profile = loc.profiles
            const isDiscoverable = loc.is_discoverable === true

            // Extract skills from profile_skills join
            const skills = isDiscoverable
              ? (profile?.profile_skills || [])
                  .map((ps: any) => ps.skills?.name)
                  .filter(Boolean)
              : []

            // Parse interests from JSON array
            let interests: string[] = []
            if (isDiscoverable && profile?.interests) {
              try {
                const interestsData = typeof profile.interests === 'string'
                  ? JSON.parse(profile.interests)
                  : profile.interests

                if (Array.isArray(interestsData)) {
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
      } catch (err: any) {
        console.error('Error loading discoverable profiles:', err)
        setError(err.message || 'Failed to load discoverable profiles')
      } finally {
        setLoading(false)
      }
    }

    loadProfiles()
  }, [user, selectedRadius, userLocation])

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser')
      return
    }

    setLocationLoading(true)
    setLocationError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setLocationLoading(false)
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions in your browser settings.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.'
            break
        }
        setLocationError(errorMessage)
        setLocationLoading(false)
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000, // Cache location for 1 minute
      }
    )
  }

  // Default to Brooklyn if no user location or location from profile
  const centerLocation = userLocation || { lat: 40.6782, lng: -73.9442 }

  return (
    <div className="w-full">
      <div className="max-w-1200px mx-auto px-6 py-16" style={{ 
        maxWidth: '1200px',
        paddingTop: '64px',
        paddingBottom: '64px',
        display: 'flex',
        gap: '32px',
        alignItems: 'flex-start'
      }}>
        {/* Side Panel for Signed-In Users */}
        {user && userProfile && (
          <div style={{
            width: '280px',
            flexShrink: 0,
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            position: 'sticky',
            top: '80px',
            display: panelOpen ? 'block' : 'none'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 600,
                color: '#1F2A37',
                fontFamily: 'Georgia, serif',
                margin: 0
              }}>
                My Profile
              </h2>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#6B7280',
                  padding: '0',
                  lineHeight: '1'
                }}
                aria-label="Close panel"
              >
                ×
              </button>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <p style={{
                fontSize: '16px',
                fontWeight: 500,
                color: '#1F2A37',
                marginBottom: '8px',
                fontFamily: '-apple-system, sans-serif'
              }}>
                @{userProfile.username}
              </p>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontFamily: '-apple-system, sans-serif'
              }}>
                <input
                  type="checkbox"
                  checked={userProfile.is_discoverable}
                  onChange={async (e) => {
                    try {
                      const client = getSupabaseClient()
                      await client
                        .from('profiles')
                        .update({ is_discoverable: e.target.checked })
                        .eq('id', user.id)
                      
                      setUserProfile(prev => prev ? {
                        ...prev,
                        is_discoverable: e.target.checked
                      } : null)
                    } catch (err) {
                      console.error('Error updating discoverability:', err)
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                />
                <span>Discoverable on map</span>
              </label>
            </div>

            {userProfile.skills.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <p style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#374151',
                  marginBottom: '8px',
                  fontFamily: '-apple-system, sans-serif'
                }}>
                  Skills
                </p>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px'
                }}>
                  {userProfile.skills.slice(0, 5).map((skill, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '12px',
                        padding: '4px 8px',
                        backgroundColor: '#E5E7EB',
                        color: '#374151',
                        borderRadius: '12px'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                  {userProfile.skills.length > 5 && (
                    <span style={{
                      fontSize: '12px',
                      color: '#6B7280'
                    }}>
                      +{userProfile.skills.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}

            <Link
              href="/profile/setup"
              style={{
                display: 'block',
                padding: '10px 16px',
                backgroundColor: '#7A8F6A',
                color: '#F7F6F2',
                textAlign: 'center',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: '-apple-system, sans-serif'
              }}
            >
              Edit Profile
            </Link>
          </div>
        )}

        {/* Main Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ marginBottom: '16px' }}>
            Explore Nearby
          </h1>
        <p style={{ 
          fontSize: '18px',
          lineHeight: '1.7',
          color: '#4B5563',
          marginBottom: '32px'
        }}>
          See dabblers who've chosen to be discoverable nearby. Use the radius selector to adjust how far you want to explore. Click on markers to view profiles and discover potential exchanges.
        </p>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8" style={{ 
          marginBottom: '32px',
          gap: '16px'
        }}>
          {/* Radius Selector */}
          <div className="flex items-center gap-3" style={{ gap: '12px' }}>
            <span className="text-sm font-medium" style={{ 
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              fontFamily: '-apple-system, sans-serif'
            }}>
              Radius:
            </span>
            <div className="flex gap-2" style={{ gap: '8px' }}>
              {[1, 5, 10].map((radius) => (
                <button
                  key={radius}
                  type="button"
                  onClick={() => setSelectedRadius(radius)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: selectedRadius === radius ? '#7A8F6A' : 'transparent',
                    color: selectedRadius === radius ? '#F7F6F2' : '#374151',
                    border: `2px solid ${selectedRadius === radius ? '#5F6B55' : '#D1D5DB'}`,
                    opacity: selectedRadius === radius ? '0.8' : '1',
                    fontFamily: '-apple-system, sans-serif',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background-color 200ms ease-in-out, border-color 200ms ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedRadius !== radius) {
                      e.currentTarget.style.borderColor = '#9CA3AF'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedRadius !== radius) {
                      e.currentTarget.style.borderColor = '#D1D5DB'
                    }
                  }}
                >
                  {radius} km
                </button>
              ))}
            </div>
          </div>

          {/* Use My Location Button */}
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={locationLoading}
            className="btn-secondary text-sm"
            style={{
              fontSize: '14px',
              padding: '10px 20px',
              opacity: locationLoading ? '0.6' : '1',
              cursor: locationLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {locationLoading ? 'Getting location...' : '📍 Use my location'}
          </button>
        </div>

        {/* Location Error */}
        {locationError && (
          <div className="mb-6 p-4 rounded-lg" style={{
            backgroundColor: '#FEF3C7',
            border: '2px solid #FCD34D',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <p style={{ color: '#92400E', fontSize: '14px', margin: 0 }}>
              {locationError}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mb-6 p-4 rounded-lg" style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            padding: '24px',
            borderRadius: '8px',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#6B7280', fontSize: '14px' }}>Loading discoverable profiles...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 rounded-lg" style={{
            backgroundColor: '#FEE2E2',
            border: '1px solid #EF4444',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <p style={{ color: '#991B1B', fontSize: '14px', margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && dabblers.length === 0 && (
          <div className="mb-6 p-4 rounded-lg" style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            padding: '32px',
            borderRadius: '8px',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#6B7280', fontSize: '16px', marginBottom: '8px' }}>
              {userLocation 
                ? `No discoverable profiles found within ${selectedRadius} km`
                : 'No discoverable profiles found'}
            </p>
            <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '16px' }}>
              {userLocation
                ? 'Try increasing the radius or use a different location.'
                : 'Be the first to make your profile discoverable!'}
            </p>
            {!userLocation && (
              <button
                type="button"
                onClick={handleUseMyLocation}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#7A8F6A',
                  color: '#F7F6F2',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: '-apple-system, sans-serif'
                }}
              >
                Use My Location
              </button>
            )}
          </div>
        )}

        {/* Diagnostics Status Block */}
        {!loading && (
          <div className="mb-6 p-3 rounded" style={{
            backgroundColor: '#F9FAFB',
            border: '1px solid #E5E7EB',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '24px',
            fontSize: '12px',
            color: '#374151',
            fontFamily: 'monospace'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>
                <span style={{ color: '#6B7280' }}>ENABLE_MAPS:</span>{' '}
                <span>{ENABLE_MAPS ? 'true' : 'false'}</span>
              </div>
              <div>
                <span style={{ color: '#6B7280' }}>hasMapsKey:</span>{' '}
                <span>{GOOGLE_MAPS_API_KEY ? 'true' : 'false'}</span>
              </div>
              <div>
                <span style={{ color: '#6B7280' }}>mapLoadStatus:</span>{' '}
                <span>{mapLoadStatus}</span>
              </div>
              <div>
                <span style={{ color: '#6B7280' }}>Profiles:</span>{' '}
                <span>{dabblers.length}</span>
              </div>
            </div>
          </div>
        )}

        {/* Map Container */}
        {!loading && !error && (
          <div className="relative w-full rounded-xl overflow-hidden" style={{
            backgroundColor: '#E5E7EB',
            border: '1px solid #D1D5DB',
            borderRadius: '12px',
            height: '60vh',
            minHeight: '500px'
          }}>
            {!ENABLE_MAPS ? (
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
                  Maps disabled. Set NEXT_PUBLIC_ENABLE_MAPS=true in .env.local
                </p>
              </div>
            ) : !GOOGLE_MAPS_API_KEY ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ 
                padding: '48px 24px',
                textAlign: 'center',
                color: '#6B7280'
              }}>
                <p style={{ 
                  fontSize: '14px',
                  color: '#DC2626',
                  fontFamily: '-apple-system, sans-serif'
                }}>
                  Google Maps API key is missing. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local
                </p>
              </div>
            ) : (
              <MapsComponent 
                center={centerLocation}
                radius={selectedRadius}
                dabblers={dabblers}
                onError={(error) => {
                  setMapError(error)
                  setMapLoadStatus('error')
                }}
                onStatusChange={setMapLoadStatus}
              />
            )}
          </div>
        )}

        {/* Dabblers List (Fallback if map fails or for accessibility) */}
        {!loading && !error && dabblers.length > 0 && (
          <div className="mt-8" style={{ marginTop: '32px' }}>
            <h2 style={{ 
              fontSize: '24px',
              marginBottom: '16px',
              color: '#1F2A37'
            }}>
              Nearby Dabblers
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4" style={{ gap: '16px' }}>
              {dabblers.map((dabbler) => (
                <div key={dabbler.id} className="card" style={{ padding: '24px' }}>
                  <Link 
                    href={`/profile/${dabbler.username}`}
                    className="link-primary"
                    style={{ textDecoration: 'none' }}
                  >
                    <h3 style={{ 
                      fontSize: '20px',
                      marginBottom: '8px',
                      color: '#1F2A37'
                    }}>
                      {dabbler.display_name || `@${dabbler.username}`}
                    </h3>
                    <p style={{ 
                      fontSize: '14px',
                      color: '#6B7280',
                      marginBottom: '12px'
                    }}>
                      @{dabbler.username}
                    </p>
                    {dabbler.location_label && (
                      <p style={{ 
                        fontSize: '14px',
                        color: '#6B7280',
                        marginBottom: '12px'
                      }}>
                        📍 {dabbler.location_label}
                      </p>
                    )}
                    {dabbler.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2" style={{ gap: '8px' }}>
                        {dabbler.skills.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 rounded-full text-xs"
                            style={{
                              backgroundColor: '#E5E7EB',
                              color: '#374151',
                              fontSize: '12px',
                              padding: '4px 8px',
                              borderRadius: '16px'
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
      
      {/* Chat Popover */}
      {chatRecipient && (
        <ChatPopover
          recipientId={chatRecipient.id}
          recipientUsername={chatRecipient.username}
          onClose={() => setChatRecipient(null)}
        />
      )}
    </div>
  )
}

/**
 * Maps Component - Only renders if ENABLE_MAPS=true
 * Dynamically imports Google Maps to prevent SSR issues and import-time errors
 * Shows InfoWindow/card on hover or click
 */
function MapsComponent({ 
  center, 
  radius, 
  dabblers,
  onError,
  onStatusChange
}: { 
  center: { lat: number; lng: number }
  radius: number
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

  // Read API key at runtime - ONLY from environment variable
  // Only read when window is defined to avoid any SSR issues
  const googleMapsApiKey = typeof window !== 'undefined' 
    ? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY 
    : undefined

  // Update status when API key is missing or errors occur (useEffect to avoid render-time updates)
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
    // Dynamic import only on client - never during SSR
    if (typeof window === 'undefined') return
    if (!googleMapsApiKey) return // Don't load if no API key

    let mounted = true
    onStatusChange?.('loading')

    const loadMaps = async () => {
      try {
        // Dynamically import @react-google-maps/api only when component mounts
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

  if (!googleMapsApiKey) {
    const errorMsg = 'Google Maps API key is missing. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local'
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ 
        padding: '48px 24px',
        textAlign: 'center',
        color: '#6B7280'
      }}>
        <p style={{ 
          fontSize: '14px',
          color: '#DC2626',
          fontFamily: '-apple-system, sans-serif'
        }}>
          {errorMsg}
        </p>
      </div>
    )
  }

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
    // Don't call onStatusChange here - it's already called in useEffect
    // Calling it during render causes React warning about updating parent during render
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
        // Extract error message without exposing API key
        let errorMsg = err.message || 'Failed to load Google Maps script'
        // Remove any potential API key from error message
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
            // Custom map styling to match calm, minimal design
            {
              featureType: 'poi',
              stylers: [{ visibility: 'off' }] // Hide points of interest for cleaner map
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
        onLoad={(_map: unknown) => {
          // Map loaded successfully
          onStatusChange?.('loaded')
        }}
        onError={(error: unknown) => {
          console.error('GoogleMap component error:', error)
          // Extract error message without exposing API key
          let errorMsg = 'Map failed to load'
          if (error && typeof error === 'object' && 'message' in error) {
            errorMsg = String(error.message)
            // Remove any potential API key from error message
            errorMsg = errorMsg.replace(/AIza[0-9A-Za-z_-]{35}/g, '[API_KEY]')
            errorMsg = errorMsg.replace(/key=[^&\s]+/gi, 'key=[API_KEY]')
          }
          setMapError(errorMsg)
          onError?.(errorMsg)
          onStatusChange?.('error')
        }}
      >
        {/* Render markers for each dabbler */}
        {dabblers.map((dabbler) => {
          const isActive = selectedMarker === dabbler.id || hoveredMarker === dabbler.id
          
          return (
            <div key={dabbler.id}>
              <Marker
                position={{ lat: dabbler.lat, lng: dabbler.lng }}
                title={`${dabbler.display_name || dabbler.username} (@${dabbler.username})`}
                onClick={() => {
                  setSelectedMarker(selectedMarker === dabbler.id ? null : dabbler.id)
                }}
                onMouseOver={() => {
                  setHoveredMarker(dabbler.id)
                }}
                onMouseOut={() => {
                  setHoveredMarker(null)
                }}
              />
              {isActive && (
                <InfoWindow
                  position={{ lat: dabbler.lat, lng: dabbler.lng }}
                  onCloseClick={() => {
                    setSelectedMarker(null)
                    setHoveredMarker(null)
                  }}
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
            </div>
          )
        })}
      </GoogleMap>
    </LoadScript>
  )
}