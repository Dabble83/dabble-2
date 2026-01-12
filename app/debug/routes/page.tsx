// Follow STYLE_GUIDE.md for any UI changes.
// Design: minimal, editorial, calm. No loud colors. No marketplace language.
'use client'

import Link from 'next/link'

export default function DebugRoutesPage() {
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: '#1F2A37' }}>
            Not Available
          </h1>
          <p style={{ color: '#4B5563' }}>
            This page is only available in development mode.
          </p>
        </div>
      </div>
    )
  }

  const routes = [
    { path: '/', title: 'Landing Page', description: 'Home page with product introduction' },
    { path: '/about', title: 'About', description: 'Product philosophy and how it works' },
    { path: '/explore', title: 'Explore', description: 'Map-based discovery of nearby dabblers' },
    { path: '/dabble/signup', title: 'Sign Up', description: 'User registration form' },
    { path: '/dabble/signin', title: 'Sign In', description: 'User authentication form' },
    { path: '/profile/setup', title: 'Profile Setup', description: 'Multi-step profile completion (placeholder)' },
    { path: '/profile/[username]', title: 'Profile View', description: 'Public profile view (placeholder)' },
    { path: '/debug/routes', title: 'Debug Routes', description: 'This page - list of all routes' },
  ]

  return (
    <div className="w-full">
      <div className="max-w-800px mx-auto px-6 py-16" style={{ 
        maxWidth: '800px',
        paddingTop: '64px',
        paddingBottom: '64px'
      }}>
        <h1 style={{ marginBottom: '16px' }}>
          Debug: Routes
        </h1>
        <p style={{ 
          fontSize: '18px',
          lineHeight: '1.7',
          color: '#4B5563',
          marginBottom: '32px'
        }}>
          List of all available routes for testing and development.
        </p>

        <div className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {routes.map((route) => (
            <div key={route.path} className="card" style={{ padding: '24px' }}>
              <Link 
                href={route.path === '/profile/[username]' ? '/profile/testuser' : route.path}
                className="link-primary"
                style={{ fontSize: '18px', fontWeight: '600', display: 'block', marginBottom: '8px' }}
              >
                {route.title}
              </Link>
              <code className="text-sm" style={{ 
                fontSize: '14px',
                color: '#6B7280',
                fontFamily: 'monospace',
                display: 'block',
                marginBottom: '8px'
              }}>
                {route.path}
              </code>
              <p style={{ 
                fontSize: '14px',
                color: '#6B7280',
                margin: 0
              }}>
                {route.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 rounded-lg" style={{ 
          marginTop: '32px',
          padding: '16px',
          backgroundColor: '#FEF3C7',
          border: '1px solid #FCD34D',
          borderRadius: '8px'
        }}>
          <p style={{ 
            fontSize: '14px',
            color: '#92400E',
            margin: 0
          }}>
            <strong>Development Mode:</strong> This page is only visible when <code style={{ fontFamily: 'monospace' }}>NODE_ENV=development</code>
          </p>
        </div>
      </div>
    </div>
  )
}
