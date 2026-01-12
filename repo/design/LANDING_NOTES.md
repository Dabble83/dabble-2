# Landing Page Visual Spec (v1)

Goal: Update the landing page UI to match the concept image:
public/design/concepts/dabble-landing-concept.png

Hard requirements:
- Top nav: Dabble (left), Sign In, Sign Up, About (right)
- Hero: H1 "Try something new, wherever you are."
- Subtext: "Learn by dabbling with people nearby."
- Primary CTA button: "Join the early community"
- Background: soft paper texture, muted watercolor landscape (use CSS gradients + subtle noise SVG)
- Mid-section: 4 icon tiles with labels:
  - Explore nearby (map icon)
  - Try something new (sailboat icon)
  - Meet Dabblers (two people at table)
  - Share what you know (bike + small scene)
- Bottom: email capture + "Get Early Access"
- Footer line: "→ Brooklyn, NY · Golden, Colorado"

Implementation guidance:
- Do NOT try to paint a full illustration; approximate with simple shapes, gradients, and SVG icons.
- Use inline SVGs and a light texture overlay.
- Keep Tailwind classes if already in use.
