import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuthStore } from '../store/useAuthStore';
import { useAthletesStore } from '../store/useAthletesStore';
import { useBookingsStore } from '../store/useBookingsStore';
import { useChatStore } from '../store/useChatStore';
import { useReviewsStore } from '../store/useReviewsStore';
import { supabase } from '../lib/supabase';
import type { Profile } from '../lib/types';

export default function Admin() {
  const user = useAuthStore((s) => s.profile);
  const athletes = useAthletesStore((s) => s.athletes);
  const bookings = useBookingsStore((s) => s.bookings);
  const messages = useChatStore((s) => s.messages);
  const reviews = useReviewsStore((s) => s.reviews);
  const [users, setUsers] = useState<Profile[]>([]);

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

  if (!user || !user.email.toLowerCase().startsWith('admin@')) {
    return <Navigate to="/" replace />;
  }

  const totalRevenue = bookings
    .filter((b) => b.status === 'confirmed' || b.status === 'completed')
    .reduce((s, b) => s + b.total, 0);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 animate-fade-in">
      <h1 className="mb-2 text-3xl font-extrabold">Admin overview</h1>
      <p className="mb-8 text-ink-muted">Read-only view of everything in the system.</p>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Users" value={String(users.length)} />
        <Stat label="Athletes" value={String(athletes.length)} />
        <Stat label="Bookings" value={String(bookings.length)} />
        <Stat label="Messages" value={String(messages.length)} />
        <Stat label="Revenue" value={`$${totalRevenue}`} />
      </div>

      <Section title="Users">
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

      <Section title="Athletes">
        <Table headers={['Name', 'Sport', 'Experiences', 'Slots', 'Owner']}>
          {athletes.map((a) => {
            const slots = Object.values(a.availability ?? {}).reduce((acc, s) => acc + s.length, 0);
            return (
              <tr key={a.id} className="border-t border-white/5">
                <td className="px-3 py-2">{a.name}</td>
                <td className="px-3 py-2">{a.sport}</td>
                <td className="px-3 py-2">{a.experiences.length}</td>
                <td className="px-3 py-2">{slots}</td>
                <td className="px-3 py-2 text-ink-muted">{a.ownerUserId ? users.find((u) => u.id === a.ownerUserId)?.email ?? 'unknown' : 'seed'}</td>
              </tr>
            );
          })}
        </Table>
      </Section>

      <Section title="Bookings">
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

      <Section title="Recent messages">
        {messages.length === 0 ? (
          <Empty>No messages yet.</Empty>
        ) : (
          <div className="space-y-2">
            {[...messages].reverse().slice(0, 20).map((m) => {
              const sender = users.find((u) => u.id === m.fromUserId);
              return (
                <div key={m.id} className="rounded-lg border border-white/10 bg-bg-secondary/40 p-3 text-sm">
                  <div className="flex justify-between">
                    <div className="font-semibold">{sender?.name ?? 'Unknown'}</div>
                    <div className="text-xs text-ink-muted">{format(new Date(m.createdAt), 'MMM d, h:mm a')}</div>
                  </div>
                  <div className="text-ink-secondary">{m.text}</div>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      <Section title="Reviews">
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card text-center">
      <div className="bg-hero-gradient bg-clip-text text-3xl font-extrabold text-transparent">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wide text-ink-muted">{label}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 text-xl font-bold">{title}</h2>
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
              <th key={h} className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
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
