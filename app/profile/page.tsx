// Follow STYLE_GUIDE.md for any UI changes.
// Design: minimal, editorial, calm. No loud colors. No marketplace language.
export default function ProfilePage() {
  return (
    <div className="w-full">
      <div className="max-w-800px mx-auto px-6 py-16" style={{ 
        maxWidth: '800px',
        paddingTop: '64px',
        paddingBottom: '64px'
      }}>
        <h1 style={{ marginBottom: '16px' }}>
          Profile
        </h1>
        <p style={{ 
          fontSize: '18px',
          lineHeight: '1.7',
          color: '#4B5563',
          marginBottom: '32px'
        }}>
          Profile redirect page. This will redirect to your profile page or setup page based on authentication status.
        </p>
        <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
          <p style={{ color: '#6B7280', marginBottom: '16px' }}>
            Profile redirect functionality will be implemented with Supabase authentication integration.
          </p>
          <div className="flex gap-4 justify-center" style={{ gap: '16px', marginTop: '24px' }}>
            <a
              href="/profile/setup"
              className="btn-primary"
              style={{ textDecoration: 'none' }}
            >
              Go to Profile Setup
            </a>
            <a
              href="/dabble/signin"
              className="btn-secondary"
              style={{ textDecoration: 'none' }}
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
