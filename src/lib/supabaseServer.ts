import { createClient } from '@supabase/supabase-js'

// Prevent this module from being imported in client components
if (typeof window !== 'undefined') {
  throw new Error(
    'supabaseServer.ts cannot be imported in client components. ' +
    'Use supabaseClient.ts instead.'
  )
}

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL environment variable. ' +
    'Please add it to your .env.local file.'
  )
}

if (!supabaseServiceRoleKey) {
  throw new Error(
    'Missing SUPABASE_SERVICE_ROLE_KEY environment variable. ' +
    'Please add it to your .env.local file.'
  )
}

/**
 * Creates a Supabase client for use in server-side code (API routes, server components).
 * This client uses the service role key and has elevated permissions.
 * 
 * ⚠️ WARNING: This client should NEVER be imported in client components.
 * It will throw an error if imported in client-side code.
 * 
 * @example
 * ```ts
 * // In an API route or server component
 * import { supabaseServer } from '@/src/lib/supabaseServer'
 * 
 * const { data } = await supabaseServer.auth.admin.getUserById(userId)
 * ```
 */
export const supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})




