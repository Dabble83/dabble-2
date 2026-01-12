import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

// Type aliases for Prisma enums
type LocationPrecision = 'neighborhood' | 'approximate'
type ProfileSkillType = 'offers' | 'wants'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      displayName,
      username,
      profileImageUrl,
      interestsIntro,
      skillsIntro,
      interests,
      offersSkills,
      wantsSkills,
      isDiscoverable,
      addressLabel,
      precision,
      lat,
      lng,
    } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    // If username is being changed, check if it's available
    if (username) {
      const existingProfile = await prisma.profile.findFirst({
        where: {
          username,
          userId: { not: userId },
        },
      })

      if (existingProfile) {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 400 }
        )
      }
    }

    // Update profile and related data in transaction
    const result = await prisma.$transaction(async (tx: any) => {
      // Update profile
      const profile = await tx.profile.update({
        where: { userId },
        data: {
          displayName: displayName || undefined,
          username: username || undefined,
          profileImageUrl: profileImageUrl || undefined,
          interestsIntro: interestsIntro || undefined,
          skillsIntro: skillsIntro || undefined,
          interests: interests ? JSON.stringify(interests) : undefined,
        },
      })

      // Update or create location
      await tx.profileLocation.upsert({
        where: { profileId: profile.id },
        update: {
          isDiscoverable: isDiscoverable !== undefined ? isDiscoverable : undefined,
          addressLabel: addressLabel || undefined,
          precision: precision ? (precision as LocationPrecision) : undefined,
          lat: lat !== undefined ? lat : undefined,
          lng: lng !== undefined ? lng : undefined,
        },
        create: {
          profileId: profile.id,
          isDiscoverable: isDiscoverable || false,
          addressLabel: addressLabel || 'Not specified',
          precision: (precision || 'neighborhood') as LocationPrecision,
          lat: lat || null,
          lng: lng || null,
        },
      })

      // Update profile skills (only if explicitly provided)
      if (offersSkills !== undefined || wantsSkills !== undefined) {
        // Delete existing skills for this profile
        await tx.profileSkill.deleteMany({
          where: { profileId: profile.id },
        })

        // Add new skills
        const skillsToAdd = []
        
        if (offersSkills && Array.isArray(offersSkills)) {
          for (const skillId of offersSkills) {
            skillsToAdd.push({
              profileId: profile.id,
              skillId,
              type: 'offers' as ProfileSkillType,
            })
          }
        }

        if (wantsSkills && Array.isArray(wantsSkills)) {
          for (const skillId of wantsSkills) {
            skillsToAdd.push({
              profileId: profile.id,
              skillId,
              type: 'wants' as ProfileSkillType,
            })
          }
        }

        if (skillsToAdd.length > 0) {
          await tx.profileSkill.createMany({
            data: skillsToAdd,
          })
        }
      }

      // Fetch the updated profile with all relations
      const updatedProfile = await tx.profile.findUnique({
        where: { id: profile.id },
        include: {
          location: true,
          profileSkills: true,
        },
      })

      return updatedProfile || profile
    })

    return NextResponse.json({
      success: true,
      profile: result,
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

