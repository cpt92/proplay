import { Link, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { FaCheck, FaRegComment, FaCalendarDays } from 'react-icons/fa6';
import { useBookingsStore } from '../store/useBookingsStore';
import { useAthletesStore } from '../store/useAthletesStore';

export default function BookingConfirmation() {
  const { id } = useParams();
  const booking = useBookingsStore((s) => (id ? s.byId(id) : undefined));
  const athlete = useAthletesStore((s) => (booking ? s.getById(booking.athleteId) : undefined));

  if (!booking || !athlete) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="mb-3 text-3xl font-bold">Booking not found</h1>
        <Link to="/browse" className="btn-primary">Back to browse</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 animate-fade-in">
      {/* ============ HERO ============ */}
      <div className="mb-10 flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:text-left">
        {/* Athlete photo with inset frame */}
        <div className="relative flex-shrink-0">
          <div className="relative h-36 w-36 overflow-hidden rounded-2xl shadow-[0_24px_60px_-24px_rgba(0,0,0,0.7)]">
            <img
              src={athlete.photo}
              alt={athlete.name}
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-2 rounded-xl ring-1 ring-inset ring-white/15" />
          </div>
          {/* Crimson celebration checkmark */}
          <div className="absolute -bottom-2 -right-2 flex h-11 w-11 items-center justify-center rounded-full border-4 border-bg-primary bg-accent-primary shadow-lg shadow-accent-primary/40">
            <FaCheck className="h-4 w-4 text-white" />
          </div>
        </div>

        {/* Headline */}
        <div className="flex-1">
          <div className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-accent-primary">
            <span className="h-px w-6 bg-accent-primary" />
            Confirmed
          </div>
          <h1 className="font-serif text-5xl font-black italic leading-none tracking-tight md:text-6xl">
            You're in.
          </h1>
          <p className="mt-4 text-ink-secondary">
            You've booked <span className="font-semibold text-ink-primary">{athlete.name}</span>. Here's what happens next.
          </p>
        </div>
      </div>

      {/* ============ WHAT HAPPENS NEXT ============ */}
      <div className="mb-10 rounded-2xl border border-white/10 bg-card p-6 md:p-8">
        <div className="mb-6 text-xs font-bold uppercase tracking-[0.14em] text-ink-muted">
          What happens next
        </div>
        <ol className="relative space-y-6 border-l border-white/10 pl-6">
          <TimelineStep
            n={1}
            title="Pro reviews your request"
            body="Usually within 2 hours. You'll get an email as soon as they confirm."
          />
          <TimelineStep
            n={2}
            title="Chat opens automatically"
            body="You'll coordinate the exact time and location directly with the athlete."
          />
          <TimelineStep
            n={3}
            title="Day of experience"
            body="Show up. Have a day you'll never forget."
          />
        </ol>
      </div>

      {/* ============ BOOKING DETAILS ============ */}
      <div className="mb-10 rounded-2xl border border-white/10 bg-card p-6 md:p-8">
        <div className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-ink-muted">
          Booking details
        </div>
        <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
          <DetailRow label="Experience" value={booking.experienceTitle} />
          <DetailRow label="Date" value={format(new Date(booking.date), 'EEEE, MMM d, yyyy')} />
          <DetailRow label="Time" value={booking.time} />
          <DetailRow label="Total paid" value={`$${booking.total}`} />
          <DetailRow label="Status" value={booking.status} />
          <DetailRow label="Payment ref" value={booking.paymentRef} />
        </dl>
      </div>

      {/* ============ CTAs ============ */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link to={`/messages?booking=${booking.id}`} className="btn-primary !px-6 !py-3.5">
          <FaRegComment className="h-4 w-4" /> Open chat
        </Link>
        <Link to="/fan/bookings" className="btn-secondary !px-6 !py-3.5">
          <FaCalendarDays className="h-4 w-4" /> View all bookings
        </Link>
      </div>
    </div>
  );
}

function TimelineStep({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <li className="relative">
      <div className="absolute -left-[33px] flex h-6 w-6 items-center justify-center rounded-full border-4 border-bg-primary bg-accent-primary text-[10px] font-black text-white">
        {n}
      </div>
      <div className="font-semibold text-ink-primary">{title}</div>
      <div className="mt-0.5 text-sm text-ink-secondary">{body}</div>
    </li>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-ink-muted">{label}</dt>
      <dd className="mt-0.5 font-semibold capitalize text-ink-primary">{value}</dd>
    </div>
  );
}
