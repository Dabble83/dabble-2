import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Simple in-memory rate limiting (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 5 // 5 requests per minute per IP

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

export async function POST(request: NextRequest) {
  try {
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
    const {
      curiosityText,
      helpText,
      existingOffers = [],
      existingWants = [],
      existingInterests = [],
    } = body

    // Basic validation
    if (!curiosityText && !helpText) {
      return NextResponse.json(
        { error: 'At least one input field is required' },
        { status: 400 }
      )
    }

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: apiKey,
    })

    // Build prompt
    const prompt = `You are helping someone create a profile for Dabble, a community platform for learning and sharing skills.

User's input:
${curiosityText ? `What they're curious about: ${curiosityText}` : ''}
${helpText ? `What friends ask them for help with: ${helpText}` : ''}

${existingOffers.length > 0 ? `Existing skills they offer: ${existingOffers.join(', ')}` : ''}
${existingWants.length > 0 ? `Existing skills they want to learn: ${existingWants.join(', ')}` : ''}
${existingInterests.length > 0 ? `Existing interests: ${existingInterests.join(', ')}` : ''}

Please provide suggestions in the following JSON format:
{
  "interestsIntro": "A warm, 2-3 sentence paragraph about their interests and curiosity. Write in first person, be conversational and friendly.",
  "skillsIntro": "A warm, 2-3 sentence paragraph about what they can share/teach. Write in first person, be conversational and friendly.",
  "suggestedOffers": ["skill1", "skill2", "skill3", ...],
  "suggestedWants": ["skill1", "skill2", "skill3", ...],
  "suggestedInterests": ["interest1", "interest2", ...],
  "profilePicIdeas": ["idea1", "idea2", "idea3"]
}

Rules:
- For suggestedOffers: Select top 10 skills from the Dabble skill list that match what they can help with based on their input. Use EXACT skill names from the list below.
- For suggestedWants: Select top 10 skills from the Dabble skill list that match what they want to learn based on their input. Use EXACT skill names from the list below.
- For suggestedInterests: Provide 3-5 custom interest tags (not from the skill list, these are free-form).
- For profilePicIdeas: Provide 3 creative, specific ideas for profile photo themes (e.g., "Photo of you cooking in your kitchen", "Outdoor shot with your bike").

Available Dabble skills (use EXACT names only):
Cooking, Baking, Fermentation, Meal Planning, Knife Skills, Sourdough Baking, Canning & Preserving, Grilling, Bike Repair, Appliance Repair, Plumbing Basics, Electrical Basics, Furniture Repair, Tool Maintenance, Gardening, Composting, Plant Propagation, Urban Gardening, Herb Growing, Seed Starting, Spanish, French, Mandarin, Sign Language, Public Speaking, Writing, Sewing, Knitting, Crocheting, Mending, Pattern Making, Embroidery, Carpentry, Woodworking, Furniture Making, Joinery, Wood Finishing, Budgeting, Investing Basics, Tax Preparation, Negotiation, Basic Coding, Web Design, Photo Editing, Video Editing, 3D Printing, Guitar, Piano, Drawing, Painting, Pottery, Photography, Yoga, Meditation, First Aid, Nutrition Basics

Return ONLY valid JSON, no markdown, no code blocks, no explanations.`

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that returns only valid JSON. Never use markdown code blocks.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    })

    const responseText = completion.choices[0]?.message?.content
    if (!responseText) {
      throw new Error('No response from AI')
    }

    // Parse JSON response
    let suggestions
    try {
      suggestions = JSON.parse(responseText)
    } catch (error) {
      console.error('Failed to parse AI response:', responseText)
      throw new Error('Invalid response format from AI')
    }

    // Validate and structure response
    return NextResponse.json({
      interestsIntro: suggestions.interestsIntro || '',
      skillsIntro: suggestions.skillsIntro || '',
      suggestedOffers: Array.isArray(suggestions.suggestedOffers) ? suggestions.suggestedOffers.slice(0, 10) : [],
      suggestedWants: Array.isArray(suggestions.suggestedWants) ? suggestions.suggestedWants.slice(0, 10) : [],
      suggestedInterests: Array.isArray(suggestions.suggestedInterests) ? suggestions.suggestedInterests : [],
      profilePicIdeas: Array.isArray(suggestions.profilePicIdeas) ? suggestions.profilePicIdeas : [],
    })
  } catch (error) {
    console.error('AI profile suggestions error:', error)
    return NextResponse.json(
      { error: 'Failed to generate suggestions. Please try again.' },
      { status: 500 }
    )
  }
}

