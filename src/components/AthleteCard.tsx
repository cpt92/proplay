import { Link } from 'react-router-dom';
import { type Athlete, minPrice } from '../lib/seed';

export default function AthleteCard({ athlete }: { athlete: Athlete }) {
  const price = minPrice(athlete);
  return (
    <Link
      to={`/athletes/${athlete.id}`}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card transition duration-300 hover:-translate-y-1 hover:border-accent-primary/50 hover:shadow-2xl hover:shadow-accent-primary/20"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <img
          src={athlete.photo}
          alt={athlete.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
        <div
          className="absolute inset-0 opacity-0 transition group-hover:opacity-100"
          style={{
            background: `linear-gradient(180deg, transparent 50%, ${athlete.color}40 100%)`,
          }}
        />

        {/* Top row: verified + price */}
        <div className="absolute left-3 right-3 top-3 flex items-start justify-between">
          {athlete.verified ? (
            <div className="inline-flex items-center gap-1 rounded-full bg-cyan/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan backdrop-blur">
              ✓ Verified
            </div>
          ) : (
            <div />
          )}
          {price !== null && (
            <div className="rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur">
              From ${price}
            </div>
          )}
        </div>

        {/* Bottom: name + position + sport */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="mb-2 inline-block rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
            {athlete.sport}
          </div>
          <div className="text-xl font-extrabold leading-tight text-white">{athlete.name}</div>
          <div className="text-xs text-white/80">{athlete.position}</div>
        </div>
      </div>

      {/* Bottom card */}
      <div className="flex items-center justify-between border-t border-white/5 px-4 py-3">
        <div className="flex items-center gap-1.5 text-sm">
          <span className="text-warn">★</span>
          <span className="font-bold text-ink-primary">{athlete.rating}</span>
          <span className="text-ink-muted">({athlete.reviews})</span>
        </div>
        <div className="text-xs font-semibold text-accent-primary opacity-0 transition group-hover:opacity-100">
          View profile →
        </div>
      </div>
    </Link>
  );
}
