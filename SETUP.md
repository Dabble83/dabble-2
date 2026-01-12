# Dabble Setup & Implementation Summary

## What's Been Implemented

### 1. Database Schema (Prisma)
**Location:** `prisma/schema.prisma`

Models created:
- `User` - Basic user account (email, username, passwordHash, name, phone)
- `Profile` - User profile (city, state, zip, radiusMiles, role flags)
- `Skill` - Skills organized by category (Adventure, HomeImprovement, Creative)
- `UserSkill` - Links users to skills with type (INTEREST/GUIDE) and level

Enums:
- `SkillCategory`: Adventure, HomeImprovement, Creative
- `SkillLevel`: Beginner, Intermediate, Advanced, Expert
- `SkillType`: INTEREST, GUIDE
- `UserRole`: Dabbler, Guide, Both

### 2. Signup Page
**Location:** `app/signup/page.tsx`

Features:
- Form matching landing page aesthetic (hand-drawn, watercolor style)
- Basic contact fields (name, email, phone)
- Location fields (city, state, zip, travel radius slider)
- Account fields (username, password, confirm password)
- Role selection (Dabbler, Guide, Both)
- Category multi-select for interests and abilities
- Skill selector with ski slope level indicators
- Client-side validation
- Success state with redirect to /try

### 3. Reusable Components
**Location:** `app/components/`

- `SkiLevelBadge.tsx` - Displays ski slope icons (green circle, blue square, black diamond, double black diamond)
- `CategoryMultiSelect.tsx` - Multi-select for skill categories
- `SkillSelector.tsx` - Selector for skills with level assignment

### 4. API Routes
**Location:** `app/api/`

- `GET /api/skills` - Returns all skills for form population
- `POST /api/signup` - Creates user account with validation and password hashing (bcrypt)
- `GET /api/guides/search` - Search guides by category, skill, city/state

### 5. Navigation
**Location:** `app/page.tsx`, `app/explore/page.tsx`

- Added "Sign Up" link next to "Sign In" in navigation
- Consistent styling across pages

### 6. Seed Data
**Location:** `prisma/seed.ts`

- 54 skills total:
  - 18 Adventure skills
  - 18 Home Improvement skills
  - 18 Creative/Hobbies skills

## Setup Instructions

### 1. Database Setup

The database is configured to use SQLite at `prisma/dev.db`.

**Note:** Prisma 7 requires special configuration. The current setup needs one of the following:

**Option A: Use Prisma 6 (Recommended for simplicity)**
```bash
npm install prisma@^6.0.0 @prisma/client@^6.0.0
```

Then update `prisma/schema.prisma` to use standard datasource URL:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

And remove the `output` path from generator, use default.

**Option B: Configure Prisma 7 properly**
Check Prisma 7 documentation for SQLite adapter setup.

### 2. Run Migrations

```bash
npm run db:migrate
# or
npx prisma migrate dev
```

### 3. Generate Prisma Client

```bash
npm run db:generate
# or
npx prisma generate
```

### 4. Seed Database

```bash
npm run db:seed
# or
npx tsx prisma/seed.ts
```

### 5. Start Development Server

```bash
npm run dev
```

## File Structure

```
dabble/
├── app/
│   ├── api/
│   │   ├── skills/route.ts
│   │   ├── signup/route.ts
│   │   └── guides/search/route.ts
│   ├── components/
│   │   ├── SkiLevelBadge.tsx
│   │   ├── CategoryMultiSelect.tsx
│   │   └── SkillSelector.tsx
│   ├── signup/page.tsx
│   └── ...
├── lib/
│   └── prisma.ts
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── dev.db (created after migration)
└── ...
```

## Prisma Schema Location
- **Schema:** `prisma/schema.prisma`

## Seed Data Location
- **Seed file:** `prisma/seed.ts`
- **Command:** `npm run db:seed`

## Migration Commands
- **Create migration:** `npm run db:migrate` or `npx prisma migrate dev`
- **Migrations stored in:** `prisma/migrations/`

## Next Steps

1. Resolve Prisma 7 SQLite adapter configuration
2. Test signup flow end-to-end
3. Verify database operations work correctly
4. Build category list pages (`/try/[category]`)

## Notes

- Passwords are hashed using bcrypt with 10 salt rounds
- All form validation includes both client and server-side checks
- The signup form dynamically shows/hides sections based on selected role
- Skills are filtered by selected categories in the UI







