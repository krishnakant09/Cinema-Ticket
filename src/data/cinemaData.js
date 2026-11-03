export const MOVIES = [
  {
    id: 'dune-2',
    title: 'Dune: Part Two',
    tagline: 'Long live the fighters.',
    genre: ['Sci-Fi', 'Adventure', 'Action'],
    rating: 'PG-13',
    imdb: '8.6',
    duration: '2h 46m',
    releaseYear: 2024,
    director: 'Denis Villeneuve',
    stars: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Austin Butler'],
    synopsis:
      'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
    poster:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    backdrop:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1800&auto=format&fit=crop',
    trailerSrc: '/trailers/dune2.mp4',
    formats: ['IMAX with Laser 3D', 'Dolby Cinema', '4DX'],
    accentColor: '#f59e0b',
  },
  {
    id: 'interstellar',
    title: 'Interstellar: 10th Anniversary',
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    genre: ['Sci-Fi', 'Drama', 'Adventure'],
    rating: 'PG-13',
    imdb: '8.7',
    duration: '2h 49m',
    releaseYear: 2024,
    director: 'Christopher Nolan',
    stars: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    synopsis:
      'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans through a wormhole near Saturn.',
    poster:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    backdrop:
      'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1800&auto=format&fit=crop',
    trailerSrc: '/trailers/interstellar.mp4',
    formats: ['IMAX 70mm', 'Dolby Cinema Atmos'],
    accentColor: '#38bdf8',
  },
  {
    id: 'avatar-2',
    title: 'Avatar: The Way of Water',
    tagline: 'Return to Pandora.',
    genre: ['Sci-Fi', 'Adventure', 'Fantasy'],
    rating: 'PG-13',
    imdb: '7.6',
    duration: '3h 12m',
    releaseYear: 2023,
    director: 'James Cameron',
    stars: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver', 'Kate Winslet'],
    synopsis:
      'Set more than a decade after the events of the first film, Jake Sully and Neytiri have formed a family. However, an ancient threat returns, forcing them to leave their home and explore the oceanic regions of Pandora.',
    poster:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    backdrop:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1800&auto=format&fit=crop',
    trailerSrc: '/trailers/avatar.mp4',
    formats: ['IMAX 3D Laser High Frame Rate', 'Dolby Cinema 3D'],
    accentColor: '#06b6d4',
  },
  {
    id: 'oppenheimer',
    title: 'Oppenheimer',
    tagline: 'The world forever changes.',
    genre: ['Biography', 'Drama', 'History'],
    rating: 'R',
    imdb: '8.9',
    duration: '3h 00m',
    releaseYear: 2023,
    director: 'Christopher Nolan',
    stars: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
    synopsis:
      'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, culminating in the Trinity test that propelled humanity into the nuclear era.',
    poster:
      'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop',
    backdrop:
      'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1800&auto=format&fit=crop',
    trailerSrc: '/trailers/oppenheimer.mp4',
    formats: ['IMAX 70mm', 'Standard 4K'],
    accentColor: '#f97316',
  }
];

export const THEATRES = [
  {
    id: 'hall-1',
    name: 'Screen 1 - Grand IMAX Laser',
    type: 'IMAX Laser 3D',
    features: ['IMAX 12.1 Sound', 'Next-Gen Dual 4K Laser', '1.43:1 Aspect Ratio', 'Stadium Seating'],
    rows: 10,
    seatsPerRow: 16
  },
  {
    id: 'hall-2',
    name: 'Screen 2 - Dolby Cinema Prime',
    type: 'Dolby Cinema',
    features: ['Dolby Atmos 64-Channel', 'Dolby Vision HDR', 'Premium Leather Recliners'],
    rows: 10,
    seatsPerRow: 16
  },
  {
    id: 'hall-3',
    name: 'Screen 3 - 4DX Sensory Dome',
    type: '4DX Motion',
    features: ['Motion Sync Seats', 'Wind, Fog & Scent FX', 'Ultra 7.1 Surround'],
    rows: 10,
    seatsPerRow: 16
  }
];

export const SHOW_DATES = [
  { id: 'today', label: 'Today', dateStr: 'Oct 30', dayName: 'Fri' },
  { id: 'tomorrow', label: 'Tomorrow', dateStr: 'Oct 31', dayName: 'Sat' },
  { id: 'day3', label: 'Sun', dateStr: 'Nov 01', dayName: 'Sun' },
  { id: 'day4', label: 'Mon', dateStr: 'Nov 02', dayName: 'Mon' },
  { id: 'day5', label: 'Tue', dateStr: 'Nov 03', dayName: 'Tue' }
];

export const SHOW_TIMES = [
  { id: 't1', time: '11:15 AM', type: 'Morning Matinee', priceMultiplier: 0.9 },
  { id: 't2', time: '02:45 PM', type: 'Afternoon Show', priceMultiplier: 1.0 },
  { id: 't3', time: '06:30 PM', type: 'Prime Evening', priceMultiplier: 1.15 },
  { id: 't4', time: '09:45 PM', type: 'Late Night IMAX', priceMultiplier: 1.1 },
  { id: 't5', time: '11:55 PM', type: 'Midnight Special', priceMultiplier: 1.0 }
];

