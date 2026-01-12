import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    // Check if profile exists and has basic info
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        profileSkills: true,
        location: true,
      },
    })

    if (!profile) {
      return NextResponse.json({ complete: false })
    }

    // Profile is incomplete if:
    // 1. Missing interestsIntro OR skillsIntro
    // 2. OR no skills selected
    const hasSkills = profile.profileSkills.length > 0
    const hasInterestsIntro = !!(profile.interestsIntro && profile.interestsIntro.trim().length > 0)
    const hasSkillsIntro = !!(profile.skillsIntro && profile.skillsIntro.trim().length > 0)

    // Profile is complete only if it has both intros AND at least one skill
    const complete = hasInterestsIntro && hasSkillsIntro && hasSkills

    return NextResponse.json({ complete })
  } catch (error) {
    console.error('Profile check error:', error)
    return NextResponse.json(
      { error: 'Failed to check profile' },
      { status: 500 }
    )
  }
}

