/**
 * Render Counter Hook
 * Warns in dev console if component renders > 50 times in 2 seconds
 * Helps detect infinite render loops
 */

import { useEffect, useRef } from 'react'

export function useRenderCounter(componentName: string) {
  const renderCountRef = useRef(0)
  const renderTimesRef = useRef<number[]>([])
  const warnedRef = useRef(false)

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return
    }

    const now = Date.now()
    renderCountRef.current += 1
    renderTimesRef.current.push(now)

    // Keep only renders from last 2 seconds
    renderTimesRef.current = renderTimesRef.current.filter(
      time => now - time < 2000
    )

    const recentRenderCount = renderTimesRef.current.length

    // Warn if > 50 renders in 2 seconds (only warn once per component)
    if (recentRenderCount > 50 && !warnedRef.current) {
      warnedRef.current = true
      console.group(`%c⚠️ INFINITE RENDER LOOP DETECTED: ${componentName}`, 
        'color: #DC2626; font-weight: bold; font-size: 14px; background: #FEE2E2; padding: 4px 8px; border-radius: 4px;')
      console.error(`Component "${componentName}" has rendered ${recentRenderCount} times in the last 2 seconds.`)
      console.error('This indicates a potential infinite render loop.')
      console.error('Common causes:')
      console.error('  1. useEffect without proper dependency array')
      console.error('  2. setState called during render')
      console.error('  3. State derived from itself')
      console.error('  4. router.push in render without guards')
      console.trace()
      console.groupEnd()
    }

    // Reset warning after 5 seconds if render count drops
    if (recentRenderCount <= 10 && warnedRef.current) {
      setTimeout(() => {
        if (renderTimesRef.current.filter(t => Date.now() - t < 2000).length <= 10) {
          warnedRef.current = false
        }
      }, 5000)
    }
  })
}


