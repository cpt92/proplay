import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  FaArrowUpRightFromSquare,
  FaCreditCard,
  FaUsers,
  FaCalendarCheck,
  FaMessage,
  FaStar,
  FaArrowRotateLeft,
  FaCircleCheck,
  FaCircleXmark,
} from 'react-icons/fa6';
import { useAuthStore } from '../store/useAuthStore';
import { useAthletesStore } from '../store/useAthletesStore';
import { useBookingsStore } from '../store/useBookingsStore';
import { useChatStore } from '../store/useChatStore';
import { useReviewsStore } from '../store/useReviewsStore';
import { supabase } from '../lib/supabase';
import { toast } from '../store/useToastStore';
import type { Profile } from '../lib/types';

type StripePayment = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  created: number;
  athleteName: string | null;
  experienceTitle: string | null;
  refunded: boolean;
};

type StripeSummary = {
  totalCents: number;
  totalDollars: number;
  grossDollars: number;
  refundedDollars: number;
  succeededCount: number;
  refundedCount: number;
  failedCount: number;
};

const QUICK_LINKS = [
  {
    name: 'Live site',
    url: 'https://proplay-seven.vercel.app',
    desc: 'Open the public site',
  },
  {
    name: 'Vercel project',
    url: 'https://vercel.com/cpt92s-projects/proplay',
    desc: 'Deploys, env vars, analytics',
  },
  {
    name: 'Stripe payments',
    url: 'https://dashboard.stripe.com/test/payments',
    desc: 'All test charges',
  },
  {
    name: 'Supabase project',
    url: 'https://supabase.com/dashboard/project/clteanpxsuncgyqlvbjj',
    desc: 'Database, auth, realtime',
  },
  {
    name: 'GitHub repo',
    url: 'https://github.com/cpt92/proplay',
    desc: 'Source code',
  },
];

