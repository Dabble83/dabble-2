# Dabble Technical Architecture

## Technology Stack

### Core Framework
- **Next.js 14+** (App Router): Server and client-side rendering, API routes, file-based routing
- **React 18+**: Component library with hooks
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework (used for spacing, layout, but design tokens should override defaults)

### Authentication & Database
- **Supabase**: Primary backend service
  - **Auth**: User authentication (email/password, optional social auth)
  - **Database**: PostgreSQL database via Supabase
  - **Storage**: File storage for profile images and uploads
  - **Real-time**: Optional real-time subscriptions for live updates

### Third-Party Services
- **Google Maps API**: For `/explore` page map interface (conditional feature flag)
- **OpenAI API**: Optional AI features (profile suggestions, image generation) - feature flagged

### Development Tools
- **ESLint**: Code linting with Next.js config
- **TypeScript**: Type checking
- **Prisma**: Database ORM (see "Rules" section for usage constraints)

## File Structure

```
/
├── app/                    # Next.js App Router
│   ├── (routes)/          # Route groups
│   ├── api/               # API routes (server-side)
│   ├── components/        # Shared React components
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home/landing page
│   ├── error.tsx          # Error boundary
│   └── global-error.tsx   # Global error boundary
├── src/
│   ├── lib/               # Utility libraries
│   │   ├── supabaseClient.ts    # Client-side Supabase client
│   │   └── supabaseServer.ts    # Server-side Supabase client
│   ├── hooks/             # Custom React hooks
│   └── utils/             # Utility functions
├── spec/                  # This specification folder
├── public/                # Static assets
├── middleware.ts          # Next.js middleware
└── package.json           # Dependencies and scripts
```

## Route Map

### Public Routes

**`/` (Landing Page)**
- Purpose: Product introduction, value proposition
- Content: Hero section, key concepts, call-to-action to sign up
- No authentication required
- Safe boot mode: Minimal static page if `NEXT_PUBLIC_SAFE_MODE=true`

**`/about`**
- Purpose: Detailed explanation of Dabble philosophy and how it works
- Content: Sections on community, exchange model, credits (optional), privacy
- No authentication required

**`/explore`**
- Purpose: Map-based discovery of nearby dabblers
- Features: Google Maps integration (feature-flagged), radius selector, marker display
- No authentication required (but shows limited data without auth)
- Conditional: Only loads maps if `NEXT_PUBLIC_ENABLE_MAPS=true`

### Authentication Routes

**`/dabble/signup`**
- Purpose: New user registration
- Process: Email, password, username, display name, optional location
- Creates Supabase auth user + profile record
- Redirects to `/profile/setup` after successful signup

**`/dabble/signin`**
- Purpose: Existing user authentication
- Process: Email/password login via Supabase
- Redirects to profile page or `/profile/setup` if incomplete

### Profile Routes

**`/profile`**
- Purpose: Profile redirect/landing (handles auth state)
- Behavior: Redirects to `/profile/[username]` if authenticated and profile complete, otherwise `/profile/setup`
- Requires authentication

**`/profile/setup`**
- Purpose: Multi-step profile completion form
- Steps:
  1. Basics: Photo, display name, username, interests intro
  2. Interests & Skills: Detailed interests, offers (can help with), wants (want to learn), custom interests
  3. Discoverability: Location sharing preferences (opt-in, precision level)
- Requires authentication
- Can be accessed in "demo mode" without auth (read-only preview)

**`/profile/[username]`**
- Purpose: Public profile view
- Content: Display name, photo, interests, skills (offers/wants), location (if discoverable)
- No authentication required (but shows edit link if viewing own profile)

### Debug Routes (Development Only)

**`/debug/routes`**
- Purpose: List all available routes for testing
- Availability: Development mode only

**`/debug/health`**
- Purpose: API health check page
- Availability: Development mode only

**`/debug/supabase`**
- Purpose: Supabase connection and env var status
- Availability: Development mode only
- Shows: Env var status (via API for server-only vars), session test button

**`/debug/auth`**
- Purpose: Auth state debugging
- Availability: Development mode only

### API Routes (Server-Side Only)

**`/api/debug/ping`**
- Purpose: Basic server health check
- Returns: Server info, timestamp

**`/api/debug/env-status`**
- Purpose: Environment variable status (development only)
- Returns: Public and server-only env var presence
- Security: Only available in development mode

**`/api/debug/ping-supabase`**
- Purpose: Supabase connectivity test (development only)
- Returns: Connection status, env var status

**`/api/profile/check`**
- Purpose: Check if user profile is complete
- Params: `userId` (query)
- Returns: `{ complete: boolean }`

**`/api/profile/me`**
- Purpose: Get current user's profile data
- Params: `userId` (query)
- Returns: Full profile object

**`/api/profile/by-username`**
- Purpose: Get profile by username (public)
- Params: `username` (query)
- Returns: Public profile object

**`/api/profile/update`**
- Purpose: Update user profile
- Method: POST
- Body: Profile fields (displayName, username, interestsIntro, skillsIntro, offersSkills, wantsSkills, etc.)
- Returns: Updated profile

