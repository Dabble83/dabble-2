// Follow STYLE_GUIDE.md for any UI changes.
// Design: minimal, editorial, calm. No loud colors. No marketplace language.
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

/**
 * Explore Page with Google Maps
 * 
 * Maps only load if NEXT_PUBLIC_ENABLE_MAPS=true
 * All map libraries are dynamically imported (never at import time)
 * No map scripts loaded in layout or landing page
 */

// Feature flag - default to disabled for safety
const ENABLE_MAPS = process.env.NEXT_PUBLIC_ENABLE_MAPS === 'true'

// Mocked nearby dabblers data (will be replaced with Supabase query later)
const MOCKED_DABBLERS = [
  {
    id: '1',
    username: 'jane_cooks',
    displayName: 'Jane',
    lat: 40.6782,
    lng: -73.9442,
    skills: ['Sourdough Baking', 'Knitting'],
    location: 'Park Slope, Brooklyn'
  },
  {
    id: '2',
    username: 'bike_fixer',
    displayName: 'Alex',
    lat: 40.6736,
    lng: -73.9567,
    skills: ['Bike Repair', 'Woodworking'],
    location: 'Prospect Heights, Brooklyn'
  },
  {
    id: '3',
    username: 'garden_guru',
    displayName: 'Sam',
    lat: 40.6715,
    lng: -73.9630,
    skills: ['Urban Gardening', 'Composting'],
    location: 'Gowanus, Brooklyn'
  },
]

export default function ExplorePage() {
  const [selectedRadius, setSelectedRadius] = useState<number>(5)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)
  // TODO: replace with Supabase discoverable profiles query
  const [dabblers] = useState(MOCKED_DABBLERS)

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

  // Default to Brooklyn if no user location
  const centerLocation = userLocation || { lat: 40.6782, lng: -73.9442 }

  return (
    <div className="w-full">
      <div className="max-w-1200px mx-auto px-6 py-16" style={{ 
        maxWidth: '1200px',
        paddingTop: '64px',
        paddingBottom: '64px'
      }}>
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

        {/* Map Container */}
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
              <svg 
                className="w-16 h-16 mb-4 mx-auto opacity-50" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{ width: '64px', height: '64px', marginBottom: '16px', opacity: 0.5 }}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" 
                />
              </svg>
              <p className="text-lg font-medium mb-2" style={{ 
                fontSize: '18px',
                fontWeight: '500',
                marginBottom: '8px',
                color: '#4B5563'
              }}>
                Map placeholder
              </p>
              <p className="text-sm text-center px-4" style={{ 
                fontSize: '14px',
                color: '#6B7280',
                maxWidth: '500px',
                margin: '0 auto'
              }}>
                To enable Google Maps, set <code className="bg-gray-100 px-1 rounded" style={{ 
                  backgroundColor: '#F3F4F6',
                  padding: '2px 4px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '12px'
                }}>NEXT_PUBLIC_ENABLE_MAPS=true</code> and <code className="bg-gray-100 px-1 rounded" style={{ 
                  backgroundColor: '#F3F4F6',
                  padding: '2px 4px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '12px'
                }}>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key</code> in your <code className="bg-gray-100 px-1 rounded" style={{ 
                  backgroundColor: '#F3F4F6',
                  padding: '2px 4px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '12px'
                }}>.env.local</code> file and restart the dev server.
              </p>
            </div>
          ) : (
            <MapsComponent 
              center={centerLocation}
              radius={selectedRadius}
              dabblers={dabblers}
            />
          )}
        </div>

        {/* Dabblers List (Fallback if map fails or for accessibility) */}
        {ENABLE_MAPS && dabblers.length > 0 && (
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
                      {dabbler.displayName}
                    </h3>
                    <p style={{ 
                      fontSize: '14px',
                      color: '#6B7280',
                      marginBottom: '12px'
                    }}>
                      @{dabbler.username}
                    </p>
                    <p style={{ 
                      fontSize: '14px',
                      color: '#6B7280',
                      marginBottom: '12px'
                    }}>
                      📍 {dabbler.location}
                    </p>
                    <div className="flex flex-wrap gap-2" style={{ gap: '8px' }}>
                      {dabbler.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
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
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Maps Component - Only renders if ENABLE_MAPS=true
 * Dynamically imports Google Maps to prevent SSR issues and import-time errors
 */
function MapsComponent({ 
  center, 
  radius, 
  dabblers 
}: { 
  center: { lat: number; lng: number }
  radius: number
  dabblers: Array<{
    id: string
    username: string
    displayName: string
    lat: number
    lng: number
    skills: string[]
    location: string
  }>
}) {
  const router = useRouter()
  const [Maps, setMaps] = useState<{
    GoogleMap: any
    LoadScript: any
    Marker: any
  } | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    // Dynamic import only on client - never during SSR
    if (typeof window === 'undefined') return

    let mounted = true

    const loadMaps = async () => {
      try {
        // Dynamically import @react-google-maps/api only when component mounts
        const googleMapsApi = await import('@react-google-maps/api')
        
        if (!mounted) return
        
        setMaps({
          GoogleMap: googleMapsApi.GoogleMap,
          LoadScript: googleMapsApi.LoadScript,
          Marker: googleMapsApi.Marker,
        })
      } catch (err) {
        if (!mounted) return
        console.error('Failed to load Google Maps:', err)
        setMapError('Failed to load Google Maps library. Please check your API key.')
      }
    }

    loadMaps()

    return () => {
      mounted = false
    }
  }, [])

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!googleMapsApiKey) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ 
        padding: '48px 24px',
        textAlign: 'center',
        color: '#6B7280'
      }}>
        <p className="text-lg font-medium mb-2" style={{ 
          fontSize: '18px',
          fontWeight: '500',
          marginBottom: '8px',
          color: '#4B5563'
        }}>
          Google Maps API Key Required
        </p>
        <p className="text-sm text-center px-4" style={{ 
          fontSize: '14px',
          color: '#6B7280',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          Please set <code className="bg-gray-100 px-1 rounded" style={{ 
            backgroundColor: '#F3F4F6',
            padding: '2px 4px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '12px'
          }}>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> in your <code className="bg-gray-100 px-1 rounded" style={{ 
            backgroundColor: '#F3F4F6',
            padding: '2px 4px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '12px'
          }}>.env.local</code> file.
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
        <p className="text-lg font-medium mb-2" style={{ 
          fontSize: '18px',
          fontWeight: '500',
          marginBottom: '8px',
          color: '#DC2626'
        }}>
          Error loading maps
        </p>
        <p className="text-sm" style={{ fontSize: '14px', color: '#6B7280' }}>
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
        <p style={{ fontSize: '14px', color: '#6B7280' }}>
          Loading map...
        </p>
      </div>
    )
  }

  const { GoogleMap, LoadScript, Marker } = Maps

  return (
    <LoadScript
      googleMapsApiKey={googleMapsApiKey}
      onLoad={() => {
        setMapLoaded(true)
      }}
      onError={(err: Error) => {
        console.error('Google Maps script error:', err)
        setMapError('Failed to load Google Maps script. Please check your API key and network connection.')
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
      >
        {/* Render markers for each dabbler */}
        {dabblers.map((dabbler) => (
          <Marker
            key={dabbler.id}
            position={{ lat: dabbler.lat, lng: dabbler.lng }}
            title={`${dabbler.displayName} (@${dabbler.username})`}
            onClick={() => {
              // Navigate to profile page when marker is clicked
              router.push(`/profile/${dabbler.username}`)
            }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  )
}
