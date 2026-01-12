import { PrismaClient, SkillCategory } from '@prisma/client'

const prisma = new PrismaClient()

// Precise skills across categories - 25-60 skills as requested
const skills: { category: SkillCategory | null; name: string }[] = [
  // Cooking & Food
  { category: null, name: 'Cooking' },
  { category: null, name: 'Baking' },
  { category: null, name: 'Fermentation' },
  { category: null, name: 'Meal Planning' },
  { category: null, name: 'Knife Skills' },
  { category: null, name: 'Sourdough Baking' },
  { category: null, name: 'Canning & Preserving' },
  { category: null, name: 'Grilling' },
  
  // Repairs & Maintenance
  { category: null, name: 'Bike Repair' },
  { category: null, name: 'Appliance Repair' },
  { category: null, name: 'Plumbing Basics' },
  { category: null, name: 'Electrical Basics' },
  { category: null, name: 'Furniture Repair' },
  { category: null, name: 'Tool Maintenance' },
  
  // Gardening & Outdoor
  { category: null, name: 'Gardening' },
  { category: null, name: 'Composting' },
  { category: null, name: 'Plant Propagation' },
  { category: null, name: 'Urban Gardening' },
  { category: null, name: 'Herb Growing' },
  { category: null, name: 'Seed Starting' },
  
  // Language & Communication
  { category: null, name: 'Spanish' },
  { category: null, name: 'French' },
  { category: null, name: 'Mandarin' },
  { category: null, name: 'Sign Language' },
  { category: null, name: 'Public Speaking' },
  { category: null, name: 'Writing' },
  
  // Sewing & Textiles
  { category: null, name: 'Sewing' },
  { category: null, name: 'Knitting' },
  { category: null, name: 'Crocheting' },
  { category: null, name: 'Mending' },
  { category: null, name: 'Pattern Making' },
  { category: null, name: 'Embroidery' },
  
  // Carpentry & Woodworking
  { category: null, name: 'Carpentry' },
  { category: null, name: 'Woodworking' },
  { category: null, name: 'Furniture Making' },
  { category: null, name: 'Joinery' },
  { category: null, name: 'Wood Finishing' },
  
  // Financial & Life Skills
  { category: null, name: 'Budgeting' },
  { category: null, name: 'Investing Basics' },
  { category: null, name: 'Tax Preparation' },
  { category: null, name: 'Negotiation' },
  
  // Tech & Digital
  { category: null, name: 'Basic Coding' },
  { category: null, name: 'Web Design' },
  { category: null, name: 'Photo Editing' },
  { category: null, name: 'Video Editing' },
  { category: null, name: '3D Printing' },
  
  // Music & Arts
  { category: null, name: 'Guitar' },
  { category: null, name: 'Piano' },
  { category: null, name: 'Drawing' },
  { category: null, name: 'Painting' },
  { category: null, name: 'Pottery' },
  { category: null, name: 'Photography' },
  
  // Health & Wellness
  { category: null, name: 'Yoga' },
  { category: null, name: 'Meditation' },
  { category: null, name: 'First Aid' },
  { category: null, name: 'Nutrition Basics' },
]

async function main() {
  console.log('Seeding database...')

  // Clear existing skills (ignore if tables don't exist yet)
  try {
    await prisma.profileSkill.deleteMany()
  } catch (e) {
    // Table might not exist yet
  }
  try {
    await prisma.skill.deleteMany()
  } catch (e) {
    // Table might not exist yet
  }

  // Create skills
  for (const skill of skills) {
    await prisma.skill.upsert({
      where: {
        name: skill.name,
      },
      update: {},
      create: {
        name: skill.name,
        category: skill.category,
      },
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
  })
