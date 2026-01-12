// Follow STYLE_GUIDE.md for any UI changes.
// Design: minimal, editorial, calm. No loud colors. No marketplace language.
'use client'

import { useState, useEffect } from 'react'

/**
 * Debug Health Check Page - Tests API connectivity
 * Always renders, never crashes
 */
export default function DebugHealthPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Test API call - only runs on client
    fetch('/api/debug/ping')
      .then(res => res.json())
      .then(json => {
        setData(json)
        setStatus('success')
      })
      .catch(err => {
        setError(err.message)
        setStatus('error')
      })
  }, [])

  return (
    <div style={{
      padding: '40px',
      fontFamily: 'system-ui, sans-serif',
      backgroundColor: '#f6f1e8',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '8px', color: '#1F2A37' }}>
          Debug: Health Check
        </h1>
        <p style={{ color: '#6B7280', marginBottom: '32px' }}>
          Testing API route connectivity...
        </p>

        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          {status === 'loading' && (
            <p style={{ color: '#6B7280' }}>⏳ Loading...</p>
          )}

          {status === 'success' && data && (
            <div>
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#D1FAE5', 
                borderRadius: '6px',
                marginBottom: '16px',
                border: '1px solid #10B981'
              }}>
                <p style={{ color: '#065F46', fontWeight: '600', margin: 0 }}>
                  ✅ API is responding
                </p>
              </div>
              <pre style={{
                fontSize: '13px',
                backgroundColor: '#f9fafb',
                padding: '16px',
                borderRadius: '6px',
                overflow: 'auto',
                color: '#374151'
              }}>
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}

          {status === 'error' && (
            <div style={{
              padding: '12px',
              backgroundColor: '#FEE2E2',
              borderRadius: '6px',
              border: '1px solid #EF4444'
            }}>
              <p style={{ color: '#991B1B', fontWeight: '600', margin: '0 0 8px 0' }}>
                ❌ API call failed
              </p>
              <p style={{ color: '#991B1B', fontSize: '14px', margin: 0 }}>
                {error || 'Unknown error'}
              </p>
            </div>
          )}
        </div>

        <div style={{ marginTop: '24px' }}>
          <button
            onClick={() => {
              setStatus('loading')
              fetch('/api/debug/ping')
                .then(res => res.json())
                .then(json => {
                  setData(json)
                  setStatus('success')
                  setError(null)
                })
                .catch(err => {
                  setError(err.message)
                  setStatus('error')
                  setData(null)
                })
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#7A8F6A',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Retry Test
          </button>
        </div>
      </div>
    </div>
  )
}


