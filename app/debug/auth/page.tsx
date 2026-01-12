// Follow STYLE_GUIDE.md for any UI changes.
// Design: minimal, editorial, calm. No loud colors. No marketplace language.
'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/src/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'

/**
 * Auth Debug Page
 * 
 * FIX: Server-only env vars (SUPABASE_SERVICE_ROLE_KEY) are now fetched via API route
 * instead of accessing process.env directly in client component
 */
export default function AuthDebugPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [envStatus, setEnvStatus] = useState<{
    hasUrl: boolean
    hasAnon: boolean
    hasServiceRole: boolean | null
  }>({
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasServiceRole: null, // Will be fetched from API
  })
  const isDevelopment = process.env.NODE_ENV === 'development'

  // FIX: Fetch server-only env var status from API route
  useEffect(() => {
    if (!isDevelopment) return

    fetch('/api/debug/env-status')
      .then(res => res.json())
      .then(data => {
        setEnvStatus({
          hasUrl: data.public?.hasUrl ?? false,
          hasAnon: data.public?.hasAnon ?? false,
          hasServiceRole: data.server?.hasServiceRole ?? null,
        })
      })
      .catch(err => {
        console.warn('Failed to fetch server env status:', err)
        // Keep public env vars, just leave service role as null
      })
  }, [isDevelopment])

  const loadUser = async () => {
    setLoading(true)
    setError(null)
    try {
      const client = getSupabaseClient()
      const { data: { user }, error: userError } = await client.auth.getUser()
      
      if (userError) {
        setError(userError.message)
        setUser(null)
      } else {
        setUser(user)
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to get user')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isDevelopment) return
    loadUser()

    // Listen for auth state changes
    const client = getSupabaseClient()
    const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [isDevelopment])

  const handleSignOut = async () => {
    try {
      const client = getSupabaseClient()
      const { error } = await client.auth.signOut()
      if (error) {
        setError(error.message)
      } else {
        setUser(null)
        setError(null)
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to sign out')
    }
  }

  // Hide page in production
  if (!isDevelopment) {
    return (
      <main className="min-h-screen bg-[#f6f1e8] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: '#1F2A37' }}>
            Not Available
          </h1>
          <p style={{ color: '#4B5563' }}>
            This page is only available in development mode.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f6f1e8]">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="font-[var(--font-serif)] text-[40px] md:text-[48px] leading-[1.05] mb-4" style={{
          color: '#1F2A37',
          letterSpacing: '-0.02em'
        }}>
          Auth Debug
        </h1>

        <p className="text-[18px] mb-8" style={{
          color: '#4B5563',
          lineHeight: '1.7'
        }}>
          Verify Supabase authentication setup and test signup/signin.
        </p>

        <div className="space-y-6">
          {/* Environment Variables */}
          <div className="bg-white rounded-lg p-6 border-2" style={{ borderColor: '#E5E7EB' }}>
            <h2 className="text-sm font-bold mb-4" style={{ color: '#374151' }}>
              Environment Variables
            </h2>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex items-center justify-between">
                <span style={{ color: '#6B7280' }}>NEXT_PUBLIC_SUPABASE_URL:</span>
                <span style={{ color: envStatus.hasUrl ? '#059669' : '#DC2626' }}>
                  {envStatus.hasUrl ? '✅ true' : '❌ false'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: '#6B7280' }}>NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
                <span style={{ color: envStatus.hasAnon ? '#059669' : '#DC2626' }}>
                  {envStatus.hasAnon ? '✅ true' : '❌ false'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: '#6B7280' }}>SUPABASE_SERVICE_ROLE_KEY (server-only):</span>
                <span style={{ 
                  color: envStatus.hasServiceRole === null 
                    ? '#F59E0B' 
                    : envStatus.hasServiceRole 
                      ? '#059669' 
                      : '#DC2626' 
                }}>
                  {envStatus.hasServiceRole === null 
                    ? '⏳ Checking...' 
                    : envStatus.hasServiceRole 
                      ? '✅ true (server-side)' 
                      : '❌ false'}
                </span>
              </div>
            </div>
          </div>

          {/* Current User */}
          <div className="bg-white rounded-lg p-6 border-2" style={{ borderColor: '#E5E7EB' }}>
            <h2 className="text-sm font-bold mb-4" style={{ color: '#374151' }}>
              Current Signed-In User
            </h2>
            {loading ? (
              <div className="text-sm" style={{ color: '#6B7280' }}>
                Loading...
              </div>
            ) : error ? (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                Error: {error}
              </div>
            ) : user ? (
              <div className="space-y-3">
                <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                  <div className="font-semibold mb-2">✅ User Signed In</div>
                  <pre className="mt-2 text-xs overflow-auto" style={{ color: '#065F46' }}>
                    {JSON.stringify({
                      id: user.id,
                      email: user.email,
                      email_confirmed_at: user.email_confirmed_at,
                      created_at: user.created_at,
                      user_metadata: user.user_metadata,
                    }, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border-2 border-gray-200 text-gray-700 px-4 py-3 rounded-lg text-sm">
                <span style={{ color: '#6B7280' }}>❌ Not signed in</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg p-6 border-2" style={{ borderColor: '#E5E7EB' }}>
            <h2 className="text-sm font-bold mb-4" style={{ color: '#374151' }}>
              Actions
            </h2>
            <div className="flex gap-4">
              <button
                onClick={loadUser}
                disabled={loading}
                className="inline-flex items-center justify-center transition-colors h-10 rounded-lg px-4"
                style={{
                  backgroundColor: loading ? '#9CA3AF' : '#7A8A6A',
                  border: `2px solid ${loading ? '#6B7280' : '#5F6B55'}`,
                  color: '#F7F6F2',
                  fontSize: '14px',
                  fontWeight: '600',
                  opacity: loading ? '0.7' : '0.8',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = '#6B7A5A'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = '#7A8A6A'
                  }
                }}
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>

              {user && (
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center justify-center transition-colors h-10 rounded-lg px-4"
                  style={{
                    backgroundColor: '#DC2626',
                    border: '2px solid #B91C1C',
                    color: '#F7F6F2',
                    fontSize: '14px',
                    fontWeight: '600',
                    opacity: '0.8',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#B91C1C'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#DC2626'
                  }}
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg p-6 border-2" style={{ borderColor: '#E5E7EB' }}>
            <h2 className="text-sm font-bold mb-4" style={{ color: '#374151' }}>
              Quick Links
            </h2>
            <div className="flex flex-wrap gap-4">
              <a
                href="/dabble/signup"
                className="text-sm font-medium transition-colors underline"
                style={{ color: '#374151' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#111827'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
              >
                Sign Up →
              </a>
              <a
                href="/dabble/signin"
                className="text-sm font-medium transition-colors underline"
                style={{ color: '#374151' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#111827'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
              >
                Sign In →
              </a>
              <a
                href="/debug/supabase"
                className="text-sm font-medium transition-colors underline"
                style={{ color: '#374151' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#111827'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
              >
                Supabase Debug →
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}



