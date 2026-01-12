# Style Guide Comments Added ✅

## Summary

Added `STYLE_GUIDE.md` and design comments to all key files to ensure consistent design across all future Cursor edits.

## Files Created

- ✅ `STYLE_GUIDE.md` - Top-level 10-bullet summary of design principles

## Files Updated with Design Comments

### Pages (All)
- ✅ `app/page.tsx` - Landing page
- ✅ `app/about/page.tsx` - About page
- ✅ `app/explore/page.tsx` - Explore map page
- ✅ `app/dabble/signup/page.tsx` - Signup page
- ✅ `app/dabble/signin/page.tsx` - Signin page
- ✅ `app/profile/page.tsx` - Profile page
- ✅ `app/profile/setup/page.tsx` - Profile setup page
- ✅ `app/profile/[username]/page.tsx` - Profile view page
- ✅ `app/debug/routes/page.tsx` - Debug routes page
- ✅ `app/debug/supabase/page.tsx` - Debug Supabase page
- ✅ `app/debug/auth/page.tsx` - Debug auth page

### Layout & Error Pages
- ✅ `app/layout.tsx` - Root layout
- ✅ `app/error.tsx` - Error boundary
- ✅ `app/global-error.tsx` - Global error boundary

### Key Components (with "Follow STYLE_GUIDE.md" note)
- ✅ `app/components/Header.tsx` - Main header component
- ✅ `app/components/ProfileCompleteBanner.tsx` - Profile banner
- ✅ `app/components/CategoryMultiSelect.tsx` - Category selector
- ✅ `app/components/SkillSelector.tsx` - Skill selector

### Other Components
- ✅ `app/components/DevOverlay.tsx` - Dev overlay

## Comment Format

### All Files
```typescript
// Design: minimal, editorial, calm. No loud colors. No marketplace language.
```

### Key Components (UI-heavy)
```typescript
// Follow STYLE_GUIDE.md for any UI changes.
// Design: minimal, editorial, calm. No loud colors. No marketplace language.
```

## STYLE_GUIDE.md Summary

The guide contains 10 core design rules covering:
1. Minimal & Calm principles
2. Editorial feel with serif fonts
3. Warm color palette
4. No loud colors
5. 4px spacing system
6. Button styles (primary/secondary)
7. Cards & forms styling
8. Typography scale
9. Language & tone rules (anti-marketplace, anti-hustle)
10. Accessibility requirements

## Impact

All future Cursor edits will see these comments at the top of files, ensuring:
- Consistent design approach
- No marketplace/hustle language
- Calm, minimal aesthetic maintained
- Proper spacing and typography
- Warm color palette respected

## Verification

- ✅ No linter errors
- ✅ All main pages have design comments
- ✅ Key components have "Follow STYLE_GUIDE.md" note
- ✅ STYLE_GUIDE.md is concise and actionable

