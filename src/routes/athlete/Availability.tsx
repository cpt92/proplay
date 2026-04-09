import { useMemo, useState } from 'react';
import { addMonths, eachDayOfInterval, endOfMonth, format, isBefore, isSameDay, isSameMonth, startOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';
import { useAthletesStore } from '../../store/useAthletesStore';

const TIMES = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];

export default function Availability() {
  const userId = useAuthStore((s) => s.currentUserId);
  const athlete = useAthletesStore((s) => (userId ? s.getByOwner(userId) : undefined));
  const toggleSlot = useAthletesStore((s) => s.toggleSlot);

  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [selected, setSelected] = useState<string | null>(null);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month));
    const end = endOfWeek(endOfMonth(month));
    return eachDayOfInterval({ start, end });
  }, [month]);

  if (!athlete) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="mb-3 text-2xl font-bold">Finish onboarding first</h1>
        <a href="/athlete/onboarding" className="btn-primary">Go to onboarding</a>
      </div>
    );
  }

  const avail = athlete.availability ?? {};
  const today = new Date();

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 animate-fade-in">
      <h1 className="mb-2 text-3xl font-extrabold">Your availability</h1>
      <p className="mb-6 text-ink-muted">Pick a day, then tap the time slots when you're free to be booked.</p>

      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <button onClick={() => setMonth(addMonths(month, -1))} className="btn-secondary !px-3 !py-1 text-sm">←</button>
          <div className="text-lg font-semibold">{format(month, 'MMMM yyyy')}</div>
          <button onClick={() => setMonth(addMonths(month, 1))} className="btn-secondary !px-3 !py-1 text-sm">→</button>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-ink-muted">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((d) => {
            const iso = format(d, 'yyyy-MM-dd');
            const slotCount = (avail[iso] ?? []).length;
            const inMonth = isSameMonth(d, month);
            const past = isBefore(d, today) && !isSameDay(d, today);
            const isSelected = selected === iso;
            return (
              <button
                key={iso}
                disabled={past}
                onClick={() => setSelected(iso)}
                className={`relative aspect-square rounded-lg border text-sm transition ${
                  isSelected
                    ? 'border-accent-primary bg-accent-primary/20 text-white'
                    : slotCount > 0
                    ? 'border-ok/40 bg-ok/10 text-white'
                    : 'border-white/10 bg-bg-secondary/40'
                } ${!inMonth ? 'opacity-30' : ''} ${past ? 'cursor-not-allowed opacity-30' : 'hover:border-accent-primary/60'}`}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span>{format(d, 'd')}</span>
                  {slotCount > 0 && <span className="text-[10px] text-ok">{slotCount} slot{slotCount === 1 ? '' : 's'}</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selected && (
        <div className="card mt-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="font-semibold">{format(new Date(selected), 'EEEE, MMM d')}</div>
            <button className="text-xs text-ink-muted hover:text-white" onClick={() => setSelected(null)}>Close</button>
          </div>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
            {TIMES.map((t) => {
              const on = (avail[selected] ?? []).includes(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleSlot(athlete.id, selected, t)}
                  className={`rounded-lg px-2 py-2 text-xs font-medium transition ${
                    on ? 'bg-hero-gradient text-white' : 'border border-white/10 text-ink-secondary hover:text-white'
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
