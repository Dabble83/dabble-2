import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Community Guidelines — Dabble',
  description: 'The values and rules that keep the Dabble community respectful, safe, and fun.',
}

const sections = [
  {
    heading: 'Be genuine',
    body: 'List only skills you actually have. Guides who misrepresent themselves are removed. Honest profiles build better sessions.',
  },
  {
    heading: 'Respect everyone',
    body: 'Dabble is for everyone. Discrimination based on age, race, gender, sexuality, disability, or religion is not tolerated and will result in immediate removal.',
  },
  {
    heading: 'Keep it safe',
    body: 'Sessions should take place in appropriate settings. For your first session with a new person, we recommend a public place. Follow our safety tiers for guidance.',
  },
  {
    heading: 'No soliciting',
    body: 'Dabble is not a marketplace. Guides may not solicit outside work, sell products, or recruit members into other services during sessions.',
  },
  {
    heading: 'Protect privacy',
    body: 'Do not record sessions without consent. Do not share personal details about learners or guides you meet on Dabble.',
  },
  {
    heading: 'Show up',
    body: 'Repeated cancellations or no-shows hurt the community. If something comes up, cancel early. Consistent no-shows will limit your ability to schedule sessions.',
  },
]

export default function GuidelinesPage() {
  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '64px 24px 80px' }}>
      <header style={{ marginBottom: '48px' }}>
        <p style={{ fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B7280', marginBottom: '12px' }}>
          Community Guidelines
        </p>
        <h1 style={{ marginBottom: '20px' }}>How we treat each other</h1>
        <p style={{ fontSize: '18px', lineHeight: '1.7', color: '#374151', maxWidth: '60ch' }}>
          Dabble works because people show up honestly and treat each other well.
          These guidelines aren&apos;t rules for rules&apos; sake — they&apos;re the things
          that make every session better.
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {sections.map((section, i) => (
          <section
            key={section.heading}
            style={{
              padding: '32px 0',
              borderTop: i === 0 ? '1px solid #E5E7EB' : '1px solid #E5E7EB',
              display: 'grid',
              gridTemplateColumns: '1fr 2fr',
              gap: '24px',
              alignItems: 'start',
            }}
          >
            <h2 style={{ fontSize: '1.1rem', margin: 0 }}>{section.heading}</h2>
            <p style={{ color: '#6B7280', lineHeight: '1.7', margin: 0 }}>{section.body}</p>
          </section>
        ))}
        <div style={{ borderTop: '1px solid #E5E7EB' }} />
      </div>

      <section style={{ marginTop: '64px' }}>
        <h2 style={{ marginBottom: '16px' }}>Enforcement</h2>
        <p style={{ color: '#6B7280', lineHeight: '1.7', marginBottom: '16px' }}>
          Violations are reviewed case by case. Consequences range from a warning to permanent removal,
          depending on severity. We err on the side of protecting learners.
        </p>
        <p style={{ color: '#6B7280', lineHeight: '1.7' }}>
          To report a violation, use the flag button in any session or profile. For urgent concerns,{' '}
          <Link href="/about" style={{ color: '#2d5016', fontWeight: '600' }}>contact us directly</Link>.
        </p>
      </section>

      <footer style={{ borderTop: '1px solid #E5E7EB', paddingTop: '32px', marginTop: '64px' }}>
        <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '12px' }}>
          Also worth reading
        </p>
        <div style={{ display: 'flex', gap: '24px' }}>
          <Link href="/safety" style={{ fontSize: '14px', color: '#2d5016', fontWeight: '600', textDecoration: 'none' }}>
            Safety & Trust →
          </Link>
          <Link href="/about" style={{ fontSize: '14px', color: '#2d5016', fontWeight: '600', textDecoration: 'none' }}>
            About Dabble →
          </Link>
        </div>
      </footer>
    </div>
  )
}
