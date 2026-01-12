# Dabble Design System

## Design Principles

### Minimal
The interface should feel uncluttered and focused. Every element should have a clear purpose. Avoid decorative elements, unnecessary animations, or visual noise. White space is intentional and generous. Information hierarchy is established through typography and spacing, not color or effects.

### Editorial
The design should feel like a well-designed magazine or book, not a web app. Text is the primary interface element. Images are used sparingly and purposefully. Layouts favor readability and narrative flow over feature discovery. The design should feel permanent and thoughtful, not trendy or ephemeral.

### Warm
The color palette and typography should feel inviting and human, not cold or corporate. Warm neutrals, soft contrasts, and natural materials (paper textures, subtle grain) create a sense of comfort and approachability. The design should feel like it's made by humans, for humans.

### Calm
Nothing should feel urgent, aggressive, or demanding. No bright red CTAs, no pulsing notifications, no autoplay videos. Interactions are gentle and predictable. Loading states are minimal and patient. Errors are handled gracefully without alarm. The entire experience should lower heart rate, not raise it.

## Typography

### Font Families
- **Primary Serif**: Use a readable serif font for headlines and body text (e.g., Georgia, Charter, or a similar web-safe serif). This establishes the editorial, human quality.
- **System Sans**: Use system UI fonts (`-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`) for UI elements, labels, and navigation to maintain clarity and performance.

### Type Scale
Base font size: 16px (1rem)

- **H1 (Hero/Page Title)**: 48px (3rem), line-height: 1.05, letter-spacing: -0.02em, weight: 700
- **H2 (Section Title)**: 32px (2rem), line-height: 1.2, weight: 600
- **H3 (Subsection)**: 24px (1.5rem), line-height: 1.3, weight: 600
- **Body Large**: 18px (1.125rem), line-height: 1.7, weight: 400
- **Body**: 16px (1rem), line-height: 1.6, weight: 400
- **Body Small**: 14px (0.875rem), line-height: 1.5, weight: 400
- **Label**: 14px (0.875rem), line-height: 1.4, weight: 500
- **Caption**: 12px (0.75rem), line-height: 1.4, weight: 400

### Typography Rules
- Maximum line length: 65-75 characters for body text
- Use serif for all headlines (H1, H2, H3) and body paragraphs
- Use system sans only for UI labels, form inputs, navigation, and metadata
- Avoid all caps except for very short labels
- Prefer italics over bold for emphasis in body text
- No underlines on links in body text (use color change only)

## Color Palette

### Neutrals (Primary Palette)
- **Background**: `#f6f1e8` (warm off-white, paper-like)
- **Surface**: `#ffffff` (pure white for cards and elevated surfaces)
- **Border**: `#e5e7eb` (light gray, subtle separation)
- **Text Primary**: `#1F2A37` (dark charcoal, high contrast but not pure black)
- **Text Secondary**: `#4B5563` (medium gray for supporting text)
- **Text Tertiary**: `#6B7280` (lighter gray for metadata, captions)
- **Text Muted**: `#9CA3AF` (very light gray for disabled states)

### Accent (Secondary Palette)
- **Primary Green**: `#7A8F6A` (muted sage green, calm and natural)
- **Primary Green Hover**: `#6B7A5A` (slightly darker on interaction)
- **Primary Green Border**: `#5F6B55` (darker border for buttons)
- **Primary Green Text**: `#2d5016` (dark green for links and accents)

### Semantic Colors (Used Sparingly)
- **Success**: `#10B981` (green, only for positive confirmations)
- **Warning**: `#FBBF24` (amber, only for important notices)
- **Error**: `#EF4444` (red, only for errors that need attention)
- **Info**: `#3B82F6` (blue, only for informational notices)

### Color Usage Rules
- **No gradients**: Use flat, solid colors only
- **Low contrast**: Text contrast should meet WCAG AA but not exceed it unnecessarily
- **Warm tones**: All grays should have a slight warm tint, not cool blue-gray
- **No bright colors**: Even accent colors are muted and desaturated
- **Background first**: The warm off-white background is the primary design element

## Spacing System

Base spacing unit: 4px (0.25rem)

- **XS**: 4px (0.25rem) - Tight spacing for related elements
- **S**: 8px (0.5rem) - Close spacing for grouped items
- **M**: 16px (1rem) - Default spacing between sections
- **L**: 24px (1.5rem) - Generous spacing for visual separation
- **XL**: 32px (2rem) - Large gaps between major sections
- **XXL**: 48px (3rem) - Page-level spacing, hero margins
- **XXXL**: 64px (4rem) - Screen-level spacing, section breaks

