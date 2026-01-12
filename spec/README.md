# Dabble Specification Documents

This folder contains the complete specification for rebuilding the Dabble platform from scratch. These documents serve as the single source of truth for product vision, design system, technical architecture, and written content.

## Documents Overview

### 1. [DABBLE_PRODUCT.md](./DABBLE_PRODUCT.md)
**Product Vision & Philosophy**
- Product description and positioning
- Core concepts (dabblers, skills exchange, credits, swaps)
- Anti-hustle principles
- Community-first approach

**Use this for:** Understanding what Dabble is, why it exists, and how it differs from marketplace platforms.

### 2. [DABBLE_DESIGN.md](./DABBLE_DESIGN.md)
**Complete Design System**
- Design principles (minimal, editorial, warm, calm)
- Typography scale and rules
- Color palette (neutrals, accents, semantic)
- Spacing system
- Component styles (buttons, cards, forms, links)
- Layout patterns
- Responsive breakpoints
- Language & tone rules
- Accessibility requirements

**Use this for:** Implementing the visual design, UI components, and ensuring consistent design language throughout the site.

### 3. [DABBLE_ARCHITECTURE.md](./DABBLE_ARCHITECTURE.md)
**Technical Architecture**
- Technology stack (Next.js, Supabase, Tailwind, etc.)
- Complete route map (all pages and API endpoints)
- Data model (database schema, tables, relationships)
- Environment variables
- Client-server boundary rules
- Authentication flow
- Security rules
- Important constraints (no NextAuth, no Prisma as primary ORM)

**Use this for:** Setting up the technical infrastructure, implementing routes, database schema, and understanding system constraints.

### 4. [DABBLE_COPY.md](./DABBLE_COPY.md)
**All Written Content**
- Tone & voice principles
- Canonical copy for every page (landing, about, signup, signin, profile, etc.)
- Form labels and helper text
- Error and success messages
- Navigation labels
- Microcopy guidelines
- Language restrictions (words to avoid)

**Use this for:** Writing all user-facing text, ensuring consistent voice and tone, and avoiding commercial/marketplace language.

## How to Use These Specs

### For New Developers
1. Start with **DABBLE_PRODUCT.md** to understand the vision
2. Read **DABBLE_ARCHITECTURE.md** to understand technical constraints
3. Reference **DABBLE_DESIGN.md** when building UI components
4. Copy text directly from **DABBLE_COPY.md** for all user-facing content

### For Designers
1. Use **DABBLE_PRODUCT.md** for product context
2. Follow **DABBLE_DESIGN.md** strictly for all design decisions
3. Reference **DABBLE_COPY.md** for content to design around

### For Product/Content
1. **DABBLE_PRODUCT.md** defines product philosophy (use for feature decisions)
2. **DABBLE_COPY.md** contains all canonical copy (use as source of truth)
3. Both documents define what language/concepts to avoid

### For Rebuilding from Scratch
1. Set up tech stack per **DABBLE_ARCHITECTURE.md**
2. Implement routes per architecture document
3. Build UI components per **DABBLE_DESIGN.md**
4. Write all copy from **DABBLE_COPY.md**
5. Ensure product vision from **DABBLE_PRODUCT.md** is reflected throughout

## Specification Principles

These specs are designed to be:
- **Complete**: Everything needed to rebuild the site
- **Clear**: No ambiguity about what to build
- **Consistent**: Cross-references between documents align
- **Constrained**: Explicit rules about what NOT to do (no NextAuth, no Prisma, no marketplace language)

## Version Control

These specifications should be version-controlled and updated when:
- Product vision changes
- Design system evolves
- Technical architecture shifts
- New routes or features are added
- Copy changes for consistency or clarity

## Questions or Updates

When updating these specs:
1. Ensure changes are reflected across all relevant documents
2. Maintain consistency with existing patterns
3. Update this README if document structure changes
4. Preserve the anti-hustle, community-first philosophy


