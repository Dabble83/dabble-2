# Dabble

**Learn Anything, From Anyone**

Dabble connects people seeking to learn a skill, sport, or hobby with nearby teachers and instructors. Whether you want to learn guitar, coding, cooking, or tennis, find the perfect instructor in your area.

## Features

- 🔍 Find local teachers for any skill
- 💬 Direct messaging with instructors
- 📅 Schedule and manage lessons
- ⭐ Rate and review teachers
- 🎯 Personalized learning experiences

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** Ready for Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

   **Note:** The `postinstall` script will automatically run `prisma generate` after installation to generate the Prisma Client.

2. Generate Prisma Client (if not already done automatically):
```bash
npm run prisma:generate
```

3. Set up environment variables:
   - Create a `.env.local` file in the project root
   - Add your Google Maps API key:
     ```
     NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
     ```
   - Add NextAuth secret (generate a random string for production):
     ```
     NEXTAUTH_SECRET=your-secret-key-change-in-production
     ```
   - Add OpenAI API key (for AI profile suggestions and image generation):
     ```
     OPENAI_API_KEY=your-openai-api-key-here
     ```
   - (Optional) Enable AI image generation (disabled by default):
     ```
     ENABLE_IMAGE_GENERATION=true
     ```
     Note: Image generation uses DALL-E 3 and is rate-limited. Keep disabled if not needed.
   - Add Supabase credentials (for authentication and database):
     ```
     NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
     SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
     ```
   - **Important:** After creating or modifying `.env.local`, restart the dev server (`npm run dev`) for changes to take effect.

4. Run the development server:
```bash
npm run dev
```

   **Note:** The dev script automatically runs `prisma generate` before starting. If you modify the Prisma schema, run `npm run prisma:generate` manually.

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
dabble/
├── app/              # Next.js app directory
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Home page
│   └── globals.css   # Global styles
├── components/       # React components (to be created)
├── public/           # Static assets
└── package.json      # Dependencies
```

## Development

- `npm run dev` - Start development server (automatically runs `prisma generate`)
- `npm run build` - Build for production (automatically runs `prisma generate`)
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma Client (run after schema changes)
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run clean` - Remove build artifacts and Prisma client cache
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed the database with initial data
- `npm run db:generate` - Alias for `prisma:generate` (legacy)

### Prisma Client Generation

The Prisma Client is automatically generated:
- After `npm install` (via `postinstall` script)
- Before `npm run dev` (via dev script)
- Before `npm run build` (via build script)

If you modify `prisma/schema.prisma`, you should run `npm run prisma:generate` to regenerate the client. The dev server will also regenerate it automatically, but manual generation ensures consistency.

### Troubleshooting Prisma Issues

If you encounter Prisma errors like "Cannot find module './client'", try these steps:

1. **Clean build artifacts and Prisma cache:**
   ```bash
   npm run clean
   ```

2. **Regenerate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

3. **Reinstall dependencies (if needed):**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run prisma:generate
   ```

4. **Start the dev server:**
   ```bash
   npm run dev
   ```

The `clean` script removes `.next` (Next.js build cache) and `node_modules/.prisma` (Prisma client cache), which often resolves generation issues.

## Contributing

This is a personal project by Frazer Lanier.

## License

Private project - All rights reserved.
