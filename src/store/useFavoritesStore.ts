import { create } from 'zustand';
import { supabase } from '../lib/supabase';

type State = {
  favorites: string[]; // athlete ids
  loaded: boolean;
};

type Actions = {
  loadForUser: (userId: string) => Promise<void>;
  clear: () => void;
  toggle: (userId: string, athleteId: string) => Promise<void>;
};

export const useFavoritesStore = create<State & Actions>((set, get) => ({
  favorites: [],
  loaded: false,

  loadForUser: async (_userId) => {
    // RLS scopes to the current user
    const { data, error } = await supabase.from('favorites').select('athlete_id');
    if (error) {
      console.error('load favorites error', error);
      return;
    }
    set({
      favorites: (data ?? []).map((r: { athlete_id: string }) => r.athlete_id),
      loaded: true,
    });
  },

  clear: () => set({ favorites: [], loaded: false }),

  toggle: async (userId, athleteId) => {
    const isFav = get().favorites.includes(athleteId);
    if (isFav) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('athlete_id', athleteId);
      set((s) => ({ favorites: s.favorites.filter((id) => id !== athleteId) }));
    } else {
      await supabase.from('favorites').insert({ user_id: userId, athlete_id: athleteId });
      set((s) => ({ favorites: [...s.favorites, athleteId] }));
    }
  },
}));