### Spacing Rules
- Use consistent spacing multiples (always 4px increments)
- Prefer more space over less—generous whitespace creates calm
- Vertical spacing should be 1.5x horizontal spacing for readability
- Padding inside cards/containers: 24px (L) minimum
- Gaps in flex/grid layouts: 16px (M) for related items, 24px (L) for distinct groups

## Component Styles

### Buttons

**Primary Button** (Main actions: Sign up, Save, Submit)
- Background: `#7A8A6A`
- Border: `2px solid #5F6B55`
- Text: `#F7F6F2` (off-white)
- Padding: `12px 24px` (vertical, horizontal)
- Border radius: `8px`
- Font size: `16px`
- Font weight: `600`
- Opacity: `0.8` (slightly transparent for softness)
- Hover: Background darkens to `#6B7A5A`
- Disabled: `#9CA3AF` background, `0.7` opacity, cursor: `not-allowed`

**Secondary Button** (Alternative actions: Cancel, Back)
- Background: `#F3F4F6`
- Border: `1px solid #D1D5DB`
- Text: `#374151`
- Same sizing and padding as primary
- Hover: Background darkens slightly to `#E5E7EB`

**Text Button** (Tertiary actions, links styled as buttons)
- No background or border
- Text: `#374151`
- Font weight: `500`
- Hover: Text color darkens to `#111827`
- Underline on hover (optional, subtle)

**Button Rules**:
- No shadows or gradients
- No animation except subtle color transition (200ms)
- All buttons must have hover states (accessibility)
- Disabled states must be clearly distinct
- Button text should be action-oriented but calm ("Save" not "Save Now!")

### Cards

**Default Card**
- Background: `#ffffff`
- Border: `1px solid #e5e7eb`
- Border radius: `12px` (xl)
- Padding: `24px` (L) minimum, `32px` for content cards
- Box shadow: None (use border for separation)
- Hover: Border color darkens slightly to `#d1d5db` (optional, for clickable cards)

**Card Spacing**:
- Cards in a list: `24px` gap between cards
- Card content: `16px` gap between sections within card
- Card header: `0 0 16px 0` margin (title/header to content)

### Forms

**Input Fields**
- Background: `#ffffff`
- Border: `2px solid #D1D5DB`
- Border radius: `8px`
- Padding: `12px 16px` (vertical, horizontal)
- Font size: `16px` (prevents zoom on iOS)
- Font family: System sans (for clarity)
- Focus: Border color changes to `#7A8A6A`, outline: `2px solid rgba(122, 143, 106, 0.2)`
- Placeholder: `#9CA3AF` color
- Disabled: `#F3F4F6` background, `#9CA3AF` text

**Labels**
- Font size: `14px`
- Font weight: `500`
- Color: `#374151`
- Spacing: `8px` margin below label, `12px` margin above input
- Required indicator: Red asterisk `*` (minimal, `#DC2626`)

**Textarea**
- Same styling as input
- Min height: `100px`
- Resize: Vertical only (if resizable)

**Checkboxes/Radio**
- Size: `16px` (1rem)
- Accent color: `#7A8A6A`
- Border: `2px solid #D1D5DB`
- Focus: Same outline as inputs

**Select Dropdown**
- Same styling as input
- Custom arrow (subtle, matches border color)

### Links

**Inline Links** (in body text)
- Color: `#374151` (same as body text initially)
- No underline by default
- Hover: Color changes to `#111827`, optional subtle underline
- Visited: Same as default (no distinct visited state)

**Navigation Links**
- Font size: `14px`
- Font weight: `500`
- Color: `#374151`
- Hover: `#111827`
- Active: `#7A8A6A` (when on current page)
- No underline

**Button-style Links**
- Use button styles above, make clickable with proper semantic HTML

### Navigation

**Header**
- Background: Transparent (or same as page background)
- Padding: `32px 24px` (vertical, horizontal)
- Border: None (or subtle bottom border `1px solid #e5e7eb`)
- Logo/Brand: Serif font, `40px` size, `#2d5016` color, weight `700`
- Nav links: System sans, `14px`, horizontal with `24px` gap

**Breadcrumbs** (if used)
- Font size: `12px`
- Color: `#6B7280`
- Separator: `·` (middle dot, not slash)
- Spacing: `8px` between items

### Badges/Tags

**Skill Tags**
- Background: `#E5E7EB`
- Text: `#374151`
- Padding: `6px 12px`
- Border radius: `16px` (pill shape)
- Font size: `14px`
- Font weight: `400`
- Spacing: `8px` gap between tags

**Category Labels**
- Font size: `12px`
- Text transform: `uppercase`
- Letter spacing: `0.05em`
- Color: `#9CA3AF`
- Font weight: `500`

