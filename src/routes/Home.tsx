import type { ComponentType } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHockeyPuck,
  FaGolfBallTee,
  FaFutbol,
  FaBasketball,
  FaBaseball,
  FaTrophy,
  FaBoltLightning,
  FaStar,
  FaCheck,
  FaMagnifyingGlass,
  FaCalendarDays,
  FaHandshake,
} from 'react-icons/fa6';
import { GiTennisRacket } from 'react-icons/gi';
import { useAthletesStore } from '../store/useAthletesStore';
import { useBookingsStore } from '../store/useBookingsStore';
import { useReviewsStore } from '../store/useReviewsStore';
import AthleteCard from '../components/AthleteCard';
import AthleteCardSkeleton from '../components/AthleteCardSkeleton';
import { useCountUp } from '../hooks/useCountUp';

type IconType = ComponentType<{ className?: string }>;

const SPORT_CATEGORIES: { name: string; Icon: IconType; gradient: string }[] = [
  { name: 'Hockey', Icon: FaHockeyPuck, gradient: 'from-blue-500 to-cyan-400' },
  { name: 'Golf', Icon: FaGolfBallTee, gradient: 'from-emerald-500 to-teal-400' },
  { name: 'Soccer', Icon: FaFutbol, gradient: 'from-lime-500 to-green-400' },
  { name: 'Basketball', Icon: FaBasketball, gradient: 'from-orange-500 to-amber-400' },
  { name: 'Tennis', Icon: GiTennisRacket, gradient: 'from-yellow-400 to-lime-300' },
  { name: 'Baseball', Icon: FaBaseball, gradient: 'from-red-500 to-rose-400' },
];

const TESTIMONIALS = [
  {
    quote:
      "Booked a former NHL forward to skate with my son's team. The kids talked about it for weeks. Worth every penny.",
    name: 'Marcus T.',
    role: 'Hockey dad, Toronto',
    avatar: 'https://i.pravatar.cc/200?img=53',
  },
  {
    quote:
      "I play in a beer league and getting to golf 18 holes with a real pro was unreal. He was so down to earth and had the best stories.",
    name: 'Jenna L.',
    role: 'Recreational golfer',
    avatar: 'https://i.pravatar.cc/200?img=47',
  },
  {
    quote:
      "I gifted my girlfriend a tennis lesson with a former WTA pro for her birthday. Best gift I've ever given. She still talks about it.",
    name: 'Devon S.',
    role: 'Boyfriend of the year',
    avatar: 'https://i.pravatar.cc/200?img=8',
  },
];

const PRESS = ['THE ATHLETIC', 'TSN', 'ESPN', 'SPORTSNET', 'BLEACHER REPORT'];

