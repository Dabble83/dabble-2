import Link from 'next/link'

// Mock data for each category
const mockSkills: Record<string, Array<{ id: string; name: string; description: string }>> = {
  adventure: [
    { id: '1', name: 'Rock Climbing', description: 'Learn basic climbing techniques and safety' },
    { id: '2', name: 'Kayaking', description: 'Paddle through local waterways' },
    { id: '3', name: 'Hiking', description: 'Explore trails and nature paths' },
    { id: '4', name: 'Surfing', description: 'Catch waves at nearby beaches' },
    { id: '5', name: 'Mountain Biking', description: 'Ride trails and off-road paths' },
    { id: '6', name: 'Camping', description: 'Set up camp and enjoy the outdoors' },
    { id: '7', name: 'Skiing', description: 'Hit the slopes this winter' },
    { id: '8', name: 'Snowboarding', description: 'Learn to ride the mountain' }
  ],
  'home-improvement': [
    { id: '1', name: 'Basic Plumbing', description: 'Fix leaks and simple repairs' },
    { id: '2', name: 'Electrical Work', description: 'Install fixtures and outlets safely' },
    { id: '3', name: 'Carpentry', description: 'Build shelves and basic furniture' },
    { id: '4', name: 'Gardening', description: 'Grow vegetables and flowers' },
    { id: '5', name: 'Painting', description: 'Interior and exterior painting techniques' },
    { id: '6', name: 'Tile Installation', description: 'Lay tile in bathrooms and kitchens' },
    { id: '7', name: 'Drywall Repair', description: 'Patch holes and finish walls' },
    { id: '8', name: 'Landscaping', description: 'Design and maintain outdoor spaces' }
  ],
  creative: [
    { id: '1', name: 'Drawing', description: 'Sketching and illustration basics' },
    { id: '2', name: 'Painting', description: 'Watercolor, acrylic, and oil techniques' },
    { id: '3', name: 'Knitting', description: 'Create scarves, hats, and more' },
    { id: '4', name: 'Pottery', description: 'Shape clay and fire ceramics' },
    { id: '5', name: 'Photography', description: 'Capture great moments and scenes' },
    { id: '6', name: 'Woodworking', description: 'Craft furniture and decorative items' },
    { id: '7', name: 'Music Production', description: 'Record and mix your own tracks' },
    { id: '8', name: 'Writing', description: 'Creative writing and storytelling' }
  ]
}

const categoryNames: Record<string, string> = {
  adventure: 'Adventure',
  'home-improvement': 'Home Improvement',
  creative: 'Creative / Hobbies'
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = params.category
  const skills = mockSkills[category] || []
  const categoryName = categoryNames[category] || 'Category'

  return (
    <main className="min-h-screen bg-[#faf8f5]">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Back link */}
        <Link 
          href="/try"
          className="inline-flex items-center text-gray-600 hover:text-[#2d5016] transition-colors mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to categories
        </Link>

        {/* Page header */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {categoryName}
        </h1>
        <p className="text-xl text-gray-600 mb-8 md:mb-12">
          Explore skills in this category
        </p>

        {/* Skills list */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-[#2d5016] transition-colors"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {skill.name}
              </h3>
              <p className="text-gray-600 text-sm">
                {skill.description}
              </p>
            </div>
          ))}
        </div>

        {skills.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No skills found in this category.</p>
          </div>
        )}
      </div>
    </main>
  )
}






