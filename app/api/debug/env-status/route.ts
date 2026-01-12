import { NextResponse } from 'next/server'

/**
 * API Route to check environment variable status
 * This is the only safe way to check server-only env vars from client components
 * 
 * Only available in development mode for security
 */
export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    )
  }

  return NextResponse.json({
    // Public env vars (available on client)
    public: {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    // Server-only env vars (only accessible via API)
    server: {
      hasServiceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
  })
}


