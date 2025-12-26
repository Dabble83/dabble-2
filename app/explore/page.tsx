'use client'

import Link from 'next/link'
import { useState } from 'react'

interface DestinationRegion {
  id: string
  category: string
  href: string
  position: {
    top: string
    left: string
    width: string
    height: string
  }
  tooltipPosition: {
    top: string
    left: string
  }
}

const destinations: DestinationRegion[] = [
  {
    id: 'adventure',
    category: 'Adventure & Outdoors',
    href: '/try/adventure',
    position: {
      top: '8%',
      left: '5%',
      width: '38%',
      height: '35%',
    },
    tooltipPosition: {
      top: '46%',
      left: '24%',
    },
  },
  {
    id: 'home-improvement',
    category: 'Home Improvement & Gardening',
    href: '/try/home-improvement',
    position: {
      top: '5%',
      left: '52%',
      width: '43%',
      height: '45%',
    },
    tooltipPosition: {
      top: '53%',
      left: '73.5%',
    },
  },
  {
    id: 'creative',
    category: 'Creative & Hobbies',
    href: '/try/creative',
    position: {
      top: '48%',
      left: '8%',
      width: '40%',
      height: '42%',
    },
    tooltipPosition: {
      top: '92%',
      left: '28%',
    },
  },
]

export default function ExplorePage() {
  const [hoveredDestination, setHoveredDestination] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-[#faf8f5] relative">
      {/* Paper texture background effect */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>

      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center relative z-10">
        <Link href="/" className="text-3xl font-bold text-[#2d5016] hand-drawn">
          Dabble
        </Link>
        <div className="flex gap-4">
          <Link href="/login" className="text-gray-700 hover:text-[#2d5016] transition text-lg">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Map Container */}
      <section className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center hand-drawn">
            Try something new
          </h1>
          
          {/* Map Illustration Container */}
          <div className="relative w-full" style={{ aspectRatio: '4/3' }}>
            {/* Background Map Image */}
            <div className="relative w-full h-full rounded-lg overflow-hidden" style={{ 
              backgroundColor: '#faf8f5',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <img
                src="/images/Dabble-try-something-new.png"
                alt="Hand-drawn map showing Adventure, Home Improvement, and Creative activity destinations"
                className="w-full h-full object-contain"
                loading="eager"
              />
            </div>

            {/* Clickable Destination Regions */}
            {destinations.map((destination) => (
              <Link
                key={destination.id}
                href={destination.href}
                className="absolute cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2d5016] focus:ring-offset-2 rounded-lg"
                style={destination.position}
                onMouseEnter={() => setHoveredDestination(destination.id)}
                onMouseLeave={() => setHoveredDestination(null)}
                onFocus={() => setHoveredDestination(destination.id)}
                onBlur={() => setHoveredDestination(null)}
                aria-label={`Explore ${destination.category}`}
              >
                {/* Invisible clickable area with subtle hover effect */}
                <div 
                  className="w-full h-full rounded-lg transition-all"
                  style={{
                    backgroundColor: hoveredDestination === destination.id ? 'rgba(45, 80, 22, 0.05)' : 'transparent',
                  }}
                />
              </Link>
            ))}

            {/* Hand-drawn Tooltips */}
            {destinations.map((destination) => (
              hoveredDestination === destination.id && (
                <div
                  key={`tooltip-${destination.id}`}
                  className="absolute pointer-events-none z-20"
                  style={{
                    ...destination.tooltipPosition,
                    transform: 'translateX(-50%)',
                  }}
                >
                  {/* Hand-drawn tooltip box */}
                  <div className="relative">
                    {/* Tooltip background - hand-drawn style with sketch lines */}
                    <svg
                      width="180"
                      height="50"
                      viewBox="0 0 180 50"
                      className="absolute -top-1 -left-1"
                    >
                      {/* Hand-drawn border - imperfect, wobbly rectangle */}
                      <path
                        d="M 3 12 Q 0 6 4 2 L 172 2 Q 177 0 176 8 L 176 38 Q 178 44 174 46 L 4 46 Q 0 44 3 38 Z"
                        fill="#faf8f5"
                        stroke="#2d5016"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.96"
                      />
                      {/* Subtle watercolor wash */}
                      <path
                        d="M 3 12 Q 0 6 4 2 L 172 2 Q 177 0 176 8 L 176 38 Q 178 44 174 46 L 4 46 Q 0 44 3 38 Z"
                        fill="#a8d5a3"
                        opacity="0.15"
                      />
                      {/* Sketch lines for texture */}
                      <line x1="8" y1="15" x2="170" y2="15" stroke="#2d5016" strokeWidth="0.5" opacity="0.2" strokeDasharray="2,3" />
                      <line x1="8" y1="25" x2="170" y2="25" stroke="#2d5016" strokeWidth="0.5" opacity="0.2" strokeDasharray="2,3" />
                    </svg>
                    {/* Tooltip text */}
                    <div className="relative px-5 py-3">
                      <p className="text-sm md:text-base font-medium text-[#2d5016] whitespace-nowrap" style={{ fontFamily: 'sans-serif' }}>
                        {destination.category}
                      </p>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      {/* Footer note */}
      <footer className="container mx-auto px-4 py-8 text-center relative z-10">
        <p className="text-sm text-gray-600">
          Click on any destination to explore activities
        </p>
      </footer>
    </main>
  )
}

