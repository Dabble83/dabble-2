// Follow STYLE_GUIDE.md for any UI changes.
// Design: minimal, editorial, calm. No loud colors. No marketplace language.
'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSupabaseAuth } from '@/src/hooks/useSupabaseAuth'

/**
 * Profile Setup Page
 * 
 * Checks auth on mount (client-side only) and loads/saves profile.
 * No Supabase calls during SSR - all in useEffect (client-side only).
 */
export default function ProfileSetupPage() {
  const { user, loading: authLoading } = useSupabaseAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check auth and profile completeness on mount (client-side only)
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }

    // Wait for auth to finish loading
    if (authLoading) {
      return
    }

    // If not authenticated, redirect to signin
    if (!user) {
      router.push('/dabble/signin')
      return
    }

    // Check if profile is complete
    const checkProfile = async () => {
      try {
        const response = await fetch(`/api/profile/check?userId=${user.id}`)
        if (response.ok) {
          const data = await response.json()
          
          // If profile is complete, redirect to profile page
          if (data.complete) {
            const username = user.user_metadata?.username
            if (username) {
              router.push(`/profile/${username}`)
            }
          }
        }
      } catch (err) {
        console.error('Error checking profile:', err)
        // Don't set error - allow user to continue with setup
      } finally {
        setLoading(false)
      }
    }

    checkProfile()
  }, [user, authLoading, router])

  if (authLoading || loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center" style={{ 
        backgroundColor: '#f6f1e8',
        minHeight: '100vh'
      }}>
        <p style={{ color: '#4B5563' }}>Loading...</p>
      </div>
    )
  }

  if (!user) {
    // Will redirect in useEffect, but show message briefly
    return (
      <div className="w-full min-h-screen flex items-center justify-center" style={{ 
        backgroundColor: '#f6f1e8',
        minHeight: '100vh'
      }}>
        <p style={{ color: '#4B5563' }}>Redirecting to sign in...</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="max-w-800px mx-auto px-6 py-16" style={{ 
        maxWidth: '800px',
        paddingTop: '64px',
        paddingBottom: '64px'
      }}>
        <h1 style={{ marginBottom: '16px' }}>
          Complete Your Profile
        </h1>
        <p style={{ 
          fontSize: '18px',
          lineHeight: '1.7',
          color: '#4B5563',
          marginBottom: '32px'
        }}>
          Profile setup page. This will include a multi-step form to complete your profile with skills, interests, and discoverability settings.
        </p>

        {error && (
          <div className="p-4 rounded-lg mb-6" style={{
            backgroundColor: '#FEE2E2',
            border: '2px solid #EF4444',
            color: '#991B1B',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <p style={{ fontSize: '14px', margin: 0 }}>{error}</p>
          </div>
        )}

        <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
          <p style={{ color: '#6B7280', marginBottom: '16px' }}>
            Profile setup form will be implemented here. You are authenticated as: {user.email}
          </p>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>
            Profile setup functionality will be fully implemented with Supabase database integration.
          </p>
        </div>
      </div>
    </div>
  )
}
