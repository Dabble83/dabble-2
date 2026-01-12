# Dabble Copy Guidelines & Canonical Content

## Tone & Voice Principles

### Core Voice Attributes
- **Warm**: Conversational and friendly, like talking to a neighbor
- **Clear**: Simple, direct language—no jargon or corporate speak
- **Respectful**: Assumes intelligence and good intentions
- **Calm**: No urgency, no pressure, no hype
- **Honest**: Transparent about how things work, no hidden agendas

### Writing Rules
- Use second person ("you") when addressing the user directly
- Use "we" sparingly, only when referring to the platform/community
- Avoid exclamation points (except rare, genuine enthusiasm)
- Prefer short sentences and paragraphs
- Use active voice ("Share your skills" not "Skills can be shared")
- Avoid contractions in formal copy, allow them in conversational UI text

## Landing Page (`/`)

### Hero Section

**Main Headline** (H1)
```
Connect through skills, not transactions.
```

**Subheadline** (Body Large)
```
Dabble is a calm space for real-life learning and sharing. Find neighbors who want to teach and learn. Build connections through in-person exchanges. No hustle, no marketplace—just people sharing what they know.
```

**Primary CTA Button**
```
Start Dabbling
```

**Secondary Link** (optional)
```
Learn more about how it works
```
*(Links to `/about`)*

### Key Concepts Section

**Section Title** (H2)
```
How Dabble Works
```

**Concept 1: Dual Identity**
```
Everyone is both a learner and a sharer. You'll list skills you can help others with, and skills you want to learn. This keeps exchanges balanced and prevents the platform from becoming a one-way service marketplace.
```

**Concept 2: Exchange, Not Payment**
```
Swaps are the default. "I'll teach you sourdough if you help me fix my bike" is how it works. Credits are optional—just a helpful tool for balancing complex exchanges, never required or purchased.
```

**Concept 3: Real-Life Connection**
```
All exchanges happen in person, in your actual neighborhood. Find dabblers nearby who share your interests. Build local community through face-to-face interaction.
```

**Concept 4: Privacy First**
```
Location sharing is optional and granular. Choose neighborhood-level precision or keep it approximate. Your exact address is never required or shared. You control your discoverability.
```

### Value Proposition

**Section Title** (H2)
```
Why Dabble Exists
```

**Body Text**
```
Most platforms turn learning into a transaction. Dabble creates space for genuine community connections based on curiosity and mutual support. Think neighborhood bulletin board, not commercial marketplace. Think community center, not Silicon Valley startup.
```

### Call to Action Section

**Headline** (H2)
```
Ready to start dabbling?
```

**Body Text**
```
Create your profile, share what you know, discover what you want to learn. It's free, it's local, and it's built for real connections.
```

**CTA Button**
```
Sign Up
```

**Secondary Text**
```
Already have an account? [Sign in]
```

## About Page (`/about`)

### Page Title (H1)
```
About Dabble
```

### Introduction Section

**Body Text**
```
Dabble connects people in real life through skills exchange and learning. We're building a calm, anti-hustle platform that feels like a neighborhood bulletin board—warm, inviting, and focused on genuine community connections.
```

### How It Works Section

**Section Title** (H2)
```
How It Works
```

**Subsection: Create Your Profile**
```
Start by creating a profile that shows both what you can share and what you want to learn. Upload a photo, write a bit about your interests, and list your skills. The dual identity—learner and sharer—keeps exchanges balanced and community-focused.
```

**Subsection: Discover Nearby Dabblers**
```
Use the explore map to find dabblers in your area. Filter by skills, interests, or radius. When you find someone interesting, view their full profile to see what they offer and what they're looking to learn.
```

**Subsection: Connect and Exchange**
```
Reach out through the platform to propose an exchange. Maybe you'll teach them sourdough baking in exchange for bike repair help. Or swap photography tips for gardening advice. Exchanges happen in person, in real life, building actual community connections.
```

**Subsection: Optional Credits**
```
Credits are a helpful tool for balancing exchanges, especially when skills have different time commitments or complexities. But they're completely optional—the platform works perfectly as a pure swap system. Credits are never purchased, never charged, and never required. They're just community-set values to help match balanced exchanges.
```

### Philosophy Section

**Section Title** (H2)
```
Our Philosophy
```

**Subsection: Anti-Hustle**
```
We explicitly avoid marketplace language, monetization features, gamification, and growth hacking. No "buy/sell," no badges, no referral bonuses. This is about community connection, not commercial optimization.
```

