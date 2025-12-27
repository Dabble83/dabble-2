import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SkillCategory } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category') as SkillCategory | null
    const skillId = searchParams.get('skillId')
    const city = searchParams.get('city')
    const state = searchParams.get('state')

    // Build where clause
    const where: any = {
      profile: {
        isGuide: true,
      },
      userSkills: {
        some: {
          type: 'GUIDE',
        },
      },
    }

    // Filter by category
    if (category) {
      where.userSkills = {
        some: {
          type: 'GUIDE',
          skill: {
            category,
          },
        },
      }
    }

    // Filter by specific skill
    if (skillId) {
      where.userSkills = {
        some: {
          type: 'GUIDE',
          skillId,
        },
      }
    }

    // Filter by location
    if (city || state) {
      where.profile = {
        ...where.profile,
        ...(city && { city }),
        ...(state && { state }),
      }
    }

    const guides = await prisma.user.findMany({
      where,
      include: {
        profile: true,
        userSkills: {
          where: {
            type: 'GUIDE',
          },
          include: {
            skill: true,
          },
        },
      },
      take: 50, // Limit results
    })

    return NextResponse.json(guides)
  } catch (error) {
    console.error('Search guides error:', error)
    return NextResponse.json(
      { error: 'Failed to search guides' },
      { status: 500 }
    )
  }
}

