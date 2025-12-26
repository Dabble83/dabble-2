'use client'

interface MapDestinationProps {
  x: number
  y: number
  href: string
  children: React.ReactNode
  category: string
}

function MapDestination({ x, y, href, children, category }: MapDestinationProps) {
  return (
    <g className="group">
      <a href={href} className="cursor-pointer">
        <g transform={`translate(${x}, ${y})`}>
          {/* Clickable area */}
          <rect
            x="-60"
            y="-60"
            width="120"
            height="120"
            fill="transparent"
          />
          {children}
        </g>
      </a>
      {/* Category label */}
      <text
        x={x}
        y={y + 80}
        fill="#2d5016"
        opacity="0.6"
        className="group-hover:opacity-100 transition-opacity pointer-events-none"
        textAnchor="middle"
        fontSize="14"
        fontFamily="sans-serif"
        fontWeight="500"
      >
        {category}
      </text>
    </g>
  )
}

export default function HandDrawnMap() {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-auto" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>
      {/* Background base */}
      <rect width="800" height="600" fill="#faf8f5" opacity="0.3" />
      
      {/* Topo contour lines - subtle, imperfect, hand-drawn */}
      <g opacity="0.12" stroke="#2d5016" strokeWidth="1.2" fill="none" strokeLinecap="round">
        {/* Contour lines around adventure area - slightly wobbly */}
        <path d="M 148 198 Q 200 178 252 202 T 352 198" strokeDasharray="2,4" />
        <path d="M 122 222 Q 198 198 282 222 T 442 218" strokeDasharray="2,4" />
        
        {/* Contour lines around home improvement - not perfect circles */}
        <path d="M 420 250 Q 460 220 480 250 Q 460 280 420 250" strokeDasharray="2,5" />
        <path d="M 400 250 Q 450 210 500 250 Q 450 290 400 250" strokeDasharray="2,5" />
        
        {/* Contour lines around creative area - wavy */}
        <path d="M 202 398 Q 248 382 302 402 T 402 398" strokeDasharray="2,4" />
        <path d="M 182 452 Q 248 428 322 452 T 462 448" strokeDasharray="2,4" />
      </g>

      {/* Dotted paths connecting destinations - hand-drawn, imperfect */}
      <g stroke="#2d5016" strokeWidth="2.2" fill="none" opacity="0.35" strokeDasharray="5,7" strokeLinecap="round">
        {/* Path from adventure to home improvement - slightly wavy */}
        <path d="M 298 218 Q 375 228 448 252" />
        
        {/* Path from home improvement to creative - curved */}
        <path d="M 498 302 Q 448 352 402 398" />
        
        {/* Path from creative back to adventure - meandering */}
        <path d="M 302 422 Q 218 342 252 282" />
      </g>

      {/* Location pins at destinations */}
      <g>
        {/* Adventure pin */}
        <circle cx="250" cy="200" r="5" fill="#fb923c" opacity="0.7" />
        <path d="M 250 200 L 250 185 M 250 200 L 240 195 M 250 200 L 260 195" 
              stroke="#fb923c" strokeWidth="2" opacity="0.7" strokeLinecap="round" />
        
        {/* Home improvement pin */}
        <circle cx="500" cy="250" r="5" fill="#fb923c" opacity="0.7" />
        <path d="M 500 250 L 500 235 M 500 250 L 490 245 M 500 250 L 510 245" 
              stroke="#fb923c" strokeWidth="2" opacity="0.7" strokeLinecap="round" />
        
        {/* Creative pin */}
        <circle cx="300" cy="400" r="5" fill="#fb923c" opacity="0.7" />
        <path d="M 300 400 L 300 385 M 300 400 L 290 395 M 300 400 L 310 395" 
              stroke="#fb923c" strokeWidth="2" opacity="0.7" strokeLinecap="round" />
      </g>

      {/* DESTINATION 1: Adventure / Outdoors */}
      <MapDestination x={250} y={200} href="/explore?category=adventure" category="Adventure">
          {/* Mountains - imperfect hand-drawn peaks with varying stroke */}
          <g opacity="0.85">
            {/* Left mountain - wobbly, hand-drawn */}
            <path 
              d="M -42 32 L -22 -8 L -7 7 L 7 -13 L 22 12 L 42 32 Z" 
              fill="none" 
              stroke="#2d5016" 
              strokeWidth="2.8"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Watercolor fill for mountains - soft, imperfect */}
            <path 
              d="M -42 32 L -22 -8 L -7 7 L 7 -13 L 22 12 L 42 32 Z" 
              fill="#a8d5a3" 
              opacity="0.25"
            />
            
            {/* River - wavy, imperfect, hand-drawn */}
            <path 
              d="M -52 42 Q -32 37 -12 42 T 32 42 T 52 37" 
              fill="none" 
              stroke="#7dd3fc" 
              strokeWidth="3.2"
              opacity="0.55"
              strokeLinecap="round"
            />
            <path 
              d="M -52 47 Q -32 42 -12 47 T 32 47 T 52 42" 
              fill="none" 
              stroke="#7dd3fc" 
              strokeWidth="2.2"
              opacity="0.35"
              strokeLinecap="round"
            />
          
          {/* Kayakers - simple stick figures in boats */}
          <g transform="translate(-25, 38)">
            {/* Boat 1 */}
            <ellipse cx="0" cy="0" rx="8" ry="3" fill="#8b6f47" opacity="0.6" />
            {/* Person in boat */}
            <circle cx="0" cy="-3" r="2" fill="#2d5016" opacity="0.7" />
            <line x1="0" y1="-1" x2="0" y2="2" stroke="#2d5016" strokeWidth="1.5" opacity="0.7" />
            <line x1="0" y1="0" x2="-4" y2="2" stroke="#2d5016" strokeWidth="1.5" opacity="0.7" />
            <line x1="0" y1="0" x2="4" y2="2" stroke="#2d5016" strokeWidth="1.5" opacity="0.7" />
          </g>
          
          <g transform="translate(15, 36)">
            {/* Boat 2 */}
            <ellipse cx="0" cy="0" rx="8" ry="3" fill="#8b6f47" opacity="0.6" />
            {/* Person in boat */}
            <circle cx="0" cy="-3" r="2" fill="#2d5016" opacity="0.7" />
            <line x1="0" y1="-1" x2="0" y2="2" stroke="#2d5016" strokeWidth="1.5" opacity="0.7" />
            <line x1="0" y1="0" x2="-4" y2="2" stroke="#2d5016" strokeWidth="1.5" opacity="0.7" />
            <line x1="0" y1="0" x2="4" y2="2" stroke="#2d5016" strokeWidth="1.5" opacity="0.7" />
          </g>
          
          {/* Climbers on mountain - stick figures */}
          <g transform="translate(-10, -5)">
            {/* Person 1 */}
            <circle cx="0" cy="0" r="2.5" fill="#2d5016" opacity="0.8" />
            <line x1="0" y1="2.5" x2="0" y2="8" stroke="#2d5016" strokeWidth="2" opacity="0.8" />
            <line x1="0" y1="5" x2="-3" y2="7" stroke="#2d5016" strokeWidth="1.5" opacity="0.8" />
            <line x1="0" y1="5" x2="3" y2="7" stroke="#2d5016" strokeWidth="1.5" opacity="0.8" />
            <line x1="0" y1="8" x2="-2" y2="10" stroke="#2d5016" strokeWidth="1.5" opacity="0.8" />
            <line x1="0" y1="8" x2="2" y2="10" stroke="#2d5016" strokeWidth="1.5" opacity="0.8" />
          </g>
          
          {/* People talking - two stick figures near river */}
          <g transform="translate(-35, 30)">
            {/* Person 1 */}
            <circle cx="0" cy="0" r="3" fill="#2d5016" opacity="0.7" />
            <line x1="0" y1="3" x2="0" y2="10" stroke="#2d5016" strokeWidth="2" opacity="0.7" />
            <line x1="0" y1="6" x2="-4" y2="9" stroke="#2d5016" strokeWidth="1.5" opacity="0.7" />
            <line x1="0" y1="6" x2="4" y2="9" stroke="#2d5016" strokeWidth="1.5" opacity="0.7" />
            
            {/* Person 2 */}
            <circle cx="12" cy="0" r="3" fill="#2d5016" opacity="0.7" />
            <line x1="12" y1="3" x2="12" y2="10" stroke="#2d5016" strokeWidth="2" opacity="0.7" />
            <line x1="12" y1="6" x2="8" y2="9" stroke="#2d5016" strokeWidth="1.5" opacity="0.7" />
            <line x1="12" y1="6" x2="16" y2="9" stroke="#2d5016" strokeWidth="1.5" opacity="0.7" />
            
            {/* Speech indication - wavy line */}
            <path d="M 18 2 Q 20 0 22 2 Q 24 4 26 2" fill="none" stroke="#2d5016" strokeWidth="1" opacity="0.5" />
          </g>
        </g>
      </MapDestination>

      {/* DESTINATION 2: Home Improvement */}
      <MapDestination x={500} y={250} href="/explore?category=home-improvement" category="Home Improvement">
        <g opacity="0.8">
          {/* House - simple, hand-drawn, imperfect */}
          {/* Roof - slightly wobbly */}
          <path 
            d="M -27 -18 L 0 -37 L 27 -18 Z" 
            fill="#fb923c" 
            opacity="0.35"
            stroke="#2d5016" 
            strokeWidth="2.8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* House body - not perfectly rectangular */}
          <path 
            d="M -27 -18 L -27 22 L 27 22 L 27 -18 Z" 
            fill="#a8d5a3" 
            opacity="0.25"
            stroke="#2d5016" 
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          {/* Door - hand-drawn */}
          <path 
            d="M -8 2 L -8 20 L 8 20 L 8 2 Q 8 0 0 0 Q -8 0 -8 2" 
            fill="#8b6f47" 
            opacity="0.55"
            stroke="#2d5016" 
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Window - slightly imperfect */}
          <path 
            d="M 8 -15 L 20 -15 L 20 -3 L 8 -3 Z" 
            fill="#7dd3fc" 
            opacity="0.35"
            stroke="#2d5016" 
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          
          {/* People with plans - two stick figures */}
          <g transform="translate(-15, 25)">
            {/* Person 1 pointing at plans */}
            <circle cx="0" cy="0" r="3" fill="#2d5016" opacity="0.7" />
            <line x1="0" y1="3" x2="0" y2="12" stroke="#2d5016" strokeWidth="2" opacity="0.7" />
            {/* Arms - one pointing, one holding */}
            <line x1="0" y1="6" x2="-6" y2="8" stroke="#2d5016" strokeWidth="1.5" opacity="0.7" />
            <line x1="0" y1="6" x2="8" y2="4" stroke="#2d5016" strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
            <line x1="8" y1="4" x2="12" y2="2" stroke="#2d5016" strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
            <line x1="0" y1="12" x2="-3" y2="15" stroke="#2d5016" strokeWidth="1.5" opacity="0.7" />
            <line x1="0" y1="12" x2="3" y2="15" stroke="#2d5016" strokeWidth="1.5" opacity="0.7" />
            
            {/* Plans/paper */}
            <rect x="12" y="0" width="15" height="12" fill="#faf8f5" opacity="0.9" stroke="#2d5016" strokeWidth="1.5" rx="1" />
            <line x1="14" y1="4" x2="24" y2="4" stroke="#2d5016" strokeWidth="0.5" opacity="0.5" />
            <line x1="14" y1="7" x2="22" y2="7" stroke="#2d5016" strokeWidth="0.5" opacity="0.5" />
            <line x1="14" y1="10" x2="25" y2="10" stroke="#2d5016" strokeWidth="0.5" opacity="0.5" />
            
            {/* Pencil behind ear - simple line */}
            <line x1="2" y1="-2" x2="2" y2="-8" stroke="#fb923c" strokeWidth="2" opacity="0.8" strokeLinecap="round" />
            <path d="M 2 -8 L 4 -10 L 2 -10 Z" fill="#fb923c" opacity="0.8" />
          </g>
          
          <g transform="translate(15, 25)">
            {/* Person 2 looking at plans */}
            <circle cx="0" cy="0" r="3" fill="#2d5016" opacity="0.7" />
            <line x1="0" y1="3" x2="0" y2="12" stroke="#2d5016" strokeWidth="2" opacity="0.7" />
            <line x1="0" y1="6" x2="-5" y2="8" stroke="#2d5016" strokeWidth="1.5" opacity="0.7" />
            <line x1="0" y1="6" x2="5" y2="8" stroke="#2d5016" strokeWidth="1.5" opacity="0.7" />
            <line x1="0" y1="12" x2="-3" y2="15" stroke="#2d5016" strokeWidth="1.5" opacity="0.7" />
            <line x1="0" y1="12" x2="3" y2="15" stroke="#2d5016" strokeWidth="1.5" opacity="0.7" />
          </g>
        </g>
      </MapDestination>

      {/* DESTINATION 3: Creative / Hobbies */}
      <MapDestination x={300} y={400} href="/explore?category=creative" category="Creative">
        <g opacity="0.8">
          {/* Couch - simple, hand-drawn, slightly wobbly */}
          <path 
            d="M -42 12 Q -42 2 -30 2 L 32 2 Q 42 2 42 12 L 42 27 Q 42 32 30 32 L -30 32 Q -42 32 -42 27 Z" 
            fill="#8b6f47" 
            opacity="0.45"
            stroke="#2d5016" 
            strokeWidth="2.8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          
          {/* Person 1 on couch - knitting */}
          <g transform="translate(-20, -5)">
            {/* Head */}
            <circle cx="0" cy="0" r="3" fill="#2d5016" opacity="0.7" />
            {/* Body */}
            <line x1="0" y1="3" x2="0" y2="12" stroke="#2d5016" strokeWidth="2" opacity="0.7" />
            {/* Arms - holding knitting needles */}
            <line x1="0" y1="6" x2="-8" y2="4" stroke="#2d5016" strokeWidth="1.5" opacity="0.7" />
            <line x1="-8" y1="4" x2="-12" y2="2" stroke="#2d5016" strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
            <line x1="0" y1="6" x2="8" y2="4" stroke="#2d5016" strokeWidth="1.5" opacity="0.7" />
            <line x1="8" y1="4" x2="12" y2="2" stroke="#2d5016" strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
            {/* Legs */}
            <line x1="0" y1="12" x2="-3" y2="18" stroke="#2d5016" strokeWidth="1.5" opacity="0.7" />
            <line x1="0" y1="12" x2="3" y2="18" stroke="#2d5016" strokeWidth="1.5" opacity="0.7" />
            {/* Yarn/knitting */}
            <ellipse cx="-10" cy="3" rx="4" ry="3" fill="#fb923c" opacity="0.4" />
            <path d="M -12 3 Q -8 5 -6 3" fill="none" stroke="#fb923c" strokeWidth="1" opacity="0.5" />
          </g>
          
          {/* Person 2 on couch - drawing */}
          <g transform="translate(5, -5)">
            {/* Head */}
            <circle cx="0" cy="0" r="3" fill="#2d5016" opacity="0.7" />
            {/* Body */}
            <line x1="0" y1="3" x2="0" y2="12" stroke="#2d5016" strokeWidth="2" opacity="0.7" />
            {/* Arms - one holding sketchbook */}
            <line x1="0" y1="6" x2="-6" y2="8" stroke="#2d5016" strokeWidth="1.5" opacity="0.7" />
            <line x1="0" y1="6" x2="8" y2="5" stroke="#2d5016" strokeWidth="1.5" opacity="0.7" />
            <line x1="0" y1="12" x2="-3" y2="18" stroke="#2d5016" strokeWidth="1.5" opacity="0.7" />
            <line x1="0" y1="12" x2="3" y2="18" stroke="#2d5016" strokeWidth="1.5" opacity="0.7" />
            {/* Sketchbook */}
            <rect x="8" y="2" width="10" height="8" fill="#faf8f5" opacity="0.9" stroke="#2d5016" strokeWidth="1.5" rx="1" />
            <line x1="9" y1="5" x2="16" y2="5" stroke="#2d5016" strokeWidth="0.5" opacity="0.4" />
            <circle cx="11" cy="7" r="1.5" fill="none" stroke="#2d5016" strokeWidth="0.5" opacity="0.4" />
          </g>
          
          {/* Person 3 on couch - chatting */}
          <g transform="translate(25, -5)">
            {/* Head */}
            <circle cx="0" cy="0" r="3" fill="#2d5016" opacity="0.7" />
            {/* Body */}
            <line x1="0" y1="3" x2="0" y2="12" stroke="#2d5016" strokeWidth="2" opacity="0.7" />
            {/* Arms */}
            <line x1="0" y1="6" x2="-5" y2="8" stroke="#2d5016" strokeWidth="1.5" opacity="0.7" />
            <line x1="0" y1="6" x2="5" y2="8" stroke="#2d5016" strokeWidth="1.5" opacity="0.7" />
            <line x1="0" y1="12" x2="-3" y2="18" stroke="#2d5016" strokeWidth="1.5" opacity="0.7" />
            <line x1="0" y1="12" x2="3" y2="18" stroke="#2d5016" strokeWidth="1.5" opacity="0.7" />
            {/* Speech bubble */}
            <path d="M 8 -2 Q 10 -4 12 -2 Q 14 0 12 2 Q 10 4 8 2" fill="#faf8f5" opacity="0.9" stroke="#2d5016" strokeWidth="1" />
            <circle cx="10" cy="0" r="1.5" fill="#2d5016" opacity="0.3" />
          </g>
        </g>
      </MapDestination>
    </svg>
  )
}

