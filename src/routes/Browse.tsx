import { useMemo, useState } from 'react';
import { useAthletesStore } from '../store/useAthletesStore';
import AthleteCard from '../components/AthleteCard';

const SPORTS = ['All', 'Hockey', 'Tennis', 'Baseball', 'Basketball', 'Soccer', 'Football', 'Gymnastics', 'Esports'];
const CATEGORIES = ['All', 'Golf', 'Skating', 'Training', 'Other'] as const;

export default function Browse() {
  const athletes = useAthletesStore((s) => s.athletes);
  const [query, setQuery] = useState('');
  const [sport, setSport] = useState('All');
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return athletes.filter((a) => {
      if (sport !== 'All' && a.sport !== sport) return false;
      if (category !== 'All' && !a.experiences.some((e) => e.category === category)) return false;
      if (
        q &&
        !a.name.toLowerCase().includes(q) &&
        !a.position.toLowerCase().includes(q) &&
        !a.tags.some((t) => t.toLowerCase().includes(q))
      )
        return false;
      return true;
    });
  }, [athletes, query, sport, category]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 animate-fade-in">
      <h1 className="mb-2 text-4xl font-extrabold">Browse athletes</h1>
      <p className="mb-8 text-ink-muted">{filtered.length} pros available right now</p>

      <div className="mb-6 grid gap-3 md:grid-cols-[1fr_auto_auto]">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, sport, or tag…"
          className="rounded-xl border border-white/10 bg-card px-4 py-3 text-sm text-ink-primary placeholder:text-ink-muted focus:border-accent-primary"
        />
        <select
          value={sport}
          onChange={(e) => setSport(e.target.value)}
          className="rounded-xl border border-white/10 bg-card px-4 py-3 text-sm"
        >
          {SPORTS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as (typeof CATEGORIES)[number])}
          className="rounded-xl border border-white/10 bg-card px-4 py-3 text-sm"
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center text-ink-muted">No athletes match those filters.</div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <AthleteCard key={a.id} athlete={a} />
          ))}
        </div>
      )}
    </div>
  );
}
