// Follow STYLE_GUIDE.md for any UI changes.
// Design: minimal, editorial, calm. No loud colors. No marketplace language.
'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/src/lib/supabaseClient'
import type { Session, User } from '@supabase/supabase-js'

interface Diagnostics {
  origin: string | null
  hasUrl: boolean
  hasAnonKey: boolean
  sessionData: {
    hasSession: boolean
    userId: string | null
    userEmail: string | null
    error: string | null
  }
  getUserData: {
    userId: string | null
    error: string | null
  }
}

/**
 * Debug Supabase Page - Robust session diagnostics
 * Client component that displays comprehensive Supabase connectivity information
 */
export default function DebugSupabasePage() {
  const [loading, setLoading] = useState(true)
  const [diagnostics, setDiagnostics] = useState<Diagnostics>({
    origin: null,
    hasUrl: false,
    hasAnonKey: false,
    sessionData: {
      hasSession: false,
      userId: null,
      userEmail: null,
      error: null,
    },
    getUserData: {
      userId: null,
      error: null,
    },
  })

  const runDiagnostics = async () => {
    setLoading(true)
    
    const newDiagnostics: Diagnostics = {
      origin: typeof window !== 'undefined' ? window.location.origin : null,
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      sessionData: {
        hasSession: false,
        userId: null,
        userEmail: null,
        error: null,
      },
      getUserData: {
        userId: null,
        error: null,
      },
    }

    try {
      const client = getSupabaseClient()
      
      // Check getSession()
      try {
        const { data: sessionData, error: sessionError } = await client.auth.getSession()
        if (sessionError) {
          newDiagnostics.sessionData.error = sessionError.message
        } else if (sessionData.session) {
          newDiagnostics.sessionData.hasSession = true
          newDiagnostics.sessionData.userId = sessionData.session.user?.id || null
          newDiagnostics.sessionData.userEmail = sessionData.session.user?.email || null
        }
      } catch (err: any) {
        newDiagnostics.sessionData.error = err.message || 'Failed to get session'
      }

      // Check getUser()
      try {
        const { data: userData, error: userError } = await client.auth.getUser()
        if (userError) {
          newDiagnostics.getUserData.error = userError.message
        } else if (userData.user) {
          newDiagnostics.getUserData.userId = userData.user.id || null
        }
      } catch (err: any) {
        newDiagnostics.getUserData.error = err.message || 'Failed to get user'
      }
    } catch (err: any) {
      // Global error if client initialization fails
      newDiagnostics.sessionData.error = err.message || 'Failed to initialize Supabase client'
    }

    setDiagnostics(newDiagnostics)
    setLoading(false)
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  const handleSignOut = async () => {
    try {
      const client = getSupabaseClient()
      await client.auth.signOut()
      // Refresh diagnostics after sign out
      await runDiagnostics()
    } catch (err: any) {
      // Update diagnostics with sign out error
      setDiagnostics(prev => ({
        ...prev,
        sessionData: {
          ...prev.sessionData,
          error: err.message || 'Failed to sign out',
        },
      }))
    }
  }

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f6f1e8',
        fontFamily: 'Georgia, serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '16px', color: '#1F2A37', fontWeight: 700 }}>
            Not Available
          </h1>
          <p style={{ color: '#4B5563', fontSize: '18px' }}>
            This page is only available in development mode.
          </p>
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
          Debug: Supabase
        </h1>
        <p style={{
          color: '#6B7280',
          marginBottom: '32px',
          fontSize: '16px'
        }}>
          Supabase session diagnostics
        </p>

        <div style={{
          backgroundColor: '#ffffff',
          padding: '32px',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          {loading ? (
            <p style={{ color: '#6B7280' }}>Checking...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* Origin */}
              <div>
                <p style={{
                  color: '#4B5563',
                  fontSize: '14px',
                  marginBottom: '8px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontWeight: 500
                }}>
                  Current origin
                </p>
                <p style={{
                  color: '#1F2A37',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  wordBreak: 'break-all'
                }}>
                  {diagnostics.origin || 'N/A'}
                </p>
              </div>

              {/* Environment Variables */}
              <div>
                <p style={{
                  color: '#4B5563',
                  fontSize: '14px',
                  marginBottom: '12px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontWeight: 500
                }}>
                  Environment variables
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <p style={{
                    color: '#1F2A37',
                    fontSize: '14px',
                    fontFamily: 'monospace'
                  }}>
                    NEXT_PUBLIC_SUPABASE_URL: {diagnostics.hasUrl ? 'yes' : 'no'}
                  </p>
                  <p style={{
                    color: '#1F2A37',
                    fontSize: '14px',
                    fontFamily: 'monospace'
                  }}>
                    NEXT_PUBLIC_SUPABASE_ANON_KEY: {diagnostics.hasAnonKey ? 'yes' : 'no'}
                  </p>
                </div>
              </div>

              {/* getSession() Result */}
              <div>
                <p style={{
                  color: '#4B5563',
                  fontSize: '14px',
                  marginBottom: '12px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontWeight: 500
                }}>
                  getSession() result
                </p>
                {diagnostics.sessionData.error ? (
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#FEE2E2',
                    borderRadius: '6px',
                    border: '1px solid #EF4444'
                  }}>
                    <p style={{
                      color: '#991B1B',
                      fontSize: '14px',
                      margin: 0
                    }}>
                      Error: {diagnostics.sessionData.error}
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <p style={{
                      color: '#1F2A37',
                      fontSize: '14px',
                      fontFamily: 'monospace'
                    }}>
                      hasSession: {diagnostics.sessionData.hasSession ? 'yes' : 'no'}
                    </p>
                    {diagnostics.sessionData.userId && (
                      <p style={{
                        color: '#1F2A37',
                        fontSize: '14px',
                        fontFamily: 'monospace',
                        wordBreak: 'break-all'
                      }}>
                        user.id: {diagnostics.sessionData.userId}
                      </p>
                    )}
                    {diagnostics.sessionData.userEmail && (
                      <p style={{
                        color: '#1F2A37',
                        fontSize: '14px',
                        fontFamily: 'monospace',
                        wordBreak: 'break-all'
                      }}>
                        user.email: {diagnostics.sessionData.userEmail}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* getUser() Result */}
              <div>
                <p style={{
                  color: '#4B5563',
                  fontSize: '14px',
                  marginBottom: '12px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontWeight: 500
                }}>
                  getUser() result
                </p>
                {diagnostics.getUserData.error ? (
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#FEE2E2',
                    borderRadius: '6px',
                    border: '1px solid #EF4444'
                  }}>
                    <p style={{
                      color: '#991B1B',
                      fontSize: '14px',
                      margin: 0
                    }}>
                      Error: {diagnostics.getUserData.error}
                    </p>
                  </div>
                ) : (
                  <div>
                    {diagnostics.getUserData.userId ? (
                      <p style={{
                        color: '#1F2A37',
                        fontSize: '14px',
                        fontFamily: 'monospace',
                        wordBreak: 'break-all'
                      }}>
                        user.id: {diagnostics.getUserData.userId}
                      </p>
                    ) : (
                      <p style={{
                        color: '#6B7280',
                        fontSize: '14px'
                      }}>
                        No user data
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{
                display: 'flex',
                gap: '12px',
                paddingTop: '16px',
                borderTop: '1px solid #e5e7eb'
              }}>
                <button
                  onClick={runDiagnostics}
                  disabled={loading}
                  className="btn-primary"
                  style={{
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                  }}
                >
                  {loading ? 'Refreshing...' : 'Refresh session'}
                </button>
                {diagnostics.sessionData.hasSession && (
                  <button
                    onClick={handleSignOut}
                    className="btn-secondary"
                    style={{
                      padding: '10px 20px',
                      fontSize: '14px',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                    }}
                  >
                    Sign out
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}