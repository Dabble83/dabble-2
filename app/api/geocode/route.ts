import { NextRequest, NextResponse } from 'next/server'
import { geocodeAddress } from '@/src/lib/geocoding'

/**
 * Geocoding API Route
 * 
 * Geocodes an address string to lat/lng coordinates.
 * Uses Google Maps Geocoding API if available, otherwise falls back to placeholder.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { address } = body

    if (!address || typeof address !== 'string' || !address.trim()) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      )
    }

    // Geocode the address
    const result = await geocodeAddress(address.trim())

    return NextResponse.json({
      lat: result.lat,
      lng: result.lng,
      formatted: result.formatted || address,
    })
  } catch (error: any) {
    console.error('Geocoding error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to geocode address' },
      { status: 500 }
    )
  }
}
