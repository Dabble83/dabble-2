// Follow STYLE_GUIDE.md for any UI changes.
// Design: minimal, editorial, calm. No loud colors. No marketplace language.
export default function AboutPage() {
  return (
    <div className="w-full">
      <div className="max-w-800px mx-auto px-6 py-16" style={{ 
        maxWidth: '800px',
        paddingTop: '64px',
        paddingBottom: '64px'
      }}>
        <h1 style={{ marginBottom: '32px' }}>
          About Dabble
        </h1>

        <p style={{ 
          fontSize: '18px',
          lineHeight: '1.7',
          color: '#4B5563',
          marginBottom: '48px'
        }}>
          Dabble connects people in real life through skills exchange and learning. We're building a calm, anti-hustle platform that feels like a neighborhood bulletin board—warm, inviting, and focused on genuine community connections.
        </p>

        {/* How It Works Section */}
        <section style={{ marginBottom: '64px' }}>
          <h2 style={{ marginBottom: '24px' }}>
            How It Works
          </h2>

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '24px' }}>
              Create Your Profile
            </h3>
            <p style={{ color: '#4B5563', lineHeight: '1.7' }}>
              Start by creating a profile that shows both what you can share and what you want to learn. Upload a photo, write a bit about your interests, and list your skills. The dual identity—learner and sharer—keeps exchanges balanced and community-focused.
            </p>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '24px' }}>
              Discover Nearby Dabblers
            </h3>
            <p style={{ color: '#4B5563', lineHeight: '1.7' }}>
              Use the explore map to find dabblers in your area. Filter by skills, interests, or radius. When you find someone interesting, view their full profile to see what they offer and what they're looking to learn.
            </p>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '24px' }}>
              Connect and Exchange
            </h3>
            <p style={{ color: '#4B5563', lineHeight: '1.7' }}>
              Reach out through the platform to propose an exchange. Maybe you'll teach them sourdough baking in exchange for bike repair help. Or swap photography tips for gardening advice. Exchanges happen in person, in real life, building actual community connections.
            </p>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '24px' }}>
              Optional Credits
            </h3>
            <p style={{ color: '#4B5563', lineHeight: '1.7' }}>
              Credits are a helpful tool for balancing exchanges, especially when skills have different time commitments or complexities. But they're completely optional—the platform works perfectly as a pure swap system. Credits are never purchased, never charged, and never required. They're just community-set values to help match balanced exchanges.
            </p>
          </div>
        </section>

        {/* Philosophy Section */}
        <section style={{ marginBottom: '64px' }}>
          <h2 style={{ marginBottom: '24px' }}>
            Our Philosophy
          </h2>

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '24px' }}>
              Anti-Hustle
            </h3>
            <p style={{ color: '#4B5563', lineHeight: '1.7' }}>
              We explicitly avoid marketplace language, monetization features, gamification, and growth hacking. No "buy/sell," no badges, no referral bonuses. This is about community connection, not commercial optimization.
            </p>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '24px' }}>
              Real-Life Focus
            </h3>
            <p style={{ color: '#4B5563', lineHeight: '1.7' }}>
              All exchanges are expected to happen in person. Online-only or remote learning isn't our focus—we're building local community through face-to-face interaction. The map helps you find people nearby who share your interests.
            </p>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '24px' }}>
              Privacy & Safety
            </h3>
            <p style={{ color: '#4B5563', lineHeight: '1.7' }}>
              Location sharing is opt-in and granular. You choose your level of precision. Exact addresses are never required. All interactions are community-moderated, and users build reputation through successful exchanges.
            </p>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '24px' }}>
              Community First
            </h3>
            <p style={{ color: '#4B5563', lineHeight: '1.7' }}>
              Success is measured by quality of connections, not user count or engagement metrics. The platform exists to serve existing communities and help new ones form. We're not trying to "scale" or "disrupt"—we're trying to connect real people in real places.
            </p>
          </div>
        </section>

        {/* Credits & Exchange Section */}
        <section style={{ marginBottom: '64px' }}>
          <h2 style={{ marginBottom: '24px' }}>
            About Credits and Exchanges
          </h2>
          <p style={{ color: '#4B5563', lineHeight: '1.7', marginBottom: '24px' }}>
            Credits exist purely as a convenience tool to facilitate exchanges, not as a monetization feature. They're optional, transparent, and community-set.
          </p>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: '600' }}>
              How Credits Work:
            </h3>
            <ul style={{ color: '#4B5563', lineHeight: '1.7', paddingLeft: '24px', listStyleType: 'disc' }}>
              <li style={{ marginBottom: '12px' }}>
                Users can optionally assign credit values to their skills (e.g., "Sourdough workshop: 3 credits")
              </li>
              <li style={{ marginBottom: '12px' }}>
                The system can help match exchanges based on credit balance (e.g., "3-credit workshop for 3-credit bike repair")
              </li>
              <li style={{ marginBottom: '12px' }}>
                Credits are never required, never charged, and never purchased
              </li>
              <li>
                They're simply a way to say "this skill typically takes X hours" or "this exchange feels balanced at Y credits"
              </li>
            </ul>
          </div>

          <div>
            <h3 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: '600' }}>
              Direct Swaps Preferred:
            </h3>
            <p style={{ color: '#4B5563', lineHeight: '1.7' }}>
              The platform actively encourages direct swaps over credits. UI copy, matching algorithms, and community norms all favor the simplicity of "I'll teach you X, you teach me Y." Credits are a fallback for complex multi-person exchanges, not the primary mode.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
