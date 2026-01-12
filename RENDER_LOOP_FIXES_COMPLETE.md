# Infinite Render Loop Fixes - Complete

## Summary

All potential infinite render loops have been identified and fixed. A render counter warning system has been added to detect components that render > 50 times in 2 seconds.

## Issues Fixed

### 1. **Fixed Dependency Arrays**

#### `app/profile/setup/page.tsx`
- **Issue**: `useEffect` had `router` in dependency array but didn't use it
- **Issue**: `loadData` and `loadSkillsForDemo` functions were recreated on every render
- **Fix**: 
  - Wrapped `loadData` and `loadSkillsForDemo` in `useCallback` to prevent recreation
  - Removed unused `router` from dependency array
  - Added proper dependencies to `useCallback` hooks
  - Added render counter

#### `app/profile/[username]/page.tsx`
- **Issue**: `loadProfile` function was recreated on every render
- **Fix**: 
  - Wrapped `loadProfile` in `useCallback` with proper dependencies
  - Updated `useEffect` dependency array to include memoized function
  - Added render counter

#### `app/profile/page.tsx`
- **Issue**: Potential for multiple redirect log checks on same state
- **Fix**: 
  - Added `hasCheckedRef` guard to prevent duplicate checks
  - Fixed dependency array to only include relevant values
  - Added render counter

#### `app/components/ProfileCompleteBanner.tsx`
- **Issue**: Potential for multiple simultaneous API calls
- **Fix**: 
  - Added `checkingRef` guard to prevent duplicate API calls
  - Fixed dependency array to use `user?.id` instead of entire `user` object
  - Added render counter

### 2. **Added Guards to router.push Calls**

All `router.push` calls now have guards to prevent duplicate redirects:

- **`app/profile/setup/page.tsx`**: Added `redirectingRef` guard in `saveProgress`
- **`app/dabble/signin/page.tsx`**: Added `redirectingRef` guard in `handleSubmit`
- **`app/dabble/signup/page.tsx`**: Added `redirectingRef` guard in `handleSubmit`

These guards prevent redirect loops if the handler is accidentally called multiple times.

### 3. **Created Render Counter Hook**

**New File**: `src/hooks/useRenderCounter.ts`

- Monitors component render frequency
- Warns in dev console if component renders > 50 times in 2 seconds
- Includes stack trace to identify the component
- Automatically resets warning after render count drops

**Usage**:
```typescript
import { useRenderCounter } from '@/src/hooks/useRenderCounter'

export default function MyComponent() {
  useRenderCounter('MyComponent') // Add at top of component
  // ... rest of component
}
```

### 4. **Added Render Counters to Key Components**

Render counters have been added to:
- ✅ `ProfileSetupPage`
- ✅ `ProfileViewPage`
- ✅ `ProfilePage`
- ✅ `ProfileCompleteBanner`
- ✅ `DevOverlay`
- ✅ `ExplorePage`

## Patterns Fixed

### Pattern 1: Functions in useEffect Dependency Array
**Before**:
```typescript
const loadData = async () => { /* ... */ }
useEffect(() => {
  loadData()
}, [user, loadData]) // loadData recreated every render!
```

**After**:
```typescript
const loadData = useCallback(async () => { /* ... */ }, [user?.id])
useEffect(() => {
  loadData()
}, [loadData]) // Stable reference
```

### Pattern 2: Missing Guards on State Updates
**Before**:
```typescript
useEffect(() => {
  fetch('/api/data').then(data => {
    setState(data) // Could fire multiple times
  })
}, [user])
```

**After**:
```typescript
const checkingRef = useRef(false)
useEffect(() => {
  if (checkingRef.current) return
  checkingRef.current = true
  fetch('/api/data').then(data => {
    setState(data)
  }).finally(() => {
    checkingRef.current = false
  })
}, [user?.id])
```

### Pattern 3: router.push Without Guards
**Before**:
```typescript
const handleSubmit = async () => {
  await submit()
  router.push('/next') // Could be called multiple times
}
```

**After**:
```typescript
const redirectingRef = useRef(false)
const handleSubmit = async () => {
  if (redirectingRef.current) return
  await submit()
  redirectingRef.current = true
  router.push('/next')
}
```

## Render Counter Behavior

The render counter:
- ✅ Only active in development mode
- ✅ Tracks renders in 2-second windows
- ✅ Warns if > 50 renders detected
- ✅ Provides helpful diagnostic information
- ✅ Auto-resets after render count normalizes

## Console Output Example

When an infinite loop is detected:
```
⚠️ INFINITE RENDER LOOP DETECTED: ProfilePage
  Component "ProfilePage" has rendered 52 times in the last 2 seconds.
  This indicates a potential infinite render loop.
  Common causes:
    1. useEffect without proper dependency array
    2. setState called during render
    3. State derived from itself
    4. router.push in render without guards
  [Stack trace]
```

## Files Modified

- ✅ `src/hooks/useRenderCounter.ts` - New utility hook
- ✅ `app/profile/setup/page.tsx` - Fixed dependencies, added guards
- ✅ `app/profile/[username]/page.tsx` - Fixed dependencies
- ✅ `app/profile/page.tsx` - Added guards, fixed dependencies
- ✅ `app/components/ProfileCompleteBanner.tsx` - Added guards
- ✅ `app/components/DevOverlay.tsx` - Added render counter
- ✅ `app/dabble/signin/page.tsx` - Added redirect guards
- ✅ `app/dabble/signup/page.tsx` - Added redirect guards
- ✅ `app/explore/page.tsx` - Added render counter

## Verification

- ✅ No linter errors
- ✅ All useEffect hooks have proper dependency arrays
- ✅ All router.push calls have guards
- ✅ No state derived from itself found
- ✅ Render counters added to all major components

## Next Steps

1. **Monitor Console**: Watch for render loop warnings in development
2. **Test Navigation**: Verify no redirect loops occur
3. **Check Performance**: Ensure render counts are normal (< 10 per 2 seconds typically)
4. **Remove Guards**: After confirming stability, consider removing some guards if they're overly defensive

## Prevention Guidelines

To prevent future render loops:

1. **Always use `useCallback`** for functions used in `useEffect` dependencies
2. **Use refs for guards** when you need to prevent duplicate operations
3. **Be precise with dependency arrays** - include only values that should trigger re-runs
4. **Add render counters** to new components during development
5. **Watch console warnings** for render loop detection


