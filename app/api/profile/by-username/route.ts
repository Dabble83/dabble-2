import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const username = searchParams.get('username')

    if (!username) {
      return NextResponse.json(
        { error: 'Username required' },
        { status: 400 }
      )
    }

    const profile = await prisma.profile.findUnique({
      where: { username },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            username: true,
          },
        },
        location: true,
        profileSkills: {
          include: {
            skill: {
              select: {
                id: true,
                name: true,
                category: true,
              },
            },
          },
        },
      },
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

