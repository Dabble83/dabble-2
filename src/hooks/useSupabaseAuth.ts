'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/src/lib/supabaseClient'
import type { User, Session } from '@supabase/supabase-js'

/**
 * Supabase Auth Hook
 * 
 * Provides user state, loading state, and sign out functionality.
 * All Supabase calls are client-side only (useEffect, never during SSR).
 */
export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }

    let mounted = true

    // Get initial session - wrap in try/catch to prevent crashes
    const client = getSupabaseClient()
    client.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (!mounted) return
        if (error) {
          console.warn('Supabase session error:', error)
          setLoading(false)
          return
        }
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      })
      .catch((err) => {
        if (!mounted) return
        console.warn('Supabase session fetch failed:', err)
        setLoading(false)
      })

    // Listen for auth changes
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    const client = getSupabaseClient()
    await client.auth.signOut()
  }

  return {
    user,
    session,
    loading,
    signOut,
  }
}
