import { useMemo, useState } from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { useAthletesStore } from '../store/useAthletesStore';
import { minPrice } from '../lib/seed';
import AthleteCard from '../components/AthleteCard';

const SPORTS = ['All', 'Hockey', 'Tennis', 'Baseball', 'Basketball', 'Soccer', 'Football', 'Gymnastics', 'Esports'];
const CATEGORIES = ['All', 'Golf', 'Skating', 'Training', 'Other'] as const;
const SORTS = [
  { value: 'rating', label: 'Top rated' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'reviews', label: 'Most reviewed' },
] as const;
type Sort = (typeof SORTS)[number]['value'];

export default function Browse() {
  const athletes = useAthletesStore((s) => s.athletes);
  const [query, setQuery] = useState('');
  const [sport, setSport] = useState('All');
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sort, setSort] = useState<Sort>('rating');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = athletes.filter((a) => {
      if (sport !== 'All' && a.sport !== sport) return false;
      if (category !== 'All' && !a.experiences.some((e) => e.category === category)) return false;
      const price = minPrice(a);
      if (price !== null && price > maxPrice) return false;
      if (
        q &&
        !a.name.toLowerCase().includes(q) &&
        !a.position.toLowerCase().includes(q) &&
        !a.tags.some((t) => t.toLowerCase().includes(q))
      )
        return false;
      return true;
    });
    return list.sort((a, b) => {
      if (sort === 'rating') return b.rating - a.rating;
      if (sort === 'reviews') return b.reviews - a.reviews;
      const pa = minPrice(a) ?? Infinity;
      const pb = minPrice(b) ?? Infinity;
      if (sort === 'price-asc') return pa - pb;
      return pb - pa;
    });
  }, [athletes, query, sport, category, maxPrice, sort]);

  const reset = () => {
    setQuery('');
    setSport('All');
    setCategory('All');
    setMaxPrice(1000);
    setSort('rating');
  };

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
          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto]">
            <div className="relative">
              <FaMagnifyingGlass className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
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
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-xl border border-white/10 bg-bg-secondary/60 px-4 py-3 text-sm focus:border-accent-primary focus:outline-none"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Price slider */}
          <div className="mt-4 flex items-center gap-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Max price</div>
            <input
              type="range"
              min="50"
              max="1000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="flex-1 accent-accent-primary"
            />
            <div className="w-16 text-right text-sm font-bold">${maxPrice}{maxPrice >= 1000 ? '+' : ''}</div>
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
              <button onClick={() => setSport('All')} className="chip hover:border-err/40 hover:text-err">
                {sport} ✕
              </button>
            )}
            {category !== 'All' && (
              <button onClick={() => setCategory('All')} className="chip hover:border-err/40 hover:text-err">
                {category} ✕
              </button>
            )}
            {maxPrice < 1000 && (
              <button onClick={() => setMaxPrice(1000)} className="chip hover:border-err/40 hover:text-err">
                ≤${maxPrice} ✕
              </button>
            )}
            {query && (
              <button onClick={() => setQuery('')} className="chip hover:border-err/40 hover:text-err">
                "{query}" ✕
              </button>
            )}
            {(sport !== 'All' || category !== 'All' || query || maxPrice < 1000) && (
              <button onClick={reset} className="chip hover:border-accent-primary/50 hover:text-accent-primary">
                Clear all
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="card py-16 text-center">
            <div className="mb-3 flex justify-center">
              <FaMagnifyingGlass className="h-12 w-12 text-ink-muted" />
            </div>
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
