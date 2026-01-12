import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category') as string | null
    const skillId = searchParams.get('skillId')
    const city = searchParams.get('city')
    const state = searchParams.get('state')

    // Build where clause - find profiles with "offers" skills (guides)
    const where: any = {
      profileSkills: {
        some: {
          type: 'offers',
        },
      },
    }

    // Filter by category
    if (category) {
      where.profileSkills = {
        some: {
          type: 'offers',
          skill: {
            category,
          },
        },
      }
    }

    // Filter by specific skill
    if (skillId) {
      where.profileSkills = {
        some: {
          type: 'offers',
          skillId,
        },
      }
    }

    // Filter by location
    if (city || state) {
      where.location = {
        ...(city && { addressLabel: { contains: city } }),
        ...(state && { addressLabel: { contains: state } }),
      }
    }

    const profiles = await prisma.profile.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        location: true,
        profileSkills: {
          where: {
            type: 'offers',
          },
          include: {
            skill: true,
          },
        },
      },
      take: 50, // Limit results
    })

    return NextResponse.json(profiles)
  } catch (error) {
    console.error('Search guides error:', error)
    return NextResponse.json(
      { error: 'Failed to search guides' },
      { status: 500 }
    )
  }
}