**Subsection: Real-Life Focus**
```
All exchanges are expected to happen in person. Online-only or remote learning isn't our focus—we're building local community through face-to-face interaction. The map helps you find people nearby who share your interests.
```

**Subsection: Privacy & Safety**
```
Location sharing is opt-in and granular. You choose your level of precision. Exact addresses are never required. All interactions are community-moderated, and users build reputation through successful exchanges.
```

**Subsection: Community First**
```
Success is measured by quality of connections, not user count or engagement metrics. The platform exists to serve existing communities and help new ones form. We're not trying to "scale" or "disrupt"—we're trying to connect real people in real places.
```

### Credits & Exchange Section

**Section Title** (H2)
```
About Credits and Exchanges
```

**Body Text**
```
Credits exist purely as a convenience tool to facilitate exchanges, not as a monetization feature. They're optional, transparent, and community-set.

**How Credits Work:**
- Users can optionally assign credit values to their skills (e.g., "Sourdough workshop: 3 credits")
- The system can help match exchanges based on credit balance (e.g., "3-credit workshop for 3-credit bike repair")
- Credits are never required, never charged, and never purchased
- They're simply a way to say "this skill typically takes X hours" or "this exchange feels balanced at Y credits"

**Direct Swaps Preferred:**
The platform actively encourages direct swaps over credits. UI copy, matching algorithms, and community norms all favor the simplicity of "I'll teach you X, you teach me Y." Credits are a fallback for complex multi-person exchanges, not the primary mode.
```

## Explore Page (`/explore`)

### Page Title (H1)
```
Explore Nearby
```

### Introduction

**Body Text**
```
See dabblers who've chosen to be discoverable nearby. Use the radius selector to adjust how far you want to explore. Click on markers to view profiles and discover potential exchanges.
```

### Map Controls

**Radius Selector Label**
```
Radius:
```

**Radius Options**
```
1 km
5 km
10 km
```

**Map Placeholder Text** (if maps disabled)
```
Maps feature disabled. To enable Google Maps, set NEXT_PUBLIC_ENABLE_MAPS=true in your .env.local file and restart the dev server.
```

## Signup Page (`/dabble/signup`)

### Page Title (H1)
```
Join Dabble
```

### Introduction

**Body Text**
```
Create your account to start dabbling.
```

### Form Labels & Helpers

**Username Field**
- Label: `Username *`
- Placeholder: (none, required field)
- Helper: (none)

**Email Field**
- Label: `Email *`
- Placeholder: (none, required field)
- Helper: (none)

**Password Field**
- Label: `Password *`
- Placeholder: (none, required field)
- Helper: `At least 8 characters`

**Display Name Field**
- Label: `Display Name *`
- Placeholder: (none, required field)
- Helper: (none)

**Address Field** (Optional)
- Label: `Address (for rough map placement)`
- Placeholder: `e.g., Park Slope, Brooklyn`
- Helper: `You can refine this later`

**Discoverability Checkbox**
- Label: `Let others discover me nearby`

**Location Precision** (if discoverable checked)
- Label: `Location Precision`
- Options:
  - `Neighborhood-level (recommended)`
  - `Approximate`

### Buttons & Actions

**Submit Button**
```
Sign Up
```

**Loading State**
```
Creating account...
```

**Success Message** (if email confirmation required)
```
Check your email to confirm your account.
```

**Error Messages**
- Email already exists: `An account with this email already exists. Please sign in instead.`
- Invalid email: `Please enter a valid email address.`
- Password too short: `Password does not meet requirements. Please use at least 8 characters.`
- Generic: `An error occurred. Please try again.`

**Footer Link**
```
Already have an account? [Sign in]
```

## Signin Page (`/dabble/signin`)

### Page Title (H1)
```
Sign In
```

### Introduction

**Body Text**
```
Welcome back to Dabble.
```

### Form Labels

**Email/Username Field**
- Label: `Email`
- Placeholder: (none)

**Password Field**
- Label: `Password`
- Placeholder: (none)

### Buttons & Actions

**Submit Button**
```
Sign In
```

**Loading State**
```
Signing in...
```

**Error Messages**
- Invalid credentials: `Invalid email or password`
- Generic: `An error occurred. Please try again.`

**Footer Link**
```
Don't have an account? [Sign up]
```

## Profile Setup Page (`/profile/setup`)

### Page Title (H1)
```
Complete Your Profile
```

### Progress Indicator

**Step Indicator**
```
Step {current} of 3
```

**Progress Percentage**
```
{percentage}% complete
```

