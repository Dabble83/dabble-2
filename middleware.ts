import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * MINIMAL MIDDLEWARE - Safe Boot Mode
 * 
 * DISABLED - Just passes through everything
 * No redirects, no auth checks, no logic
 * This ensures middleware never blocks the app
 * 
 * All redirect attempts are logged in development
 */

export function middleware(request: NextRequest) {
  // ABSOLUTE MINIMAL - Just pass through
  // No logic, no checks, no redirects
  
  // Log middleware execution in development (for debugging redirect loops)
  if (process.env.NODE_ENV === 'development') {
    const pathname = request.nextUrl.pathname
    // Only log once per request to avoid spam
    if (!pathname.startsWith('/_next') && !pathname.startsWith('/api/debug')) {
      console.log(`[MIDDLEWARE] ${request.method} ${pathname} - Passing through (no redirects)`)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}
