/**
 * Inline SVG placeholder for the landing hero — a pencil-sketched skill
 * exchange: two figures trading a fly rod for a drywall trowel.
 *
 * This is a stop-gap. A real graphite-on-paper illustration is queued for
 * generation per docs/cursor-queue/2026-04-22-copy-and-hero-rework.md (Step 0)
 * and will replace this component via Prompt 4 of that queue.
 */
export function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 440 360"
      className="h-auto w-full max-w-md text-[var(--text-primary)]"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        {/* hand-drawn jitter on every stroked path */}
        <filter id="dabble-pencil" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="3" result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="2" />
        </filter>
        {/* gentler jitter for thinner / softer marks */}
        <filter id="dabble-pencil-soft" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="9" result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="1" />
        </filter>
      </defs>

      {/* warm paper tone behind the sketch */}
      <rect width="440" height="360" rx="24" fill="#f5ede0" fillOpacity="0.55" />

      {/* horizon / ground hint */}
      <g
        filter="url(#dabble-pencil-soft)"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
        strokeLinecap="round"
        opacity="0.5"
      >
        <path d="M30 296 Q220 302 410 294" />
        <path d="M55 301 Q220 307 395 302" strokeOpacity="0.4" />
      </g>

      {/* ---------- LEFT FIGURE — drywall, offering trowel ---------- */}
      <g
        filter="url(#dabble-pencil)"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      >
        {/* head + sketchy double-line */}
        <circle cx="140" cy="100" r="18" />
        <circle cx="140" cy="100" r="18.5" strokeWidth="0.5" strokeOpacity="0.4" />
        {/* hair tied back */}
        <path d="M124 92 Q140 78 156 92" strokeWidth="1" />
        <path d="M156 95 Q165 100 162 112" strokeWidth="0.9" strokeOpacity="0.7" />
        {/* neck */}
        <path d="M132 117 L132 130 M148 117 L148 130" strokeWidth="1" />
        {/* work-shirt torso */}
        <path d="M115 138 L118 215 L162 215 L165 138 Z" />
        {/* placket */}
        <path d="M140 145 L140 200" strokeWidth="0.7" strokeDasharray="3 4" strokeOpacity="0.5" />
        {/* sleeve fold */}
        <path d="M120 160 Q116 175 119 188" strokeWidth="0.6" strokeOpacity="0.5" />
        {/* left arm relaxed */}
        <path d="M117 145 L107 195 L113 235" />
        {/* right arm extended forward, offering trowel */}
        <path d="M165 145 Q190 152 210 165" />
        {/* hand grip */}
        <circle cx="210" cy="166" r="3.5" strokeWidth="1" />
        {/* legs */}
        <path d="M126 215 L122 290" />
        <path d="M154 215 L160 290" />
        {/* shoes */}
        <path d="M115 290 L132 290" strokeWidth="1.6" />
        <path d="M152 290 L168 290" strokeWidth="1.6" />
      </g>

      {/* light cross-hatch shading on left figure's shaded side */}
      <g
        filter="url(#dabble-pencil-soft)"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinecap="round"
        opacity="0.35"
      >
        <path d="M118 152 L122 168" />
        <path d="M118 162 L122 178" />
        <path d="M118 172 L122 188" />
        <path d="M119 182 L123 198" />
      </g>

      {/* ---------- TROWEL + DRYWALL PATCH ---------- */}
      <g
        filter="url(#dabble-pencil)"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.92"
      >
        {/* handle */}
        <path d="M213 165 L228 161" strokeWidth="2.2" />
        <path d="M218 164 L226 162" strokeWidth="0.6" strokeOpacity="0.5" />
        {/* trapezoidal blade */}
        <path d="M228 156 L260 151 L264 164 L232 169 Z" />
        {/* drywall scrap */}
        <path d="M223 184 L256 178 L260 197 L226 202 Z" strokeOpacity="0.75" />
        {/* surface hatch on patch */}
        <path d="M230 188 L255 184" strokeWidth="0.45" strokeOpacity="0.45" />
        <path d="M232 192 L257 188" strokeWidth="0.45" strokeOpacity="0.4" />
        <path d="M233 196 L257 192" strokeWidth="0.45" strokeOpacity="0.35" />
      </g>

      {/* ---------- RIGHT FIGURE — fly fisher, offering rod ---------- */}
      <g
        filter="url(#dabble-pencil)"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      >
        {/* head + sketchy double */}
        <circle cx="320" cy="100" r="18" />
        <circle cx="320" cy="100" r="18.5" strokeWidth="0.5" strokeOpacity="0.4" />
        {/* short hair */}
        <path d="M304 90 Q320 78 336 92" strokeWidth="1" />
        <path d="M336 92 Q336 100 332 105" strokeWidth="0.9" strokeOpacity="0.7" />
        {/* neck */}
        <path d="M312 117 L312 130 M328 117 L328 130" strokeWidth="1" />
        {/* fishing vest torso */}
        <path d="M295 138 L290 215 L350 215 L345 138 Z" />
        {/* center seam */}
        <path d="M320 138 L320 215" strokeWidth="0.6" strokeDasharray="3 3" strokeOpacity="0.4" />
        {/* main pocket */}
        <path d="M298 165 L320 165 L320 188 L298 188 Z" strokeWidth="0.85" strokeOpacity="0.6" />
        <path d="M309 175 L309 188" strokeWidth="0.55" strokeOpacity="0.5" />
        {/* small upper pocket */}
        <path d="M335 168 L344 168 L344 184 L335 184 Z" strokeWidth="0.75" strokeOpacity="0.55" />
        {/* left arm extended forward */}
        <path d="M295 145 Q278 150 268 162" />
        {/* hand */}
        <circle cx="270" cy="164" r="3.5" strokeWidth="1" />
        {/* right arm relaxed */}
        <path d="M345 148 L355 200 L350 235" />
        {/* legs */}
        <path d="M306 215 L302 290" />
        <path d="M334 215 L340 290" />
        {/* shoes */}
        <path d="M294 290 L312 290" strokeWidth="1.6" />
        <path d="M333 290 L348 290" strokeWidth="1.6" />
      </g>

      {/* hatch shading on right figure's shaded side */}
      <g
        filter="url(#dabble-pencil-soft)"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinecap="round"
        opacity="0.35"
      >
        <path d="M340 152 L344 168" />
        <path d="M340 162 L344 178" />
        <path d="M340 172 L344 188" />
        <path d="M341 182 L345 198" />
      </g>

      {/* ---------- FLY ROD — long sweep from right hand up over both figures ---------- */}
      <g
        filter="url(#dabble-pencil-soft)"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        opacity="0.9"
      >
        {/* main rod arc — handle at right hand, tip extending past upper-left */}
        <path d="M268 164 Q175 60 50 70" strokeWidth="1.5" />
        {/* second pass for grip-end thickness, fading */}
        <path d="M268 164 Q220 110 175 80" strokeWidth="0.55" strokeOpacity="0.55" />
        {/* reel near grip */}
        <circle cx="273" cy="170" r="5.5" strokeWidth="1.1" />
        <circle cx="273" cy="170" r="2.2" strokeWidth="0.6" strokeOpacity="0.55" />
        <path d="M273 165 L273 175" strokeWidth="0.5" strokeOpacity="0.5" />
        {/* line guides along the rod */}
        <circle cx="240" cy="138" r="1.4" strokeWidth="0.55" strokeOpacity="0.55" />
        <circle cx="208" cy="112" r="1.2" strokeWidth="0.5" strokeOpacity="0.5" />
        <circle cx="172" cy="90" r="1" strokeWidth="0.45" strokeOpacity="0.5" />
        <circle cx="130" cy="78" r="0.9" strokeWidth="0.45" strokeOpacity="0.45" />
        <circle cx="90" cy="72" r="0.8" strokeWidth="0.4" strokeOpacity="0.4" />
        {/* leader line beyond tip */}
        <path d="M50 70 Q38 65 28 70" strokeWidth="0.5" strokeOpacity="0.55" />
        {/* tiny dry fly tuft at the very tip */}
        <g strokeWidth="0.55" strokeOpacity="0.7">
          <path d="M28 70 L23 67" />
          <path d="M28 70 L24 73" />
          <path d="M28 70 L26 75" />
          <path d="M28 70 L21 71" />
          <path d="M28 70 L21 69" />
        </g>
      </g>

      {/* ---------- TACKLE BOX at right figure's feet ---------- */}
      <g
        filter="url(#dabble-pencil-soft)"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.95"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      >
        <path d="M348 268 L378 268 L378 285 L348 285 Z" />
        <path d="M353 268 L353 261 Q363 256 373 261 L373 268" />
        <path d="M348 274 L378 274" />
        <path d="M361 278 L361 282" />
      </g>

      {/* ---------- MUD PAN at left figure's feet ---------- */}
      <g
        filter="url(#dabble-pencil-soft)"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.95"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      >
        <path d="M104 274 Q100 290 106 290 L150 290 Q156 290 152 274 Z" />
        <path d="M110 281 Q128 285 148 281" strokeOpacity="0.45" />
      </g>

      {/* soft ground shadows under each figure */}
      <ellipse cx="140" cy="296" rx="36" ry="3" fill="currentColor" fillOpacity="0.07" />
      <ellipse cx="320" cy="296" rx="36" ry="3" fill="currentColor" fillOpacity="0.07" />
    </svg>
  );
}
