// Follow STYLE_GUIDE.md for any UI changes.
// Design: minimal, editorial, calm. No loud colors. No marketplace language.
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const isDev = process.env.NODE_ENV === 'development'

  return (
    <html lang="en">
      <body>
        <div style={{ 
          padding: '40px',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
          backgroundColor: '#f6f1e8',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <h1 style={{ fontSize: '32px', marginBottom: '16px', color: '#DC2626' }}>
            Application Error
          </h1>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            maxWidth: '600px',
            marginBottom: '24px',
            border: '2px solid #DC2626'
          }}>
            <p style={{ color: '#1F2A37', marginBottom: '16px', fontSize: '18px' }}>
              {error.message || 'A critical error occurred'}
            </p>
            {isDev && error.stack && (
              <details style={{ marginTop: '16px', textAlign: 'left' }}>
                <summary style={{ cursor: 'pointer', color: '#6B7280', marginBottom: '8px' }}>
                  Stack Trace (dev only)
                </summary>
                <pre style={{ 
                  fontSize: '11px',
                  color: '#DC2626',
                  overflow: 'auto',
                  backgroundColor: '#fef2f2',
                  padding: '12px',
                  borderRadius: '4px',
                  maxHeight: '300px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
          <button
            onClick={reset}
            style={{
              padding: '12px 24px',
              backgroundColor: '#7A8F6A',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
