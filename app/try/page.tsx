import Link from 'next/link'
import Image from 'next/image'

export default function TryPage() {
  return (
    <main className="min-h-screen bg-[#f6f1e8]">
      <div className="max-w-[1200px] mx-auto px-6 py-16 md:py-24">
        {/* Reference image with clickable hotspots */}
        <div className="relative w-full">
          <Image
            src="/images/Dabble-try-something-new.png"
            alt="Try something new - hand-drawn map with three framed scenes"
            width={1600}
            height={900}
            className="w-full h-auto"
            priority
          />
          
          {/* Adventure hotspot - top-left frame */}
          <Link
            href="/try/adventure"
            className="absolute rounded-xl cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2d5016] transition-all hover:bg-white/10"
            style={{
              left: "6%",
              top: "10%",
              width: "38%",
              height: "28%"
            }}
            aria-label="Adventure - Outdoor activities and exploration"
          />
          
          {/* Home Improvement hotspot - right-side large frame */}
          <Link
            href="/try/home-improvement"
            className="absolute rounded-xl cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2d5016] transition-all hover:bg-white/10"
            style={{
              right: "8%",
              top: "18%",
              width: "42%",
              height: "48%"
            }}
            aria-label="Home Improvement - DIY, repairs, and gardening"
          />
          
          {/* Creative Crafts & Hobbies hotspot - bottom-left frame */}
          <Link
            href="/try/creative"
            className="absolute rounded-xl cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2d5016] transition-all hover:bg-white/10"
            style={{
              left: "8%",
              bottom: "15%",
              width: "36%",
              height: "30%"
            }}
            aria-label="Creative Crafts & Hobbies - Arts, crafts, and creative pursuits"
          />
        </div>
      </div>
    </main>
  )
}

