import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Review } from '../lib/types';

type State = {
  reviews: Review[];
  loaded: boolean;
};

type Actions = {
  load: () => Promise<void>;
  add: (input: Omit<Review, 'id' | 'createdAt'>) => Promise<void>;
};

function rowToReview(row: Record<string, unknown>): Review {
  return {
    id: row.id as string,
    bookingId: row.booking_id as string,
    athleteId: row.athlete_id as string,
    fanId: row.fan_id as string,
    fanName: row.fan_name as string,
    rating: row.rating as number,
    text: row.body as string,
    createdAt: row.created_at as string,
  };
}

export const useReviewsStore = create<State & Actions>((set, get) => ({
  reviews: [],
  loaded: false,

  load: async () => {
    if (get().loaded) return;
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('load reviews error', error);
      return;
    }
    set({ reviews: (data ?? []).map(rowToReview), loaded: true });
  },

  add: async (input) => {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        booking_id: input.bookingId,
        athlete_id: input.athleteId,
        fan_id: input.fanId,
        fan_name: input.fanName,
        rating: input.rating,
        body: input.text,
      })
      .select()
      .single();
    if (error || !data) {
      console.error('add review error', error);
      return;
    }
    set((s) => ({ reviews: [rowToReview(data), ...s.reviews] }));
  },
}));
