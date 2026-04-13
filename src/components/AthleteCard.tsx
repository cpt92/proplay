import { Link } from 'react-router-dom';
import { FaStar, FaCircleCheck, FaHeart, FaRegHeart, FaLocationDot, FaRegClock } from 'react-icons/fa6';
import { type Athlete, minPrice } from '../lib/types';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from '../store/useToastStore';

function shortResponseTime(raw: string): string {
  if (!raw) return 'Responsive';
  const match = raw.match(/(\d+)\s*(hour|hr|minute|min|day)/i);
  if (match) {
    const n = match[1];
    const unit = match[2].toLowerCase();
    if (unit.startsWith('hour') || unit.startsWith('hr')) return `~${n}h response`;
    if (unit.startsWith('min')) return `~${n}m response`;
    if (unit.startsWith('day')) return `~${n}d response`;
  }
  return raw.replace(/^Usually responds in\s*/i, '~');
}

export default function AthleteCard({ athlete }: { athlete: Athlete }) {
  const price = minPrice(athlete);
  const profile = useAuthStore((s) => s.profile);
  const favorites = useFavoritesStore((s) => s.favorites);
  const toggleFav = useFavoritesStore((s) => s.toggle);
  const isFav = favorites.includes(athlete.id);

  const handleFav = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!profile) {
      toast.info('Sign in to save favorites');
      return;
    }
    await toggleFav(profile.id, athlete.id);
    toast.info(isFav ? 'Removed from favorites' : 'Saved to favorites');
  };

  return (
    <Link
      to={`/athletes/${athlete.id}`}
      className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-card shadow-[0_24px_60px_-24px_rgba(0,0,0,0.7)] transition duration-300 hover:-translate-y-1 hover:border-accent-primary/50 hover:shadow-[0_32px_80px_-24px_rgba(230,57,70,0.35)]"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <img
          src={athlete.photo}
          alt={athlete.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {/* Inset frame */}
        <div className="pointer-events-none absolute inset-2 rounded-xl ring-1 ring-inset ring-white/10" />
        {/* Readability gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
        {/* Crimson hover wash */}
        <div
          className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background: 'linear-gradient(180deg, transparent 40%, rgba(230,57,70,0.3) 100%)',
            mixBlendMode: 'multiply',
          }}
        />

        {/* Top row: verified + price + favorite */}
        <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-2">
          {athlete.verified ? (
            <div className="inline-flex items-center gap-1 rounded-full bg-info/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-info backdrop-blur">
              <FaCircleCheck className="h-3 w-3" /> Verified
            </div>
          ) : (
            <div />
          )}
          <div className="flex items-center gap-2">
            {price !== null && (
              <div className="rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                From ${price}
              </div>
            )}
            <button
              type="button"
              onClick={handleFav}
              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur transition hover:scale-110"
            >
              {isFav ? <FaHeart className="h-3.5 w-3.5 text-err" /> : <FaRegHeart className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Bottom: name + position + sport */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="mb-2 inline-block rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
            {athlete.sport}
          </div>
          <div className="text-xl font-extrabold leading-tight text-white">{athlete.name}</div>
          <div className="text-xs text-white/80">{athlete.position}</div>
          {athlete.location && (
            <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-white/70">
              <FaLocationDot className="h-2.5 w-2.5" />
              {athlete.location}
            </div>
          )}
        </div>
      </div>

      {/* Bottom card */}
      <div className="flex items-center justify-between border-t border-white/10 bg-bg-secondary/60 px-4 py-3">
        <div className="flex items-center gap-1.5 text-sm">
          <FaStar className="h-3.5 w-3.5 text-warn" />
          <span className="font-bold text-ink-primary">{athlete.rating}</span>
          <span className="text-ink-muted">({athlete.reviews})</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-ink-muted">
          <FaRegClock className="h-3 w-3" />
          <span className="truncate">{shortResponseTime(athlete.responseTime)}</span>
        </div>
      </div>
    </Link>
  );
}
