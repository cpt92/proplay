import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Message = {
  id: string;
  bookingId: string;
  fromUserId: string;
  text: string;
  createdAt: string;
};

type State = {
  messages: Message[];
};

type Actions = {
  send: (bookingId: string, fromUserId: string, text: string) => void;
  threadFor: (bookingId: string) => Message[];
};

export const useChatStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      messages: [],
      send: (bookingId, fromUserId, text) =>
        set((s) => ({
          messages: [
            ...s.messages,
            {
              id: crypto.randomUUID(),
              bookingId,
              fromUserId,
              text: text.trim(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      threadFor: (bookingId) =>
        get()
          .messages.filter((m) => m.bookingId === bookingId)
          .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1)),
    }),
    { name: 'proplay-chat' }
  )
);