### Step 1: Basics

**Section Title** (H2)
```
Step 1: Basics
```

**Profile Photo**
- Label: `Profile Photo`
- Upload Button: `Upload Photo` / `Change Photo`
- Uploading: `Uploading...`
- Helper: `JPG, PNG, or WebP (max 5MB)`
- Error: `Please upload a JPG, PNG, or WebP image.` / `Image is too large. Maximum size is 5MB.`

**Generate AI Profile Image** (if AI enabled)
- Section Title: `Generate an icon-style profile image`
- Input Placeholder: `e.g., Hands holding tools, a bowl of noodles, gardening scene...`
- Button: `Generate Image`
- Generating: `Generating...`
- Helper: `Creates a simple, calm illustration matching your idea`

**Display Name**
- Label: `Display Name *`
- Helper: (none)

**Username**
- Label: `Username *`
- Helper: (none)

**Interests Intro**
- Label: `What I'm into (short line)`
- Placeholder: `e.g., Cooking, hiking, and learning new languages`
- Helper: `You can expand on this in the next step`

**Navigation**
- Next Button: `Next: Interests & Skills →`

### Step 2: Interests & Skills

**Section Title** (H2)
```
Step 2: Interests & Skills
```

**Interests Paragraph**
- Label: `A paragraph about my interests`
- Placeholder: `Tell others what you're curious about and what you enjoy learning...`

**Skills Paragraph**
- Label: `A paragraph about my skills I can share`
- Placeholder: `Share what you can teach or help others with...`

**AI Helper Widget** (if AI enabled)
- Title: `Need help describing what you're into?`
- Curiosity Input Label: `What are you curious about lately? (optional)`
- Curiosity Placeholder: `e.g., I've been wanting to learn how to make sourdough bread...`
- Help Input Label: `What do friends ask you for help with? (optional)`
- Help Placeholder: `e.g., People often ask me to help fix their bikes...`
- Brainstorm Button: `Brainstorm`
- Apply Button: `Apply to my profile`
- Loading: `Generating...`

**Offers Skills**
- Label: `Things I can help with (Offers)`
- Helper: (none, shows checkboxes)

**Wants Skills**
- Label: `Things I want to learn (Wants)`
- Helper: (none, shows checkboxes)

**Custom Interests**
- Label: `Custom Interests (optional)`
- Input Placeholder: `Add a custom interest...`
- Add Button: `Add`

**Navigation**
- Back Button: `← Back`
- Next Button: `Next: Discoverability →`

### Step 3: Discoverability

**Section Title** (H2)
```
Step 3: Discoverability
```

**Discoverability Checkbox**
- Label: `Let others discover me nearby`

**Location Precision** (if discoverable)
- Label: `Location Precision`
- Options:
  - `Neighborhood-level (recommended)`
  - `Approximate`

**Address Label** (if discoverable)
- Label: `Address Label`
- Placeholder: `e.g., Park Slope, Brooklyn`

**Navigation**
- Back Button: `← Back`
- Save Button: `Save and Finish`
- Saving: `Saving...`

**Demo Mode Banner** (if not authenticated)
```
Demo Mode: You're viewing the profile setup page. [Sign up] to create your profile.
```

## Profile View Page (`/profile/[username]`)

### Profile Header

**Display Name** (H1)
```
{displayName}
```

**Username**
```
@{username}
```

**Location** (if discoverable)
```
Nearby in {neighborhood}
```

**Edit Link** (if own profile)
```
Edit profile
```
*(Links to `/profile/setup`)*

### Profile Sections

**Interests Section** (if interestsIntro exists)
```
{interestsIntro}
```
*(No heading, just paragraph text)*

**Skills Section** (if skillsIntro exists)
```
{skillsIntro}
```
*(No heading, just paragraph text)*

**Offers Section** (if offers skills exist)
- Heading: `Things I can help with`
- Category Headings: `{CATEGORY}` (uppercase, small, gray)
- Skills: Displayed as tags/badges

**Wants Section** (if wants skills exist)
- Heading: `Things I want to learn`
- Category Headings: `{CATEGORY}` (uppercase, small, gray)
- Skills: Displayed as tags/badges

### Empty States

**No Profile Found**
```
Profile not found
```

**Loading State**
```
Loading...
```

## Profile Complete Banner

**Banner Text** (shown on incomplete profiles)
```
[Complete your profile] to start dabbling with others nearby.
```
*("Complete your profile" is a link to `/profile/setup`)*

## Error Messages

### General Errors

