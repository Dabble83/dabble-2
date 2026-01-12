// Follow STYLE_GUIDE.md for any UI changes.
// Design: minimal, editorial, calm. No loud colors. No marketplace language.
'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/src/lib/supabaseClient'

/**
 * Debug Supabase Page - Tests env vars and session
 * Never crashes, always renders
 * All Supabase calls happen on button click (client-side only)
 */
export default function DebugSupabasePage() {
  const [envStatus, setEnvStatus] = useState<{
    hasUrl: boolean
    hasAnon: boolean
  } | null>(null)
  const [sessionStatus, setSessionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [sessionData, setSessionData] = useState<any>(null)
  const [sessionError, setSessionError] = useState<string | null>(null)
  const [serverEnvStatus, setServerEnvStatus] = useState<{
    hasServiceRole: boolean | null
  }>({ hasServiceRole: null })

  // Check public env vars on mount (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setEnvStatus({
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      })

      // Fetch server-only env var status from API route
      fetch('/api/debug/env-status')
        .then(res => res.json())
        .then(data => {
          setServerEnvStatus({
            hasServiceRole: data.server?.hasServiceRole ?? null,
          })
        })
        .catch(err => {
          console.warn('Failed to fetch server env status:', err)
        })
    }
  }, [])

  const testSession = async () => {
    setSessionStatus('loading')
    setSessionError(null)
    setSessionData(null)

    try {
      // Get client only when button is clicked (client-side only)
      const client = getSupabaseClient()
      const { data, error } = await client.auth.getSession()
      
      if (error) {
        setSessionError(error.message)
        setSessionStatus('error')
      } else {
        setSessionData(data)
        setSessionStatus('success')
      }
    } catch (err: any) {
      setSessionError(err.message || 'Unknown error')
      setSessionStatus('error')
    }
  }

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: '#1F2A37' }}>
            Not Available
          </h1>
          <p style={{ color: '#4B5563' }}>
            This page is only available in development mode.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      padding: '40px',
      fontFamily: 'system-ui, sans-serif',
      backgroundColor: '#f6f1e8',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '8px', color: '#1F2A37' }}>
          Debug: Supabase
        </h1>
        <p style={{ color: '#6B7280', marginBottom: '32px' }}>
          Check Supabase environment variables and test session connectivity.
        </p>

        {/* Environment Variables Section */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px', color: '#1F2A37' }}>
            Environment Variables
          </h2>
          {envStatus ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%',
                  backgroundColor: envStatus.hasUrl ? '#10B981' : '#EF4444'
                }} />
                <span style={{ fontFamily: 'monospace', fontSize: '14px', color: '#374151' }}>
                  NEXT_PUBLIC_SUPABASE_URL: {envStatus.hasUrl ? '✅ Present' : '❌ Missing'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%',
                  backgroundColor: envStatus.hasAnon ? '#10B981' : '#EF4444'
                }} />
                <span style={{ fontFamily: 'monospace', fontSize: '14px', color: '#374151' }}>
                  NEXT_PUBLIC_SUPABASE_ANON_KEY: {envStatus.hasAnon ? '✅ Present' : '❌ Missing'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%',
                  backgroundColor: serverEnvStatus.hasServiceRole === null 
                    ? '#FBBF24' 
                    : serverEnvStatus.hasServiceRole 
                      ? '#10B981' 
                      : '#EF4444'
                }} />
                <span style={{ fontFamily: 'monospace', fontSize: '14px', color: '#374151' }}>
                  SUPABASE_SERVICE_ROLE_KEY (server-only): {
                    serverEnvStatus.hasServiceRole === null 
                      ? '⏳ Checking via API...' 
                      : serverEnvStatus.hasServiceRole 
                        ? '✅ Present (server-side)' 
                        : '❌ Missing (expected - client cannot access this)'
                  }
                </span>
              </div>
            </div>
          ) : (
            <p style={{ color: '#6B7280' }}>Checking...</p>
          )}
        </div>

        {/* Session Test Section */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px', color: '#1F2A37' }}>
            Session Test
          </h2>
          <p style={{ color: '#6B7280', marginBottom: '16px', fontSize: '14px' }}>
            Click the button below to test Supabase session. This will not run automatically on page load.
          </p>

          <button
            onClick={testSession}
            disabled={sessionStatus === 'loading'}
            className="btn-primary"
            style={{
              padding: '10px 20px',
              marginBottom: '16px'
            }}
          >
            {sessionStatus === 'loading' ? 'Testing...' : 'Test Supabase Session'}
          </button>

          {sessionStatus === 'success' && sessionData && (
            <div style={{
              padding: '12px',
              backgroundColor: '#D1FAE5',
              borderRadius: '6px',
              border: '1px solid #10B981',
              marginTop: '16px'
            }}>
              <p style={{ color: '#065F46', fontWeight: '600', margin: '0 0 8px 0' }}>
                ✅ Session test successful
              </p>
              <details style={{ marginTop: '8px' }}>
                <summary style={{ cursor: 'pointer', color: '#065F46', fontSize: '14px' }}>
                  View session data
                </summary>
                <pre style={{
                  fontSize: '12px',
                  backgroundColor: '#f9fafb',
                  padding: '12px',
                  borderRadius: '4px',
                  overflow: 'auto',
                  marginTop: '8px',
                  maxHeight: '300px',
                  color: '#374151'
                }}>
                  {JSON.stringify(sessionData, null, 2)}
                </pre>
              </details>
            </div>
          )}

          {sessionStatus === 'error' && sessionError && (
            <div style={{
              padding: '12px',
              backgroundColor: '#FEE2E2',
              borderRadius: '6px',
              border: '1px solid #EF4444',
              marginTop: '16px'
            }}>
              <p style={{ color: '#991B1B', fontWeight: '600', margin: '0 0 8px 0' }}>
                ❌ Session test failed
              </p>
              <p style={{ color: '#991B1B', fontSize: '14px', margin: 0 }}>
                {sessionError}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
