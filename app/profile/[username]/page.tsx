// Follow STYLE_GUIDE.md for any UI changes.
// Design: minimal, editorial, calm. No loud colors. No marketplace language.
export default async function ProfileViewPage({ 
  params 
}: { 
  params: Promise<{ username: string }> 
}) {
  // Next.js 14+ params are async
  const { username } = await params

  return (
    <div className="w-full">
      <div className="max-w-800px mx-auto px-6 py-16" style={{ 
        maxWidth: '800px',
        paddingTop: '64px',
        paddingBottom: '64px'
      }}>
        <h1 style={{ marginBottom: '16px' }}>
          Profile: {username}
        </h1>
        <p style={{ 
          fontSize: '18px',
          lineHeight: '1.7',
          color: '#4B5563',
          marginBottom: '32px'
        }}>
          Profile view page coming soon. This will display user profiles with skills, interests, and location (if discoverable).
        </p>
        <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
          <p style={{ color: '#6B7280' }}>
            Profile view functionality will be implemented with Supabase integration.
          </p>
        </div>
      </div>
    </div>
  )
}