**`/api/skills`**
- Purpose: List all available skills
- Returns: Array of skill objects with id, name, category

**`/api/skills/create`**
- Purpose: Create new skill (if not exists)
- Method: POST
- Body: `{ name: string }`
- Returns: Created skill object

**`/api/upload/profile-image`**
- Purpose: Upload profile image to Supabase Storage
- Method: POST
- Body: FormData with image file
- Returns: `{ url: string }` (public URL)

**`/api/ai/profile-suggestions`** (Optional, Feature-Flagged)
- Purpose: Generate profile suggestions using AI
- Method: POST
- Body: `{ curiosityText, helpText, existingOffers, existingWants, existingInterests }`
- Returns: AI-generated suggestions for interests, skills, profile text

**`/api/ai/profile-image`** (Optional, Feature-Flagged)
- Purpose: Generate profile image using AI
- Method: POST
- Body: `{ ideaText: string }`
- Returns: `{ url: string }` (generated image URL)

## Data Model

### Core Tables (Supabase/PostgreSQL)

**`profiles`**
- `id` (UUID, primary key, references auth.users.id)
- `username` (text, unique, required)
- `display_name` (text, required)
- `profile_image_url` (text, nullable, Supabase Storage URL)
- `interests_intro` (text, nullable, markdown-friendly)
- `skills_intro` (text, nullable, markdown-friendly)
- `interests` (jsonb, array of strings)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**`profile_location`** (Optional, if user opts in)
- `id` (UUID, primary key)
- `profile_id` (UUID, foreign key to profiles.id)
- `is_discoverable` (boolean, default false)
- `address_label` (text, e.g., "Park Slope, Brooklyn")
- `precision` (enum: 'neighborhood' | 'approximate')
- `lat` (decimal, nullable, for map positioning)
- `lng` (decimal, nullable, for map positioning)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**`skills`**
- `id` (UUID, primary key)
- `name` (text, unique, required, e.g., "Sourdough Baking")
- `category` (text, nullable, e.g., "Cooking", "HomeImprovement", "Creative")
- `created_at` (timestamp)

**`profile_skills`** (Join table: profiles ↔ skills)
- `id` (UUID, primary key)
- `profile_id` (UUID, foreign key to profiles.id)
- `skill_id` (UUID, foreign key to skills.id)
- `type` (enum: 'offers' | 'wants')
- `created_at` (timestamp)

### Supabase Auth Integration

- User accounts managed by Supabase Auth (`auth.users` table)
- Profile `id` matches Supabase user `id`
- User metadata stored in Supabase Auth: `username`, `displayName` (for quick access)
- Profile data stored in separate `profiles` table for queryability and privacy

### Storage (Supabase Storage)

**Bucket: `profile-images`**
- Public read access
- Authenticated write access
- File naming: `{userId}/{timestamp}.{ext}`
- Allowed types: `image/jpeg`, `image/png`, `image/webp`
- Max file size: 5MB

## Environment Variables

### Required (Public - `NEXT_PUBLIC_*`)
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous/public key

### Required (Server-Only)
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (for admin operations, server-side only)

### Optional (Feature Flags)
- `NEXT_PUBLIC_ENABLE_MAPS`: Set to `"true"` to enable Google Maps on `/explore`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Maps API key (required if maps enabled)
- `NEXT_PUBLIC_SAFE_MODE`: Set to `"true"` to enable minimal safe boot mode (defaults to true)
- `NEXT_PUBLIC_ENABLE_AI`: Set to `"true"` to enable AI features
- `OPENAI_API_KEY`: OpenAI API key (required if AI enabled)

### Development Only
- `NODE_ENV`: Set to `"development"` for dev mode (automatic)

## Client-Server Boundary Rules

### Client Components (`'use client'`)
- All page components in `app/` are client components
- All shared components in `app/components/` are client components
- Can access: `NEXT_PUBLIC_*` environment variables only
- Can import: `@supabase/supabase-js` (client instance only)
- Cannot import: `supabaseServer.ts`, `fs`, `path`, or any Node.js modules
- Cannot access: Server-only environment variables (must use API routes)

### Server Components (No `'use client'`)
- API routes in `app/api/` are server-side by default
- Can access: All environment variables
- Can import: Node.js modules (`fs`, `path`), `supabaseServer.ts`
- Can use: Server-only Supabase operations (admin API, service role)

### API Route Pattern
When client components need server-only data:
1. Create API route in `app/api/`
2. API route accesses server-only resources
3. Client component fetches from API route
4. Example: `/api/debug/env-status` for server-only env var checks

## Authentication Flow

### Signup Flow
1. User fills form on `/dabble/signup`
2. Client calls `supabase.auth.signUp()` with email, password, metadata (username, displayName)
3. Supabase creates auth user and sends confirmation email (if email confirmation enabled)
4. On successful signup, redirect to `/profile/setup`
5. Profile setup creates/updates `profiles` record via `/api/profile/update`

### Signin Flow
1. User fills form on `/dabble/signin`
2. Client calls `supabase.auth.signInWithPassword()`
3. On success, redirect based on profile completeness:
   - Profile complete → `/profile/[username]`
   - Profile incomplete → `/profile/setup`

