import { Link } from 'react-router-dom';
import { type Athlete, minPrice } from '../lib/seed';

export default function AthleteCard({ athlete }: { athlete: Athlete }) {
  return (
    <Link
      to={`/athletes/${athlete.id}`}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-card transition hover:-translate-y-1 hover:border-accent-primary/40 hover:shadow-2xl hover:shadow-accent-primary/10"
    >
      <div
        className="relative h-56 w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${athlete.photo})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        {minPrice(athlete) !== null && (
          <div className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            From ${minPrice(athlete)}
          </div>
        )}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-2 text-base font-bold text-white">
            {athlete.name}
            {athlete.verified && <span className="text-cyan">✓</span>}
          </div>
          <div className="text-xs text-white/80">{athlete.position}</div>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-1 text-sm">
          <span className="text-warn">★</span>
          <span className="font-semibold">{athlete.rating}</span>
          <span className="text-ink-muted">({athlete.reviews})</span>
        </div>
        <div className="chip">{athlete.sport}</div>
      </div>
    </Link>
  );
}
