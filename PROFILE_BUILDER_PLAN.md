# Profile Builder Feature - Implementation Plan

## Overview
Create a guided profile builder that helps users complete their profile after signup with interests, skills, intro, and profile picture. This will replace the current `/profile/setup` page as the post-signup destination.

## User Flow

### 1. Post-Signup Redirect
- **Current**: Signup redirects to `/profile/setup`
- **New**: Signup redirects to `/profile` (new "My Profile" page)
- **Location**: Update `app/dabble/signup/page.tsx` line 102

### 2. My Profile Page (`/app/profile/page.tsx`)
This will be the main profile builder page with:
- Profile picture upload section
- Category-based hobby/skill selectors (3 categories)
- OpenAI-powered profile completion widget
- Save/complete functionality

### 3. Explore Page Integration
- Enhance existing InfoWindow popup on map markers
- Add link to full profile view
- Ensure hover behavior works smoothly

---

## Component Architecture

### New/Modified Pages

#### 1. `/app/profile/page.tsx` (NEW - Replace current redirect page)
**Purpose**: Main profile builder page for authenticated users

**Features**:
- Profile picture upload (with preview)
- Three category-based skill/hobby selectors:
  - Adventure
  - Hobbies and Creative
  - Home Improvement
- OpenAI profile completion widget
- Save profile button
- Progress indicator

**State Management**:
- Profile picture URL
- Selected skills per category
- Profile intro text
- Interests list
- Loading states for AI suggestions

#### 2. `/app/profile/setup/page.tsx` (MODIFY)
**Purpose**: Keep as advanced/optional profile settings
- Move location/discoverability settings here
- Keep as secondary profile editing page
- Accessible from main profile page

### New Components

#### 1. `app/components/ProfilePictureUpload.tsx`
**Features**:
- Drag & drop or click to upload
- Image preview
- Crop/resize functionality (optional, v1 can skip)
- Remove/replace image
- Shows placeholder if no image
- Integration with `/api/upload/profile-image`

#### 2. `app/components/CategorySkillSelector.tsx`
**Features**:
- Dropdown/multi-select for skills in a specific category
- Filters skills by category (Adventure, Creative, HomeImprovement)
- Shows selected count
- Search/filter within category (optional)
- Uses existing `SkillSelector` component as base

#### 3. `app/components/ProfileAIWidget.tsx`
**Features**:
- Text input for user to describe themselves
- "Generate suggestions" button
- Loading state during AI call
- Results display:
  - Profile intro summary (editable)
  - Suggested interests to add
  - Suggested skills to add (by category)
  - Suggested profile picture ideas
- "Apply suggestions" button (adds to form)
- "Regenerate" option

### Modified Components

#### 1. `app/explore/page.tsx` - MapsComponent
**Enhancements**:
- Ensure InfoWindow shows on hover (already implemented)
- Add "View Full Profile" link (already exists)
- Consider adding profile picture thumbnail in InfoWindow
- Smooth hover transitions

---

## API Routes

### Existing (No Changes Needed)
- ✅ `/api/upload/profile-image/route.ts` - Profile picture upload
- ✅ `/api/ai/profile-suggestions/route.ts` - OpenAI suggestions
- ✅ `/api/profile/update/route.ts` - Profile updates

### New API Routes Needed

#### 1. `/api/profile/me/route.ts` (ENHANCE)
**Purpose**: Get current user's profile data
- Check if already exists
- If exists, return full profile with skills, interests, etc.
- If not, return empty structure

#### 2. `/api/skills/by-category/route.ts` (NEW)
**Purpose**: Get skills filtered by category
- Query: `?category=Adventure|Creative|HomeImprovement`
- Returns: Array of skills with id, name, category
- Used by CategorySkillSelector components

---

## Database Schema

### Current Schema (Supabase)
- ✅ `profiles` table - has all needed fields
- ✅ `skills` table - has category field
- ✅ `profile_skills` table - links profiles to skills
- ✅ `profile_location` table - location/discoverability

