import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'fan' | 'athlete';

export type User = {
  id: string;
  role: Role;
  name: string;
  email: string;
  password: string; // mock only — never do this for real
  athleteId?: number;
  createdAt: string;
};

type State = {
  users: User[];
  currentUserId: string | null;
};

type Actions = {
  signup: (input: { role: Role; name: string; email: string; password: string }) => User | { error: string };
  login: (email: string, password: string) => User | { error: string };
  logout: () => void;
  currentUser: () => User | null;
  linkAthleteId: (athleteId: number) => void;
};

export const useAuthStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      users: [],
      currentUserId: null,

      signup: ({ role, name, email, password }) => {
        const exists = get().users.some((u) => u.email.toLowerCase() === email.toLowerCase());
        if (exists) return { error: 'An account with that email already exists.' };
        const user: User = {
          id: crypto.randomUUID(),
          role,
          name: name.trim(),
          email: email.trim(),
          password,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ users: [...s.users, user], currentUserId: user.id }));
        return user;
      },

      login: (email, password) => {
        const u = get().users.find(
          (x) => x.email.toLowerCase() === email.toLowerCase() && x.password === password
        );
        if (!u) return { error: 'Wrong email or password.' };
        set({ currentUserId: u.id });
        return u;
      },

      logout: () => set({ currentUserId: null }),

      currentUser: () => {
        const id = get().currentUserId;
        return id ? get().users.find((u) => u.id === id) ?? null : null;
      },

      linkAthleteId: (athleteId) => {
        const id = get().currentUserId;
        if (!id) return;
        set((s) => ({
          users: s.users.map((u) => (u.id === id ? { ...u, athleteId } : u)),
        }));
      },
    }),
    { name: 'proplay-auth' }
  )
);
