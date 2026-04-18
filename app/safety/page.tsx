import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Safety & Trust — Dabble',
  description: 'How Dabble keeps the community safe and builds trust between learners and guides.',
}

const tiers = [
  {
    level: 'Tier 1',
    label: 'New Guide',
    description: 'Profile verified with email and bio. Visible in Explore with a "New" badge.',
    checks: ['Email verified', 'Profile photo', 'Bio complete'],
  },
  {
    level: 'Tier 2',
    label: 'Trusted Guide',
    description: 'Has completed at least 3 sessions with 4.5+ average rating.',
    checks: ['3+ sessions completed', '4.5+ average rating', 'No safety flags'],
  },
  {
    level: 'Tier 3',
    label: 'Community Pillar',
    description: 'Long-standing guide with 20+ sessions and community endorsements.',
    checks: ['20+ sessions', 'Community endorsements', 'Consistent 5-star sessions'],
  },
]

export default function SafetyPage() {
  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '64px 24px 80px' }}>
      <header style={{ marginBottom: '48px' }}>
        <p style={{ fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B7280', marginBottom: '12px' }}>
          Safety & Trust
        </p>
        <h1 style={{ marginBottom: '20px' }}>How we keep Dabble safe</h1>
        <p style={{ fontSize: '18px', lineHeight: '1.7', color: '#374151', maxWidth: '60ch' }}>
          Dabble is built on trust between learners and guides. Here&apos;s how we verify guides,
          protect the community, and give you confidence every time you dabble with someone new.
        </p>
      </header>

      <section style={{ marginBottom: '64px' }}>
        <h2 style={{ marginBottom: '8px' }}>Our tiered trust framework</h2>
        <p style={{ color: '#6B7280', marginBottom: '32px' }}>
          Every guide earns their level through real activity and community feedback.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {tiers.map((tier) => (
            <div
              key={tier.level}
              style={{
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                padding: '28px',
                background: '#FAFAF8',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9CA3AF' }}>
                  {tier.level}
                </span>
                <h3 style={{ margin: 0 }}>{tier.label}</h3>
              </div>
              <p style={{ color: '#6B7280', marginBottom: '16px' }}>{tier.description}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {tier.checks.map((check) => (
                  <li key={check} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151' }}>
                    <span style={{ color: '#2d5016', fontWeight: '600' }}>✓</span>
                    {check}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '64px' }}>
        <h2 style={{ marginBottom: '24px' }}>Community reporting</h2>
        <p style={{ color: '#6B7280', lineHeight: '1.7' }}>
          Every session includes a simple, anonymous way to flag concerns. Reports are reviewed within 24 hours.
          Guides with unresolved flags are hidden from Explore until the issue is resolved.
        </p>
      </section>

      <section style={{ marginBottom: '64px' }}>
        <h2 style={{ marginBottom: '24px' }}>Our commitments</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            'We never share your personal contact info with guides.',
            'First sessions can always be held in public spaces.',
            'You can cancel any session up to 2 hours before, no questions asked.',
            'Guides are never allowed to charge outside the Dabble platform.',
          ].map((item) => (
            <li key={item} style={{ display: 'flex', gap: '12px', fontSize: '15px', color: '#374151', lineHeight: '1.6' }}>
              <span style={{ color: '#2d5016', fontWeight: '600', flexShrink: 0 }}>—</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <footer style={{ borderTop: '1px solid #E5E7EB', paddingTop: '32px' }}>
        <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '12px' }}>
          Have a safety concern right now?
        </p>
        <Link
          href="/about"
          style={{ fontSize: '14px', color: '#2d5016', fontWeight: '600', textDecoration: 'none' }}
        >
          Contact us →
        </Link>
      </footer>
    </div>
  )
}