### No Schema Changes Needed
The existing schema supports all requirements.

---

## Implementation Steps

### Phase 1: Core Profile Builder Page
1. **Create new `/app/profile/page.tsx`**
   - Replace current redirect page
   - Add authentication check
   - Load existing profile data if available
   - Layout with sections for:
     - Profile picture upload
     - Category selectors
     - AI widget
     - Save button

2. **Create `ProfilePictureUpload` component**
   - File upload UI
   - Integration with upload API
   - Preview functionality
   - Error handling

3. **Create `CategorySkillSelector` component**
   - Fetch skills by category from API
   - Multi-select dropdown
   - Display selected skills
   - Category filtering

### Phase 2: OpenAI Integration
4. **Enhance `ProfileAIWidget` component**
   - Text input for user description
   - Call `/api/ai/profile-suggestions`
   - Display results in organized sections
   - Apply suggestions to form state
   - Handle loading/error states

5. **Enhance `/api/ai/profile-suggestions/route.ts`**
   - Update prompt to include category information
   - Return skills organized by category
   - Include profile picture suggestions
   - Better structured response

### Phase 3: Save & Integration
6. **Implement save functionality**
   - Collect all form data
   - Call `/api/profile/update` or create new endpoint
   - Handle success/error states
   - Redirect to profile view on success

7. **Update signup redirect**
   - Change `/dabble/signup/page.tsx` to redirect to `/profile`
   - Ensure authentication state is ready

8. **Enhance Explore page popup**
   - Add profile picture to InfoWindow
   - Improve styling
   - Test hover behavior
   - Ensure link to profile works

### Phase 4: Polish & Edge Cases
9. **Handle edge cases**
   - User already has profile → show edit mode
   - Partial profile → show completion status
   - No skills in category → show empty state
   - AI API failure → graceful degradation

10. **Add progress tracking**
    - Show completion percentage
    - Highlight missing sections
    - Encourage completion

---

## UI/UX Design Guidelines

### Follow STYLE_GUIDE.md
- Minimal, editorial, calm design
- No loud colors
- No marketplace language
- Use existing design tokens

### Profile Builder Layout
```
┌─────────────────────────────────────┐
│  Complete Your Profile              │
│  [Progress: 60%]                    │
├─────────────────────────────────────┤
│  [Profile Picture Upload Section]   │
│  ┌─────────┐                        │
│  │  [IMG]  │  Click to upload       │
│  └─────────┘                        │
├─────────────────────────────────────┤
│  Select Your Interests & Skills     │
│                                     │
│  Adventure                          │
│  [Dropdown: Select skills...]      │
│  Selected: Rock Climbing, Hiking   │
│                                     │
│  Hobbies and Creative               │
│  [Dropdown: Select skills...]      │
│  Selected: Drawing, Photography    │
│                                     │
│  Home Improvement                   │
│  [Dropdown: Select skills...]      │
│  Selected: Gardening, Carpentry    │
├─────────────────────────────────────┤
│  AI Profile Helper                  │
│  ┌─────────────────────────────────┐│
│  │ Tell us about yourself...       ││
│  │ [Text area]                     ││
│  │ [Generate Suggestions]          ││
│  └─────────────────────────────────┘│
│  [Results appear here when ready]   │
├─────────────────────────────────────┤
│  [Save Profile] [Skip for Now]      │
└─────────────────────────────────────┘
```

### AI Widget Results Display
```
┌─────────────────────────────────────┐
│  Profile Summary                    │
│  [Generated intro text - editable]  │
│                                     │
│  Suggested Interests                │
│  ☑ Outdoor photography              │
│  ☑ Local hiking trails             │
│  ☐ Urban gardening                  │
│                                     │
│  Suggested Skills                   │
│  Adventure: ☑ Rock Climbing        │
│  Creative: ☑ Photography            │
│  Home: ☑ Gardening                  │
│                                     │
│  Profile Picture Ideas              │
│  • Photo of you hiking              │
│  • Outdoor shot with camera         │
│                                     │
│  [Apply All] [Regenerate]           │
└─────────────────────────────────────┘
```