### Session Management
- Session stored in Supabase Auth (cookie-based)
- Client hook `useSupabaseAuth()` provides user state
- Session persists across page reloads
- Sign out via `supabase.auth.signOut()`

## Middleware

**File**: `middleware.ts`

### Current Behavior
- Minimal implementation (pass-through for debugging)
- Safe mode aware: In safe mode, no logic executed
- Logs requests in development mode
- No authentication checks (handled at page level)

### Future Enhancements (Optional)
- Rate limiting
- Request logging
- Auth token validation (if needed)

## Error Handling

### Error Boundaries
- `app/error.tsx`: Catches errors in route segments
- `app/global-error.tsx`: Catches errors at root level
- Both display error message and stack trace (development only)
- Provide "Try again" and "Go home" actions

### API Error Handling
- All API routes return JSON with `error` field on failure
- HTTP status codes: 200 (success), 400 (bad request), 401 (unauthorized), 403 (forbidden), 500 (server error)
- Client components handle API errors gracefully with user-friendly messages

### Client Error Handling
- All async operations wrapped in try/catch
- User-facing error messages (no technical stack traces)
- Console logging for debugging (development only)

## Performance Considerations

### Code Splitting
- Next.js automatically code-splits by route
- Dynamic imports for heavy components (Google Maps, AI features)
- Feature flags prevent loading unused code

### Image Optimization
- Next.js Image component for optimized images
- Profile images served from Supabase Storage (CDN)
- Lazy loading for below-fold images

### Database Queries
- Use Supabase indexes on frequently queried fields (`username`, `profile_id`)
- Pagination for large lists (skills, profiles)
- Efficient joins for profile + skills queries

### Caching
- Static pages can be cached (landing, about)
- API routes should set appropriate cache headers
- Supabase client-side caching for frequently accessed data

## Security Rules

### Supabase Row Level Security (RLS)
- Profiles: Users can read all, update only their own
- Profile Location: Users can read discoverable profiles only, update only their own
- Profile Skills: Users can read all, update only their own
- Skills: Public read, authenticated create

### API Route Security
- Server-only endpoints check authentication via Supabase session
- Debug endpoints restricted to development mode only
- File upload endpoints validate file type and size
- Input validation on all API routes

### Client-Side Security
- Never expose service role key or other secrets
- Environment variables properly scoped (NEXT_PUBLIC_* for client)
- XSS prevention: React auto-escapes, no `dangerouslySetInnerHTML` without sanitization
- CSRF protection: Next.js built-in protection for API routes

## Development Workflow

### Setup
1. Clone repository
2. Install dependencies: `npm install`
3. Generate Prisma client: `npm run prisma:generate` (if Prisma used)
4. Copy `.env.example` to `.env.local` and fill in values
5. Run dev server: `npm run dev`

### Build
1. Generate Prisma client: `npm run prisma:generate`
2. Build: `npm run build`
3. Start production: `npm start`

### Database Migrations
- Use Supabase migrations (not Prisma migrations - see Rules)
- Run migrations via Supabase CLI or dashboard
- Version control migration files

## Important Rules

### ❌ No NextAuth
- Do not use NextAuth.js or any NextAuth dependencies
- Use Supabase Auth exclusively
- All authentication flows must use `@supabase/supabase-js` client

### ❌ No Prisma (as primary ORM)
- Do not use Prisma for database operations
- Use Supabase client queries directly (`supabase.from('table').select()`)
- Prisma may be used for type generation only (if needed), but not for queries
- All database operations must go through Supabase client

### ✅ Supabase-First Approach
- Database: Supabase PostgreSQL
- Auth: Supabase Auth
- Storage: Supabase Storage
- Real-time: Supabase Realtime (if needed)
- Use Supabase client libraries, not raw SQL or other ORMs

### ✅ Type Safety
- Use TypeScript for all files
- Define types for all data structures
- Use Supabase-generated types where possible
- No `any` types except for third-party library integration

### ✅ Client-Server Separation
- Clear boundary between client and server code
- API routes for all server-side operations
- Client components only for UI and client-side interactions
- No server-only imports in client components

### ✅ Feature Flags
- All optional features behind environment variable flags
- Google Maps: `NEXT_PUBLIC_ENABLE_MAPS`
- AI Features: `NEXT_PUBLIC_ENABLE_AI`
- Safe Mode: `NEXT_PUBLIC_SAFE_MODE`
- Features should degrade gracefully when disabled

## Deployment Considerations

### Build Requirements
- Node.js 18+ required
- Environment variables must be set in deployment platform
- Supabase project must be configured and accessible
- Google Maps API key (if maps enabled)
- OpenAI API key (if AI enabled)

### Environment-Specific Config
- Development: Full feature set, debug routes enabled
- Production: Feature flags control optional features, debug routes disabled
- Safe mode: Minimal functionality, no external dependencies

### Monitoring
- Error tracking: Implement error boundary logging
- Performance: Monitor API response times
- Usage: Track feature flag usage (which features are enabled)