**404 Not Found**
```
Page not found
```

**500 Server Error**
```
Something went wrong
```

**Generic Error**
```
An error occurred. Please try again.
```

### Form Validation

**Required Field**
```
Please fill in all required fields
```

**Email Invalid**
```
Please enter a valid email address
```

**Password Too Short**
```
Password must be at least 8 characters
```

**Username Taken**
```
This username is already taken. Please choose another.
```

**Image Too Large**
```
Image is too large. Maximum size is 5MB.
```

**Invalid File Type**
```
Please upload a JPG, PNG, or WebP image.
```

## Success Messages

### Profile Saved
```
Profile saved successfully
```

### Image Uploaded
```
Image uploaded successfully
```

### Skills Applied
```
Suggestions applied to your profile!
```

## Empty States

### No Skills Selected
```
No skills selected yet. Add skills you can help with and skills you want to learn.
```

### No Nearby Dabblers
```
No dabblers found nearby. Adjust your radius or check back later.
```

### No Profile Image
```
No profile image. Upload a photo or generate one.
```

## Loading States

### Generic Loading
```
Loading...
```

### Saving
```
Saving...
```

### Uploading
```
Uploading...
```

### Generating
```
Generating...
```

## Navigation Labels

### Header Navigation (Authenticated)
- Logo/Brand: `Dabble` (links to `/`)
- Links: `Profile`, `Explore`, `About`, `Sign Out`

### Header Navigation (Unauthenticated)
- Logo/Brand: `Dabble` (links to `/`)
- Links: `Explore`, `Sign In`, `Sign Up`, `About`

### Footer Navigation (if present)
- `About`
- `Privacy`
- `Contact`

## Microcopy Guidelines

### Button Labels
- Use action verbs: "Save," "Continue," "Sign Up"
- Keep it short: 1-3 words
- No urgency: "Save" not "Save Now!"
- Present tense: "Sign In" not "Signing In" (except loading states)

### Link Labels
- Be descriptive: "Complete your profile" not "Click here"
- Use context: "Sign in" in context of authentication
- Keep it natural: "Learn more" not "Learn More About Our Features"

### Helper Text
- Keep it brief: One sentence maximum
- Be helpful: Explain why, not just what
- No assumptions: "At least 8 characters" not "Must be secure"

### Error Messages
- Be specific: "Invalid email address" not "Error"
- Be helpful: "Please enter a valid email address" suggests what to do
- No blame: "Something went wrong" not "You made an error"

### Success Messages
- Be brief: "Saved" or "Profile updated"
- No celebration: Avoid excessive enthusiasm
- Clear action: "Profile saved" confirms what happened

## Language Restrictions

### Words to Avoid
- Marketplace terms: "buy," "sell," "purchase," "vendor," "customer"
- Commercial terms: "pricing," "checkout," "cart," "order," "payment"
- Hustle terms: "scale," "grow," "optimize," "maximize," "hustle," "grind"
- Corporate terms: "leverage," "synergy," "solution," "platform" (as selling point)
- Urgency terms: "limited time," "act now," "don't miss out," "last chance"
- Gamification: "points," "badges," "levels," "achievements," "leaderboard"
- Growth hacking: "invite friends," "share to unlock," "referral bonus"

### Preferred Alternatives
- Instead of "marketplace": "community," "platform," "space"
- Instead of "buy/sell": "exchange," "swap," "share," "learn"
- Instead of "providers/customers": "dabblers," "people," "neighbors"
- Instead of "services": "skills," "knowledge," "help"
- Instead of "transaction": "exchange," "swap," "connection"

## Content Examples by Tone

### ✅ Good Tone Examples

**Warm & Inviting**
```
Welcome to Dabble. Find neighbors who share your interests and discover new skills through real-life exchanges.
```

**Clear & Direct**
```
Create your profile to start connecting. List what you can help with and what you want to learn.
```

**Respectful**
```
Your location is optional and you control the level of detail. Choose what feels comfortable for you.
```

**Calm**
```
Take your time setting up your profile. You can always come back and update it later.
```

### ❌ Bad Tone Examples

**Too Commercial**
```
Join thousands of users and unlock exclusive features! Start your journey today and grow your network!
```

**Too Urgent**
```
Limited time: Sign up now to get early access to premium features! Don't miss out!
```

**Too Corporate**
```
Leverage our platform to optimize your learning experience and maximize your skill development potential.
```

**Too Casual**
```
Hey! Wanna learn stuff? Come check out this cool thing we built! It's gonna be awesome!!!
```