---

## Technical Considerations

### Authentication
- Use `useSupabaseAuth()` hook
- Redirect to signin if not authenticated
- Show loading state during auth check

### Data Loading
- Load profile data on mount
- Load skills by category on demand
- Cache skills data to reduce API calls

### Form State Management
- Use React state for form data
- Validate before save
- Show unsaved changes warning (optional)

### AI Integration
- Rate limiting already in place
- Handle API failures gracefully
- Show loading states
- Allow retry on failure

### Image Upload
- Validate file type and size
- Show upload progress (optional)
- Handle upload errors
- Update profile immediately after upload

### Performance
- Lazy load category selectors
- Debounce AI requests (if user types)
- Optimize image uploads
- Cache skill lists

---

## File Structure

```
app/
  profile/
    page.tsx                    # NEW: Main profile builder
    setup/
      page.tsx                  # MODIFY: Keep for advanced settings
    [username]/
      page.tsx                  # EXISTING: Profile view page

components/
  ProfilePictureUpload.tsx      # NEW
  CategorySkillSelector.tsx     # NEW
  ProfileAIWidget.tsx           # NEW

api/
  profile/
    me/
      route.ts                  # ENHANCE: Get current user profile
  skills/
    by-category/
      route.ts                  # NEW: Get skills by category
  ai/
    profile-suggestions/
      route.ts                  # ENHANCE: Better category support
```

---

## Testing Checklist

### Profile Builder Page
- [ ] Loads for authenticated users
- [ ] Redirects unauthenticated users
- [ ] Displays existing profile data if available
- [ ] Profile picture upload works
- [ ] Category selectors load and filter correctly
- [ ] Skills can be selected/deselected
- [ ] AI widget generates suggestions
- [ ] Suggestions can be applied to form
- [ ] Save functionality works
- [ ] Error handling works

### Explore Page Integration
- [ ] InfoWindow appears on marker hover
- [ ] Profile picture shows in InfoWindow
- [ ] "View Profile" link works
- [ ] Smooth transitions

### Edge Cases
- [ ] Empty profile (new user)
- [ ] Partial profile (returning user)
- [ ] No skills in category
- [ ] AI API failure
- [ ] Image upload failure
- [ ] Network errors

---

## Future Enhancements (Post-MVP)

1. **Profile Picture Generation**
   - Use DALL-E or similar to generate profile pictures
   - Based on user interests/skills
   - Multiple style options

2. **Profile Completion Gamification**
   - Progress bar
   - Badges for completion
   - Encouragement messages

3. **Skill Recommendations**
   - Suggest skills based on selected ones
   - "People with X also like Y"

4. **Profile Preview**
   - Show how profile looks to others
   - Before/after comparison

5. **Bulk Skill Import**
   - Import from LinkedIn/other platforms
   - CSV import option

---

## Questions to Resolve

1. **Profile Picture Storage**
   - Current: Local file system (`public/uploads/profiles/`)
   - Future: Should we move to Supabase Storage?
   - Decision: Keep local for now, migrate later if needed

2. **AI Profile Picture Suggestions**
   - Current: Text suggestions only
   - Future: Generate actual images?
   - Decision: Start with text suggestions, add image generation later

3. **Profile Completion Requirements**
   - What's required vs optional?
   - Can users skip and complete later?
   - Decision: Make most fields optional, encourage completion

4. **Category Naming**
   - Current: "Hobbies and Creative" vs "Creative" in schema
   - Need to align naming
   - Decision: Use "Hobbies and Creative" in UI, map to "Creative" in DB

---

## Next Steps

1. Review and approve this plan
2. Start with Phase 1: Core Profile Builder Page
3. Iterate based on feedback
4. Test thoroughly before deployment
