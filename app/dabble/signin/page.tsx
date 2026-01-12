// Follow STYLE_GUIDE.md for any UI changes.
// Design: minimal, editorial, calm. No loud colors. No marketplace language.
'use client'

import Link from 'next/link'
import { useState, FormEvent, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/src/lib/supabaseClient'

export default function SigninPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const submittingRef = useRef(false) // Guard to prevent duplicate submissions

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    // Guard to prevent duplicate submissions
    if (submittingRef.current) {
      return
    }

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    submittingRef.current = true
    setLoading(true)

    try {
      // Get Supabase client (only when form is submitted, client-side only)
      const client = getSupabaseClient()
      
      // Sign in with Supabase (requires email, not username)
      const { data: signInData, error: signInError } = await client.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message || 'Invalid email or password')
        setLoading(false)
        submittingRef.current = false
        return
      }

      if (!signInData.user) {
        setError('Sign in failed')
        setLoading(false)
        submittingRef.current = false
        return
      }

      // Success - redirect to profile setup (will check if profile is complete there)
      submittingRef.current = false
      router.push('/profile/setup')
      router.refresh()
    } catch (err: any) {
      setError(err?.message || 'An error occurred. Please try again.')
      setLoading(false)
      submittingRef.current = false
    }
  }

  return (
    <div className="w-full">
      <div className="max-w-md mx-auto px-6 py-16" style={{ 
        maxWidth: '448px',
        paddingTop: '64px',
        paddingBottom: '64px'
      }}>
        <h1 style={{ marginBottom: '16px' }}>
          Sign In
        </h1>
        <p style={{ 
          fontSize: '18px',
          lineHeight: '1.7',
          color: '#4B5563',
          marginBottom: '32px'
        }}>
          Welcome back to Dabble.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {error && (
            <div className="p-4 rounded-lg" style={{
              backgroundColor: '#FEE2E2',
              border: '2px solid #EF4444',
              color: '#991B1B'
            }}>
              <p style={{ fontSize: '14px', margin: 0 }}>{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input"
            />
          </div>

          <div>
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
            style={{ width: '100%' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ 
          marginTop: '24px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#6B7280'
        }}>
          Don't have an account?{' '}
          <Link href="/dabble/signup" className="link-primary font-medium" style={{ fontWeight: '500' }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
