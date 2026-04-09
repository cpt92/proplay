import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { format, isBefore } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';
import { useBookingsStore, type BookingStatus, type Booking } from '../../store/useBookingsStore';
import { useAthletesStore } from '../../store/useAthletesStore';
import { useReviewsStore } from '../../store/useReviewsStore';
import { toast } from '../../store/useToastStore';

const STATUS_STYLE: Record<BookingStatus, string> = {
  pending: 'border-warn/40 bg-warn/10 text-warn',
  confirmed: 'border-ok/40 bg-ok/10 text-ok',
  declined: 'border-err/40 bg-err/10 text-err',
  cancelled: 'border-white/10 bg-white/5 text-ink-muted',
  completed: 'border-accent-primary/40 bg-accent-primary/10 text-accent-primary',
};

type Tab = 'upcoming' | 'past' | 'cancelled';

export default function MyBookings() {
  const user = useAuthStore((s) =>
    s.currentUserId ? s.users.find((u) => u.id === s.currentUserId) ?? null : null
  );
  const allBookings = useBookingsStore((s) => s.bookings);
  const bookings = useMemo(
    () => (user ? allBookings.filter((b) => b.fanId === user.id) : []),
    [allBookings, user]
  );
  const setStatus = useBookingsStore((s) => s.setStatus);
  const athletes = useAthletesStore((s) => s.athletes);
  const reviews = useReviewsStore((s) => s.reviews);
  const addReview = useReviewsStore((s) => s.add);

  const [tab, setTab] = useState<Tab>('upcoming');
  const [reviewing, setReviewing] = useState<Booking | null>(null);
  const [stars, setStars] = useState(5);
  const [text, setText] = useState('');

  if (!user) return null;

  const now = new Date();
  const filtered = bookings.filter((b) => {
    const dt = new Date(`${b.date}T${b.time}`);
    if (tab === 'cancelled') return b.status === 'cancelled' || b.status === 'declined';
    if (tab === 'past') return b.status === 'completed' || (isBefore(dt, now) && b.status !== 'cancelled' && b.status !== 'declined');
    return (b.status === 'pending' || b.status === 'confirmed') && !isBefore(dt, now);
  });

  const submitReview = () => {
    if (!reviewing) return;
    addReview({
      bookingId: reviewing.id,
      athleteId: reviewing.athleteId,
      fanId: user.id,
      fanName: user.name,
      rating: stars,
      text: text.trim(),
    });
    setReviewing(null);
    setStars(5);
    setText('');
    toast.success('Thanks for your review!');
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 animate-fade-in">
      <h1 className="mb-2 text-3xl font-extrabold">My bookings</h1>
      <p className="mb-6 text-ink-muted">{bookings.length} total</p>

      <div className="mb-6 flex gap-2 rounded-xl border border-white/10 bg-card p-1">
        {(['upcoming', 'past', 'cancelled'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold capitalize transition ${
              tab === t ? 'bg-hero-gradient text-white' : 'text-ink-secondary hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center text-ink-muted">
          {tab === 'upcoming' ? (
            <>
              No upcoming bookings.{' '}
              <Link to="/browse" className="text-accent-primary hover:underline">Browse pros →</Link>
            </>
          ) : (
            'Nothing here yet.'
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((b) => {
            const a = athletes.find((x) => x.id === b.athleteId);
            const existingReview = reviews.find((r) => r.bookingId === b.id);
            return (
              <div key={b.id} className="card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  {a && <img src={a.photo} alt="" className="h-12 w-12 rounded-xl object-cover" />}
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-base font-semibold">{b.experienceTitle}</div>
                      <span className={`chip ${STATUS_STYLE[b.status]}`}>{b.status}</span>
                    </div>
                    <div className="text-sm text-ink-muted">
                      {a?.name} · {format(new Date(b.date), 'EEE, MMM d')} · {b.time} · ${b.total}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(b.status === 'confirmed' || b.status === 'pending') && (
                    <Link to={`/messages?booking=${b.id}`} className="btn-secondary !px-3 !py-2 text-xs">
                      Message
                    </Link>
                  )}
                  {b.status === 'completed' && !existingReview && (
                    <button
                      onClick={() => setReviewing(b)}
                      className="btn-primary !px-3 !py-2 text-xs"
                    >
                      Leave review
                    </button>
                  )}
                  {b.status === 'completed' && existingReview && (
                    <span className="chip border-ok/40 text-ok">Reviewed ✓</span>
                  )}
                  {(b.status === 'pending' || b.status === 'confirmed') && (
                    <button
                      onClick={() => {
                        if (confirm('Cancel this booking?')) {
                          setStatus(b.id, 'cancelled');
                          toast.info('Booking cancelled');
                        }
                      }}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-ink-secondary transition hover:text-white"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {reviewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="card w-full max-w-md space-y-4">
            <div className="text-xl font-bold">Leave a review</div>
            <div className="text-sm text-ink-muted">{reviewing.experienceTitle}</div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setStars(n)}
                  className={`text-3xl transition ${n <= stars ? 'text-warn' : 'text-ink-muted'}`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              className="textarea h-28"
              placeholder="How was your experience?"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button className="btn-secondary !px-4 !py-2 text-sm" onClick={() => setReviewing(null)}>
                Cancel
              </button>
              <button className="btn-primary !px-4 !py-2 text-sm" onClick={submitReview} disabled={!text.trim()}>
                Submit review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
