'use client'

import { createClient, SupabaseClient } from '@supabase/supabase-js'

/**
 * Supabase Client - Safe Import
 * 
 * FIX: Does NOT throw at import time. Validates env vars only when getSupabaseClient() is called.
 * This prevents the app from crashing if env vars are missing during import.
 * 
 * IMPORTANT: Never call getSupabaseClient() at module level - always call it inside functions/effects.
 */

// Store singleton client instance
let clientInstance: SupabaseClient | null = null

/**
 * Get Supabase client instance. Validates env vars only when called, not at import time.
 * Returns a client even if env vars are missing (with placeholder values) to prevent crashes.
 * 
 * @example
 * ```ts
 * 'use client'
 * import { getSupabaseClient } from '@/src/lib/supabaseClient'
 * 
 * useEffect(() => {
 *   const client = getSupabaseClient()
 *   const { data } = await client.auth.getUser()
 * }, [])
 * ```
 */
export function getSupabaseClient(): SupabaseClient {
  if (clientInstance) {
    return clientInstance
  }

  // Read env vars only when function is called, not at import time
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const url = supabaseUrl || 'https://placeholder.supabase.co'
  const key = supabaseAnonKey || 'placeholder-key'

  // Log warning if env vars missing, but don't throw (allows app to load)
  if (!supabaseUrl || !supabaseAnonKey) {
    if (process.env.NODE_ENV === 'production') {
      console.error(
        'Missing Supabase environment variables. ' +
        'Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.'
      )
    } else {
      console.warn(
        '⚠️  Supabase environment variables not configured. ' +
        'Some features may not work. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local'
      )
    }
  }

  clientInstance = createClient(url, key)
  return clientInstance
}