export default function Admin() {
  const user = useAuthStore((s) => s.profile);
  const athletes = useAthletesStore((s) => s.athletes);
  const bookings = useBookingsStore((s) => s.bookings);
  const messages = useChatStore((s) => s.messages);
  const reviews = useReviewsStore((s) => s.reviews);

  const [users, setUsers] = useState<Profile[]>([]);
  const [stripeSummary, setStripeSummary] = useState<StripeSummary | null>(null);
  const [stripePayments, setStripePayments] = useState<StripePayment[]>([]);
  const [stripeLoading, setStripeLoading] = useState(true);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [refunding, setRefunding] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, role, name, email, athlete_id, created_at')
        .order('created_at', { ascending: false });
      setUsers(
        (data ?? []).map((r: Record<string, unknown>) => ({
          id: r.id as string,
          role: r.role as Profile['role'],
          name: r.name as string,
          email: r.email as string,
          athleteId: (r.athlete_id as string) ?? null,
          createdAt: r.created_at as string,
        }))
      );
    })();
  }, []);

  const loadStripe = async () => {
    setStripeLoading(true);
    setStripeError(null);
    try {
      const res = await fetch('/api/stripe-summary');
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'Could not load Stripe data');
      setStripeSummary(data.summary);
      setStripePayments(data.payments);
    } catch (err) {
      setStripeError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setStripeLoading(false);
    }
  };

  useEffect(() => {
    loadStripe();
  }, []);

  if (!user || !user.email.toLowerCase().startsWith('admin@')) {
    return <Navigate to="/" replace />;
  }

  const handleRefund = async (paymentIntentId: string) => {
    if (!confirm('Refund this payment? This is a real Stripe action (test mode).')) return;
    setRefunding(paymentIntentId);
    try {
      const res = await fetch('/api/refund-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'Refund failed');
      toast.success('Payment refunded');
      await loadStripe();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Refund failed');
    } finally {
      setRefunding(null);
    }
  };

  const totalRevenue = bookings
    .filter((b) => b.status === 'confirmed' || b.status === 'completed')
    .reduce((s, b) => s + b.total, 0);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 animate-fade-in">
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-primary">
        Admin
      </div>
      <h1 className="mb-2 text-4xl font-extrabold tracking-tight">Management dashboard</h1>
      <p className="mb-10 text-ink-muted">Live data from Stripe, Supabase, and your app.</p>

      {/* ===== KPI ROW ===== */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          icon={<FaCreditCard />}
          label="Stripe net revenue"
          value={stripeSummary ? `$${stripeSummary.totalDollars.toFixed(2)}` : stripeLoading ? '…' : '—'}
          sub={
            stripeSummary
              ? `$${stripeSummary.grossDollars.toFixed(0)} gross · $${stripeSummary.refundedDollars.toFixed(0)} refunded`
              : ''
          }
        />
        <Kpi
          icon={<FaUsers />}
          label="Total users"
          value={String(users.length)}
          sub={`${users.filter((u) => u.role === 'athlete').length} athletes · ${users.filter((u) => u.role === 'fan').length} fans`}
        />
        <Kpi
          icon={<FaCalendarCheck />}
          label="Bookings (DB)"
          value={String(bookings.length)}
          sub={`$${totalRevenue} confirmed/completed`}
        />
        <Kpi
          icon={<FaStar />}
          label="Athletes / Reviews"
          value={`${athletes.length} / ${reviews.length}`}
          sub={`${messages.length} messages`}
        />
      </div>

      {/* ===== QUICK LINKS ===== */}
      <Section title="Quick links">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_LINKS.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card group flex items-center justify-between gap-3 transition hover:-translate-y-0.5 hover:border-accent-primary/40"
            >
              <div>
                <div className="font-semibold">{l.name}</div>
                <div className="text-xs text-ink-muted">{l.desc}</div>
              </div>
              <FaArrowUpRightFromSquare className="h-4 w-4 text-ink-muted transition group-hover:text-accent-primary" />
            </a>
          ))}
        </div>
      </Section>

      {/* ===== STRIPE PAYMENTS ===== */}
      <Section
        title="Recent Stripe payments"
        right={
          <button onClick={loadStripe} className="btn-secondary !px-3 !py-2 text-xs" disabled={stripeLoading}>
            {stripeLoading ? 'Loading…' : 'Refresh'}
          </button>
        }
      >
        {stripeError ? (
          <div className="card border-err/30 bg-err/5 text-sm text-err">
            Could not load Stripe: {stripeError}
          </div>
        ) : stripePayments.length === 0 ? (
          <Empty>No Stripe payments yet.</Empty>
        ) : (
          <Table headers={['When', 'Description', 'Amount', 'Status', 'Actions']}>
            {stripePayments.map((p) => (
              <tr key={p.id} className="border-t border-white/5">
                <td className="px-3 py-2 text-xs text-ink-muted">
                  {format(new Date(p.created * 1000), 'MMM d, h:mm a')}
                </td>
                <td className="px-3 py-2">
                  <div className="font-medium">{p.experienceTitle ?? p.description ?? '—'}</div>
                  {p.athleteName && (
                    <div className="text-xs text-ink-muted">with {p.athleteName}</div>
                  )}
                </td>
                <td className="px-3 py-2 font-bold">
                  ${(p.amount / 100).toFixed(2)} {p.currency.toUpperCase()}
                </td>
                <td className="px-3 py-2">
                  {p.refunded ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-warn/40 bg-warn/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-warn">
                      <FaArrowRotateLeft className="h-2.5 w-2.5" /> Refunded
                    </span>
                  ) : p.status === 'succeeded' ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-ok/40 bg-ok/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ok">
                      <FaCircleCheck className="h-2.5 w-2.5" /> Succeeded
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-ink-muted/40 bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                      <FaCircleXmark className="h-2.5 w-2.5" /> {p.status}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-right">
                  {!p.refunded && p.status === 'succeeded' && (
                    <button
                      onClick={() => handleRefund(p.id)}
                      disabled={refunding === p.id}
                      className="rounded-lg border border-err/40 bg-err/10 px-3 py-1 text-xs font-semibold text-err transition hover:bg-err/20 disabled:opacity-50"
                    >
                      {refunding === p.id ? 'Refunding…' : 'Refund'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Section>

      {/* ===== USERS ===== */}
      <Section title="Users" subtitle={`${users.length} total`}>
        {users.length === 0 ? (
          <Empty>No users yet.</Empty>
        ) : (
          <Table headers={['Name', 'Email', 'Role', 'Joined']}>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-white/5">
                <td className="px-3 py-2">{u.name}</td>
                <td className="px-3 py-2 text-ink-muted">{u.email}</td>
                <td className="px-3 py-2 capitalize">{u.role}</td>
                <td className="px-3 py-2 text-ink-muted">{format(new Date(u.createdAt), 'MMM d, yyyy')}</td>
              </tr>
            ))}
          </Table>
        )}
      </Section>

      {/* ===== ATHLETES ===== */}
      <Section title="Athletes" subtitle={`${athletes.length} total`}>
        <Table headers={['Name', 'Sport', 'Experiences', 'Slots', 'Owner']}>
          {athletes.map((a) => {
            const slots = Object.values(a.availability ?? {}).reduce((acc, s) => acc + s.length, 0);
            return (
              <tr key={a.id} className="border-t border-white/5">
                <td className="px-3 py-2">{a.name}</td>
                <td className="px-3 py-2">{a.sport}</td>
                <td className="px-3 py-2">{a.experiences.length}</td>
                <td className="px-3 py-2">{slots}</td>
                <td className="px-3 py-2 text-ink-muted">
                  {a.ownerUserId
                    ? users.find((u) => u.id === a.ownerUserId)?.email ?? 'unknown'
                    : 'seed'}
                </td>
              </tr>
            );
          })}
        </Table>
      </Section>

      {/* ===== BOOKINGS ===== */}
      <Section title="Bookings (database)" subtitle={`${bookings.length} total`}>
        {bookings.length === 0 ? (
          <Empty>No bookings yet.</Empty>
        ) : (
          <Table headers={['Fan', 'Athlete', 'Experience', 'Date', 'Total', 'Status']}>
            {bookings.map((b) => {
              const a = athletes.find((x) => x.id === b.athleteId);
              return (
                <tr key={b.id} className="border-t border-white/5">
                  <td className="px-3 py-2">{b.fanName}</td>
                  <td className="px-3 py-2">{a?.name ?? '—'}</td>
                  <td className="px-3 py-2">{b.experienceTitle}</td>
                  <td className="px-3 py-2 text-ink-muted">{b.date} {b.time}</td>
                  <td className="px-3 py-2">${b.total}</td>
                  <td className="px-3 py-2 capitalize">{b.status}</td>
                </tr>
              );
            })}
          </Table>
        )}
      </Section>

      {/* ===== MESSAGES ===== */}
      <Section title="Recent messages" subtitle={`${messages.length} total — showing latest 20`}>
        {messages.length === 0 ? (
          <Empty>No messages yet.</Empty>
        ) : (
          <div className="space-y-2">
            {[...messages]
              .reverse()
              .slice(0, 20)
              .map((m) => {
                const sender = users.find((u) => u.id === m.fromUserId);
                return (
                  <div key={m.id} className="rounded-lg border border-white/10 bg-bg-secondary/40 p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FaMessage className="h-3 w-3 text-ink-muted" />
                        <div className="font-semibold">{sender?.name ?? 'Unknown'}</div>
                      </div>
                      <div className="text-xs text-ink-muted">
                        {format(new Date(m.createdAt), 'MMM d, h:mm a')}
                      </div>
                    </div>
                    <div className="mt-1 text-ink-secondary">{m.text}</div>
                  </div>
                );
              })}
          </div>
        )}
      </Section>

      {/* ===== REVIEWS ===== */}
      <Section title="Reviews" subtitle={`${reviews.length} total`}>
        {reviews.length === 0 ? (
          <Empty>No reviews yet.</Empty>
        ) : (
          <Table headers={['Fan', 'Athlete', 'Rating', 'Text']}>
            {reviews.map((r) => {
              const a = athletes.find((x) => x.id === r.athleteId);
              return (
                <tr key={r.id} className="border-t border-white/5">
                  <td className="px-3 py-2">{r.fanName}</td>
                  <td className="px-3 py-2">{a?.name ?? '—'}</td>
                  <td className="px-3 py-2 text-warn">{'★'.repeat(r.rating)}</td>
                  <td className="px-3 py-2 text-ink-muted">{r.text}</td>
                </tr>
              );
            })}
          </Table>
        )}
      </Section>
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="card">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs uppercase tracking-wide text-ink-muted">{label}</div>
        <div className="text-accent-primary">{icon}</div>
      </div>
      <div className="bg-accent-gradient bg-clip-text font-serif text-4xl font-black leading-none text-transparent md:text-5xl">
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-ink-muted">{sub}</div>}
    </div>
  );
}

function Section({
  title,
  subtitle,
  right,
  children,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          {subtitle && <div className="text-xs text-ink-muted">{subtitle}</div>}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="card overflow-x-auto p-0">
      <table className="w-full text-left text-sm">
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-ink-muted"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="card text-center text-sm text-ink-muted">{children}</div>;
}
