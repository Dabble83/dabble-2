# Profile Builder - Quick Summary

## What We're Building

A guided profile builder that appears after signup, helping users:
1. Upload a profile picture
2. Select hobbies/skills from 3 categories (Adventure, Hobbies & Creative, Home Improvement)
3. Use AI to generate profile summary and suggestions
4. Complete their profile before exploring

## Key Changes

### 1. Post-Signup Flow
- **Current**: Signup → `/profile/setup`
- **New**: Signup → `/profile` (new builder page)

### 2. New Page: `/app/profile/page.tsx`
Main profile builder with:
- Profile picture upload
- 3 category-based skill selectors
- OpenAI widget for profile completion
- Save functionality

### 3. New Components
- `ProfilePictureUpload.tsx` - Image upload with preview
- `CategorySkillSelector.tsx` - Dropdown for skills by category
- `ProfileAIWidget.tsx` - AI-powered suggestions widget

### 4. Enhanced Explore Page
- Better InfoWindow popups on map markers
- Profile picture in popup
- Link to full profile

## Implementation Phases

**Phase 1**: Core builder page + picture upload + category selectors
**Phase 2**: OpenAI integration widget
**Phase 3**: Save functionality + signup redirect
**Phase 4**: Polish + edge cases

## Data Flow

```
User Signs Up
    ↓
Redirect to /profile
    ↓
Load existing profile (if any)
    ↓
User uploads picture
User selects skills by category
User describes themselves → AI generates suggestions
    ↓
User applies suggestions
    ↓
Save profile → Redirect to profile view
```

## API Endpoints Used

- `/api/upload/profile-image` - Upload picture (exists)
- `/api/ai/profile-suggestions` - Get AI suggestions (exists, needs enhancement)
- `/api/profile/update` - Save profile (exists)
- `/api/skills/by-category` - Get skills by category (new)

## UI Layout

```
┌─────────────────────────────────┐
│ Complete Your Profile          │
├─────────────────────────────────┤
│ [Profile Picture Upload]       │
├─────────────────────────────────┤
│ Adventure Skills               │
│ [Dropdown selector]            │
├─────────────────────────────────┤
│ Hobbies & Creative Skills      │
│ [Dropdown selector]            │
├─────────────────────────────────┤
│ Home Improvement Skills         │
│ [Dropdown selector]            │
├─────────────────────────────────┤
│ AI Profile Helper              │
│ [Describe yourself...]         │
│ [Generate Suggestions]          │
├─────────────────────────────────┤
│ [Save Profile]                 │
└─────────────────────────────────┘
```

## Next Steps

1. Review the detailed plan in `PROFILE_BUILDER_PLAN.md`
2. Approve approach
3. Begin Phase 1 implementation
