import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { FaStar, FaCheck, FaArrowLeft, FaRegClock } from 'react-icons/fa6';
import { useAthletesStore } from '../store/useAthletesStore';
import { useReviewsStore } from '../store/useReviewsStore';

export default function AthleteProfile() {
  const { id } = useParams();
  const athleteId = Number(id);
  const athlete = useAthletesStore((s) => s.getById(athleteId));
  // Read the raw arrays from the store (stable references) and compute locally.
  // Using selector functions that return fresh arrays causes infinite re-renders.
  const allReviews = useReviewsStore((s) => s.reviews);
  const reviews = useMemo(
    () =>
      allReviews
        .filter((r) => r.athleteId === athleteId)
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [allReviews, athleteId]
  );
  const ratingInfo = useMemo(() => {
    if (reviews.length === 0) return { avg: 0, count: 0 };
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    return { avg: Math.round(avg * 10) / 10, count: reviews.length };
  }, [reviews]);

  if (!athlete) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="mb-4 text-3xl font-bold">Athlete not found</h1>
        <Link to="/browse" className="btn-primary">Back to browse</Link>
      </div>
    );
  }

  const ratingDisplay = ratingInfo.count > 0 ? ratingInfo.avg : athlete.rating;
  const reviewCount = ratingInfo.count > 0 ? ratingInfo.count : athlete.reviews;
  const activeExperiences = athlete.experiences.filter((e) => e.active);

  return (
    <div className="animate-fade-in">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center opacity-30 blur-2xl"
          style={{ backgroundImage: `url(${athlete.photo})` }}
        />
        <div className="absolute inset-0 -z-10 bg-bg-primary/80" />
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full opacity-30 blur-[100px]"
            style={{ background: athlete.color }}
          />
        </div>

        <div className="mx-auto max-w-5xl px-6 py-16">
          <Link to="/browse" className="mb-6 inline-flex items-center gap-2 text-sm text-ink-muted hover:text-white">
            <FaArrowLeft className="h-3 w-3" /> Back to athletes
          </Link>
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="relative">
              <img
                src={athlete.photo}
                alt={athlete.name}
                width={400}
                height={400}
                loading="eager"
                className="h-32 w-32 rounded-3xl border-4 border-white/20 object-cover shadow-2xl sm:h-40 sm:w-40"
              />
              {athlete.verified && (
                <div className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full border-4 border-bg-primary bg-cyan text-bg-primary">
                  <FaCheck className="h-4 w-4" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="mb-2 inline-block rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink-secondary backdrop-blur">
                {athlete.sport}
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">{athlete.name}</h1>
              <div className="mt-1 text-lg text-ink-secondary">{athlete.position}</div>
              <div className="mt-1 text-sm text-ink-muted">
                {athlete.team} · {athlete.location}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                <div className="inline-flex items-center gap-1.5">
                  <FaStar className="h-4 w-4 text-warn" />
                  <span className="font-bold">{ratingDisplay || '—'}</span>
                  <span className="text-ink-muted">({reviewCount})</span>
                </div>
                <div className="text-ink-muted">·</div>
                <div className="text-ink-muted">{athlete.responseTime}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* ============ ABOUT ============ */}
        <section>
          <SectionHeading kicker="About" title={`Meet ${athlete.name.split(' ')[0]}`} />
          <p className="text-lg leading-relaxed text-ink-secondary">{athlete.bio}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {athlete.tags.map((t) => (
              <span key={t} className="chip">
                #{t}
              </span>
            ))}
          </div>
        </section>

        {/* ============ CAREER ============ */}
        <section className="mt-16">
          <SectionHeading kicker="Career" title="By the numbers" />
          <div className="grid gap-4 md:grid-cols-4">
            <Stat label="Games" value={String(athlete.career.gamesPlayed)} />
            <Stat label="Goals/Wins" value={String(athlete.career.goals)} />
            <Stat label="Assists/More" value={String(athlete.career.assists)} />
            {athlete.career.championships ? (
              <Stat label="Championships" value={athlete.career.championships} />
            ) : (
              <Stat label="Sport" value={athlete.sport} />
            )}
          </div>
        </section>

        {/* ============ EXPERIENCES ============ */}
        <section className="mt-16">
          <SectionHeading kicker="Book now" title="Pick your experience" />
          {activeExperiences.length === 0 ? (
            <div className="card text-center text-ink-muted">No experiences available right now.</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {activeExperiences.map((e) => (
                <div key={e.id} className="group card relative flex flex-col overflow-hidden">
                  <div
                    className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-3xl transition group-hover:opacity-30"
                    style={{ background: athlete.color }}
                  />
                  <div className="relative">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <div className="mb-1 inline-block rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink-secondary">
                          {e.category}
                        </div>
                        <div className="text-xl font-bold leading-tight">{e.title}</div>
                        <div className="mt-1 inline-flex items-center gap-1 text-xs text-ink-muted">
                          <FaRegClock className="h-3 w-3" /> {e.duration}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-extrabold leading-none">${e.price}</div>
                        <div className="text-xs text-ink-muted">flat fee</div>
                      </div>
                    </div>
                    <p className="mb-5 text-sm leading-relaxed text-ink-secondary">{e.description}</p>
                    <Link
                      to={`/book/${athlete.id}/${e.id}`}
                      className="btn-primary !w-full !px-4 !py-3 text-sm"
                    >
                      Book this experience →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ============ REVIEWS ============ */}
        {reviews.length > 0 && (
          <section className="mt-16">
            <SectionHeading kicker="Reviews" title="What fans are saying" />
            <div className="grid gap-4 md:grid-cols-2">
              {reviews.map((r) => (
                <div key={r.id} className="card">
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{r.fanName}</div>
                      <div className="text-xs text-ink-muted">
                        {format(new Date(r.createdAt), 'MMM d, yyyy')}
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                          key={i}
                          className={`h-3.5 w-3.5 ${i < r.rating ? 'text-warn' : 'text-ink-muted/30'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink-secondary">{r.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function SectionHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-6">
      <div className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent-primary">
        {kicker}
      </div>
      <h2 className="text-3xl font-extrabold tracking-tight">{title}</h2>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-bg-secondary/60 p-5 text-center">
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wide text-ink-muted">{label}</div>
    </div>
  );
}
