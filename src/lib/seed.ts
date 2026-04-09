// NOTE: These are placeholder/example athletes carried over from the prototype
// to make the marketplace look populated during development. Real athletes will
// sign up via the onboarding flow.

export type Experience = {
  id: string;
  athleteId: number;
  title: string;
  description: string;
  category: 'Golf' | 'Skating' | 'Training' | 'Other';
  duration: string;
  price: number;
  active: boolean;
};

export type Availability = { [isoDate: string]: string[] }; // "2026-04-12": ["09:00","09:30"]

export type Athlete = {
  id: number;
  name: string;
  sport: string;
  position: string;
  team: string;
  location: string;
  initials: string;
  photo: string;
  rating: number;
  reviews: number;
  responseTime: string;
  bio: string;
  verified: boolean;
  color: string;
  career: { gamesPlayed: string | number; goals: string | number; assists: string | number; championships?: string };
  tags: string[];
  experiences: Experience[];
  availability?: Availability;
  ownerUserId?: string;
};

export const SEED_ATHLETES: Athlete[] = [
  {
    id: 1, name: 'Mike Branson', sport: 'Hockey', position: 'Former NHL Forward',
    team: 'Toronto Maple Leafs (Retired)', location: 'Toronto, ON', initials: 'MB',
    photo: 'https://i.pravatar.cc/800?img=12', rating: 4.9, reviews: 47,
    responseTime: 'Usually responds in 2 hours',
    bio: '14-year NHL veteran who played 800+ games. Passionate about giving back to the hockey community and connecting with fans. Whether it\'s skating with your kids\' team or joining your beer league, I bring the energy!',
    verified: true, color: '#1e3a8a',
    career: { gamesPlayed: 847, goals: 205, assists: 312, championships: '1 Cup' },
    tags: ['hockey', 'skating', 'training', 'nhl'],
    experiences: [
      { id: 'e1', athleteId: 1, title: 'Skate With Your Kids\' Team', description: 'I\'ll join your kids\' hockey practice or game for a full session. Includes skills tips, a mini scrimmage, and photos with the team.', category: 'Skating', duration: '90 min', price: 450, active: true },
      { id: 'e2', athleteId: 1, title: 'Golf Foursome Partner', description: 'Join me for 18 holes at your local GTA course. Includes friendly competition, stories from the NHL, and plenty of laughs.', category: 'Golf', duration: '4-5 hours', price: 800, active: true },
      { id: 'e3', athleteId: 1, title: '1-on-1 Hockey Training', description: 'Personalized on-ice training session focused on skating, shooting, and game sense.', category: 'Training', duration: '60 min', price: 350, active: true },
    ],
  },
  {
    id: 2, name: 'Serena Hayes', sport: 'Tennis', position: 'Former WTA Pro',
    team: 'Independent', location: 'Toronto, ON', initials: 'SH',
    photo: 'https://i.pravatar.cc/800?img=5', rating: 4.8, reviews: 39,
    responseTime: 'Usually responds in 3 hours',
    bio: '12 years on the professional tennis circuit. I love coaching and playing with aspiring athletes. Let\'s improve your game or just have fun on the court!',
    verified: true, color: '#7c2d12',
    career: { gamesPlayed: '800+ matches', goals: '35 titles', assists: 'Top 50 globally' },
    tags: ['tennis', 'coaching', 'sports'],
    experiences: [
      { id: 'e4', athleteId: 2, title: 'Tennis Coaching Session', description: 'One-on-one coaching to improve your serve, volley, and strategy.', category: 'Training', duration: '90 min', price: 300, active: true },
      { id: 'e5', athleteId: 2, title: 'Tennis Match & Social', description: 'Play a casual match with me and grab coffee after.', category: 'Other', duration: '120 min', price: 250, active: true },
    ],
  },
  {
    id: 3, name: 'Alex Rodriguez', sport: 'Baseball', position: 'Former MLB Pitcher',
    team: 'Toronto Blue Jays (Retired)', location: 'Toronto, ON', initials: 'AR',
    photo: 'https://i.pravatar.cc/800?img=33', rating: 4.7, reviews: 28,
    responseTime: 'Usually responds in 4 hours',
    bio: 'Pitched for 15 years across multiple MLB teams. Love teaching the next generation about baseball fundamentals and the mental side of sports.',
    verified: false, color: '#1e40af',
    career: { gamesPlayed: 487, goals: '200+ wins', assists: '1200+ Ks' },
    tags: ['baseball', 'pitching', 'sports'],
    experiences: [
      { id: 'e6', athleteId: 3, title: 'Baseball Pitching Clinic', description: 'Learn pitching mechanics, grip, and strategy from a former pro.', category: 'Training', duration: '120 min', price: 400, active: true },
      { id: 'e7', athleteId: 3, title: 'Catch & Chat', description: 'Play catch, discuss baseball strategy, and hear behind-the-scenes stories.', category: 'Other', duration: '90 min', price: 200, active: true },
    ],
  },
  {
    id: 4, name: 'Jordan Matthews', sport: 'Basketball', position: 'Former NBA Guard',
    team: 'Toronto Raptors (Retired)', location: 'Toronto, ON', initials: 'JM',
    photo: 'https://i.pravatar.cc/800?img=68', rating: 4.9, reviews: 56,
    responseTime: 'Usually responds in 1 hour',
    bio: 'Spent 10 years in the NBA bringing intensity to the court. Now dedicated to coaching youth and adult players to reach their potential.',
    verified: true, color: '#7c3aed',
    career: { gamesPlayed: 687, goals: '7500+ pts', assists: '3200+ ast' },
    tags: ['basketball', 'training', 'nba'],
    experiences: [
      { id: 'e8', athleteId: 4, title: '1-on-1 Basketball Training', description: 'Work on your shooting, handles, and game IQ with an NBA vet.', category: 'Training', duration: '90 min', price: 350, active: true },
      { id: 'e9', athleteId: 4, title: 'Pickup Game', description: 'Join a casual 3-on-3 or 5-on-5 game with me and other athletes.', category: 'Other', duration: '120 min', price: 150, active: true },
    ],
  },
  {
    id: 5, name: 'Emma Wilson', sport: 'Soccer', position: 'Former NWSL Forward',
    team: 'Toronto FC Women (Retired)', location: 'Toronto, ON', initials: 'EW',
    photo: 'https://i.pravatar.cc/800?img=49', rating: 4.8, reviews: 42,
    responseTime: 'Usually responds in 2 hours',
    bio: 'International soccer player with 50+ caps for Canada. Passionate about growing women\'s soccer and mentoring young athletes.',
    verified: true, color: '#059669',
    career: { gamesPlayed: '200+ apps', goals: '40 goals', assists: 'International' },
    tags: ['soccer', "women's sports", 'training'],
    experiences: [
      { id: 'e10', athleteId: 5, title: 'Soccer Skills Workshop', description: 'Learn dribbling, shooting, and positioning from a pro striker.', category: 'Training', duration: '90 min', price: 300, active: true },
      { id: 'e11', athleteId: 5, title: 'Pickup Soccer Game', description: 'Play in a casual, co-ed soccer game with me and friends.', category: 'Other', duration: '120 min', price: 100, active: true },
    ],
  },
  {
    id: 6, name: 'Marcus Thompson', sport: 'Football', position: 'Former CFL Running Back',
    team: 'Toronto Argonauts (Retired)', location: 'Toronto, ON', initials: 'MT',
    photo: 'https://i.pravatar.cc/800?img=60', rating: 4.6, reviews: 33,
    responseTime: 'Usually responds in 5 hours',
    bio: 'Explosive runner with a passion for mentoring the next generation of CFL stars. Let\'s work on your footwork and athletic potential!',
    verified: false, color: '#b91c1c',
    career: { gamesPlayed: 156, goals: '3400+ rush yds', assists: '30 TDs' },
    tags: ['football', 'cfl', 'training'],
    experiences: [
      { id: 'e12', athleteId: 6, title: 'CFL Training Camp', description: 'Learn running back techniques from someone who played at the highest level.', category: 'Training', duration: '120 min', price: 350, active: true },
      { id: 'e13', athleteId: 6, title: 'Agility & Speed Work', description: 'Private training focused on sprinting, footwork, and explosiveness.', category: 'Training', duration: '90 min', price: 300, active: true },
    ],
  },
  {
    id: 7, name: 'Nicole Chen', sport: 'Gymnastics', position: 'Former National Team Member',
    team: 'Canada Gymnastics (Retired)', location: 'Toronto, ON', initials: 'NC',
    photo: 'https://i.pravatar.cc/800?img=25', rating: 4.9, reviews: 51,
    responseTime: 'Usually responds in 1 hour',
    bio: 'Competed at the national level in artistic gymnastics. Now coaching and mentoring young gymnasts. I make fitness fun and accessible!',
    verified: true, color: '#db2777',
    career: { gamesPlayed: '15 nat. champs', goals: 'Multiple medals', assists: 'Coach since 2015' },
    tags: ['gymnastics', 'fitness', 'coaching'],
    experiences: [
      { id: 'e14', athleteId: 7, title: 'Flexibility & Strength Training', description: 'Full-body conditioning and flexibility work for better athletic performance.', category: 'Training', duration: '90 min', price: 250, active: true },
      { id: 'e15', athleteId: 7, title: 'Gymnastics Basics Workshop', description: 'Learn fundamental tumbling and balance skills in a fun, safe environment.', category: 'Training', duration: '120 min', price: 200, active: true },
    ],
  },
  {
    id: 8, name: 'David Park', sport: 'Esports', position: 'Former Pro Gamer',
    team: 'Immortals Gaming (Retired)', location: 'Toronto, ON', initials: 'DP',
    photo: 'https://i.pravatar.cc/800?img=15', rating: 4.7, reviews: 44,
    responseTime: 'Usually responds in 2 hours',
    bio: 'Competed in professional esports for 8 years. Now coaching aspiring gamers and creating content. Let\'s level up your game!',
    verified: true, color: '#0891b2',
    career: { gamesPlayed: '1000+ matches', goals: '15 tourney wins', assists: 'Top 5 ranking' },
    tags: ['esports', 'gaming', 'coaching'],
    experiences: [
      { id: 'e16', athleteId: 8, title: 'Esports Coaching', description: 'One-on-one coaching on strategy, game mechanics, and mental game.', category: 'Training', duration: '90 min', price: 180, active: true },
      { id: 'e17', athleteId: 8, title: 'Tournament Practice', description: 'Participate in a practice tournament with pro-level competition.', category: 'Other', duration: '120 min', price: 150, active: true },
    ],
  },
];

export const minPrice = (a: Athlete): number | null =>
  a.experiences.length === 0 ? null : Math.min(...a.experiences.map((e) => e.price));

// Generates a plausible availability map for the next 14 days, varying by athleteId
// so each example athlete has a different pattern. Used to keep seed athletes bookable.
export function generateSeedAvailability(athleteId: number): Availability {
  const TIMES_POOL = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  const out: Availability = {};
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    // Skip some days deterministically per athlete so calendars look natural
    if ((i + athleteId) % 3 === 0) continue;
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    // Pick 3-5 slots per available day
    const count = 3 + ((i + athleteId) % 3);
    const offset = (athleteId + i) % TIMES_POOL.length;
    const slots: string[] = [];
    for (let j = 0; j < count; j++) {
      slots.push(TIMES_POOL[(offset + j) % TIMES_POOL.length]);
    }
    out[iso] = [...new Set(slots)].sort();
  }
  return out;
}
