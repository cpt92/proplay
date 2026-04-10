import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Message } from '../lib/types';

type State = {
  messages: Message[];
  loaded: boolean;
  subscription: { unsubscribe: () => void } | null;
};

type Actions = {
  loadForUser: (userId: string) => Promise<void>;
  subscribe: () => void;
  unsubscribe: () => void;
  clear: () => void;
  send: (bookingId: string, fromUserId: string, text: string) => Promise<void>;
};

function rowToMessage(row: Record<string, unknown>): Message {
  return {
    id: row.id as string,
    bookingId: row.booking_id as string,
    fromUserId: row.from_user_id as string,
    text: row.body as string,
    createdAt: row.created_at as string,
  };
}

export const useChatStore = create<State & Actions>((set, get) => ({
  messages: [],
  loaded: false,
  subscription: null,

  loadForUser: async (_userId) => {
    // RLS already filters to messages the user can see (bookings they are involved in)
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) {
      console.error('load messages error', error);
      return;
    }
    set({ messages: (data ?? []).map(rowToMessage), loaded: true });
  },

  subscribe: () => {
    if (get().subscription) return;
    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const m = rowToMessage(payload.new as Record<string, unknown>);
          set((s) =>
            s.messages.some((x) => x.id === m.id) ? s : { messages: [...s.messages, m] }
          );
        }
      )
      .subscribe();
    set({ subscription: channel });
  },

  unsubscribe: () => {
    const sub = get().subscription;
    if (sub) {
      sub.unsubscribe();
      set({ subscription: null });
    }
  },

  clear: () => {
    get().unsubscribe();
    set({ messages: [], loaded: false });
  },

  send: async (bookingId, fromUserId, text) => {
    const clean = text.trim();
    if (!clean) return;
    const { data, error } = await supabase
      .from('messages')
      .insert({ booking_id: bookingId, from_user_id: fromUserId, body: clean })
      .select()
      .single();
    if (error || !data) {
      console.error('send message error', error);
      return;
    }
    const msg = rowToMessage(data);
    // Optimistic: add it if realtime hasn't already delivered it
    set((s) =>
      s.messages.some((x) => x.id === msg.id) ? s : { messages: [...s.messages, msg] }
    );
  },
}));
