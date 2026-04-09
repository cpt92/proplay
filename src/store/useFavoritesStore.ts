import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
  favorites: number[]; // athlete IDs
};
type Actions = {
  toggle: (athleteId: number) => void;
  isFavorite: (athleteId: number) => boolean;
  clear: () => void;
};

export const useFavoritesStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggle: (athleteId) =>
        set((s) => ({
          favorites: s.favorites.includes(athleteId)
            ? s.favorites.filter((id) => id !== athleteId)
            : [...s.favorites, athleteId],
        })),
      isFavorite: (athleteId) => get().favorites.includes(athleteId),
      clear: () => set({ favorites: [] }),
    }),
    { name: 'proplay-favorites' }
  )
);
