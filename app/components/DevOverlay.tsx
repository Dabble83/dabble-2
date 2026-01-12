// Follow STYLE_GUIDE.md for any UI changes.
// Design: minimal, editorial, calm. No loud colors. No marketplace language.
'use client'

import { useState, useEffect } from 'react'
import { useRenderCounter } from '@/src/hooks/useRenderCounter'

/**
 * Dev Overlay - Shows diagnostic info and errors in development
 * 
 * CRITICAL: This overlay MUST work even if usePathname fails.
 * It catches unhandled errors and displays them visibly in the UI.
 * 
 * Features:
 * - Shows current pathname (with fallback if it fails)
 * - Shows SAFE_MODE status
 * - Catches and displays unhandled JavaScript errors
 * - Catches and displays unhandled promise rejections
 * - Always visible in development, never blocks production
 */
export function DevOverlay() {
  // Render counter to detect infinite loops (only active in dev)
  useRenderCounter('DevOverlay')

  const [pathname, setPathname] = useState<string>('/')
  const [lastError, setLastError] = useState<string | null>(null)
  const [errorCount, setErrorCount] = useState(0)
  const safeMode = process.env.NEXT_PUBLIC_SAFE_MODE !== 'false'

  useEffect(() => {
    // Try to get pathname, but don't fail if it doesn't work
    try {
      // Use window.location as fallback if usePathname isn't available
      setPathname(window.location.pathname)
      
      // Listen for navigation changes
      const handlePopState = () => {
        setPathname(window.location.pathname)
      }
      window.addEventListener('popstate', handlePopState)
      return () => window.removeEventListener('popstate', handlePopState)
    } catch (err) {
      // If pathname detection fails, just use '/'
      setPathname('/')
    }
  }, [])

  useEffect(() => {
    // CRITICAL: Catch ALL unhandled errors and display them
    const handleError = (event: ErrorEvent) => {
      const errorMsg = event.message || 'Unknown error'
      setLastError(errorMsg)
      setErrorCount(prev => prev + 1)
      console.error('🚨 Unhandled error caught by DevOverlay:', event.error)
    }

    const handleRejection = (event: PromiseRejectionEvent) => {
      const errorMsg = event.reason?.message || String(event.reason) || 'Unhandled promise rejection'
      setLastError(errorMsg)
      setErrorCount(prev => prev + 1)
      console.error('🚨 Unhandled promise rejection caught by DevOverlay:', event.reason)
    }

    // Also catch React errors that might not be caught by error boundaries
    const originalConsoleError = console.error
    console.error = (...args: any[]) => {
      originalConsoleError.apply(console, args)
      
      // Check if it looks like an error message
      const errorString = args.join(' ')
      if (errorString.includes('Error:') || errorString.includes('at ')) {
        setLastError(errorString.substring(0, 200))
        setErrorCount(prev => prev + 1)
      }
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleRejection)
      console.error = originalConsoleError
    }
  }, [])

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: '#fff',
        padding: '10px 16px',
        fontSize: '11px',
        fontFamily: 'monospace',
        zIndex: 99999,
        borderTop: '2px solid #dc2626',
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        flexWrap: 'wrap',
        maxHeight: '150px',
        overflow: 'auto'
      }}
    >
      <span style={{ whiteSpace: 'nowrap' }}>
        <strong style={{ color: '#60a5fa' }}>Path:</strong>{' '}
        <span style={{ color: '#fbbf24' }}>{pathname}</span>
      </span>
      
      <span style={{ whiteSpace: 'nowrap' }}>
        <strong style={{ color: '#60a5fa' }}>SAFE_MODE:</strong>{' '}
        <span style={{ color: safeMode ? '#34d399' : '#f87171' }}>
          {safeMode ? '✅ ON' : '❌ OFF'}
        </span>
      </span>
      
      {errorCount > 0 && (
        <span style={{ whiteSpace: 'nowrap' }}>
          <strong style={{ color: '#60a5fa' }}>Errors:</strong>{' '}
          <span style={{ 
            color: '#f87171',
            backgroundColor: 'rgba(248, 113, 113, 0.2)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}>
            {errorCount}
          </span>
        </span>
      )}
      
      {lastError && (
        <span style={{ 
          flex: '1',
          minWidth: '200px',
          color: '#fca5a5',
          backgroundColor: 'rgba(220, 38, 38, 0.2)',
          padding: '4px 8px',
          borderRadius: '4px',
          border: '1px solid #dc2626'
        }}>
          <strong style={{ color: '#f87171' }}>Last Error:</strong>{' '}
          <span style={{ wordBreak: 'break-word' }}>
            {lastError.length > 150 ? `${lastError.substring(0, 150)}...` : lastError}
          </span>
        </span>
      )}
      
      {!lastError && (
        <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>
          No errors detected
        </span>
      )}
      
      <button
        onClick={() => {
          setLastError(null)
          setErrorCount(0)
        }}
        style={{
          padding: '4px 8px',
          backgroundColor: 'rgba(107, 114, 128, 0.3)',
          color: '#fff',
          border: '1px solid #6b7280',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '10px',
          whiteSpace: 'nowrap'
        }}
        title="Clear error log"
      >
        Clear
      </button>
    </div>
  )
}
