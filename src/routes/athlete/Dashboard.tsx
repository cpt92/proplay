import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useAthletesStore } from '../../store/useAthletesStore';
import { useBookingsStore } from '../../store/useBookingsStore';

export default function Dashboard() {
  const user = useAuthStore((s) =>
    s.currentUserId ? s.users.find((u) => u.id === s.currentUserId) ?? null : null
  );
  const athlete = useAthletesStore((s) => (user ? s.getByOwner(user.id) : undefined));
  const bookings = useBookingsStore((s) => (athlete ? s.byAthlete(athlete.id) : []));

  if (!user) return null;

  if (!athlete) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="mb-3 text-3xl font-bold">Welcome, {user.name.split(' ')[0]}</h1>
        <p className="mb-6 text-ink-muted">Let's set up your athlete profile.</p>
        <Link to="/athlete/onboarding" className="btn-primary">Start onboarding →</Link>
      </div>
    );
  }

  const totalSlots = Object.values(athlete.availability ?? {}).reduce((acc, slots) => acc + slots.length, 0);
  const activeExperiences = athlete.experiences.filter((e) => e.active).length;
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const earnings = bookings
    .filter((b) => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + b.total, 0);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 animate-fade-in">
      <div className="mb-8 flex items-center gap-4">
        <img src={athlete.photo} alt="" className="h-16 w-16 rounded-2xl border border-white/10 object-cover" />
        <div>
          <h1 className="text-3xl font-extrabold">{athlete.name}</h1>
          <div className="text-sm text-ink-muted">{athlete.position} · {athlete.sport}</div>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Pending requests" value={String(pendingCount)} />
        <Stat label="Confirmed" value={String(confirmedCount)} />
        <Stat label="Open slots" value={String(totalSlots)} />
        <Stat label="Earnings" value={`$${earnings}`} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashCard
          to="/athlete/bookings"
          title="Bookings"
          body="Accept or decline incoming requests."
          cta={pendingCount > 0 ? `${pendingCount} pending →` : `${bookings.length} total →`}
        />
        <DashCard
          to="/athlete/experiences"
          title="Experiences"
          body="Add, edit, or pause what fans can book."
          cta={`${activeExperiences} active →`}
        />
        <DashCard
          to="/athlete/availability"
          title="Availability"
          body="Set the days and times you're free."
          cta={`${totalSlots} slots →`}
        />
        <DashCard
          to={`/athletes/${athlete.id}`}
          title="Public profile"
          body="See exactly what fans see when they visit your page."
          cta="View profile →"
        />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card text-center">
      <div className="bg-hero-gradient bg-clip-text text-3xl font-extrabold text-transparent">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wide text-ink-muted">{label}</div>
    </div>
  );
}

function DashCard({ to, title, body, cta }: { to: string; title: string; body: string; cta: string }) {
  return (
    <Link to={to} className="card transition hover:-translate-y-0.5 hover:border-accent-primary/40">
      <div className="text-lg font-semibold">{title}</div>
      <p className="mt-1 text-sm text-ink-muted">{body}</p>
      <div className="mt-4 text-sm font-semibold text-accent-primary">{cta}</div>
    </Link>
  );
}
