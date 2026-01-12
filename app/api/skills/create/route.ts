import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name } = body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Skill name is required' },
        { status: 400 }
      )
    }

    // Check if skill already exists (case-insensitive)
    // First try exact match (most common case)
    const trimmedName = name.trim()
    let existingSkill = await prisma.skill.findUnique({
      where: { name: trimmedName },
    })

    // If not found, check case-insensitive (SQLite limitation - fetch and filter)
    if (!existingSkill) {
      const allSkills = await prisma.skill.findMany()
      existingSkill = allSkills.find(
        (s: any) => s.name.toLowerCase().trim() === trimmedName.toLowerCase()
      ) || null
    }

    if (existingSkill) {
      return NextResponse.json({
        success: true,
        skill: existingSkill,
      })
    }

    // Create new skill with null category (will be treated as "Custom")
    const skill = await prisma.skill.create({
      data: {
        name: name.trim(),
        category: null, // Custom category
      },
    })

    return NextResponse.json({
      success: true,
      skill,
    })
  } catch (error) {
    console.error('Error creating skill:', error)
    return NextResponse.json(
      { error: 'Failed to create skill' },
      { status: 500 }
    )
  }
}

