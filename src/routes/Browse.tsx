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
    <div className="animate-fade-in">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-accent-primary/15 blur-[100px]" />
        </div>
        <div className="mx-auto max-w-6xl px-6 py-14 text-center">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-primary">
            The roster
          </div>
          <h1 className="mb-3 text-5xl font-extrabold tracking-tight">Browse athletes</h1>
          <p className="text-ink-muted">Find your hero. Book in minutes.</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Filters */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-card p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted">
                🔍
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, position, or tag…"
                className="w-full rounded-xl border border-white/10 bg-bg-secondary/60 py-3 pl-10 pr-4 text-sm text-ink-primary placeholder:text-ink-muted focus:border-accent-primary focus:outline-none"
              />
            </div>
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              className="rounded-xl border border-white/10 bg-bg-secondary/60 px-4 py-3 text-sm focus:border-accent-primary focus:outline-none"
            >
              {SPORTS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as (typeof CATEGORIES)[number])}
              className="rounded-xl border border-white/10 bg-bg-secondary/60 px-4 py-3 text-sm focus:border-accent-primary focus:outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Result count + active filter chips */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-ink-muted">
            <span className="font-bold text-ink-primary">{filtered.length}</span>{' '}
            {filtered.length === 1 ? 'athlete' : 'athletes'} found
          </div>
          <div className="flex flex-wrap gap-2">
            {sport !== 'All' && (
              <button
                onClick={() => setSport('All')}
                className="chip hover:border-err/40 hover:text-err"
              >
                {sport} ✕
              </button>
            )}
            {category !== 'All' && (
              <button
                onClick={() => setCategory('All')}
                className="chip hover:border-err/40 hover:text-err"
              >
                {category} ✕
              </button>
            )}
            {query && (
              <button onClick={() => setQuery('')} className="chip hover:border-err/40 hover:text-err">
                "{query}" ✕
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="card py-16 text-center">
            <div className="mb-3 text-5xl">🔍</div>
            <div className="mb-1 text-lg font-bold">No matches</div>
            <div className="text-sm text-ink-muted">Try clearing some filters.</div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((a) => (
              <AthleteCard key={a.id} athlete={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
