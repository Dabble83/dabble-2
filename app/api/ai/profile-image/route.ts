import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// Feature flag - set to false to disable image generation
const IMAGE_GENERATION_ENABLED = process.env.ENABLE_IMAGE_GENERATION === 'true'

// Simple in-memory rate limiting (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 3 // 3 requests per minute per IP (more restrictive for image generation)

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false
  }

  record.count++
  return true
}

// Simple content moderation - check for disallowed terms
function isContentAllowed(text: string): boolean {
  const disallowedTerms = [
    'violence', 'weapon', 'gun', 'knife', 'blood',
    'nude', 'naked', 'explicit', 'sexual',
    'hate', 'discrimination', 'offensive',
  ]
  
  const lowerText = text.toLowerCase()
  return !disallowedTerms.some(term => lowerText.includes(term))
}

export async function POST(request: NextRequest) {
  try {
    // Check feature flag
    if (!IMAGE_GENERATION_ENABLED) {
      return NextResponse.json(
        { error: 'Image generation is currently disabled' },
        { status: 503 }
      )
    }

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a minute.' },
        { status: 429 }
      )
    }

    // Check API key
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { ideaText } = body

    // Validation
    if (!ideaText || typeof ideaText !== 'string' || ideaText.trim().length === 0) {
      return NextResponse.json(
        { error: 'Idea text is required' },
        { status: 400 }
      )
    }

    // Content moderation
    if (!isContentAllowed(ideaText)) {
      return NextResponse.json(
        { error: 'Content does not meet our guidelines' },
        { status: 400 }
      )
    }

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: apiKey,
    })

    // Build prompt for image generation
    const prompt = `A simple, calm, minimal icon-style illustration for a profile picture. ${ideaText}. 
Style: soft watercolor aesthetic, muted colors, gentle and friendly, suitable for a community learning platform. 
No text, no words, just a simple illustration. Square format, centered composition.`

    // Generate image using DALL-E
    // Note: DALL-E 3 requires specific API access. Falls back gracefully if unavailable.
    let response
    try {
      response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        style: 'natural', // Calm, natural style
      })
    } catch (error: any) {
      // If DALL-E 3 is not available, try DALL-E 2
      if (error.code === 'model_not_found' || error.message?.includes('dall-e-3')) {
        response = await openai.images.generate({
          model: 'dall-e-2',
          prompt: prompt,
          n: 1,
          size: '1024x1024',
        })
      } else {
        throw error
      }
    }

    const imageUrl = response.data?.[0]?.url
    if (!imageUrl) {
      throw new Error('No image URL returned from OpenAI')
    }

    // Download and store the image
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      throw new Error('Failed to download generated image')
    }

    const imageBuffer = await imageResponse.arrayBuffer()

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'profiles', 'generated')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 15)
    const filename = `ai-${timestamp}-${randomStr}.png`
    const filepath = join(uploadsDir, filename)

    // Save image
    await writeFile(filepath, Buffer.from(imageBuffer))

    // Return the public URL
    const publicUrl = `/uploads/profiles/generated/${filename}`

    return NextResponse.json({
      success: true,
      url: publicUrl,
    })
  } catch (error: any) {
    console.error('AI profile image generation error:', error)
    
    // Handle OpenAI-specific errors
    if (error.response?.status === 400) {
      return NextResponse.json(
        { error: 'Content does not meet OpenAI guidelines. Please try a different idea.' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate image. Please try again.' },
      { status: 500 }
    )
  }
}

