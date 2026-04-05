// Follow STYLE_GUIDE.md for any UI changes.
// Design: minimal, editorial, calm. No loud colors. No marketplace language.
import Link from 'next/link'

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="max-w-800px mx-auto px-6 py-16" style={{ 
        maxWidth: '800px',
        paddingTop: '64px',
        paddingBottom: '64px',
        textAlign: 'center'
      }}>
        <h1 style={{ marginBottom: '24px' }}>
          Try something new, wherever you are.
        </h1>
        <p className="text-lg mb-8" style={{ 
          fontSize: '18px',
          lineHeight: '1.7',
          color: '#4B5563',
          marginBottom: '32px',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Learn by dabbling with people near you
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/dabble/signup" className="btn-primary">
            Start Dabbling
          </Link>
          <Link href="/about" className="link-primary" style={{ fontSize: '16px' }}>
            Learn more about how it works
          </Link>
        </div>
      </section>

      {/* Key Concepts Section */}
      <section className="max-w-1200px mx-auto px-6 py-16" style={{ 
        maxWidth: '1200px',
        paddingTop: '64px',
        paddingBottom: '64px'
      }}>
        <h2 className="text-center mb-12" style={{ marginBottom: '48px', textAlign: 'center' }}>
          How Dabble Works
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8" style={{ gap: '32px' }}>
          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '24px' }}>
              Everyone is both a learner and a sharer
            </h3>
            <p style={{ color: '#4B5563', lineHeight: '1.7' }}>
              You'll list skills you can help others with, and skills you want to learn. This keeps exchanges balanced and prevents the platform from becoming a one-way service marketplace.
            </p>
          </div>

          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '24px' }}>
              Exchange, not payment
            </h3>
            <p style={{ color: '#4B5563', lineHeight: '1.7' }}>
              Swaps are the default. "I'll teach you sourdough if you help me fix my bike" is how it works. Credits are optional—just a helpful tool for balancing complex exchanges, never required or purchased.
            </p>
          </div>

          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '24px' }}>
              Real-life connection
            </h3>
            <p style={{ color: '#4B5563', lineHeight: '1.7' }}>
              All exchanges happen in person, in your actual neighborhood. Find dabblers nearby who share your interests. Build local community through face-to-face interaction.
            </p>
          </div>

          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '24px' }}>
              Privacy first
            </h3>
            <p style={{ color: '#4B5563', lineHeight: '1.7' }}>
              Location sharing is optional and granular. Choose neighborhood-level precision or keep it approximate. Your exact address is never required or shared. You control your discoverability.
            </p>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="max-w-800px mx-auto px-6 py-16" style={{ 
        maxWidth: '800px',
        paddingTop: '64px',
        paddingBottom: '64px'
      }}>
        <h2 className="text-center mb-8" style={{ marginBottom: '32px', textAlign: 'center' }}>
          Why Dabble Exists
        </h2>
        <p style={{ 
          fontSize: '18px',
          lineHeight: '1.7',
          color: '#4B5563',
          textAlign: 'center'
        }}>
          Most platforms turn learning into a transaction. Dabble creates space for genuine community connections based on curiosity and mutual support. Think neighborhood bulletin board, not commercial marketplace. Think community center, not Silicon Valley startup.
        </p>
      </section>

      {/* Call to Action Section */}
      <section className="max-w-800px mx-auto px-6 py-16 text-center" style={{ 
        maxWidth: '800px',
        paddingTop: '64px',
        paddingBottom: '64px'
      }}>
        <h2 style={{ marginBottom: '16px' }}>
          Ready to start dabbling?
        </h2>
        <p style={{ 
          fontSize: '18px',
          lineHeight: '1.7',
          color: '#4B5563',
          marginBottom: '32px'
        }}>
          Create your profile, share what you know, discover what you want to learn. It's free, it's local, and it's built for real connections.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/dabble/signup" className="btn-primary">
            Sign Up
          </Link>
          <Link href="/dabble/signin" className="link-primary" style={{ fontSize: '16px' }}>
            Already have an account? Sign in
          </Link>
        </div>
      </section>
    </div>
  )
}
