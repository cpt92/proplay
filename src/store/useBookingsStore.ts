import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAthletesStore } from './useAthletesStore';

export type BookingStatus = 'pending' | 'confirmed' | 'declined' | 'cancelled' | 'completed';

export type Booking = {
  id: string;
  fanId: string;
  fanName: string;
  athleteId: number;
  experienceId: string;
  experienceTitle: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  total: number;
  status: BookingStatus;
  paymentRef: string; // mock payment intent id
  createdAt: string;
};

type State = {
  bookings: Booking[];
};

type Actions = {
  create: (input: Omit<Booking, 'id' | 'status' | 'createdAt'>) => Booking;
  setStatus: (id: string, status: BookingStatus) => void;
  byFan: (fanId: string) => Booking[];
  byAthlete: (athleteId: number) => Booking[];
  byId: (id: string) => Booking | undefined;
};

export const useBookingsStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      bookings: [],

      create: (input) => {
        const b: Booking = {
          ...input,
          id: crypto.randomUUID(),
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ bookings: [b, ...s.bookings] }));
        return b;
      },

      setStatus: (id, status) => {
        const b = get().bookings.find((x) => x.id === id);
        set((s) => ({
          bookings: s.bookings.map((x) => (x.id === id ? { ...x, status } : x)),
        }));
        // When confirmed, remove the slot from the athlete's availability
        if (b && status === 'confirmed') {
          const athletes = useAthletesStore.getState();
          const a = athletes.getById(b.athleteId);
          if (a?.availability?.[b.date]?.includes(b.time)) {
            athletes.toggleSlot(b.athleteId, b.date, b.time);
          }
        }
      },

      byFan: (fanId) => get().bookings.filter((b) => b.fanId === fanId),
      byAthlete: (athleteId) => get().bookings.filter((b) => b.athleteId === athleteId),
      byId: (id) => get().bookings.find((b) => b.id === id),
    }),
    { name: 'proplay-bookings' }
  )
);
