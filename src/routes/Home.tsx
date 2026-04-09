import { Link } from 'react-router-dom';
import { useAthletesStore } from '../store/useAthletesStore';
import { useBookingsStore } from '../store/useBookingsStore';
import { useReviewsStore } from '../store/useReviewsStore';
import AthleteCard from '../components/AthleteCard';

export default function Home() {
  const athletes = useAthletesStore((s) => s.athletes);
  const bookings = useBookingsStore((s) => s.bookings);
  const reviews = useReviewsStore((s) => s.reviews);
  const featured = [...athletes].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const totalExperiences = athletes.reduce((acc, a) => acc + a.experiences.length, 0);
  const completedBookings = bookings.filter((b) => b.status === 'completed' || b.status === 'confirmed').length;
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
      : (athletes.reduce((a, b) => a + b.rating, 0) / athletes.length).toFixed(1);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 text-center md:pt-24">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-medium text-ink-secondary">
            <span className="h-2 w-2 rounded-full bg-ok animate-pulse" />
            Now booking experiences in the GTA
          </div>
          <h1 className="mb-6 text-5xl font-extrabold leading-tight md:text-7xl">
            Play with the
            <br />
            <span className="bg-hero-gradient bg-clip-text text-transparent">pros.</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-ink-secondary">
            Hire a real professional athlete for a round of golf, a skate with your kids' team,
            a private training session, or whatever you're into. Like Cameo — but in person.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/browse" className="btn-primary">Browse athletes →</Link>
            <Link to="/login" className="btn-secondary">Become a pro</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Stat label="Pro athletes" value={`${athletes.length}`} />
          <Stat label="Experiences" value={`${totalExperiences}`} />
          <Stat label="Bookings" value={`${completedBookings}`} />
          <Stat label="Avg rating" value={`${avgRating}★`} />
        </div>
      </section>

      {/* Featured athletes */}
      <section className="mx-auto max-w-6xl px-6 pt-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold">Featured pros</h2>
            <p className="text-ink-muted">Top-rated athletes ready to book</p>
          </div>
          <Link to="/browse" className="text-sm font-semibold text-accent-primary hover:underline">
            See all →
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((a) => (
            <AthleteCard key={a.id} athlete={a} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 pt-24">
        <h2 className="mb-10 text-center text-3xl font-bold">How it works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Step n="1" title="Pick a pro" body="Browse athletes by sport and find the experience you want." />
          <Step n="2" title="Book a slot" body="Choose from their real availability and pay securely." />
          <Step n="3" title="Show up & play" body="Chat directly to coordinate, then meet in person." />
        </div>
      </section>
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

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="card">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-hero-gradient text-sm font-bold">
        {n}
      </div>
      <div className="mb-1 text-lg font-semibold">{title}</div>
      <div className="text-sm text-ink-muted">{body}</div>
    </div>
  );
}
