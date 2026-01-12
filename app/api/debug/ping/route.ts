import { NextResponse } from 'next/server'

/**
 * Health check endpoint - always returns success
 * Used by /debug/health to verify API routes are working
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    time: new Date().toISOString(),
    nodeVersion: process.version,
    nextVersion: require('next/package.json').version,
    env: process.env.NODE_ENV,
  })
}



