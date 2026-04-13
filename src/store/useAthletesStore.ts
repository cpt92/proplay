import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Athlete, Experience } from '../lib/types';

type State = {
  athletes: Athlete[];
  loaded: boolean;
  loading: boolean;
};

type Actions = {
  load: () => Promise<void>;
  getById: (id: string) => Athlete | undefined;
  getByOwner: (userId: string) => Athlete | undefined;
  createAthlete: (
    input: Omit<Athlete, 'id' | 'rating' | 'reviews' | 'verified' | 'experiences' | 'availability'>
  ) => Promise<Athlete | null>;
  addExperience: (athleteId: string, exp: Omit<Experience, 'id' | 'athleteId'>) => Promise<void>;
  updateExperience: (
    athleteId: string,
    expId: string,
    patch: Partial<Experience>
  ) => Promise<void>;
  deleteExperience: (athleteId: string, expId: string) => Promise<void>;
  toggleSlot: (athleteId: string, date: string, time: string) => Promise<void>;
  setInitialAvailability: (
    athleteId: string,
    avail: { [date: string]: string[] }
  ) => Promise<void>;
};

// Helper: group an array by a key
function groupBy<T, K extends string | number>(list: T[], key: (t: T) => K): Record<K, T[]> {
  const out = {} as Record<K, T[]>;
  for (const item of list) {
    const k = key(item);
    (out[k] ||= []).push(item);
  }
  return out;
}

