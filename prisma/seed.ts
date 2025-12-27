import { PrismaClient } from '../app/generated/prisma/client'
import { SkillCategory } from '../app/generated/prisma/enums'
import { PrismaSqlite } from '@prisma/adapter-sqlite'
import Database from 'better-sqlite3'

const sqlite = new Database('./prisma/dev.db')
const adapter = new PrismaSqlite(sqlite)
const prisma = new PrismaClient({ adapter })

const skills: { category: SkillCategory; name: string }[] = [
  // Adventure
  { category: SkillCategory.Adventure, name: 'Rock Climbing' },
  { category: SkillCategory.Adventure, name: 'Hiking' },
  { category: SkillCategory.Adventure, name: 'Mountain Biking' },
  { category: SkillCategory.Adventure, name: 'Kayaking' },
  { category: SkillCategory.Adventure, name: 'Whitewater Rafting' },
  { category: SkillCategory.Adventure, name: 'Surfing' },
  { category: SkillCategory.Adventure, name: 'Snowboarding' },
  { category: SkillCategory.Adventure, name: 'Skiing' },
  { category: SkillCategory.Adventure, name: 'Camping' },
  { category: SkillCategory.Adventure, name: 'Backpacking' },
  { category: SkillCategory.Adventure, name: 'Scuba Diving' },
  { category: SkillCategory.Adventure, name: 'Sailing' },
  { category: SkillCategory.Adventure, name: 'Skydiving' },
  { category: SkillCategory.Adventure, name: 'Trail Running' },
  { category: SkillCategory.Adventure, name: 'Archery' },
  { category: SkillCategory.Adventure, name: 'Fishing' },
  { category: SkillCategory.Adventure, name: 'Wilderness Survival' },
  { category: SkillCategory.Adventure, name: 'Bouldering' },

  // Home Improvement
  { category: SkillCategory.HomeImprovement, name: 'Carpentry' },
  { category: SkillCategory.HomeImprovement, name: 'Plumbing' },
  { category: SkillCategory.HomeImprovement, name: 'Electrical Work' },
  { category: SkillCategory.HomeImprovement, name: 'Painting' },
  { category: SkillCategory.HomeImprovement, name: 'Drywall' },
  { category: SkillCategory.HomeImprovement, name: 'Flooring Installation' },
  { category: SkillCategory.HomeImprovement, name: 'Tile Work' },
  { category: SkillCategory.HomeImprovement, name: 'Roofing' },
  { category: SkillCategory.HomeImprovement, name: 'Landscaping' },
  { category: SkillCategory.HomeImprovement, name: 'Gardening' },
  { category: SkillCategory.HomeImprovement, name: 'HVAC Repair' },
  { category: SkillCategory.HomeImprovement, name: 'Window Installation' },
  { category: SkillCategory.HomeImprovement, name: 'Deck Building' },
  { category: SkillCategory.HomeImprovement, name: 'Fence Installation' },
  { category: SkillCategory.HomeImprovement, name: 'Cabinet Making' },
  { category: SkillCategory.HomeImprovement, name: 'Concrete Work' },
  { category: SkillCategory.HomeImprovement, name: 'Welding' },
  { category: SkillCategory.HomeImprovement, name: 'Appliance Repair' },

  // Creative / Hobbies
  { category: SkillCategory.Creative, name: 'Drawing' },
  { category: SkillCategory.Creative, name: 'Painting (Art)' },
  { category: SkillCategory.Creative, name: 'Photography' },
  { category: SkillCategory.Creative, name: 'Knitting' },
  { category: SkillCategory.Creative, name: 'Crocheting' },
  { category: SkillCategory.Creative, name: 'Sewing' },
  { category: SkillCategory.Creative, name: 'Pottery' },
  { category: SkillCategory.Creative, name: 'Ceramics' },
  { category: SkillCategory.Creative, name: 'Woodworking' },
  { category: SkillCategory.Creative, name: 'Jewelry Making' },
  { category: SkillCategory.Creative, name: 'Calligraphy' },
  { category: SkillCategory.Creative, name: 'Lettering' },
  { category: SkillCategory.Creative, name: 'Digital Art' },
  { category: SkillCategory.Creative, name: 'Music Production' },
  { category: SkillCategory.Creative, name: 'Guitar' },
  { category: SkillCategory.Creative, name: 'Piano' },
  { category: SkillCategory.Creative, name: 'Cooking' },
  { category: SkillCategory.Creative, name: 'Baking' },
]

async function main() {
  console.log('Seeding database...')

  // Clear existing skills
  await prisma.userSkill.deleteMany()
  await prisma.skill.deleteMany()

  // Create skills
  for (const skill of skills) {
    await prisma.skill.upsert({
      where: {
        category_name: {
          category: skill.category,
          name: skill.name,
        },
      },
      update: {},
      create: skill,
    })
  }

  console.log(`Seeded ${skills.length} skills`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    sqlite.close()
  })
