// Follow STYLE_GUIDE.md for any UI changes.
// Design: minimal, editorial, calm. No loud colors. No marketplace language.
'use client'

import Link from 'next/link'
import { useSupabaseAuth } from '@/src/hooks/useSupabaseAuth'
import { usePathname } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { useRenderCounter } from '@/src/hooks/useRenderCounter'

export default function ProfileCompleteBanner() {
  // Render counter to detect infinite loops
  useRenderCounter('ProfileCompleteBanner')

  const { user, loading } = useSupabaseAuth()
  const pathname = usePathname()
  const [isIncomplete, setIsIncomplete] = useState<boolean | null>(null)
  const checkingRef = useRef(false)

  useEffect(() => {
    // FIX: Guard to prevent multiple simultaneous checks
    if (checkingRef.current) return

    if (user?.id) {
      checkingRef.current = true
      fetch(`/api/profile/check?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          setIsIncomplete(!data.complete)
        })
        .catch(() => {
          setIsIncomplete(false) // Hide banner on error
        })
        .finally(() => {
          checkingRef.current = false
        })
    } else {
      setIsIncomplete(false)
    }
  }, [user?.id])

  // Don't show banner if:
  // - Loading or not authenticated
  // - Profile is complete
  // - On the setup page itself (redundant)
  if (loading || !user || !isIncomplete || pathname === '/profile/setup') {
    return null
  }

  return (
    <div className="w-full py-3 px-6 text-center" style={{
      backgroundColor: '#FEF3C7',
      borderBottom: '1px solid #FCD34D'
    }}>
      <p className="text-sm" style={{ color: '#92400E' }}>
        <Link 
          href="/profile/setup" 
          className="font-medium underline hover:no-underline"
          style={{ color: '#92400E' }}
        >
          Complete your profile
        </Link>
        {' '}to start dabbling with others nearby.
      </p>
    </div>
  )
}