export default function Home() {
  const athletes = useAthletesStore((s) => s.athletes);
  const athletesLoaded = useAthletesStore((s) => s.loaded);
  const bookings = useBookingsStore((s) => s.bookings);
  const reviews = useReviewsStore((s) => s.reviews);

  const featured = [...athletes].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const totalExperiences = athletes.reduce((acc, a) => acc + a.experiences.length, 0);
  const completedBookings = bookings.filter(
    (b) => b.status === 'completed' || b.status === 'confirmed'
  ).length;
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
      : (athletes.reduce((a, b) => a + b.rating, 0) / athletes.length).toFixed(1);

  return (
    <div className="animate-fade-in">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        {/* Background mesh gradient — slowly drifts over time */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 h-[600px] w-[1000px] -translate-x-1/2 animate-gradient-drift rounded-full bg-accent-primary/30 blur-[120px]" />
          <div
            className="absolute -top-20 left-1/4 h-[500px] w-[700px] animate-gradient-drift rounded-full bg-accent-tertiary/20 blur-[120px]"
            style={{ animationDelay: '-7s' }}
          />
          <div
            className="absolute -top-20 right-1/4 h-[500px] w-[700px] animate-gradient-drift rounded-full bg-accent-secondary/20 blur-[120px]"
            style={{ animationDelay: '-14s' }}
          />
        </div>
        {/* Subtle grid */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-20 text-center md:pt-32">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-ink-secondary backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ok" />
            </span>
            Now booking experiences in the GTA
          </div>

          <h1 className="mb-6 font-display text-5xl font-bold leading-[1.02] tracking-tighter md:text-7xl lg:text-[5.5rem]">
            Hire a pro athlete
            <br />
            <span className="bg-hero-gradient bg-clip-text text-transparent">for the day.</span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-ink-secondary md:text-xl">
            Rent a real professional for a round of golf, a skate with your kids' team, a
            private training session, or whatever you're into. Real stars, in person.
          </p>

          {/* Sport pills */}
          <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
            {SPORT_CATEGORIES.map(({ name, Icon }) => (
              <span
                key={name}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-sm text-ink-secondary backdrop-blur"
              >
                <Icon className="h-3.5 w-3.5 text-accent-primary" />
                {name}
              </span>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/browse" className="btn-primary !px-7 !py-4 text-base shadow-2xl shadow-accent-primary/30">
              Browse athletes →
            </Link>
            <Link to="/login" className="btn-secondary !px-7 !py-4 text-base">
              Become a pro
            </Link>
          </div>

          {/* Trust microcopy */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-ink-muted">
            <span className="inline-flex items-center gap-1.5"><FaCheck className="h-3 w-3 text-ok" /> Verified pros only</span>
            <span className="inline-flex items-center gap-1.5"><FaCheck className="h-3 w-3 text-ok" /> Secure payments</span>
            <span className="inline-flex items-center gap-1.5"><FaCheck className="h-3 w-3 text-ok" /> 100% satisfaction guarantee</span>
          </div>
        </div>
      </section>

      {/* ============ PRESS BAR ============ */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="mb-4 text-center text-xs uppercase tracking-[0.2em] text-ink-muted">
            As featured in
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 opacity-60">
            {PRESS.map((p) => (
              <div key={p} className="text-sm font-bold tracking-[0.25em] text-ink-secondary">
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="mx-auto max-w-6xl px-6 pt-16">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatNumber Icon={FaTrophy} label="Pro athletes" target={athletes.length} />
          <StatNumber Icon={FaBoltLightning} label="Experiences" target={totalExperiences} />
          <StatNumber Icon={FaCalendarDays} label="Bookings" target={completedBookings} />
          <StatNumber
            Icon={FaStar}
            label="Avg rating"
            target={Number(avgRating)}
            decimals={1}
          />
        </div>
      </section>

      {/* ============ BROWSE BY SPORT ============ */}
      <section className="mx-auto max-w-6xl px-6 pt-24">
        <div className="mb-8 text-center">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-primary">
            Browse by sport
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight">Pick your game</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {SPORT_CATEGORIES.map(({ name, Icon, gradient }) => (
            <Link
              key={name}
              to="/browse"
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card p-6 text-center transition hover:-translate-y-1 hover:border-white/30"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition group-hover:opacity-20`}
              />
              <div className="relative">
                <div className="mb-3 flex justify-center">
                  <Icon className="h-8 w-8 text-accent-primary transition group-hover:text-white" />
                </div>
                <div className="text-sm font-semibold">{name}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ FEATURED PROS ============ */}
      <section className="mx-auto max-w-6xl px-6 pt-24">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-primary">
              Top rated
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight">Featured pros</h2>
            <p className="mt-1 text-ink-muted">Bookable right now</p>
          </div>
          <Link
            to="/browse"
            className="hidden text-sm font-semibold text-accent-primary hover:underline sm:inline"
          >
            See all athletes →
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {!athletesLoaded
            ? Array.from({ length: 4 }).map((_, i) => <AthleteCardSkeleton key={i} />)
            : featured.map((a) => <AthleteCard key={a.id} athlete={a} />)}
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="mx-auto max-w-6xl px-6 pt-28">
        <div className="mb-12 text-center">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-primary">
            How it works
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight">From browse to booked in minutes</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Step
            n="1"
            Icon={FaMagnifyingGlass}
            title="Pick a pro"
            body="Browse athletes by sport, see their experiences, and find the perfect match."
          />
          <Step
            n="2"
            Icon={FaCalendarDays}
            title="Book a slot"
            body="Choose from their real availability and pay securely. Done in 60 seconds."
          />
          <Step
            n="3"
            Icon={FaHandshake}
            title="Show up & play"
            body="Chat directly to coordinate the details, then meet your hero in person."
          />
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="mx-auto max-w-6xl px-6 pt-28">
        <div className="mb-12 text-center">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-primary">
            From real fans
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight">Memories that don't fade</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="card relative">
              <div className="absolute -top-4 left-6 text-5xl text-accent-primary/40">"</div>
              <p className="relative pt-3 text-sm leading-relaxed text-ink-secondary">{t.quote}</p>
              <div className="mt-6 flex items-center gap-3 border-t border-white/5 pt-4">
                <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-ink-muted">{t.role}</div>
                </div>
                <div className="ml-auto flex items-center gap-0.5 text-warn">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar key={i} className="h-3 w-3" />
                ))}
              </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="mx-auto max-w-6xl px-6 pb-12 pt-28">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-card p-10 text-center md:p-16">
          <div className="pointer-events-none absolute inset-0 -z-0">
            <div className="absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-primary/20 blur-[100px]" />
          </div>
          <div className="relative">
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl">
              Ready to play with a star?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-ink-secondary">
              Browse hundreds of experiences with verified pro athletes. Book in seconds.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/browse" className="btn-primary !px-7 !py-4 text-base">
                Find your athlete →
              </Link>
              <Link to="/login" className="btn-secondary !px-7 !py-4 text-base">
                Become a pro
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatNumber({
  Icon,
  label,
  target,
  decimals = 0,
}: {
  Icon: IconType;
  label: string;
  target: number;
  decimals?: number;
}) {
  const value = useCountUp(target, 1400);
  const display = value.toFixed(decimals);
  return (
    <div className="card text-center">
      <div className="mb-2 flex justify-center">
        <Icon className="h-6 w-6 text-accent-primary" />
      </div>
      <div className="bg-hero-gradient bg-clip-text font-display text-3xl font-extrabold text-transparent md:text-4xl">
        {display}
      </div>
      <div className="mt-1 text-xs uppercase tracking-wide text-ink-muted">{label}</div>
    </div>
  );
}

function Step({ n, Icon, title, body }: { n: string; Icon: IconType; title: string; body: string }) {
  return (
    <div className="card relative overflow-hidden">
      <div className="absolute -right-4 -top-4 text-9xl font-extrabold leading-none text-white/[0.03]">
        {n}
      </div>
      <div className="relative">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-hero-gradient text-white shadow-lg shadow-accent-primary/30">
          <Icon className="h-5 w-5" />
        </div>
        <div className="mb-1 text-xl font-bold">{title}</div>
        <div className="text-sm text-ink-muted">{body}</div>
      </div>
    </div>
  );
}
