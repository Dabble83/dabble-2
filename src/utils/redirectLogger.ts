/**
 * Redirect Logger - Logs all redirect attempts in development
 * Helps identify redirect loops and automatic redirects
 */

export function logRedirect(
  from: string,
  to: string,
  reason: string,
  userInitiated: boolean = false
) {
  if (process.env.NODE_ENV === 'development') {
    const timestamp = new Date().toISOString()
    const style = userInitiated 
      ? 'color: #10B981; font-weight: bold;' // Green for user-initiated
      : 'color: #EF4444; font-weight: bold;' // Red for automatic
    
    console.group(`%c🔀 Redirect ${userInitiated ? '(User Clicked)' : '(AUTOMATIC)'}`, style)
    console.log(`From: ${from}`)
    console.log(`To: ${to}`)
    console.log(`Reason: ${reason}`)
    console.log(`Timestamp: ${timestamp}`)
    console.log(`Stack trace:`)
    console.trace()
    console.groupEnd()
  }
}


