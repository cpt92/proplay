import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa6';
import { useAthletesStore } from '../store/useAthletesStore';
import { useFavoritesStore } from '../store/useFavoritesStore';
import AthleteCard from '../components/AthleteCard';

export default function Favorites() {
  const athletes = useAthletesStore((s) => s.athletes);
  const favorites = useFavoritesStore((s) => s.favorites);
  const list = useMemo(() => athletes.filter((a) => favorites.includes(a.id)), [athletes, favorites]);

  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-err/15 blur-[100px]" />
        </div>
        <div className="mx-auto max-w-6xl px-6 py-14 text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-err/20 text-err">
            <FaHeart className="h-6 w-6" />
          </div>
          <h1 className="mb-2 text-5xl font-extrabold tracking-tight">Favorites</h1>
          <p className="text-ink-muted">Pros you've saved for later.</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {list.length === 0 ? (
          <div className="card py-16 text-center">
            <div className="mb-3 flex justify-center">
              <FaHeart className="h-10 w-10 text-ink-muted" />
            </div>
            <div className="mb-1 text-lg font-bold">No favorites yet</div>
            <p className="mb-6 text-sm text-ink-muted">Tap the heart on any athlete card to save them here.</p>
            <Link to="/browse" className="btn-primary">Browse athletes →</Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((a) => (
              <AthleteCard key={a.id} athlete={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
