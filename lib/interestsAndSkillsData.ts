/**
 * Comprehensive lists of interests and skills organized by category and themes
 * These populate the dropdown selectors in the profile builder
 */

export type Category = 'Adventure' | 'Creative' | 'HomeImprovement'

export interface InterestOrSkill {
  name: string
  theme: string
  category: Category
}

// Adventure Category
export const adventureInterests: InterestOrSkill[] = [
  // Outdoor Sports & Activities
  { name: 'Rock Climbing', theme: 'Outdoor Sports', category: 'Adventure' },
  { name: 'Bouldering', theme: 'Outdoor Sports', category: 'Adventure' },
  { name: 'Hiking', theme: 'Outdoor Sports', category: 'Adventure' },
  { name: 'Trail Running', theme: 'Outdoor Sports', category: 'Adventure' },
  { name: 'Backpacking', theme: 'Outdoor Sports', category: 'Adventure' },
  { name: 'Camping', theme: 'Outdoor Sports', category: 'Adventure' },
  { name: 'Mountaineering', theme: 'Outdoor Sports', category: 'Adventure' },
  { name: 'Scrambling', theme: 'Outdoor Sports', category: 'Adventure' },
  { name: 'Orienteering', theme: 'Outdoor Sports', category: 'Adventure' },
  { name: 'Geocaching', theme: 'Outdoor Sports', category: 'Adventure' },
  
  // Water Sports
  { name: 'Kayaking', theme: 'Water Sports', category: 'Adventure' },
  { name: 'Canoeing', theme: 'Water Sports', category: 'Adventure' },
  { name: 'Stand-up Paddleboarding', theme: 'Water Sports', category: 'Adventure' },
  { name: 'Surfing', theme: 'Water Sports', category: 'Adventure' },
  { name: 'Windsurfing', theme: 'Water Sports', category: 'Adventure' },
  { name: 'Kitesurfing', theme: 'Water Sports', category: 'Adventure' },
  { name: 'Sailing', theme: 'Water Sports', category: 'Adventure' },
  { name: 'Scuba Diving', theme: 'Water Sports', category: 'Adventure' },
  { name: 'Snorkeling', theme: 'Water Sports', category: 'Adventure' },
  { name: 'Open Water Swimming', theme: 'Water Sports', category: 'Adventure' },
  { name: 'Rowing', theme: 'Water Sports', category: 'Adventure' },
  { name: 'Whitewater Rafting', theme: 'Water Sports', category: 'Adventure' },
  
  // Winter Sports
  { name: 'Alpine Skiing', theme: 'Winter Sports', category: 'Adventure' },
  { name: 'Cross-Country Skiing', theme: 'Winter Sports', category: 'Adventure' },
  { name: 'Snowboarding', theme: 'Winter Sports', category: 'Adventure' },
  { name: 'Ice Climbing', theme: 'Winter Sports', category: 'Adventure' },
  { name: 'Ice Skating', theme: 'Winter Sports', category: 'Adventure' },
  { name: 'Snowshoeing', theme: 'Winter Sports', category: 'Adventure' },
  { name: 'Sledding', theme: 'Winter Sports', category: 'Adventure' },
  { name: 'Curling', theme: 'Winter Sports', category: 'Adventure' },
  
  // Cycling & Wheels
  { name: 'Mountain Biking', theme: 'Cycling', category: 'Adventure' },
  { name: 'Road Cycling', theme: 'Cycling', category: 'Adventure' },
  { name: 'BMX', theme: 'Cycling', category: 'Adventure' },
  { name: 'Bike Touring', theme: 'Cycling', category: 'Adventure' },
  { name: 'Unicycling', theme: 'Cycling', category: 'Adventure' },
  { name: 'Skateboarding', theme: 'Cycling', category: 'Adventure' },
  { name: 'Longboarding', theme: 'Cycling', category: 'Adventure' },
  { name: 'Rollerblading', theme: 'Cycling', category: 'Adventure' },
  
  // Adventure Activities
  { name: 'Skydiving', theme: 'Adventure Activities', category: 'Adventure' },
  { name: 'Paragliding', theme: 'Adventure Activities', category: 'Adventure' },
  { name: 'Hang Gliding', theme: 'Adventure Activities', category: 'Adventure' },
  { name: 'Bungee Jumping', theme: 'Adventure Activities', category: 'Adventure' },
  { name: 'Zip-lining', theme: 'Adventure Activities', category: 'Adventure' },
  { name: 'Caving', theme: 'Adventure Activities', category: 'Adventure' },
  { name: 'Canyoneering', theme: 'Adventure Activities', category: 'Adventure' },
  { name: 'Via Ferrata', theme: 'Adventure Activities', category: 'Adventure' },
  { name: 'Highlining', theme: 'Adventure Activities', category: 'Adventure' },
  { name: 'Slacklining', theme: 'Adventure Activities', category: 'Adventure' },
  
  // Fitness & Movement
  { name: 'Parkour', theme: 'Fitness', category: 'Adventure' },
  { name: 'Free Running', theme: 'Fitness', category: 'Adventure' },
  { name: 'Obstacle Course Racing', theme: 'Fitness', category: 'Adventure' },
  { name: 'Ultra Running', theme: 'Fitness', category: 'Adventure' },
]

