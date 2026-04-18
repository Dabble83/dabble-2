# Dabble 2.0 QA Checklist (Phase 1)

Use this checklist before marking the branch ready for non-draft review.

## Environment

- [ ] `npm run check-env` runs cleanly (or only expected warnings)
- [ ] `.env.local` exists and Supabase keys are set
- [ ] `NEXT_PUBLIC_ENABLE_MAPS` behavior matches expectation (on/off)
- [ ] No server-only secrets are placed in `NEXT_PUBLIC_*` variables

## Build Health

- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] `npm run dev` starts without runtime errors
- [ ] `npm run ready`

## Core Flow

- [ ] Create account from `/dabble/signup`
- [ ] If email confirmation is required, confirm and sign in
- [ ] Complete `/profile/setup`
- [ ] Save redirects to `/profile/[username]` once required fields are present
- [ ] `/profile` redirects correctly (signin/setup/public profile)

## Explore Flow

- [ ] `/explore` loads profiles from API
- [ ] Search filter narrows results
- [ ] Neighborhood filter narrows results
- [ ] Empty and no-match states render clearly

## Session UX

- [ ] Header shows `Sign in` while signed out
- [ ] Header shows `My profile` + `Sign out` while signed in
- [ ] Sign out returns user to sign-in flow

## API Spot Checks

- [ ] `GET /api/profile/me?userId=<id>`
- [ ] `GET /api/profile/check?userId=<id>`
- [ ] `GET /api/profile/by-username?username=<username>`
- [ ] `POST /api/profile/update`
- [ ] `GET /api/explore/discoverable`