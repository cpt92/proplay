import { Link, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { useAthletesStore } from '../store/useAthletesStore';
import { useReviewsStore } from '../store/useReviewsStore';

export default function AthleteProfile() {
  const { id } = useParams();
  const athleteId = Number(id);
  const athlete = useAthletesStore((s) => s.getById(athleteId));
  const reviews = useReviewsStore((s) => s.forAthlete(athleteId));
  const ratingInfo = useReviewsStore((s) => s.averageFor(athleteId));

  if (!athlete) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="mb-4 text-3xl font-bold">Athlete not found</h1>
        <Link to="/browse" className="btn-primary">Back to browse</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 animate-fade-in">
      {/* Hero */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-card">
        <div
          className="relative h-64 w-full bg-cover bg-center md:h-80"
          style={{ backgroundImage: `linear-gradient(135deg, ${athlete.color}cc, #0a0a0a), url(${athlete.photo})` }}
        >
          <div className="absolute inset-0 flex items-end p-8">
            <div className="flex items-center gap-5">
              <img
                src={athlete.photo}
                alt={athlete.name}
                className="h-24 w-24 rounded-2xl border-4 border-white/20 object-cover shadow-xl"
              />
              <div>
                <div className="flex items-center gap-2 text-3xl font-extrabold">
                  {athlete.name}
                  {athlete.verified && <span className="text-cyan">✓</span>}
                </div>
                <div className="text-ink-secondary">{athlete.position}</div>
                <div className="text-sm text-ink-muted">{athlete.team} · {athlete.location}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-4">
          <Stat
            label="Rating"
            value={ratingInfo.count > 0 ? `${ratingInfo.avg}★` : athlete.rating ? `${athlete.rating}★` : '—'}
          />
          <Stat
            label="Reviews"
            value={`${ratingInfo.count > 0 ? ratingInfo.count : athlete.reviews}`}
          />
          <Stat label="Sport" value={athlete.sport} />
          <Stat label="Response" value={athlete.responseTime.replace('Usually responds in ', '')} />
        </div>
      </div>

      {/* Bio */}
      <section className="mt-10">
        <h2 className="mb-3 text-xl font-bold">About</h2>
        <p className="text-ink-secondary">{athlete.bio}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {athlete.tags.map((t) => (
            <span key={t} className="chip">#{t}</span>
          ))}
        </div>
      </section>

      {/* Career */}
      <section className="mt-10">
        <h2 className="mb-3 text-xl font-bold">Career</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <Stat label="Games" value={String(athlete.career.gamesPlayed)} />
          <Stat label="Goals/Wins" value={String(athlete.career.goals)} />
          <Stat label="Assists/More" value={String(athlete.career.assists)} />
          {athlete.career.championships && <Stat label="Championships" value={athlete.career.championships} />}
        </div>
      </section>

      {/* Experiences */}
      <section className="mt-10">
        <h2 className="mb-3 text-xl font-bold">Book an experience</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {athlete.experiences.filter((e) => e.active).map((e) => (
            <div key={e.id} className="card flex flex-col">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold">{e.title}</div>
                  <div className="text-xs text-ink-muted">{e.category} · {e.duration}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold">${e.price}</div>
                </div>
              </div>
              <p className="mb-4 text-sm text-ink-secondary">{e.description}</p>
              <Link
                to={`/book/${athlete.id}/${e.id}`}
                className="btn-primary mt-auto self-start !px-4 !py-2 text-sm"
              >
                Book this →
              </Link>
            </div>
          ))}
        </div>
      </section>
      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-xl font-bold">Reviews</h2>
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="card">
                <div className="mb-1 flex items-center justify-between">
                  <div className="font-semibold">{r.fanName}</div>
                  <div className="text-warn">{'★'.repeat(r.rating)}<span className="text-ink-muted">{'★'.repeat(5 - r.rating)}</span></div>
                </div>
                <div className="text-xs text-ink-muted">{format(new Date(r.createdAt), 'MMM d, yyyy')}</div>
                <p className="mt-2 text-sm text-ink-secondary">{r.text}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-bg-secondary/60 p-4 text-center">
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs uppercase tracking-wide text-ink-muted">{label}</div>
    </div>
  );
}
