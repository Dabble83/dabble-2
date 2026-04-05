# Profile Builder Enhancement Plan

## Issues to Fix

### 1. AI Service Configuration
- **Problem**: "AI service is not configured" error
- **Fix**: Verify OPENAI_API_KEY is being read correctly, add better error handling

### 2. Restructure Profile Builder
- **Current**: Mixed interests and skills in same section
- **New Structure**:
  1. **Section 1: Interests** (What you're curious about)
     - 3 category dropdowns (Adventure, Hobbies & Creative, Home Improvement)
     - Search functionality
     - Add custom interests
  2. **Section 2: Skills You Want to Teach** (What you can offer)
     - 3 category dropdowns (Adventure, Hobbies & Creative, Home Improvement)
     - Search functionality
     - Add custom skills

### 3. Enhanced Dropdown Components
- Search/filter functionality
- Ability to add custom items
- Organized by category with sub-themes
- Visual organization by themes

## Comprehensive Interest & Skill Lists

### Adventure Category

#### Outdoor Sports & Activities
- Rock Climbing
- Bouldering
- Hiking
- Trail Running
- Backpacking
- Camping
- Mountaineering
- Scrambling
- Orienteering
- Geocaching

#### Water Sports
- Kayaking
- Canoeing
- Stand-up Paddleboarding (SUP)
- Surfing
- Windsurfing
- Kitesurfing
- Sailing
- Scuba Diving
- Snorkeling
- Swimming (Open Water)
- Rowing
- Whitewater Rafting

#### Winter Sports
- Skiing (Alpine)
- Skiing (Cross-Country)
- Snowboarding
- Ice Climbing
- Ice Skating
- Snowshoeing
- Sledding
- Curling

#### Cycling & Wheels
- Mountain Biking
- Road Cycling
- BMX
- Bike Touring
- Unicycling
- Skateboarding
- Longboarding
- Rollerblading

#### Adventure Activities
- Skydiving
- Paragliding
- Hang Gliding
- Bungee Jumping
- Zip-lining
- Caving/Spelunking
- Canyoneering
- Via Ferrata
- Highlining
- Slacklining

#### Fitness & Movement
- Parkour
- Free Running
- Obstacle Course Racing
- Trail Running
- Ultra Running

### Hobbies & Creative Category

#### Visual Arts
- Drawing
- Painting (Watercolor)
- Painting (Acrylic)
- Painting (Oil)
- Digital Art
- Illustration
- Sketching
- Doodling
- Calligraphy
- Hand Lettering
- Graffiti Art
- Street Art
- Mural Painting
- Portrait Drawing
- Landscape Painting
- Abstract Art
- Mixed Media Art

#### Photography
- Photography (Portrait)
- Photography (Landscape)
- Photography (Street)
- Photography (Nature)
- Photography (Wildlife)
- Photography (Macro)
- Photography (Architecture)
- Photography (Food)
- Photography (Event)
- Photography (Wedding)
- Film Photography
- Darkroom Printing
- Photo Editing
- Video Editing
- Cinematography
- Drone Photography

#### Crafts & Textiles
- Sewing
- Knitting
- Crocheting
- Embroidery
- Cross-Stitch
- Quilting
- Weaving
- Spinning (Yarn)
- Dyeing (Fabric)
- Mending
- Pattern Making
- Tailoring
- Upholstery
- Macramé
- Tapestry
- Felting
- Lace Making

#### Pottery & Ceramics
- Pottery (Wheel Throwing)
- Pottery (Hand Building)
- Ceramic Sculpture
- Glazing
- Kiln Firing
- Raku Firing
- Tile Making

#### Woodworking & Carpentry
- Woodworking
- Carpentry
- Furniture Making
- Joinery
- Wood Carving
- Wood Turning
- Wood Finishing
- Cabinet Making
- Scroll Sawing
- Marquetry
- Intarsia

#### Music & Sound
- Guitar (Acoustic)
- Guitar (Electric)
- Bass Guitar
- Piano
- Keyboard
- Drums
- Violin
- Cello
- Viola
- Double Bass
- Flute
- Saxophone
- Trumpet
- Trombone
- Clarinet
- Ukulele
- Banjo
- Mandolin
- Harmonica
- Singing
- Songwriting
- Music Production
- Audio Engineering
- DJing
- Beat Making
- Sound Design

#### Writing & Literature
- Creative Writing
- Poetry
- Fiction Writing
- Non-Fiction Writing
- Screenwriting
- Playwriting
- Blogging
- Journaling
- Copywriting
- Editing
- Proofreading
- Storytelling
- Spoken Word

#### Performance Arts
- Acting
- Improv
- Stand-up Comedy
- Theater
- Dance (Ballet)
- Dance (Contemporary)
- Dance (Hip-Hop)
- Dance (Ballroom)
- Dance (Salsa)
- Dance (Swing)
- Dance (Tap)
- Dance (Jazz)
- Magic
- Juggling
- Circus Arts
- Puppetry

#### Games & Puzzles
- Chess
- Go
- Bridge
- Poker
- Board Game Design
- Puzzle Solving
- Escape Rooms
- Tabletop RPGs

#### Collecting & Hobbies
- Stamp Collecting
- Coin Collecting
- Vinyl Collecting
- Book Collecting
- Art Collecting
- Antique Collecting
- Vintage Collecting

### Home Improvement Category

#### Construction & Building
- Framing
- Drywall Installation
- Drywall Repair
- Insulation
- Roofing
- Siding Installation
- Deck Building
- Fence Building
- Shed Building
- Gazebo Building
- Pergola Building

#### Electrical Work
- Electrical Basics
- Wiring
- Outlet Installation
- Switch Installation
- Light Fixture Installation
- Ceiling Fan Installation
- Electrical Troubleshooting
- Smart Home Installation
- Home Automation

#### Plumbing
- Plumbing Basics
- Pipe Repair
- Faucet Installation
- Toilet Installation
- Sink Installation
- Shower Installation
- Bathtub Installation
- Water Heater Installation
- Leak Detection
- Drain Cleaning
- Pipe Insulation

#### Flooring
- Hardwood Flooring
- Laminate Flooring
- Tile Installation
- Carpet Installation
- Vinyl Flooring
- Floor Sanding
- Floor Refinishing
- Grout Repair

#### Painting & Finishing
- Interior Painting
- Exterior Painting
- Wallpaper Installation
- Texturing
- Staining
- Varnishing
- Faux Finishing
- Color Consultation

#### Tiling & Masonry
- Tile Installation (Floor)
- Tile Installation (Wall)
- Tile Installation (Backsplash)
- Grouting
- Tile Repair
- Brick Laying
- Stone Work
- Concrete Work
- Mortar Mixing

#### Windows & Doors
- Window Installation
- Window Repair
- Door Installation
- Door Repair
- Weatherstripping
- Window Treatment Installation
- Blinds Installation
- Curtain Hanging

#### HVAC & Climate
- HVAC Basics
- Air Filter Replacement
- Thermostat Installation
- Vent Cleaning
- Ductwork Repair
- Insulation Installation

#### Appliance & Equipment
- Appliance Repair
- Appliance Installation
- Tool Maintenance
- Equipment Maintenance
- Small Engine Repair

#### Organization & Storage
- Closet Organization
- Garage Organization
- Storage Solutions
- Shelving Installation
- Cabinet Installation
- Drawer Installation

#### Landscaping & Outdoor
- Gardening
- Vegetable Gardening
- Flower Gardening
- Container Gardening
- Urban Gardening
- Raised Bed Gardening
- Composting
- Plant Propagation
- Seed Starting
- Herb Growing
- Tree Care
- Lawn Care
- Landscaping Design
- Hardscaping
- Patio Building
- Walkway Installation
- Retaining Wall Building
- Irrigation Installation
- Outdoor Lighting
- Fire Pit Building

#### Maintenance & Repair
- Furniture Repair
- Upholstery Repair
- Appliance Troubleshooting
- General Home Maintenance
- Preventive Maintenance
- Seasonal Maintenance

#### Safety & Security
- Home Security Installation
- Smoke Detector Installation
- Carbon Monoxide Detector Installation
- Fire Safety
- First Aid
- Emergency Preparedness

#### Energy Efficiency
- Weatherization
- Energy Audit
- Solar Panel Installation
- Energy-Efficient Upgrades

## Implementation Steps

### Step 1: Fix AI Service Configuration
- Add better error logging
- Verify env var loading
- Add fallback error message

### Step 2: Create Interest/Skill Data Files
- Create JSON files with comprehensive lists
- Organize by category and sub-themes
- Make searchable

### Step 3: Create Enhanced Dropdown Component
- Search/filter functionality
- Add custom item capability
- Category filtering
- Theme grouping

### Step 4: Restructure Profile Builder
- Separate Interests section
- Separate Skills section
- Update form state management
- Update save logic

### Step 5: Update Database Operations
- Save interests as JSON array
- Save skills with 'offers' type
- Handle custom items

## Component Structure

```
ProfileBuilder
├── ProfilePictureUpload
├── Basic Info (name, username)
├── Interests Section
│   ├── CategoryInterestSelector (Adventure)
│   ├── CategoryInterestSelector (Creative)
│   └── CategoryInterestSelector (HomeImprovement)
├── Skills Section (What you can teach)
│   ├── CategorySkillSelector (Adventure)
│   ├── CategorySkillSelector (Creative)
│   └── CategorySkillSelector (HomeImprovement)
├── Profile Intro Text
└── AI Widget
```
