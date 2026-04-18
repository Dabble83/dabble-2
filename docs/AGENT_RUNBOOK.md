# Dabble 2.0 Multi-Agent Runbook

Use this runbook to coordinate implementation with minimal intervention.

## Operator Responsibilities (You)

- Approve only at Gate B (scope), Gate C (aesthetic), Gate D (interaction quality).
- Avoid direct code edits unless intentionally overriding agent output.
- Keep credentials out of prompts and chats.

## Quick Start

1. Start from clean baseline:
   - `npm run check-env`
   - `npm run lint`
   - `npm run build`
2. Assign one active implementation agent at a time.
3. Allow read-only review agents in parallel when needed.
4. Merge only after gate checks pass.

## Agent Queue

1. Product-Spec Agent
2. Design-System Agent
3. App-Shell Agent
4. Data/Auth Agent
5. Maps Agent
6. AI Agent (optional)
7. Stability Agent

## Gate Checklists

### Gate B (scope)
- [ ] Route list approved
- [ ] Non-goals approved
- [ ] Milestone order approved

### Gate C (design)
- [ ] Tokens feel right
- [ ] Typography and spacing are consistent
- [ ] Imagery style direction approved

### Gate D (integrations)
- [ ] Explore works with maps disabled
- [ ] Explore works with maps enabled
- [ ] Errors are user-readable, no blank states

## Required Evidence in Every Handoff

- Commands run and outputs summary
- Screens or route-level behavior notes
- List of unresolved risks
- Next action with clear owner