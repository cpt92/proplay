import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Review = {
  id: string;
  bookingId: string;
  athleteId: number;
  fanId: string;
  fanName: string;
  rating: number; // 1-5
  text: string;
  createdAt: string;
};

type State = {
  reviews: Review[];
};

type Actions = {
  add: (input: Omit<Review, 'id' | 'createdAt'>) => void;
  forAthlete: (athleteId: number) => Review[];
  forBooking: (bookingId: string) => Review | undefined;
  averageFor: (athleteId: number) => { avg: number; count: number };
};

export const useReviewsStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      reviews: [],
      add: (input) =>
        set((s) => ({
          reviews: [
            ...s.reviews,
            { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
          ],
        })),
      forAthlete: (athleteId) =>
        get()
          .reviews.filter((r) => r.athleteId === athleteId)
          .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
      forBooking: (bookingId) => get().reviews.find((r) => r.bookingId === bookingId),
      averageFor: (athleteId) => {
        const list = get().reviews.filter((r) => r.athleteId === athleteId);
        if (list.length === 0) return { avg: 0, count: 0 };
        const avg = list.reduce((s, r) => s + r.rating, 0) / list.length;
        return { avg: Math.round(avg * 10) / 10, count: list.length };
      },
    }),
    { name: 'proplay-reviews' }
  )
);
