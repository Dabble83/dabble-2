import Link from 'next/link'
import HandDrawnMap from './components/HandDrawnMap'

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
            {/* Hand-drawn map illustration with clickable destinations */}
            <div className="relative w-full max-w-2xl mx-auto">
              <HandDrawnMap />
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
                {/* Map background - hand-drawn style */}
                <rect x="15" y="15" width="70" height="70" fill="#faf8f5" stroke="#2d5016" strokeWidth="2.5" rx="3" opacity="0.9"/>
                
                {/* Streets/roads - imperfect, hand-drawn */}
                <path d="M 20 35 Q 30 33 40 35 T 60 35 T 80 35" fill="none" stroke="#8b6f47" strokeWidth="3" opacity="0.6" strokeLinecap="round"/>
                <path d="M 20 50 Q 30 48 40 50 T 60 50 T 80 50" fill="none" stroke="#8b6f47" strokeWidth="3" opacity="0.6" strokeLinecap="round"/>
                <path d="M 20 65 Q 30 63 40 65 T 60 65 T 80 65" fill="none" stroke="#8b6f47" strokeWidth="3" opacity="0.6" strokeLinecap="round"/>
                <path d="M 35 20 L 35 80" fill="none" stroke="#8b6f47" strokeWidth="2.5" opacity="0.5" strokeLinecap="round"/>
                <path d="M 50 20 L 50 80" fill="none" stroke="#8b6f47" strokeWidth="2.5" opacity="0.5" strokeLinecap="round"/>
                <path d="M 65 20 L 65 80" fill="none" stroke="#8b6f47" strokeWidth="2.5" opacity="0.5" strokeLinecap="round"/>
                
                {/* Location pins - hand-drawn style */}
                <g>
                  {/* Pin 1 */}
                  <circle cx="35" cy="40" r="3.5" fill="#fb923c" opacity="0.9"/>
                  <path d="M 35 40 L 35 28 M 35 40 L 28 36 M 35 40 L 42 36" 
                        stroke="#fb923c" strokeWidth="2" opacity="0.9" strokeLinecap="round"/>
                  
                  {/* Pin 2 */}
                  <circle cx="60" cy="55" r="3.5" fill="#fb923c" opacity="0.9"/>
                  <path d="M 60 55 L 60 43 M 60 55 L 53 51 M 60 55 L 67 51" 
                        stroke="#fb923c" strokeWidth="2" opacity="0.9" strokeLinecap="round"/>
                  
                  {/* Pin 3 - smaller */}
                  <circle cx="50" cy="70" r="2.5" fill="#fb923c" opacity="0.7"/>
                  <path d="M 50 70 L 50 62 M 50 70 L 45 67 M 50 70 L 55 67" 
                        stroke="#fb923c" strokeWidth="1.5" opacity="0.7" strokeLinecap="round"/>
                </g>
                
                {/* Compass in corner - hand-drawn */}
                <g transform="translate(70, 20)">
                  <circle cx="0" cy="0" r="8" fill="none" stroke="#2d5016" strokeWidth="2" opacity="0.6"/>
                  <line x1="0" y1="-8" x2="0" y2="8" stroke="#2d5016" strokeWidth="1.5" opacity="0.6"/>
                  <line x1="-8" y1="0" x2="8" y2="0" stroke="#2d5016" strokeWidth="1.5" opacity="0.6"/>
                  <path d="M 0 -8 L -3 -3 L 0 0 Z" fill="#2d5016" opacity="0.6"/>
                  <text x="0" y="12" fontSize="8" fill="#2d5016" opacity="0.6" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">N</text>
                </g>
                
                {/* Magnifying glass / location finder - hand-drawn */}
                <g transform="translate(25, 25)">
                  <circle cx="0" cy="0" r="6" fill="none" stroke="#2d5016" strokeWidth="2.5" opacity="0.7" strokeLinecap="round"/>
                  <line x1="4" y1="4" x2="8" y2="8" stroke="#2d5016" strokeWidth="2.5" opacity="0.7" strokeLinecap="round"/>
                </g>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Explore nearby</h3>
            <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 text-2xl text-gray-400 hidden md:block">→</div>
          </div>

          {/* Panel 2: Try something new */}
          <Link href="/explore" className="bg-white border-2 border-gray-300 rounded-lg p-6 relative hover:border-[#2d5016] transition cursor-pointer block">
            <div className="mb-4 h-20 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-16 h-16">
                {/* Ocean waves - hand-drawn, wavy */}
                <g opacity="0.6">
                  <path d="M 15 75 Q 25 72 35 75 T 55 75 T 75 75 T 85 72" 
                        fill="none" stroke="#7dd3fc" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M 15 80 Q 25 77 35 80 T 55 80 T 75 80 T 85 77" 
                        fill="none" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M 15 85 Q 25 82 35 85 T 55 85 T 75 85 T 85 82" 
                        fill="none" stroke="#7dd3fc" strokeWidth="2.5" strokeLinecap="round"/>
                </g>
                
                {/* Ocean watercolor fill */}
                <rect x="15" y="70" width="70" height="20" fill="#7dd3fc" opacity="0.2"/>
                
                {/* Ship hull - hand-drawn, imperfect */}
                <path 
                  d="M 35 75 Q 40 70 45 72 Q 50 70 55 72 Q 60 70 65 75 L 65 82 Q 60 80 50 80 Q 40 80 35 82 Z" 
                  fill="#8b6f47" 
                  opacity="0.7"
                  stroke="#2d5016" 
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                
                {/* Sail - hand-drawn, billowing */}
                <path 
                  d="M 48 75 L 48 50 Q 50 45 55 50 Q 60 48 62 52 L 60 75 Z" 
                  fill="#faf8f5" 
                  opacity="0.9"
                  stroke="#2d5016" 
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                
                {/* Mast */}
                <line 
                  x1="48" 
                  y1="75" 
                  x2="48" 
                  y2="50" 
                  stroke="#2d5016" 
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  opacity="0.8"
                />
                
                {/* Sail cross lines - rigging */}
                <line 
                  x1="48" 
                  y1="60" 
                  x2="58" 
                  y2="65" 
                  stroke="#2d5016" 
                  strokeWidth="1.5"
                  opacity="0.5"
                  strokeLinecap="round"
                />
                <line 
                  x1="50" 
                  y1="52" 
                  x2="60" 
                  y2="58" 
                  stroke="#2d5016" 
                  strokeWidth="1.5"
                  opacity="0.5"
                  strokeLinecap="round"
                />
                
                {/* Flag at top of mast */}
                <path 
                  d="M 48 50 L 48 45 L 52 47 L 48 50" 
                  fill="#fb923c" 
                  opacity="0.8"
                  stroke="#2d5016" 
                  strokeWidth="1.5"
                />
                
                {/* Person with telescope - stick figure on deck */}
                <g transform="translate(52, 72)">
                  {/* Head */}
                  <circle cx="0" cy="0" r="2.5" fill="#2d5016" opacity="0.8"/>
                  {/* Body */}
                  <line x1="0" y1="2.5" x2="0" y2="6" stroke="#2d5016" strokeWidth="2" opacity="0.8" strokeLinecap="round"/>
                  {/* Arms holding telescope */}
                  <line x1="0" y1="4" x2="-4" y2="5" stroke="#2d5016" strokeWidth="1.5" opacity="0.8" strokeLinecap="round"/>
                  <line x1="0" y1="4" x2="6" y2="3" stroke="#2d5016" strokeWidth="2" opacity="0.8" strokeLinecap="round"/>
                  {/* Legs */}
                  <line x1="0" y1="6" x2="-2" y2="8" stroke="#2d5016" strokeWidth="1.5" opacity="0.8" strokeLinecap="round"/>
                  <line x1="0" y1="6" x2="2" y2="8" stroke="#2d5016" strokeWidth="1.5" opacity="0.8" strokeLinecap="round"/>
                  
                  {/* Telescope - extending from eye */}
                  <line 
                    x1="4" 
                    y1="3" 
                    x2="12" 
                    y2="5" 
                    stroke="#8b6f47" 
                    strokeWidth="2.5"
                    opacity="0.9"
                    strokeLinecap="round"
                  />
                  {/* Telescope end piece */}
                  <circle cx="12" cy="5" r="2" fill="#2d5016" opacity="0.7"/>
                  {/* Telescope lens */}
                  <circle cx="12" cy="5" r="1.2" fill="#7dd3fc" opacity="0.5"/>
                </g>
                
                {/* Sun in sky - optional atmospheric element */}
                <circle cx="80" cy="25" r="6" fill="#fb923c" opacity="0.4"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Try something new</h3>
            <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 text-2xl text-gray-400 hidden md:block">→</div>
          </Link>

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