// Creative/Hobbies Category
export const creativeInterests: InterestOrSkill[] = [
  // Visual Arts
  { name: 'Drawing', theme: 'Visual Arts', category: 'Creative' },
  { name: 'Watercolor Painting', theme: 'Visual Arts', category: 'Creative' },
  { name: 'Acrylic Painting', theme: 'Visual Arts', category: 'Creative' },
  { name: 'Oil Painting', theme: 'Visual Arts', category: 'Creative' },
  { name: 'Digital Art', theme: 'Visual Arts', category: 'Creative' },
  { name: 'Illustration', theme: 'Visual Arts', category: 'Creative' },
  { name: 'Sketching', theme: 'Visual Arts', category: 'Creative' },
  { name: 'Doodling', theme: 'Visual Arts', category: 'Creative' },
  { name: 'Calligraphy', theme: 'Visual Arts', category: 'Creative' },
  { name: 'Hand Lettering', theme: 'Visual Arts', category: 'Creative' },
  { name: 'Graffiti Art', theme: 'Visual Arts', category: 'Creative' },
  { name: 'Street Art', theme: 'Visual Arts', category: 'Creative' },
  { name: 'Mural Painting', theme: 'Visual Arts', category: 'Creative' },
  { name: 'Portrait Drawing', theme: 'Visual Arts', category: 'Creative' },
  { name: 'Landscape Painting', theme: 'Visual Arts', category: 'Creative' },
  { name: 'Abstract Art', theme: 'Visual Arts', category: 'Creative' },
  { name: 'Mixed Media Art', theme: 'Visual Arts', category: 'Creative' },
  
  // Photography
  { name: 'Portrait Photography', theme: 'Photography', category: 'Creative' },
  { name: 'Landscape Photography', theme: 'Photography', category: 'Creative' },
  { name: 'Street Photography', theme: 'Photography', category: 'Creative' },
  { name: 'Nature Photography', theme: 'Photography', category: 'Creative' },
  { name: 'Wildlife Photography', theme: 'Photography', category: 'Creative' },
  { name: 'Macro Photography', theme: 'Photography', category: 'Creative' },
  { name: 'Architecture Photography', theme: 'Photography', category: 'Creative' },
  { name: 'Food Photography', theme: 'Photography', category: 'Creative' },
  { name: 'Event Photography', theme: 'Photography', category: 'Creative' },
  { name: 'Wedding Photography', theme: 'Photography', category: 'Creative' },
  { name: 'Film Photography', theme: 'Photography', category: 'Creative' },
  { name: 'Darkroom Printing', theme: 'Photography', category: 'Creative' },
  { name: 'Photo Editing', theme: 'Photography', category: 'Creative' },
  { name: 'Video Editing', theme: 'Photography', category: 'Creative' },
  { name: 'Cinematography', theme: 'Photography', category: 'Creative' },
  { name: 'Drone Photography', theme: 'Photography', category: 'Creative' },
  
  // Crafts & Textiles
  { name: 'Sewing', theme: 'Crafts', category: 'Creative' },
  { name: 'Knitting', theme: 'Crafts', category: 'Creative' },
  { name: 'Crocheting', theme: 'Crafts', category: 'Creative' },
  { name: 'Embroidery', theme: 'Crafts', category: 'Creative' },
  { name: 'Cross-Stitch', theme: 'Crafts', category: 'Creative' },
  { name: 'Quilting', theme: 'Crafts', category: 'Creative' },
  { name: 'Weaving', theme: 'Crafts', category: 'Creative' },
  { name: 'Yarn Spinning', theme: 'Crafts', category: 'Creative' },
  { name: 'Fabric Dyeing', theme: 'Crafts', category: 'Creative' },
  { name: 'Mending', theme: 'Crafts', category: 'Creative' },
  { name: 'Pattern Making', theme: 'Crafts', category: 'Creative' },
  { name: 'Tailoring', theme: 'Crafts', category: 'Creative' },
  { name: 'Upholstery', theme: 'Crafts', category: 'Creative' },
  { name: 'Macramé', theme: 'Crafts', category: 'Creative' },
  { name: 'Tapestry', theme: 'Crafts', category: 'Creative' },
  { name: 'Felting', theme: 'Crafts', category: 'Creative' },
  { name: 'Lace Making', theme: 'Crafts', category: 'Creative' },
  
  // Pottery & Ceramics
  { name: 'Wheel Throwing', theme: 'Pottery', category: 'Creative' },
  { name: 'Hand Building Pottery', theme: 'Pottery', category: 'Creative' },
  { name: 'Ceramic Sculpture', theme: 'Pottery', category: 'Creative' },
  { name: 'Glazing', theme: 'Pottery', category: 'Creative' },
  { name: 'Kiln Firing', theme: 'Pottery', category: 'Creative' },
  { name: 'Raku Firing', theme: 'Pottery', category: 'Creative' },
  { name: 'Tile Making', theme: 'Pottery', category: 'Creative' },
  
  // Woodworking & Carpentry
  { name: 'Woodworking', theme: 'Woodworking', category: 'Creative' },
  { name: 'Carpentry', theme: 'Woodworking', category: 'Creative' },
  { name: 'Furniture Making', theme: 'Woodworking', category: 'Creative' },
  { name: 'Joinery', theme: 'Woodworking', category: 'Creative' },
  { name: 'Wood Carving', theme: 'Woodworking', category: 'Creative' },
  { name: 'Wood Turning', theme: 'Woodworking', category: 'Creative' },
  { name: 'Wood Finishing', theme: 'Woodworking', category: 'Creative' },
  { name: 'Cabinet Making', theme: 'Woodworking', category: 'Creative' },
  { name: 'Scroll Sawing', theme: 'Woodworking', category: 'Creative' },
  { name: 'Marquetry', theme: 'Woodworking', category: 'Creative' },
  { name: 'Intarsia', theme: 'Woodworking', category: 'Creative' },
  
  // Music & Sound
  { name: 'Acoustic Guitar', theme: 'Music', category: 'Creative' },
  { name: 'Electric Guitar', theme: 'Music', category: 'Creative' },
  { name: 'Bass Guitar', theme: 'Music', category: 'Creative' },
  { name: 'Piano', theme: 'Music', category: 'Creative' },
  { name: 'Keyboard', theme: 'Music', category: 'Creative' },
  { name: 'Drums', theme: 'Music', category: 'Creative' },
  { name: 'Violin', theme: 'Music', category: 'Creative' },
  { name: 'Cello', theme: 'Music', category: 'Creative' },
  { name: 'Viola', theme: 'Music', category: 'Creative' },
  { name: 'Double Bass', theme: 'Music', category: 'Creative' },
  { name: 'Flute', theme: 'Music', category: 'Creative' },
  { name: 'Saxophone', theme: 'Music', category: 'Creative' },
  { name: 'Trumpet', theme: 'Music', category: 'Creative' },
  { name: 'Trombone', theme: 'Music', category: 'Creative' },
  { name: 'Clarinet', theme: 'Music', category: 'Creative' },
  { name: 'Ukulele', theme: 'Music', category: 'Creative' },
  { name: 'Banjo', theme: 'Music', category: 'Creative' },
  { name: 'Mandolin', theme: 'Music', category: 'Creative' },
  { name: 'Harmonica', theme: 'Music', category: 'Creative' },
  { name: 'Singing', theme: 'Music', category: 'Creative' },
  { name: 'Songwriting', theme: 'Music', category: 'Creative' },
  { name: 'Music Production', theme: 'Music', category: 'Creative' },
  { name: 'Audio Engineering', theme: 'Music', category: 'Creative' },
  { name: 'DJing', theme: 'Music', category: 'Creative' },
  { name: 'Beat Making', theme: 'Music', category: 'Creative' },
  { name: 'Sound Design', theme: 'Music', category: 'Creative' },
  
  // Writing & Literature
  { name: 'Creative Writing', theme: 'Writing', category: 'Creative' },
  { name: 'Poetry', theme: 'Writing', category: 'Creative' },
  { name: 'Fiction Writing', theme: 'Writing', category: 'Creative' },
  { name: 'Non-Fiction Writing', theme: 'Writing', category: 'Creative' },
  { name: 'Screenwriting', theme: 'Writing', category: 'Creative' },
  { name: 'Playwriting', theme: 'Writing', category: 'Creative' },
  { name: 'Blogging', theme: 'Writing', category: 'Creative' },
  { name: 'Journaling', theme: 'Writing', category: 'Creative' },
  { name: 'Copywriting', theme: 'Writing', category: 'Creative' },
  { name: 'Editing', theme: 'Writing', category: 'Creative' },
  { name: 'Proofreading', theme: 'Writing', category: 'Creative' },
  { name: 'Storytelling', theme: 'Writing', category: 'Creative' },
  { name: 'Spoken Word', theme: 'Writing', category: 'Creative' },
  
  // Performance Arts
  { name: 'Acting', theme: 'Performance', category: 'Creative' },
  { name: 'Improv', theme: 'Performance', category: 'Creative' },
  { name: 'Stand-up Comedy', theme: 'Performance', category: 'Creative' },
  { name: 'Theater', theme: 'Performance', category: 'Creative' },
  { name: 'Ballet', theme: 'Performance', category: 'Creative' },
  { name: 'Contemporary Dance', theme: 'Performance', category: 'Creative' },
  { name: 'Hip-Hop Dance', theme: 'Performance', category: 'Creative' },
  { name: 'Ballroom Dance', theme: 'Performance', category: 'Creative' },
  { name: 'Salsa Dancing', theme: 'Performance', category: 'Creative' },
  { name: 'Swing Dancing', theme: 'Performance', category: 'Creative' },
  { name: 'Tap Dancing', theme: 'Performance', category: 'Creative' },
  { name: 'Jazz Dance', theme: 'Performance', category: 'Creative' },
  { name: 'Magic', theme: 'Performance', category: 'Creative' },
  { name: 'Juggling', theme: 'Performance', category: 'Creative' },
  { name: 'Circus Arts', theme: 'Performance', category: 'Creative' },
  { name: 'Puppetry', theme: 'Performance', category: 'Creative' },
  
  // Games & Puzzles
  { name: 'Chess', theme: 'Games', category: 'Creative' },
  { name: 'Go', theme: 'Games', category: 'Creative' },
  { name: 'Bridge', theme: 'Games', category: 'Creative' },
  { name: 'Poker', theme: 'Games', category: 'Creative' },
  { name: 'Board Game Design', theme: 'Games', category: 'Creative' },
  { name: 'Puzzle Solving', theme: 'Games', category: 'Creative' },
  { name: 'Escape Rooms', theme: 'Games', category: 'Creative' },
  { name: 'Tabletop RPGs', theme: 'Games', category: 'Creative' },
]

