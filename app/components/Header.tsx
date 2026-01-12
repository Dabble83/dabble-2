// Follow STYLE_GUIDE.md for any UI changes.
// Design: minimal, editorial, calm. No loud colors. No marketplace language.
'use client'

import Link from 'next/link'
import ProfileCompleteBanner from './ProfileCompleteBanner'
import { useSupabaseAuth } from '@/src/hooks/useSupabaseAuth'

export default function Header() {
  const { user, loading, signOut } = useSupabaseAuth()
  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <header className="w-full">
      <ProfileCompleteBanner />
      {/* Supabase Auth Status Indicator - Dev Only */}
      {isDevelopment && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="text-xs font-mono" style={{ color: '#1E40AF' }}>
              <span className="font-semibold">Supabase Auth:</span>{' '}
              {loading ? (
                <span style={{ color: '#6B7280' }}>Loading...</span>
              ) : user ? (
                <span>
                  Signed in as{' '}
                  <span className="font-semibold">
                    {user.user_metadata?.username || user.email || 'Unknown'}
                  </span>
                </span>
              ) : (
                <span style={{ color: '#6B7280' }}>Not signed in</span>
              )}
            </div>
            {user && (
              <button
                onClick={() => signOut()}
                className="text-xs px-3 py-1 rounded transition-colors"
                style={{
                  backgroundColor: '#DBEAFE',
                  color: '#1E40AF',
                  border: '1px solid #93C5FD'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#BFDBFE'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#DBEAFE'
                }}
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      )}
      <nav className="flex justify-between items-center pt-8 pb-4" style={{
        paddingLeft: '24px',
        paddingRight: '24px',
        maxWidth: '100%'
      }}>
        <Link href="/" className="font-bold hand-drawn" style={{
          fontSize: '40px',
          color: '#2d5016',
          fontWeight: '700'
        }}>
          Dabble
        </Link>
        <div className="flex items-center gap-6" style={{ gap: '24px' }}>
          {loading ? (
            <span className="text-sm" style={{ color: '#6B7280' }}>Loading...</span>
          ) : user ? (
            <>
              <Link
                href={user.user_metadata?.username ? `/profile/${user.user_metadata.username}` : '/profile/setup'}
                className="text-sm font-medium transition-colors"
                style={{
                  color: '#374151'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#111827'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
              >
                Profile
              </Link>
              <Link
                href="/explore"
                className="text-sm font-medium transition-colors"
                style={{
                  color: '#374151'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#111827'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
              >
                Explore
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium transition-colors"
                style={{
                  color: '#374151'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#111827'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
              >
                About
              </Link>
              <button
                onClick={() => signOut()}
                className="text-sm font-medium transition-colors"
                style={{
                  color: '#374151'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#111827'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/explore"
                className="text-sm font-medium transition-colors"
                style={{
                  color: '#374151'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#111827'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
              >
                Explore
              </Link>
              <Link
                href="/dabble/signin"
                className="text-sm font-medium transition-colors"
                style={{
                  color: '#374151'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#111827'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
              >
                Sign In
              </Link>
              <Link
                href="/dabble/signup"
                className="text-sm font-medium transition-colors"
                style={{
                  color: '#374151'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#111827'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
              >
                Sign Up
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium transition-colors"
                style={{
                  color: '#374151'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#111827'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
              >
                About
              </Link>
            </>
          )}
          <button
            className="text-sm font-medium transition-colors cursor-pointer"
            style={{
              color: '#374151',
              padding: '4px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#111827'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.5 5H17.5M2.5 10H17.5M2.5 15H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </nav>
    </header>
  )
}



