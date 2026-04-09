import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';
import { useAthletesStore } from '../../store/useAthletesStore';
import { useBookingsStore, type BookingStatus } from '../../store/useBookingsStore';
import { toast } from '../../store/useToastStore';

const STATUS_STYLE: Record<BookingStatus, string> = {
  pending: 'border-warn/40 bg-warn/10 text-warn',
  confirmed: 'border-ok/40 bg-ok/10 text-ok',
  declined: 'border-err/40 bg-err/10 text-err',
  cancelled: 'border-white/10 bg-white/5 text-ink-muted',
  completed: 'border-accent-primary/40 bg-accent-primary/10 text-accent-primary',
};

export default function BookingRequests() {
  const userId = useAuthStore((s) => s.currentUserId);
  const athlete = useAthletesStore((s) => (userId ? s.getByOwner(userId) : undefined));
  const allBookings = useBookingsStore((s) => s.bookings);
  const bookings = useMemo(
    () => (athlete ? allBookings.filter((b) => b.athleteId === athlete.id) : []),
    [allBookings, athlete]
  );
  const setStatus = useBookingsStore((s) => s.setStatus);

  if (!athlete) return null;

  const sorted = [...bookings].sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 animate-fade-in">
      <h1 className="mb-2 text-3xl font-extrabold">Booking requests</h1>
      <p className="mb-6 text-ink-muted">{sorted.length} total · {sorted.filter((b) => b.status === 'pending').length} pending</p>

      {sorted.length === 0 ? (
        <div className="card text-center text-ink-muted">No bookings yet. Once a fan books one of your experiences, it'll show up here.</div>
      ) : (
        <div className="grid gap-4">
          {sorted.map((b) => (
            <div key={b.id} className="card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="text-lg font-semibold">{b.experienceTitle}</div>
                  <span className={`chip ${STATUS_STYLE[b.status]}`}>{b.status}</span>
                </div>
                <div className="text-sm text-ink-muted">
                  {format(new Date(b.date), 'EEE, MMM d')} · {b.time} · ${b.total}
                </div>
                <div className="text-xs text-ink-muted">From: {b.fanName}</div>
              </div>
              {b.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setStatus(b.id, 'confirmed');
                      toast.success(`Accepted booking from ${b.fanName}`);
                    }}
                    className="btn-primary !px-3 !py-2 text-xs"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => {
                      setStatus(b.id, 'declined');
                      toast.info('Booking declined');
                    }}
                    className="rounded-xl border border-err/40 bg-err/10 px-3 py-2 text-xs font-semibold text-err transition hover:bg-err/20"
                  >
                    Decline
                  </button>
                </div>
              )}
              {b.status === 'confirmed' && (
                <div className="flex gap-2">
                  <Link to={`/messages?booking=${b.id}`} className="btn-secondary !px-3 !py-2 text-xs">
                    Message
                  </Link>
                  <button
                    onClick={() => {
                      setStatus(b.id, 'completed');
                      toast.success('Booking marked as completed');
                    }}
                    className="btn-primary !px-3 !py-2 text-xs"
                  >
                    Mark completed
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