// Home Improvement Category
export const homeImprovementInterests: InterestOrSkill[] = [
  // Construction & Building
  { name: 'Framing', theme: 'Construction', category: 'HomeImprovement' },
  { name: 'Drywall Installation', theme: 'Construction', category: 'HomeImprovement' },
  { name: 'Drywall Repair', theme: 'Construction', category: 'HomeImprovement' },
  { name: 'Insulation', theme: 'Construction', category: 'HomeImprovement' },
  { name: 'Roofing', theme: 'Construction', category: 'HomeImprovement' },
  { name: 'Siding Installation', theme: 'Construction', category: 'HomeImprovement' },
  { name: 'Deck Building', theme: 'Construction', category: 'HomeImprovement' },
  { name: 'Fence Building', theme: 'Construction', category: 'HomeImprovement' },
  { name: 'Shed Building', theme: 'Construction', category: 'HomeImprovement' },
  { name: 'Gazebo Building', theme: 'Construction', category: 'HomeImprovement' },
  { name: 'Pergola Building', theme: 'Construction', category: 'HomeImprovement' },
  
  // Electrical Work
  { name: 'Electrical Basics', theme: 'Electrical', category: 'HomeImprovement' },
  { name: 'Wiring', theme: 'Electrical', category: 'HomeImprovement' },
  { name: 'Outlet Installation', theme: 'Electrical', category: 'HomeImprovement' },
  { name: 'Switch Installation', theme: 'Electrical', category: 'HomeImprovement' },
  { name: 'Light Fixture Installation', theme: 'Electrical', category: 'HomeImprovement' },
  { name: 'Ceiling Fan Installation', theme: 'Electrical', category: 'HomeImprovement' },
  { name: 'Electrical Troubleshooting', theme: 'Electrical', category: 'HomeImprovement' },
  { name: 'Smart Home Installation', theme: 'Electrical', category: 'HomeImprovement' },
  { name: 'Home Automation', theme: 'Electrical', category: 'HomeImprovement' },
  
  // Plumbing
  { name: 'Plumbing Basics', theme: 'Plumbing', category: 'HomeImprovement' },
  { name: 'Pipe Repair', theme: 'Plumbing', category: 'HomeImprovement' },
  { name: 'Faucet Installation', theme: 'Plumbing', category: 'HomeImprovement' },
  { name: 'Toilet Installation', theme: 'Plumbing', category: 'HomeImprovement' },
  { name: 'Sink Installation', theme: 'Plumbing', category: 'HomeImprovement' },
  { name: 'Shower Installation', theme: 'Plumbing', category: 'HomeImprovement' },
  { name: 'Bathtub Installation', theme: 'Plumbing', category: 'HomeImprovement' },
  { name: 'Water Heater Installation', theme: 'Plumbing', category: 'HomeImprovement' },
  { name: 'Leak Detection', theme: 'Plumbing', category: 'HomeImprovement' },
  { name: 'Drain Cleaning', theme: 'Plumbing', category: 'HomeImprovement' },
  { name: 'Pipe Insulation', theme: 'Plumbing', category: 'HomeImprovement' },
  
  // Flooring
  { name: 'Hardwood Flooring', theme: 'Flooring', category: 'HomeImprovement' },
  { name: 'Laminate Flooring', theme: 'Flooring', category: 'HomeImprovement' },
  { name: 'Tile Installation', theme: 'Flooring', category: 'HomeImprovement' },
  { name: 'Carpet Installation', theme: 'Flooring', category: 'HomeImprovement' },
  { name: 'Vinyl Flooring', theme: 'Flooring', category: 'HomeImprovement' },
  { name: 'Floor Sanding', theme: 'Flooring', category: 'HomeImprovement' },
  { name: 'Floor Refinishing', theme: 'Flooring', category: 'HomeImprovement' },
  { name: 'Grout Repair', theme: 'Flooring', category: 'HomeImprovement' },
  
  // Painting & Finishing
  { name: 'Interior Painting', theme: 'Painting', category: 'HomeImprovement' },
  { name: 'Exterior Painting', theme: 'Painting', category: 'HomeImprovement' },
  { name: 'Wallpaper Installation', theme: 'Painting', category: 'HomeImprovement' },
  { name: 'Texturing', theme: 'Painting', category: 'HomeImprovement' },
  { name: 'Staining', theme: 'Painting', category: 'HomeImprovement' },
  { name: 'Varnishing', theme: 'Painting', category: 'HomeImprovement' },
  { name: 'Faux Finishing', theme: 'Painting', category: 'HomeImprovement' },
  { name: 'Color Consultation', theme: 'Painting', category: 'HomeImprovement' },
  
  // Tiling & Masonry
  { name: 'Backsplash Installation', theme: 'Tiling', category: 'HomeImprovement' },
  { name: 'Grouting', theme: 'Tiling', category: 'HomeImprovement' },
  { name: 'Tile Repair', theme: 'Tiling', category: 'HomeImprovement' },
  { name: 'Brick Laying', theme: 'Tiling', category: 'HomeImprovement' },
  { name: 'Stone Work', theme: 'Tiling', category: 'HomeImprovement' },
  { name: 'Concrete Work', theme: 'Tiling', category: 'HomeImprovement' },
  { name: 'Mortar Mixing', theme: 'Tiling', category: 'HomeImprovement' },
  
  // Windows & Doors
  { name: 'Window Installation', theme: 'Windows & Doors', category: 'HomeImprovement' },
  { name: 'Window Repair', theme: 'Windows & Doors', category: 'HomeImprovement' },
  { name: 'Door Installation', theme: 'Windows & Doors', category: 'HomeImprovement' },
  { name: 'Door Repair', theme: 'Windows & Doors', category: 'HomeImprovement' },
  { name: 'Weatherstripping', theme: 'Windows & Doors', category: 'HomeImprovement' },
  { name: 'Window Treatment Installation', theme: 'Windows & Doors', category: 'HomeImprovement' },
  { name: 'Blinds Installation', theme: 'Windows & Doors', category: 'HomeImprovement' },
  { name: 'Curtain Hanging', theme: 'Windows & Doors', category: 'HomeImprovement' },
  
  // HVAC & Climate
  { name: 'HVAC Basics', theme: 'HVAC', category: 'HomeImprovement' },
  { name: 'Air Filter Replacement', theme: 'HVAC', category: 'HomeImprovement' },
  { name: 'Thermostat Installation', theme: 'HVAC', category: 'HomeImprovement' },
  { name: 'Vent Cleaning', theme: 'HVAC', category: 'HomeImprovement' },
  { name: 'Ductwork Repair', theme: 'HVAC', category: 'HomeImprovement' },
  { name: 'Insulation Installation', theme: 'HVAC', category: 'HomeImprovement' },
  
  // Appliance & Equipment
  { name: 'Appliance Repair', theme: 'Appliances', category: 'HomeImprovement' },
  { name: 'Appliance Installation', theme: 'Appliances', category: 'HomeImprovement' },
  { name: 'Tool Maintenance', theme: 'Appliances', category: 'HomeImprovement' },
  { name: 'Equipment Maintenance', theme: 'Appliances', category: 'HomeImprovement' },
  { name: 'Small Engine Repair', theme: 'Appliances', category: 'HomeImprovement' },
  { name: 'Bike Repair', theme: 'Appliances', category: 'HomeImprovement' },
  
  // Organization & Storage
  { name: 'Closet Organization', theme: 'Organization', category: 'HomeImprovement' },
  { name: 'Garage Organization', theme: 'Organization', category: 'HomeImprovement' },
  { name: 'Storage Solutions', theme: 'Organization', category: 'HomeImprovement' },
  { name: 'Shelving Installation', theme: 'Organization', category: 'HomeImprovement' },
  { name: 'Cabinet Installation', theme: 'Organization', category: 'HomeImprovement' },
  { name: 'Drawer Installation', theme: 'Organization', category: 'HomeImprovement' },
  
  // Landscaping & Outdoor
  { name: 'Gardening', theme: 'Landscaping', category: 'HomeImprovement' },
  { name: 'Vegetable Gardening', theme: 'Landscaping', category: 'HomeImprovement' },
  { name: 'Flower Gardening', theme: 'Landscaping', category: 'HomeImprovement' },
  { name: 'Container Gardening', theme: 'Landscaping', category: 'HomeImprovement' },
  { name: 'Urban Gardening', theme: 'Landscaping', category: 'HomeImprovement' },
  { name: 'Raised Bed Gardening', theme: 'Landscaping', category: 'HomeImprovement' },
  { name: 'Composting', theme: 'Landscaping', category: 'HomeImprovement' },
  { name: 'Plant Propagation', theme: 'Landscaping', category: 'HomeImprovement' },
  { name: 'Seed Starting', theme: 'Landscaping', category: 'HomeImprovement' },
  { name: 'Herb Growing', theme: 'Landscaping', category: 'HomeImprovement' },
  { name: 'Tree Care', theme: 'Landscaping', category: 'HomeImprovement' },
  { name: 'Lawn Care', theme: 'Landscaping', category: 'HomeImprovement' },
  { name: 'Landscaping Design', theme: 'Landscaping', category: 'HomeImprovement' },
  { name: 'Hardscaping', theme: 'Landscaping', category: 'HomeImprovement' },
  { name: 'Patio Building', theme: 'Landscaping', category: 'HomeImprovement' },
  { name: 'Walkway Installation', theme: 'Landscaping', category: 'HomeImprovement' },
  { name: 'Retaining Wall Building', theme: 'Landscaping', category: 'HomeImprovement' },
  { name: 'Irrigation Installation', theme: 'Landscaping', category: 'HomeImprovement' },
  { name: 'Outdoor Lighting', theme: 'Landscaping', category: 'HomeImprovement' },
  { name: 'Fire Pit Building', theme: 'Landscaping', category: 'HomeImprovement' },
  
  // Maintenance & Repair
  { name: 'Furniture Repair', theme: 'Repair', category: 'HomeImprovement' },
  { name: 'Upholstery Repair', theme: 'Repair', category: 'HomeImprovement' },
  { name: 'Appliance Troubleshooting', theme: 'Repair', category: 'HomeImprovement' },
  { name: 'General Home Maintenance', theme: 'Repair', category: 'HomeImprovement' },
  { name: 'Preventive Maintenance', theme: 'Repair', category: 'HomeImprovement' },
  { name: 'Seasonal Maintenance', theme: 'Repair', category: 'HomeImprovement' },
  
  // Safety & Security
  { name: 'Home Security Installation', theme: 'Safety', category: 'HomeImprovement' },
  { name: 'Smoke Detector Installation', theme: 'Safety', category: 'HomeImprovement' },
  { name: 'Carbon Monoxide Detector Installation', theme: 'Safety', category: 'HomeImprovement' },
  { name: 'Fire Safety', theme: 'Safety', category: 'HomeImprovement' },
  { name: 'First Aid', theme: 'Safety', category: 'HomeImprovement' },
  { name: 'Emergency Preparedness', theme: 'Safety', category: 'HomeImprovement' },
  
  // Energy Efficiency
  { name: 'Weatherization', theme: 'Energy', category: 'HomeImprovement' },
  { name: 'Energy Audit', theme: 'Energy', category: 'HomeImprovement' },
  { name: 'Solar Panel Installation', theme: 'Energy', category: 'HomeImprovement' },
  { name: 'Energy-Efficient Upgrades', theme: 'Energy', category: 'HomeImprovement' },
  
  // Cooking & Food (Home-related)
  { name: 'Cooking', theme: 'Food', category: 'HomeImprovement' },
  { name: 'Baking', theme: 'Food', category: 'HomeImprovement' },
  { name: 'Fermentation', theme: 'Food', category: 'HomeImprovement' },
  { name: 'Meal Planning', theme: 'Food', category: 'HomeImprovement' },
  { name: 'Knife Skills', theme: 'Food', category: 'HomeImprovement' },
  { name: 'Sourdough Baking', theme: 'Food', category: 'HomeImprovement' },
  { name: 'Canning & Preserving', theme: 'Food', category: 'HomeImprovement' },
  { name: 'Grilling', theme: 'Food', category: 'HomeImprovement' },
]

// Combine all for easy access
export const allInterestsAndSkills: InterestOrSkill[] = [
  ...adventureInterests,
  ...creativeInterests,
  ...homeImprovementInterests,
]

// Helper functions
export function getByCategory(category: Category): InterestOrSkill[] {
  return allInterestsAndSkills.filter(item => item.category === category)
}

export function getByTheme(category: Category, theme: string): InterestOrSkill[] {
  return allInterestsAndSkills.filter(item => item.category === category && item.theme === theme)
}

export function getThemes(category: Category): string[] {
  const themes = new Set<string>()
  allInterestsAndSkills
    .filter(item => item.category === category)
    .forEach(item => themes.add(item.theme))
  return Array.from(themes).sort()
}

export function searchItems(query: string, category?: Category): InterestOrSkill[] {
  const lowerQuery = query.toLowerCase()
  let items = category 
    ? allInterestsAndSkills.filter(item => item.category === category)
    : allInterestsAndSkills
  
  return items.filter(item => 
    item.name.toLowerCase().includes(lowerQuery) ||
    item.theme.toLowerCase().includes(lowerQuery)
  )
}
