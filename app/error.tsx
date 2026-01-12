// Follow STYLE_GUIDE.md for any UI changes.
// Design: minimal, editorial, calm. No loud colors. No marketplace language.
'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught:', error)
      console.error('Stack:', error.stack)
    }
  }, [error])

  const isDev = process.env.NODE_ENV === 'development'

  return (
    <div style={{ 
      fontFamily: 'system-ui, sans-serif',
      padding: '40px',
      backgroundColor: '#f6f1e8',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '16px', color: '#1F2A37' }}>
          Something went wrong
        </h1>
        <div style={{ 
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          marginBottom: '24px',
          border: '1px solid #e5e7eb'
        }}>
          <p style={{ color: '#DC2626', marginBottom: '16px', fontWeight: '600' }}>
            {error.message || 'An unexpected error occurred'}
          </p>
          {isDev && error.stack && (
            <details style={{ marginTop: '16px' }}>
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
                maxHeight: '400px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {error.stack}
              </pre>
            </details>
          )}
          {error.digest && (
            <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '12px' }}>
              Error ID: {error.digest}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            className="btn-primary"
            style={{
              padding: '12px 24px',
              fontSize: '16px'
            }}
          >
            Try again
          </button>
          <Link
            href="/"
            className="btn-secondary"
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            Go home
          </Link>
          {isDev && (
            <Link
              href="/debug/routes"
              className="btn-secondary"
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              Debug Routes
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
