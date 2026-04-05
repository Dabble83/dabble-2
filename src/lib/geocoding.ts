/**
 * Geocoding Adapter
 * 
 * Provides a consistent interface for geocoding addresses to lat/lng coordinates.
 * Currently supports Google Maps Geocoding API, but can be swapped for other providers.
 * 
 * To use a different provider, implement the same interface:
 * - geocodeAddress(address: string): Promise<{ lat: number; lng: number; formatted?: string }>
 */

export interface GeocodeResult {
  lat: number
  lng: number
  formatted?: string // Formatted address from geocoding service
}

/**
 * Geocode an address using Google Maps Geocoding API
 * Falls back to placeholder adapter if API key is not available
 */
export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (apiKey) {
    return geocodeWithGoogle(address, apiKey)
  } else {
    // Fallback to placeholder adapter
    console.warn('Google Maps API key not found, using placeholder geocoding')
    return geocodePlaceholder(address)
  }
}

/**
 * Geocode using Google Maps Geocoding API
 */
async function geocodeWithGoogle(
  address: string,
  apiKey: string
): Promise<GeocodeResult> {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    
    const response = await fetch(url)
    const data = await response.json()

    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const result = data.results[0]
      const location = result.geometry.location

      return {
        lat: location.lat,
        lng: location.lng,
        formatted: result.formatted_address,
      }
    } else if (data.status === 'ZERO_RESULTS') {
      throw new Error(`No results found for address: ${address}`)
    } else if (data.status === 'OVER_QUERY_LIMIT') {
      throw new Error('Geocoding API quota exceeded')
    } else {
      throw new Error(`Geocoding failed: ${data.status}`)
    }
  } catch (error: any) {
    // If network error or API error, fall back to placeholder
    console.error('Google Geocoding error:', error)
    return geocodePlaceholder(address)
  }
}

/**
 * Placeholder geocoding adapter
 * Returns a placeholder location (NYC coordinates) and logs the address
 * Replace this with your preferred geocoding provider if not using Google Maps
 */
async function geocodePlaceholder(address: string): Promise<GeocodeResult> {
  // Placeholder: returns NYC coordinates
  // In production, replace with your preferred geocoding service
  console.log(`[Placeholder Geocoding] Address: ${address}`)
  
  // Return a default location (New York City)
  // This should be replaced with actual geocoding service (Mapbox, HERE, etc.)
  return {
    lat: 40.7128,
    lng: -73.9352,
    formatted: address, // Use the input as formatted address
  }
}

/**
 * Example: Replace with Mapbox Geocoding API
 * 
 * async function geocodeWithMapbox(address: string, apiKey: string): Promise<GeocodeResult> {
 *   const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${apiKey}`
 *   const response = await fetch(url)
 *   const data = await response.json()
 *   
 *   if (data.features && data.features.length > 0) {
 *     const [lng, lat] = data.features[0].center
 *     return {
 *       lat,
 *       lng,
 *       formatted: data.features[0].place_name
 *     }
 *   }
 *   throw new Error('Geocoding failed')
 * }
 */
