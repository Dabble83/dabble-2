import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'
import { SkillLevel, SkillType, UserRole } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      phone,
      username,
      password,
      city,
      state,
      zip,
      radiusMiles,
      role,
      dabblerSkills,
      guideSkills,
    } = body

    // Validation
    if (!name || !email || !username || !password || !city || !state) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email or username already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Determine role flags
    const isDabbler = role === 'Dabbler' || role === 'Both'
    const isGuide = role === 'Guide' || role === 'Both'

    // Create user and profile in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          username,
          passwordHash,
          name,
          phone: phone || null,
        },
      })

      // Create profile
      const profile = await tx.profile.create({
        data: {
          userId: user.id,
          city,
          state,
          zip: zip || null,
          radiusMiles: radiusMiles || 10,
          isDabbler,
          isGuide,
        },
      })

      // Create user skills
      const userSkillsData = []

      if (isDabbler && dabblerSkills && Array.isArray(dabblerSkills)) {
        for (const skill of dabblerSkills) {
          userSkillsData.push({
            userId: user.id,
            skillId: skill.skillId,
            type: 'INTEREST' as SkillType,
            level: skill.level as SkillLevel,
          })
        }
      }

      if (isGuide && guideSkills && Array.isArray(guideSkills)) {
        for (const skill of guideSkills) {
          userSkillsData.push({
            userId: user.id,
            skillId: skill.skillId,
            type: 'GUIDE' as SkillType,
            level: skill.level as SkillLevel,
          })
        }
      }

      if (userSkillsData.length > 0) {
        await tx.userSkill.createMany({
          data: userSkillsData,
        })
      }

      return { user, profile }
    })

    return NextResponse.json({
      success: true,
      userId: result.user.id,
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}

