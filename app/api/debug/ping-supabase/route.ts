import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/src/lib/supabaseServer'

export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { ok: false, error: 'This endpoint is only available in development' },
      { status: 403 }
    )
  }

  const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
  const hasAnon = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const hasServiceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY

  try {
    // Try to use the Supabase server client
    // This will throw if env vars are missing (validation in supabaseServer.ts)
    const { data, error } = await supabaseServer.auth.getSession()

    // If we get here, client was initialized successfully
    // (We don't care about the session result, just that the client works)
    return NextResponse.json({
      ok: true,
      hasUrl,
      hasAnon,
      hasServiceRole,
    })
  } catch (error: any) {
    // Client initialization or operation failed
    return NextResponse.json(
      {
        ok: false,
        hasUrl,
        hasAnon,
        hasServiceRole,
        error: error?.message || 'Supabase client initialization failed',
      },
      { status: 500 }
    )
  }
}

// Keep POST for backward compatibility (used by the debug page button)
export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development' },
      { status: 403 }
    )
  }

  try {
    let supabase
    try {
      supabase = supabaseServer
    } catch (clientError: any) {
      return NextResponse.json(
        {
          success: false,
          error: 'Supabase client creation failed',
          message: clientError?.message || 'Supabase environment variables not configured',
        },
        { status: 500 }
      )
    }

    // Test a simple operation - try to get the current session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    // Also test a simple query to verify connectivity
    // Using a simple RPC call or query that should work even without auth
    let queryResult = null
    let queryError = null

    try {
      // Try a simple query - this will fail if tables don't exist, but that's okay for debugging
      // We'll just catch the error and include it in the response
      const { data, error } = await supabase
        .from('_test_connection')
        .select('*')
        .limit(1)

      if (error) {
        queryError = error.message
      } else {
        queryResult = data
      }
    } catch (err: any) {
      // Expected - table probably doesn't exist, but this confirms Supabase is reachable
      queryError = err?.message || 'Connection test query failed (expected if tables not set up)'
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL 
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 20)}...` 
        : 'Not configured',
      session: {
        hasSession: !!sessionData?.session,
        error: sessionError?.message || null,
      },
      query: {
        result: queryResult,
        error: queryError,
      },
      message: 'Supabase connectivity test completed',
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to connect to Supabase',
        details: process.env.NODE_ENV === 'development' 
          ? error?.stack 
          : undefined,
      },
      { status: 500 }
    )
  }
}

