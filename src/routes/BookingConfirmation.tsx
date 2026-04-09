import { Link, useParams } from 'react-router-dom';
import { format } from 'date-fns';
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
    <div className="mx-auto max-w-2xl px-6 py-16 animate-fade-in">
      <div className="card text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-ok/20 text-3xl">
          ✓
        </div>
        <h1 className="mb-2 text-3xl font-extrabold">Booking confirmed!</h1>
        <p className="mb-6 text-ink-muted">
          Your request has been sent to {athlete.name}. They'll review and confirm shortly.
        </p>

        <div className="rounded-xl border border-white/10 bg-bg-secondary/40 p-5 text-left">
          <Row label="Athlete" value={athlete.name} />
          <Row label="Experience" value={booking.experienceTitle} />
          <Row label="Date" value={format(new Date(booking.date), 'EEEE, MMM d, yyyy')} />
          <Row label="Time" value={booking.time} />
          <Row label="Total paid" value={`$${booking.total}`} />
          <Row label="Status" value={booking.status} />
          <Row label="Payment ref" value={booking.paymentRef} />
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link to="/fan/bookings" className="btn-primary">View my bookings</Link>
          <Link to="/browse" className="btn-secondary">Browse more pros</Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-white/5 py-2 text-sm last:border-0">
      <span className="text-ink-muted">{label}</span>
      <span className="font-semibold capitalize">{value}</span>
    </div>
  );
}
