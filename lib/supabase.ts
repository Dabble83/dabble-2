import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set')
}

// Browser client (for client components)
export function createBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are not configured')
  }
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Server client (for server components/API routes)
// Uses service role key if available, otherwise falls back to anon key
export function createServerClient() {
  if (!supabaseUrl) {
    throw new Error('Supabase URL is not configured')
  }
  
  // Prefer service role key for server-side operations
  const key = supabaseServiceRoleKey || supabaseAnonKey
  
  if (!key) {
    throw new Error('Supabase API key is not configured')
  }
  
  return createClient(supabaseUrl, key)
}

