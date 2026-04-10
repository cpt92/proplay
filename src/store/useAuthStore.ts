import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Profile, Role } from '../lib/types';

type State = {
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
};

type Actions = {
  init: () => Promise<void>;
  signup: (input: { role: Role; name: string; email: string; password: string }) => Promise<Profile | { error: string }>;
  login: (email: string, password: string) => Promise<Profile | { error: string }>;
  logout: () => Promise<void>;
  setAthleteId: (athleteId: string) => Promise<void>;
};

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, role, name, email, athlete_id, created_at')
    .eq('id', userId)
    .maybeSingle();
  if (error || !data) return null;
  return {
    id: data.id,
    role: data.role as Role,
    name: data.name,
    email: data.email,
    athleteId: data.athlete_id ?? null,
    createdAt: data.created_at,
  };
}

export const useAuthStore = create<State & Actions>((set, get) => ({
  profile: null,
  loading: false,
  initialized: false,

  init: async () => {
    if (get().initialized) return;
    set({ loading: true });
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      const profile = await fetchProfile(data.session.user.id);
      set({ profile, loading: false, initialized: true });
    } else {
      set({ profile: null, loading: false, initialized: true });
    }

    // Keep profile in sync with auth state changes (login/logout/refresh).
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        set({ profile });
      } else {
        set({ profile: null });
      }
    });
  },

  signup: async ({ role, name, email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        // Email confirmation is OFF by default on new Supabase projects, so the user
        // gets a session immediately. Metadata is used by the profile trigger.
        data: { role, name: name.trim() },
      },
    });
    if (error) return { error: error.message };
    if (!data.user) return { error: 'Signup did not return a user.' };

    // Wait briefly for the profile trigger to insert the row, then fetch it.
    let profile: Profile | null = null;
    for (let i = 0; i < 5; i++) {
      profile = await fetchProfile(data.user.id);
      if (profile) break;
      await new Promise((r) => setTimeout(r, 200));
    }
    if (!profile) {
      // Fallback: insert manually
      await supabase.from('profiles').insert({
        id: data.user.id,
        role,
        name: name.trim(),
        email: email.trim(),
      });
      profile = await fetchProfile(data.user.id);
    }
    if (!profile) return { error: 'Could not create profile.' };
    set({ profile });
    return profile;
  },

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) return { error: error.message };
    if (!data.user) return { error: 'Login did not return a user.' };
    const profile = await fetchProfile(data.user.id);
    if (!profile) return { error: 'Profile not found.' };
    set({ profile });
    return profile;
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ profile: null });
  },

  setAthleteId: async (athleteId) => {
    const p = get().profile;
    if (!p) return;
    const { error } = await supabase
      .from('profiles')
      .update({ athlete_id: athleteId })
      .eq('id', p.id);
    if (!error) set({ profile: { ...p, athleteId } });
  },
}));
