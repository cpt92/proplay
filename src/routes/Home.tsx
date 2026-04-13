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
  FaShieldHalved,
  FaLock,
  FaHeart,
} from 'react-icons/fa6';
import { GiTennisRacket } from 'react-icons/gi';
import { useAthletesStore } from '../store/useAthletesStore';
import { useBookingsStore } from '../store/useBookingsStore';
import { useReviewsStore } from '../store/useReviewsStore';
import AthleteCard from '../components/AthleteCard';
import AthleteCardSkeleton from '../components/AthleteCardSkeleton';
import { useCountUp } from '../hooks/useCountUp';
import { useParallax } from '../hooks/useParallax';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';

type IconType = ComponentType<{ className?: string }>;

const SPORT_CATEGORIES: { name: string; Icon: IconType }[] = [
  { name: 'Hockey', Icon: FaHockeyPuck },
  { name: 'Golf', Icon: FaGolfBallTee },
  { name: 'Soccer', Icon: FaFutbol },
  { name: 'Basketball', Icon: FaBasketball },
  { name: 'Tennis', Icon: GiTennisRacket },
  { name: 'Baseball', Icon: FaBaseball },
];

const PROMISES: { Icon: IconType; title: string; body: string }[] = [
  {
    Icon: FaShieldHalved,
    title: 'Verified pros only',
    body: 'Every athlete is identity-checked and background-verified before they join the roster.',
  },
  {
    Icon: FaLock,
    title: 'Secure payments',
    body: 'Card details never touch our servers. Funds are held until the experience is complete.',
  },
  {
    Icon: FaHeart,
    title: 'Satisfaction guarantee',
    body: 'If the experience falls short, we make it right — full refund or rebook, your call.',
  },
];

export default function Home() {
  const athletes = useAthletesStore((s) => s.athletes);
  const athletesLoaded = useAthletesStore((s) => s.loaded);
  const reviews = useReviewsStore((s) => s.reviews);
  const publicBookingCount = useBookingsStore((s) => s.publicCompletedCount);

  const featured = [...athletes].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const totalExperiences = athletes.reduce((acc, a) => acc + a.experiences.length, 0);

  const ratedAthletes = athletes.filter((a) => a.rating > 0);
  const avgFromReviews =
    reviews.length > 0 ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : null;
  const avgFromAthletes =
    ratedAthletes.length > 0
      ? ratedAthletes.reduce((a, b) => a + b.rating, 0) / ratedAthletes.length
      : null;
  const avgRatingNum = avgFromReviews ?? avgFromAthletes ?? 0;

  return (
    <div className="animate-fade-in">
      {/* ============ HERO ============ */}
      <HeroSection />

      {/* ============ STATS ============ */}
      <section className="mx-auto max-w-6xl px-6 pt-16">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatNumber Icon={FaTrophy} label="Pro athletes" target={athletes.length} />
          <StatNumber Icon={FaBoltLightning} label="Experiences" target={totalExperiences} />
          <StatNumber Icon={FaCalendarDays} label="Bookings" target={publicBookingCount} />
          <StatNumber
            Icon={FaStar}
            label="Avg rating"
            target={avgRatingNum}
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
          {SPORT_CATEGORIES.map(({ name, Icon }) => (
            <Link
              key={name}
              to="/browse"
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card p-6 text-center transition hover:-translate-y-1 hover:border-accent-primary/40"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 to-transparent opacity-0 transition group-hover:opacity-100" />
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
            : featured.map((a, i) => (
                <RevealCard key={a.id} delayMs={i * 80}>
                  <AthleteCard athlete={a} />
                </RevealCard>
              ))}
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-6 pt-28">
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

      {/* ============ OUR PROMISE ============ */}
      <section className="mx-auto max-w-6xl px-6 pt-28">
        <div className="mb-12 text-center">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-primary">
            Our promise
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Book with <span className="font-serif italic font-black text-accent-primary">confidence</span>
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {PROMISES.map(({ Icon, title, body }, i) => (
            <RevealCard key={title} delayMs={i * 100}>
              <div className="card relative overflow-hidden">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-hero-gradient text-white shadow-lg shadow-accent-primary/30">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mb-1 text-xl font-bold">{title}</div>
                <div className="text-sm leading-relaxed text-ink-muted">{body}</div>
              </div>
            </RevealCard>
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
      <div className="bg-accent-gradient bg-clip-text font-serif text-5xl font-black leading-none text-transparent md:text-6xl">
        {display}
      </div>
      <div className="mt-3 text-xs uppercase tracking-wide text-ink-muted">{label}</div>
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

function RevealCard({
  children,
  delayMs = 0,
  className = '',
}: {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
}) {
  const { ref, visible } = useRevealOnScroll<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
}

function HeroSection() {
  const parallaxRef = useParallax(0.18);
  return (
    <section className="relative overflow-hidden">
      {/* Parallax photo background */}
      <div ref={parallaxRef} className="pointer-events-none absolute inset-0 -z-20 h-[140%] will-change-transform">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-arena.jpg')", backgroundColor: '#050a1a' }}
        />
      </div>
      {/* Navy gradient overlay for legibility */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-bg-primary/55 via-bg-primary/75 to-bg-primary" />
      {/* Crimson accent glow, top right */}
      <div className="pointer-events-none absolute -right-32 -top-32 -z-10 h-[520px] w-[520px] rounded-full bg-accent-primary/15 blur-[140px]" />
      {/* Noise grain */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 pb-28 pt-24 md:pb-32 md:pt-36">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="mb-6 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-accent-primary">
            <span className="h-px w-8 bg-accent-primary" />
            Elite experiences
          </div>

          <h1 className="mb-6 font-display text-5xl font-bold leading-[1.02] tracking-tighter md:text-7xl lg:text-[5.5rem]">
            Train with the
            <br />
            <span className="bg-accent-gradient bg-clip-text font-serif italic font-black text-transparent">
              greatest ever.
            </span>
          </h1>

          <p className="mb-10 max-w-xl text-lg text-ink-secondary md:text-xl">
            Book one-on-one days with real pro athletes — private training, game tickets, meet-and-greets. Verified. Insured. Unforgettable.
          </p>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Link
              to="/browse"
              className="btn-primary !px-7 !py-4 text-base shadow-2xl shadow-accent-primary/30"
            >
              Browse athletes →
            </Link>
            <a href="#how-it-works" className="btn-secondary !px-7 !py-4 text-base">
              How it works
            </a>
          </div>

          {/* Trust microcopy */}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-ink-muted">
            <span className="inline-flex items-center gap-1.5"><FaCheck className="h-3 w-3 text-ok" /> Verified pros only</span>
            <span className="inline-flex items-center gap-1.5"><FaCheck className="h-3 w-3 text-ok" /> Secure payments</span>
            <span className="inline-flex items-center gap-1.5"><FaCheck className="h-3 w-3 text-ok" /> 100% satisfaction guarantee</span>
          </div>
        </div>
      </div>
    </section>
  );
}
