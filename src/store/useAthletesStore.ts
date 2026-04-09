import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SEED_ATHLETES, generateSeedAvailability, type Athlete, type Experience, type Availability } from '../lib/seed';

const SEED_IDS = new Set(SEED_ATHLETES.map((a) => a.id));

type State = {
  athletes: Athlete[];
};

type Actions = {
  getById: (id: number) => Athlete | undefined;
  getByOwner: (userId: string) => Athlete | undefined;
  createAthlete: (input: Omit<Athlete, 'id' | 'rating' | 'reviews' | 'verified' | 'experiences' | 'availability'>) => Athlete;
  updateAthlete: (id: number, patch: Partial<Athlete>) => void;
  addExperience: (athleteId: number, exp: Omit<Experience, 'id' | 'athleteId'>) => void;
  updateExperience: (athleteId: number, expId: string, patch: Partial<Experience>) => void;
  deleteExperience: (athleteId: number, expId: string) => void;
  setAvailability: (athleteId: number, avail: Availability) => void;
  toggleSlot: (athleteId: number, date: string, time: string) => void;
  refreshSeedAvailability: () => void;
};

const nextId = (athletes: Athlete[]) => (athletes.reduce((m, a) => Math.max(m, a.id), 0) || 0) + 1;

export const useAthletesStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      athletes: SEED_ATHLETES,

      getById: (id) => get().athletes.find((a) => a.id === id),
      getByOwner: (userId) => get().athletes.find((a) => a.ownerUserId === userId),

      createAthlete: (input) => {
        const a: Athlete = {
          ...input,
          id: nextId(get().athletes),
          rating: 0,
          reviews: 0,
          verified: false,
          experiences: [],
          availability: {},
        };
        set((s) => ({ athletes: [...s.athletes, a] }));
        return a;
      },

      updateAthlete: (id, patch) =>
        set((s) => ({
          athletes: s.athletes.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        })),

      addExperience: (athleteId, exp) =>
        set((s) => ({
          athletes: s.athletes.map((a) =>
            a.id === athleteId
              ? {
                  ...a,
                  experiences: [
                    ...a.experiences,
                    { ...exp, id: crypto.randomUUID(), athleteId },
                  ],
                }
              : a
          ),
        })),

      updateExperience: (athleteId, expId, patch) =>
        set((s) => ({
          athletes: s.athletes.map((a) =>
            a.id === athleteId
              ? { ...a, experiences: a.experiences.map((e) => (e.id === expId ? { ...e, ...patch } : e)) }
              : a
          ),
        })),

      deleteExperience: (athleteId, expId) =>
        set((s) => ({
          athletes: s.athletes.map((a) =>
            a.id === athleteId ? { ...a, experiences: a.experiences.filter((e) => e.id !== expId) } : a
          ),
        })),

      setAvailability: (athleteId, avail) =>
        set((s) => ({
          athletes: s.athletes.map((a) => (a.id === athleteId ? { ...a, availability: avail } : a)),
        })),

      toggleSlot: (athleteId, date, time) =>
        set((s) => ({
          athletes: s.athletes.map((a) => {
            if (a.id !== athleteId) return a;
            const avail = { ...(a.availability ?? {}) };
            const day = avail[date] ?? [];
            avail[date] = day.includes(time) ? day.filter((t) => t !== time) : [...day, time].sort();
            if (avail[date].length === 0) delete avail[date];
            return { ...a, availability: avail };
          }),
        })),

      refreshSeedAvailability: () =>
        set((s) => ({
          athletes: s.athletes.map((a) =>
            SEED_IDS.has(a.id) ? { ...a, availability: generateSeedAvailability(a.id) } : a
          ),
        })),
    }),
    { name: 'proplay-athletes' }
  )
);
