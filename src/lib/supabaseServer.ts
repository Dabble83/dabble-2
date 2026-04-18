import { createClient, SupabaseClient } from '@supabase/supabase-js'

if (typeof window !== 'undefined') {
  throw new Error(
    'supabaseServer.ts cannot be imported in client components. ' +
    'Use supabaseClient.ts instead.'
  )
}

let _instance: SupabaseClient | null = null

function getInstance(): SupabaseClient {
  if (!_instance) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable.')
    if (!key) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable.')
    _instance = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }
  return _instance
}

export const supabaseServer = new Proxy({} as SupabaseClient, {
  get(_target, prop: string) {
    return (getInstance() as any)[prop]
  },
})
