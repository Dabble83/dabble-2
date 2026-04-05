import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/src/lib/supabaseServer'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')

    // Validate category if provided
    const validCategories = ['Adventure', 'HomeImprovement', 'Creative']
    if (category && !validCategories.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
        { status: 400 }
      )
    }

    // Build query
    let query = supabaseServer
      .from('skills')
      .select('id, name, category')
      .order('name', { ascending: true })

    // Filter by category if provided
    if (category) {
      query = query.eq('category', category)
    }

    const { data: skills, error } = await query

    if (error) {
      console.error('Error fetching skills:', error)
      return NextResponse.json(
        { error: 'Failed to fetch skills' },
        { status: 500 }
      )
    }

    return NextResponse.json(skills || [])
  } catch (error) {
    console.error('Error in skills by category API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    )
  }
}
