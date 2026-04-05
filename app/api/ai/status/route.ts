import { NextResponse } from 'next/server'

/**
 * API route to check if OpenAI is configured
 * This allows client components to check OpenAI availability without exposing the API key
 */
export async function GET() {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    
    return NextResponse.json({
      configured: !!apiKey && apiKey !== 'your-openai-key-here',
    })
  } catch (error) {
    console.error('Error checking OpenAI status:', error)
    return NextResponse.json(
      { configured: false },
      { status: 500 }
    )
  }
}
