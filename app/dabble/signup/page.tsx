// Follow STYLE_GUIDE.md for any UI changes.
// Design: minimal, editorial, calm. No loud colors. No marketplace language.
'use client'

import Link from 'next/link'
import { useState, FormEvent, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/src/lib/supabaseClient'

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailConfirmationMessage, setEmailConfirmationMessage] = useState(false)
  const submittingRef = useRef(false) // Guard to prevent duplicate submissions
  
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [address, setAddress] = useState('')
  const [isDiscoverable, setIsDiscoverable] = useState(false)
  const [precision, setPrecision] = useState<'neighborhood' | 'approximate'>('neighborhood')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setEmailConfirmationMessage(false)

    // Guard to prevent duplicate submissions
    if (submittingRef.current) {
      return
    }

    // Basic validation
    if (!username || !email || !password || !displayName) {
      setError('Please fill in all required fields')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    submittingRef.current = true
    setLoading(true)

    try {
      // Get Supabase client (only when form is submitted, client-side only)
      const client = getSupabaseClient()
      
      // Call Supabase signUp with metadata
      const { data: signUpData, error: signUpError } = await client.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            displayName,
            addressLabel: address || 'Not specified',
            isDiscoverable,
            precision,
          },
        },
      })

      if (signUpError) {
        // Handle common Supabase errors
        let errorMsg = signUpError.message || 'Signup failed'
        
        if (signUpError.message?.includes('already registered') || signUpError.message?.includes('already exists')) {
          errorMsg = 'An account with this email already exists. Please sign in instead.'
        } else if (signUpError.message?.includes('invalid email')) {
          errorMsg = 'Please enter a valid email address.'
        } else if (signUpError.message?.includes('password')) {
          errorMsg = 'Password does not meet requirements. Please use at least 8 characters.'
        }
        
        setError(errorMsg)
        setLoading(false)
        submittingRef.current = false
        return
      }

      // Check if email confirmation is required
      // If session is null, email confirmation is required
      // If session exists, user is immediately signed in
      if (!signUpData.session) {
        // Email confirmation required
        setEmailConfirmationMessage(true)
        setError(null)
        setLoading(false)
        submittingRef.current = false
      } else {
        // Session created immediately - redirect to profile setup
        setEmailConfirmationMessage(false)
        setError(null)
        submittingRef.current = false
        
        // Redirect to profile setup
        router.push('/profile/setup')
        router.refresh()
      }
    } catch (err: any) {
      const errorMsg = err?.message || 'An error occurred. Please try again.'
      setError(errorMsg)
      setLoading(false)
      setEmailConfirmationMessage(false)
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
          Join Dabble
        </h1>
        <p style={{ 
          fontSize: '18px',
          lineHeight: '1.7',
          color: '#4B5563',
          marginBottom: '32px'
        }}>
          Create your account to start dabbling.
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

          {emailConfirmationMessage && (
            <div className="p-4 rounded-lg" style={{
              backgroundColor: '#D1FAE5',
              border: '2px solid #10B981',
              color: '#065F46'
            }}>
              <p style={{ fontSize: '14px', margin: 0 }}>
                Check your email to confirm your account.
              </p>
            </div>
          )}

          <div>
            <label htmlFor="username" className="label">
              Username <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="input"
            />
          </div>

          <div>
            <label htmlFor="email" className="label">
              Email <span style={{ color: '#DC2626' }}>*</span>
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
              Password <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="input"
            />
            <p className="text-xs mt-1" style={{ 
              fontSize: '12px',
              color: '#6B7280',
              marginTop: '4px'
            }}>
              At least 8 characters
            </p>
          </div>

          <div>
            <label htmlFor="displayName" className="label">
              Display Name <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="input"
            />
          </div>

          <div>
            <label htmlFor="address" className="label">
              Address (for rough map placement)
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g., Park Slope, Brooklyn"
              className="input"
            />
            <p className="text-xs mt-1" style={{ 
              fontSize: '12px',
              color: '#6B7280',
              marginTop: '4px'
            }}>
              You can refine this later
            </p>
          </div>

          <div className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isDiscoverable"
                checked={isDiscoverable}
                onChange={(e) => setIsDiscoverable(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '4px',
                  borderColor: '#D1D5DB',
                  accentColor: '#7A8F6A'
                }}
              />
              <label htmlFor="isDiscoverable" className="ml-3 text-sm" style={{ 
                marginLeft: '12px',
                fontSize: '14px',
                color: '#374151'
              }}>
                Let others discover me nearby
              </label>
            </div>

            {isDiscoverable && (
              <div>
                <label htmlFor="precision" className="label">
                  Location Precision
                </label>
                <select
                  id="precision"
                  value={precision}
                  onChange={(e) => setPrecision(e.target.value as 'neighborhood' | 'approximate')}
                  className="input"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="neighborhood">Neighborhood-level (recommended)</option>
                  <option value="approximate">Approximate</option>
                </select>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
            style={{ width: '100%' }}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ 
          marginTop: '24px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#6B7280'
        }}>
          Already have an account?{' '}
          <Link href="/dabble/signin" className="link-primary font-medium" style={{ fontWeight: '500' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
