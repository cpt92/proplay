import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAthletesStore } from './useAthletesStore';
import type { Booking, BookingStatus } from '../lib/types';
export type { Booking, BookingStatus };

type State = {
  bookings: Booking[];
  loaded: boolean;
  loadingFor: string | null; // userId currently loaded for
  publicCompletedCount: number;
};

type Actions = {
  loadForUser: (userId: string) => Promise<void>;
  loadPublicCompletedCount: () => Promise<void>;
  clear: () => void;
  create: (input: Omit<Booking, 'id' | 'status' | 'createdAt'>) => Promise<Booking | null>;
  setStatus: (id: string, status: BookingStatus) => Promise<void>;
  byId: (id: string) => Booking | undefined;
};

function rowToBooking(row: Record<string, unknown>): Booking {
  return {
    id: row.id as string,
    fanId: row.fan_id as string,
    fanName: row.fan_name as string,
    athleteId: row.athlete_id as string,
    experienceId: row.experience_id as string,
    experienceTitle: row.experience_title as string,
    date: row.booking_date as string,
    time: row.booking_time as string,
    total: row.total as number,
    status: row.status as BookingStatus,
    paymentRef: (row.payment_ref as string) ?? '',
    createdAt: row.created_at as string,
  };
}

export const useBookingsStore = create<State & Actions>((set, get) => ({
  bookings: [],
  loaded: false,
  loadingFor: null,
  publicCompletedCount: 0,

  loadPublicCompletedCount: async () => {
    const { data, error } = await supabase.rpc('public_completed_booking_count');
    if (error) {
      console.error('load public booking count error', error);
      return;
    }
    set({ publicCompletedCount: Number(data ?? 0) });
  },

  loadForUser: async (userId) => {
    if (get().loadingFor === userId && get().loaded) return;
    set({ loadingFor: userId });
    // RLS policy will return only bookings where the user is the fan OR the owning athlete.
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('load bookings error', error);
      set({ loaded: true });
      return;
    }
    set({
      bookings: (data ?? []).map(rowToBooking),
      loaded: true,
    });
  },

  clear: () => set({ bookings: [], loaded: false, loadingFor: null }),

  create: async (input) => {
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        fan_id: input.fanId,
        fan_name: input.fanName,
        athlete_id: input.athleteId,
        experience_id: input.experienceId,
        experience_title: input.experienceTitle,
        booking_date: input.date,
        booking_time: input.time,
        total: input.total,
        payment_ref: input.paymentRef,
      })
      .select()
      .single();
    if (error || !data) {
      console.error('create booking error', error);
      return null;
    }
    const booking = rowToBooking(data);
    set((s) => ({ bookings: [booking, ...s.bookings] }));
    return booking;
  },

  setStatus: async (id, status) => {
    const b = get().bookings.find((x) => x.id === id);
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
    if (error) {
      console.error('setStatus error', error);
      return;
    }
    set((s) => ({ bookings: s.bookings.map((x) => (x.id === id ? { ...x, status } : x)) }));

    // When confirmed, remove the slot from the athlete's availability so nobody else can book it
    if (b && status === 'confirmed') {
      const athletes = useAthletesStore.getState();
      const a = athletes.getById(b.athleteId);
      if (a?.availability?.[b.date]?.includes(b.time)) {
        await athletes.toggleSlot(b.athleteId, b.date, b.time);
      }
    }
  },

  byId: (id) => get().bookings.find((b) => b.id === id),
}));