### Loading States

**Skeleton/Placeholder**
- Background: `#F3F4F6`
- Border radius: `4px`
- Animation: Subtle pulse (opacity 0.6 to 0.8, 1.5s ease-in-out)
- Match the shape and size of the content being loaded

**Spinner** (if needed)
- Size: `24px`
- Color: `#7A8A6A`
- Animation: Smooth rotation, 1s linear
- Use sparingly—prefer skeleton loaders

### Error States

**Error Message**
- Background: `#FEE2E2` (light red)
- Border: `2px solid #EF4444`
- Text: `#991B1B` (dark red)
- Padding: `12px 16px`
- Border radius: `8px`
- Icon: Optional, red `⚠️` or `✕`

**Inline Error** (form validation)
- Text: `#DC2626`
- Font size: `14px`
- Position: Below input field, `8px` margin
- No background box for inline errors

### Success States

**Success Message**
- Background: `#D1FAE5` (light green)
- Border: `2px solid #10B981`
- Text: `#065F46` (dark green)
- Same padding and styling as error message
- Icon: Optional, green `✓`

## Layout Patterns

### Page Container
- Max width: `1200px` for content, `800px` for reading-focused pages
- Centered with `margin: 0 auto`
- Horizontal padding: `24px` on mobile, `48px` on desktop
- Vertical padding: `64px` top, `48px` bottom (adjust for page type)

### Content Sections
- Spacing between sections: `48px` (XXXL)
- Section padding: `0` (contained within page padding)

### Grid Layouts
- Use CSS Grid or Flexbox
- Default gap: `24px`
- Responsive: 1 column mobile, 2-3 columns tablet/desktop
- Cards in grid should have equal heights (use `align-items: stretch`)

### Modal/Dialog (if used)
- Background overlay: `rgba(0, 0, 0, 0.5)` with backdrop blur
- Modal background: `#ffffff`
- Border radius: `12px`
- Padding: `32px`
- Max width: `600px`
- Centered vertically and horizontally

## Responsive Breakpoints

- **Mobile**: Default (< 768px)
- **Tablet**: `768px` and up
- **Desktop**: `1024px` and up
- **Large Desktop**: `1280px` and up

### Mobile-First Rules
- Design for mobile first, then enhance for larger screens
- Typography scales up slightly on larger screens (max 1.2x)
- Spacing can increase on larger screens (max 1.5x)
- Navigation switches from hamburger menu to horizontal nav at tablet breakpoint

## Language & Tone Rules

### Do Use
- "Share" and "learn" (not "teach" and "study")
- "Connect" and "exchange" (not "transaction" or "purchase")
- "Discover" and "explore" (not "browse" or "shop")
- "Profile" (not "listing" or "service")
- "Skills" (not "services" or "products")
- "Dabblers" (not "users," "providers," or "customers")
- "Exchange" or "swap" (not "transaction" or "purchase")
- Warm, conversational tone ("Welcome" not "Get Started")

### Don't Use
- Marketplace language: "buy," "sell," "marketplace," "vendor," "customer"
- Hustle language: "scale," "grow," "optimize," "maximize," "hustle," "grind"
- Commercial language: "pricing," "checkout," "cart," "order," "payment"
- Corporate language: "leverage," "synergy," "solution," "platform" (as a selling point)
- Urgency language: "limited time," "act now," "don't miss out"
- Gamification: "points," "badges," "levels," "achievements"
- Growth language: "invite friends," "share to unlock," "referral bonus"

### Tone Examples

**Good**: "Find dabblers nearby who share your interests"
**Bad**: "Discover top-rated providers in your area"

**Good**: "What would you like to learn?"
**Bad**: "What skills are you looking to purchase?"

**Good**: "Complete your profile to start connecting"
**Bad**: "Finish your profile to unlock features"

**Good**: "Explore nearby dabblers"
**Bad**: "Browse local marketplace"

## Accessibility Requirements

- All interactive elements must be keyboard accessible
- Focus states must be clearly visible (2px outline, high contrast)
- Color contrast must meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- All images must have alt text
- Form labels must be properly associated with inputs
- Error messages must be announced to screen readers
- Loading states must be communicated to assistive technology
- No content should rely solely on color to convey meaning

## Animation & Motion

- **Transitions**: Maximum 200ms duration, ease-in-out timing
- **No auto-play**: All animations must be user-initiated or system-initiated (loading)
- **Reduced motion**: Respect `prefers-reduced-motion` media query
- **Subtle only**: Hover states, focus states, gentle transitions—nothing flashy or attention-grabbing
- **No parallax**: Avoid parallax scrolling or other motion effects that could cause discomfort