export const TIER_CONFIG = {
  VIP: {
    name: 'VIP Recliner',
    description: 'Electric plush leather recliners, food tray, prime acoustic elevation',
    basePrice: 24.5,
    rows: ['I', 'J'],
    color: '#f59e0b', // Amber Gold
    glowColor: 'rgba(245, 158, 11, 0.4)'
  },
  PREMIUM: {
    name: 'Premium Club',
    description: 'Center sweet-spot soundstage, high-back ergonomic rocking chairs',
    basePrice: 18.0,
    rows: ['E', 'F', 'G', 'H'],
    color: '#06b6d4', // Cyan Neon
    glowColor: 'rgba(6, 182, 212, 0.4)'
  },
  STANDARD: {
    name: 'Standard Classic',
    description: 'Crisp sightlines, spacious padded cinema seats',
    basePrice: 13.5,
    rows: ['A', 'B', 'C', 'D'],
    color: '#8b5cf6', // Purple/Violet
    glowColor: 'rgba(139, 92, 246, 0.4)'
  }
};

// Generates the 3D theatre seat layout with coordinates and occupied states
export function generateCinemaSeats(showtimeId = 't2', movieId = 'dune-2') {
  const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const seatsPerRow = 16;
  const aisleWidth = 1.4; // gap between left and right bank
  const seatSpacingX = 0.95;
  const rowSpacingZ = 1.25;
  const riserElevationY = 0.42; // slope height per row

  // Deterministic seed for booked seats per movie + showtime
  const seedString = `${movieId}-${showtimeId}`;
  let seed = 0;
  for (let i = 0; i < seedString.length; i++) {
    seed = (seed * 31 + seedString.charCodeAt(i)) % 10000;
  }

  const seats = [];

  rowLetters.forEach((rowChar, rowIndex) => {
    let tierKey = 'STANDARD';
    if (['I', 'J'].includes(rowChar)) tierKey = 'VIP';
    else if (['E', 'F', 'G', 'H'].includes(rowChar)) tierKey = 'PREMIUM';

    const tier = TIER_CONFIG[tierKey];

    for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
      let posX = (seatNum - 8.5) * seatSpacingX;
      if (seatNum <= 8) {
        posX -= aisleWidth / 2;
      } else {
        posX += aisleWidth / 2;
      }

      const posZ = 3.5 + rowIndex * rowSpacingZ;
      const posY = rowIndex * riserElevationY;

      // Wheelchair designated spots in row D, seats 1 and 16
      const isWheelchair = rowChar === 'D' && (seatNum === 1 || seatNum === 16);

      const pseudorand = Math.sin(seed + rowIndex * 17 + seatNum * 31) * 10000;
      const randVal = pseudorand - Math.floor(pseudorand);

      let bookedThreshold = 0.35;
      if (['E', 'F', 'G'].includes(rowChar) && seatNum >= 6 && seatNum <= 11) {
        bookedThreshold = 0.65;
      }

      const isBooked = randVal < bookedThreshold;

      seats.push({
        id: `${rowChar}-${seatNum}`,
        row: rowChar,
        number: seatNum,
        rowIndex,
        seatIndex: seatNum - 1,
        tierKey,
        tierName: tier.name,
        price: tier.basePrice,
        isWheelchair,
        status: isBooked ? 'booked' : 'available',
        x: posX,
        y: posY,
        z: posZ
      });
    }
  });

  return seats;
}

export const CONCESSIONS = [
  {
    id: 'c-popcorn-truffle',
    name: 'Truffle & Butter Popcorn',
    category: 'Popcorn',
    description: 'Freshly popped jumbo kernels drizzled with black truffle oil and creamy butter',
    price: 9.5,
    calories: '620 cal',
    image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?q=80&w=400&auto=format&fit=crop',
    popular: true
  },
  {
    id: 'c-popcorn-caramel',
    name: 'Sweet Caramel Glaze Tub',
    category: 'Popcorn',
    description: 'Golden kettle-cooked caramel popcorn with sea salt flakes',
    price: 8.5,
    calories: '710 cal',
    image: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?q=80&w=400&auto=format&fit=crop',
    popular: false
  },
  {
    id: 'c-nachos-deluxe',
    name: 'Artisan Queso Nachos',
    category: 'Warm Snacks',
    description: 'Crispy warm corn tortilla chips, jalapeños, craft queso blanco & pico de gallo',
    price: 11.0,
    calories: '840 cal',
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?q=80&w=400&auto=format&fit=crop',
    popular: true
  },
  {
    id: 'c-drink-coke',
    name: 'Fountain Soda (Large 32oz)',
    category: 'Beverages',
    description: 'Ice-cold Coca-Cola, Coke Zero, Sprite, or Dr Pepper with free refills',
    price: 6.5,
    calories: '280 cal',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=400&auto=format&fit=crop',
    popular: false
  },
  {
    id: 'c-drink-icee',
    name: 'Frozen Wild Cherry ICEE',
    category: 'Beverages',
    description: 'Sub-zero frozen cherry slush with iconic cinema taste',
    price: 7.0,
    calories: '310 cal',
    image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?q=80&w=400&auto=format&fit=crop',
    popular: false
  },
  {
    id: 'c-combo-vip',
    name: 'VIP Premiere Duo Combo',
    category: 'Combos',
    description: '1 Jumbo Truffle Popcorn + 2 Large Sodas + 1 Nachos + 1 Box Red Vines (Save 20%)',
    price: 26.0,
    calories: '1,450 cal',
    image: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?q=80&w=400&auto=format&fit=crop',
    popular: true
  }
];

export const PROMO_CODES = {
  CINEMA20: { discountPercent: 20, description: '20% Off Total' },
  IMAXVIP: { discountPercent: 15, description: '15% Off VIP Experience' },
  FIRST5: { discountAmount: 5, description: '$5 Off Ticket Order' }
};
