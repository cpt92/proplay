// Domain types — aligned with the Supabase schema

export type Role = 'fan' | 'athlete';

export type Profile = {
  id: string; // uuid (auth.users.id)
  role: Role;
  name: string;
  email: string;
  athleteId?: string | null;
  createdAt: string;
};

export type Experience = {
  id: string;
  athleteId: string;
  title: string;
  description: string;
  category: 'Golf' | 'Skating' | 'Training' | 'Other';
  duration: string;
  price: number;
  active: boolean;
};

export type Athlete = {
  id: string;
  ownerUserId: string | null;
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
  career: {
    gamesPlayed: string;
    goals: string;
    assists: string;
    championships?: string;
  };
  tags: string[];
  experiences: Experience[];
  availability?: { [isoDate: string]: string[] };
};

export type BookingStatus = 'pending' | 'confirmed' | 'declined' | 'cancelled' | 'completed';

export type Booking = {
  id: string;
  fanId: string;
  fanName: string;
  athleteId: string;
  experienceId: string;
  experienceTitle: string;
  date: string;
  time: string;
  total: number;
  status: BookingStatus;
  paymentRef: string;
  createdAt: string;
};

export type Message = {
  id: string;
  bookingId: string;
  fromUserId: string;
  text: string;
  createdAt: string;
};

export type Review = {
  id: string;
  bookingId: string;
  athleteId: string;
  fanId: string;
  fanName: string;
  rating: number;
  text: string;
  createdAt: string;
};

// Helper
export const minPrice = (a: Athlete): number | null =>
  a.experiences.length === 0 ? null : Math.min(...a.experiences.map((e) => e.price));