export const useAthletesStore = create<State & Actions>((set, get) => ({
  athletes: [],
  loaded: false,
  loading: false,

  load: async () => {
    if (get().loaded || get().loading) return;
    set({ loading: true });

    // Fetch athletes, experiences, availability in parallel
    const [athletesRes, expRes, availRes] = await Promise.all([
      supabase.from('athletes').select('*').order('rating', { ascending: false }),
      supabase.from('experiences').select('*'),
      supabase.from('availability').select('athlete_id, slot_date, slot_time'),
    ]);

    if (athletesRes.error || expRes.error || availRes.error) {
      console.error('Failed to load athletes', athletesRes.error || expRes.error || availRes.error);
      set({ loading: false });
      return;
    }

    const expsByAthlete = groupBy(expRes.data ?? [], (e: { athlete_id: string }) => e.athlete_id);
    const availByAthlete = groupBy(availRes.data ?? [], (r: { athlete_id: string }) => r.athlete_id);

    const athletes: Athlete[] = (athletesRes.data ?? []).map((row: Record<string, unknown>) => {
      const exps = (expsByAthlete[row.id as string] ?? []).map((e: Record<string, unknown>) => ({
        id: e.id as string,
        athleteId: e.athlete_id as string,
        title: e.title as string,
        description: e.description as string,
        category: e.category as Experience['category'],
        duration: e.duration as string,
        price: e.price as number,
        active: e.active as boolean,
      }));

      const availability: { [date: string]: string[] } = {};
      for (const slot of availByAthlete[row.id as string] ?? []) {
        const d = (slot as { slot_date: string }).slot_date;
        const t = (slot as { slot_time: string }).slot_time;
        (availability[d] ||= []).push(t);
      }
      for (const d of Object.keys(availability)) availability[d].sort();

      return {
        id: row.id as string,
        ownerUserId: (row.owner_user_id as string) ?? null,
        name: row.name as string,
        sport: row.sport as string,
        position: row.position as string,
        team: (row.team as string) ?? '',
        location: (row.location as string) ?? '',
        initials: (row.initials as string) ?? '',
        photo: (row.photo as string) ?? '',
        rating: Number(row.rating ?? 0),
        reviews: Number(row.reviews_count ?? 0),
        responseTime: (row.response_time as string) ?? '',
        bio: (row.bio as string) ?? '',
        verified: Boolean(row.verified),
        color: (row.color as string) ?? '#e63946',
        career: {
          gamesPlayed: (row.career_games_played as string) ?? '',
          goals: (row.career_goals as string) ?? '',
          assists: (row.career_assists as string) ?? '',
          championships: (row.career_championships as string) ?? undefined,
        },
        tags: (row.tags as string[]) ?? [],
        experiences: exps,
        availability,
      };
    });

    set({ athletes, loaded: true, loading: false });
  },

  getById: (id) => get().athletes.find((a) => a.id === id),
  getByOwner: (userId) => get().athletes.find((a) => a.ownerUserId === userId),

  createAthlete: async (input) => {
    const { data, error } = await supabase
      .from('athletes')
      .insert({
        owner_user_id: input.ownerUserId,
        name: input.name,
        sport: input.sport,
        position: input.position,
        team: input.team,
        location: input.location,
        initials: input.initials,
        photo: input.photo,
        response_time: input.responseTime,
        bio: input.bio,
        color: input.color,
        career_games_played: String(input.career.gamesPlayed),
        career_goals: String(input.career.goals),
        career_assists: String(input.career.assists),
        career_championships: input.career.championships ?? null,
        tags: input.tags,
      })
      .select()
      .single();

    if (error || !data) {
      console.error('createAthlete error', error);
      return null;
    }

    const athlete: Athlete = {
      ...input,
      id: data.id,
      rating: 0,
      reviews: 0,
      verified: false,
      experiences: [],
      availability: {},
    };
    set((s) => ({ athletes: [...s.athletes, athlete] }));
    return athlete;
  },

  addExperience: async (athleteId, exp) => {
    const { data, error } = await supabase
      .from('experiences')
      .insert({
        athlete_id: athleteId,
        title: exp.title,
        description: exp.description,
        category: exp.category,
        duration: exp.duration,
        price: exp.price,
        active: exp.active,
      })
      .select()
      .single();
    if (error || !data) return;
    const newExp: Experience = { ...exp, id: data.id, athleteId };
    set((s) => ({
      athletes: s.athletes.map((a) =>
        a.id === athleteId ? { ...a, experiences: [...a.experiences, newExp] } : a
      ),
    }));
  },

  updateExperience: async (athleteId, expId, patch) => {
    const dbPatch: Record<string, unknown> = {};
    if (patch.title !== undefined) dbPatch.title = patch.title;
    if (patch.description !== undefined) dbPatch.description = patch.description;
    if (patch.category !== undefined) dbPatch.category = patch.category;
    if (patch.duration !== undefined) dbPatch.duration = patch.duration;
    if (patch.price !== undefined) dbPatch.price = patch.price;
    if (patch.active !== undefined) dbPatch.active = patch.active;
    await supabase.from('experiences').update(dbPatch).eq('id', expId);
    set((s) => ({
      athletes: s.athletes.map((a) =>
        a.id === athleteId
          ? {
              ...a,
              experiences: a.experiences.map((e) => (e.id === expId ? { ...e, ...patch } : e)),
            }
          : a
      ),
    }));
  },

  deleteExperience: async (athleteId, expId) => {
    await supabase.from('experiences').delete().eq('id', expId);
    set((s) => ({
      athletes: s.athletes.map((a) =>
        a.id === athleteId
          ? { ...a, experiences: a.experiences.filter((e) => e.id !== expId) }
          : a
      ),
    }));
  },

  toggleSlot: async (athleteId, date, time) => {
    const athlete = get().athletes.find((a) => a.id === athleteId);
    if (!athlete) return;
    const current = athlete.availability?.[date] ?? [];
    const exists = current.includes(time);

    if (exists) {
      await supabase
        .from('availability')
        .delete()
        .eq('athlete_id', athleteId)
        .eq('slot_date', date)
        .eq('slot_time', time);
    } else {
      await supabase.from('availability').insert({
        athlete_id: athleteId,
        slot_date: date,
        slot_time: time,
      });
    }

    set((s) => ({
      athletes: s.athletes.map((a) => {
        if (a.id !== athleteId) return a;
        const avail = { ...(a.availability ?? {}) };
        const day = avail[date] ?? [];
        avail[date] = exists ? day.filter((t) => t !== time) : [...day, time].sort();
        if (avail[date].length === 0) delete avail[date];
        return { ...a, availability: avail };
      }),
    }));
  },

  setInitialAvailability: async (athleteId, avail) => {
    const rows: { athlete_id: string; slot_date: string; slot_time: string }[] = [];
    for (const date of Object.keys(avail)) {
      for (const time of avail[date]) {
        rows.push({ athlete_id: athleteId, slot_date: date, slot_time: time });
      }
    }
    if (rows.length === 0) return;
    await supabase.from('availability').insert(rows);
    set((s) => ({
      athletes: s.athletes.map((a) => (a.id === athleteId ? { ...a, availability: avail } : a)),
    }));
  },
}));
