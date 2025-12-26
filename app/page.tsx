import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf8f5] relative overflow-hidden">
      {/* Paper texture background effect */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>

      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center relative z-10">
        <div className="text-3xl font-bold text-[#2d5016] hand-drawn">
          Dabble
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="text-gray-700 hover:text-[#2d5016] transition text-lg">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              Try something new,<br />wherever you are.
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Learn by dabbling with people nearby.
            </p>
            <Link 
              href="/signup"
              className="inline-block bg-[#a8d5a3] border-2 border-[#2d5016] text-[#2d5016] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#95c590] transition shadow-md"
            >
              Join the early community
            </Link>
          </div>
          <div className="relative">
            {/* Large D Logo with illustration */}
            <div className="relative w-full max-w-md mx-auto">
              <svg viewBox="0 0 300 300" className="w-full h-auto">
                {/* Left half - Mountain sketch */}
                <path 
                  d="M 50 250 L 80 200 L 100 180 L 120 160 L 140 150 L 150 120 L 150 250 Z" 
                  fill="none" 
                  stroke="#2d5016" 
                  strokeWidth="2"
                  className="opacity-60"
                />
                {/* Mountain path */}
                <path 
                  d="M 80 200 Q 100 180 120 160 Q 140 150 150 120" 
                  fill="none" 
                  stroke="#2d5016" 
                  strokeWidth="1.5"
                  strokeDasharray="3,3"
                  className="opacity-50"
                />
                {/* Flag at peak */}
                <line x1="150" y1="120" x2="150" y2="100" stroke="#2d5016" strokeWidth="2" className="opacity-60"/>
                <polygon points="150,100 150,110 165,105" fill="#2d5016" className="opacity-60"/>
                {/* Pine trees */}
                <path d="M 60 230 L 70 210 L 50 210 Z" fill="#2d5016" className="opacity-40"/>
                <path d="M 90 220 L 100 200 L 80 200 Z" fill="#2d5016" className="opacity-40"/>
                
                {/* Right half - Colored landscape */}
                <path 
                  d="M 150 250 L 150 120 L 250 120 L 250 250 Z" 
                  fill="#a8d5a3" 
                  className="opacity-40"
                />
                {/* Lake */}
                <ellipse cx="200" cy="200" rx="40" ry="20" fill="#7dd3fc" className="opacity-60"/>
                {/* Hills */}
                <path d="M 150 200 Q 180 180 200 190 Q 220 200 250 190 L 250 250 L 150 250 Z" fill="#95c590" className="opacity-50"/>
                {/* Sun */}
                <circle cx="220" cy="140" r="15" fill="#fb923c" className="opacity-70"/>
                {/* Path continuation */}
                <path 
                  d="M 150 120 Q 180 140 200 150 Q 220 160 250 170" 
                  fill="none" 
                  stroke="#2d5016" 
                  strokeWidth="2"
                  strokeDasharray="4,4"
                  className="opacity-40"
                />
                {/* Location pins */}
                <circle cx="180" cy="160" r="6" fill="#fb923c"/>
                <circle cx="230" cy="180" r="6" fill="#fb923c"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Winding Path Section */}
      <section className="container mx-auto px-4 py-8 relative z-10">
        <div className="relative h-20 overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 1200 80" preserveAspectRatio="none">
            <path 
              d="M 0 40 Q 150 20 300 40 T 600 40 T 900 40 T 1200 40" 
              fill="none" 
              stroke="#2d5016" 
              strokeWidth="2"
              strokeDasharray="4,4"
              className="opacity-30"
            />
            {/* Pine trees along path */}
            <path d="M 200 30 L 210 10 L 190 10 Z" fill="#2d5016" className="opacity-20"/>
            <path d="M 500 50 L 510 30 L 490 30 Z" fill="#2d5016" className="opacity-20"/>
            {/* Location pin */}
            <circle cx="700" cy="40" r="5" fill="#2d5016" className="opacity-30"/>
          </svg>
        </div>
      </section>

      {/* How it works Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-900 hand-drawn">
          How it works
        </h2>
        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Panel 1: Explore nearby */}
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6 relative">
            <div className="mb-4 h-20 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-16 h-16">
                <rect x="20" y="20" width="60" height="60" fill="#7dd3fc" opacity="0.3" rx="5"/>
                <path d="M 30 40 Q 50 30 70 40" fill="none" stroke="#2d5016" strokeWidth="2" strokeDasharray="2,2"/>
                <circle cx="40" cy="50" r="4" fill="#fb923c"/>
                <circle cx="60" cy="50" r="4" fill="#fb923c"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Explore nearby</h3>
            <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 text-2xl text-gray-400 hidden md:block">→</div>
          </div>

          {/* Panel 2: Try something new */}
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6 relative">
            <div className="mb-4 h-20 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-16 h-16">
                <circle cx="50" cy="50" r="8" fill="#2d5016"/>
                <path d="M 50 50 L 70 30" fill="none" stroke="#2d5016" strokeWidth="2" strokeDasharray="2,2"/>
                <text x="70" y="30" fontSize="20" fill="#2d5016" fontWeight="bold">X</text>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Try something new</h3>
            <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 text-2xl text-gray-400 hidden md:block">→</div>
          </div>

          {/* Panel 3: Meet people */}
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6 relative">
            <div className="mb-4 h-20 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-16 h-16">
                <circle cx="40" cy="50" r="20" fill="#7dd3fc" opacity="0.5"/>
                <circle cx="60" cy="50" r="20" fill="#fb923c" opacity="0.5"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Meet people</h3>
            <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 text-2xl text-gray-400 hidden md:block">→</div>
          </div>

          {/* Panel 4: Share what you know */}
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
            <div className="mb-4 h-20 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-16 h-16">
                <line x1="30" y1="80" x2="30" y2="30" stroke="#2d5016" strokeWidth="4" strokeLinecap="round"/>
                <path d="M 30 30 Q 40 20 50 30" fill="none" stroke="#2d5016" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Share what you know</h3>
          </div>
        </div>
      </section>

      {/* Join the early community Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto relative">
          {/* Road sign */}
          <div className="absolute -left-20 top-1/2 transform -translate-y-1/2 hidden lg:block">
            <div className="bg-[#8b6f47] border-2 border-[#2d5016] rounded-lg p-3 text-white text-sm">
              <div className="mb-2">← NYC</div>
              <div>← Denver, LA</div>
            </div>
          </div>

          <div className="bg-gray-100 border-2 border-gray-300 rounded-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 hand-drawn">
              Join the early community
            </h2>
            <form className="max-w-md mx-auto space-y-4">
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#2d5016]"
              />
              <button
                type="submit"
                className="w-full bg-[#a8d5a3] border-2 border-[#2d5016] text-[#2d5016] px-6 py-3 rounded-lg font-semibold hover:bg-[#95c590] transition"
              >
                Get Early Access
              </button>
            </form>
            <p className="text-sm text-gray-500 text-center mt-4">
              No spam, unsubscribe anytime.
            </p>
          </div>

          {/* Location pin on right */}
          <div className="absolute -right-10 top-1/2 transform -translate-y-1/2 hidden lg:block">
            <svg viewBox="0 0 30 40" className="w-8 h-10">
              <path d="M 15 0 Q 20 5 20 15 Q 20 25 15 40 Q 10 25 10 15 Q 10 5 15 0 Z" fill="#fb923c"/>
            </svg>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-gray-200 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600">© 2024 Dabble</div>
          <div className="flex gap-4 items-center">
            {/* Social icons placeholder */}
            <div className="w-6 h-6 bg-gray-400 rounded"></div>
            <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
            <div className="w-6 h-6 bg-gray-400 rounded"></div>
            <div className="w-6 h-6 bg-gray-400 rounded"></div>
          </div>
          <div className="flex gap-4 text-sm text-gray-600">
            <Link href="/privacy" className="hover:text-[#2d5016] transition">Privacy</Link>
            <Link href="/terms" className="hover:text-[#2d5016] transition">Terms</Link>
            <a href="mailto:hello@dabble.do" className="hover:text-[#2d5016] transition">hello@dabble.do</a>
          </div>
        </div>
      </footer>
    </main>
  )
}

