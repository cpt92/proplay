import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isBefore, isSameDay, isSameMonth, startOfMonth, startOfWeek } from 'date-fns';
import { useAthletesStore } from '../store/useAthletesStore';
import { useAuthStore } from '../store/useAuthStore';
import { useBookingsStore } from '../store/useBookingsStore';
import { toast } from '../store/useToastStore';

const STEPS = ['Review', 'Pick a date', 'Pick a time', 'Checkout'] as const;

export default function Booking() {
  const { athleteId, expId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) =>
    s.currentUserId ? s.users.find((u) => u.id === s.currentUserId) ?? null : null
  );
  const athlete = useAthletesStore((s) => s.getById(Number(athleteId)));
  const createBooking = useBookingsStore((s) => s.create);

  const [step, setStep] = useState(0);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [card, setCard] = useState({ number: '', exp: '', cvc: '' });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exp = athlete?.experiences.find((e) => e.id === expId);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month));
    const end = endOfWeek(endOfMonth(month));
    return eachDayOfInterval({ start, end });
  }, [month]);

  if (!user) return <Navigate to="/login" replace />;
  if (!athlete || !exp) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="mb-3 text-3xl font-bold">Experience not found</h1>
        <Link to="/browse" className="btn-primary">Back to browse</Link>
      </div>
    );
  }
  if (user.role === 'athlete') {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="mb-3 text-3xl font-bold">Athletes can't book themselves</h1>
        <p className="mb-6 text-ink-muted">Sign in as a fan to book this experience.</p>
        <Link to="/" className="btn-primary">Home</Link>
      </div>
    );
  }

  const avail = athlete.availability ?? {};
  const today = new Date();

  const handlePay = () => {
    setError(null);
    if (!date || !time) {
      setError('Pick a date and time first.');
      return;
    }
    if (!/^\d{12,19}$/.test(card.number.replace(/\s/g, ''))) {
      setError('Enter a 12–19 digit card number. (Mock — anything works)');
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      const booking = createBooking({
        fanId: user.id,
        fanName: user.name,
        athleteId: athlete.id,
        experienceId: exp.id,
        experienceTitle: exp.title,
        date,
        time,
        total: exp.price,
        paymentRef: `mock_pi_${crypto.randomUUID().slice(0, 8)}`,
      });
      toast.success('Payment processed — booking sent to athlete!');
      navigate(`/book/confirmation/${booking.id}`);
    }, 900);
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 animate-fade-in">
      <div className="mb-6 flex items-center gap-3">
        <img src={athlete.photo} alt="" className="h-12 w-12 rounded-xl object-cover" />
        <div>
          <div className="text-xl font-bold">{athlete.name}</div>
          <div className="text-sm text-ink-muted">{exp.title} · ${exp.price}</div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8 flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                i <= step ? 'bg-hero-gradient text-white' : 'bg-bg-secondary text-ink-muted'
              }`}
            >
              {i + 1}
            </div>
            <div className={`text-xs ${i <= step ? 'text-ink-primary' : 'text-ink-muted'}`}>{s}</div>
            {i < STEPS.length - 1 && <div className="h-px flex-1 bg-white/10" />}
          </div>
        ))}
      </div>

      <div className="card space-y-4">
        {step === 0 && (
          <>
            <div className="text-xl font-bold">{exp.title}</div>
            <div className="flex flex-wrap gap-2">
              <span className="chip">{exp.category}</span>
              <span className="chip">{exp.duration}</span>
            </div>
            <p className="text-sm text-ink-secondary">{exp.description}</p>
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-bg-secondary/40 p-4">
              <div className="text-sm text-ink-muted">Total</div>
              <div className="text-2xl font-extrabold">${exp.price}</div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="flex items-center justify-between">
              <button onClick={() => setMonth(addMonths(month, -1))} className="btn-secondary !px-3 !py-1 text-sm">←</button>
              <div className="font-semibold">{format(month, 'MMMM yyyy')}</div>
              <button onClick={() => setMonth(addMonths(month, 1))} className="btn-secondary !px-3 !py-1 text-sm">→</button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-ink-muted">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((d) => {
                const iso = format(d, 'yyyy-MM-dd');
                const slotCount = (avail[iso] ?? []).length;
                const inMonth = isSameMonth(d, month);
                const past = isBefore(d, today) && !isSameDay(d, today);
                const selectable = slotCount > 0 && !past;
                const isSelected = date === iso;
                return (
                  <button
                    key={iso}
                    disabled={!selectable}
                    onClick={() => { setDate(iso); setTime(null); }}
                    className={`aspect-square rounded-lg border text-sm transition ${
                      isSelected
                        ? 'border-accent-primary bg-accent-primary/30 text-white'
                        : selectable
                        ? 'border-ok/40 bg-ok/10 hover:border-accent-primary/60'
                        : 'border-white/5 bg-bg-secondary/20 text-ink-muted/40 cursor-not-allowed'
                    } ${!inMonth ? 'opacity-30' : ''}`}
                  >
                    <div className="flex h-full flex-col items-center justify-center">
                      <span>{format(d, 'd')}</span>
                      {selectable && <span className="text-[10px] text-ok">{slotCount}</span>}
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-ink-muted">Green days have open slots. Grey days aren't available.</p>
          </>
        )}

        {step === 2 && (
          <>
            {!date ? (
              <div className="text-sm text-ink-muted">Go back and pick a date first.</div>
            ) : (
              <>
                <div className="text-sm text-ink-muted">Available times for {format(new Date(date), 'EEEE, MMM d')}:</div>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {(avail[date] ?? []).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTime(t)}
                      className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                        time === t
                          ? 'bg-hero-gradient text-white'
                          : 'border border-white/10 text-ink-secondary hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <div className="rounded-lg border border-warn/40 bg-warn/10 p-3 text-xs text-warn">
              ⚠️ Mock checkout — this does not charge a real card. Real Stripe will be wired in once a backend is deployed.
            </div>
            <div className="rounded-lg border border-white/10 bg-bg-secondary/40 p-4 text-sm">
              <div className="flex justify-between"><span className="text-ink-muted">Experience</span><span>{exp.title}</span></div>
              <div className="flex justify-between"><span className="text-ink-muted">When</span><span>{date && format(new Date(date), 'MMM d')} · {time}</span></div>
              <div className="mt-2 flex justify-between border-t border-white/10 pt-2 font-bold"><span>Total</span><span>${exp.price}</span></div>
            </div>

            <Field label="Card number">
              <input className="input" placeholder="4242 4242 4242 4242" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Expiry"><input className="input" placeholder="MM/YY" value={card.exp} onChange={(e) => setCard({ ...card, exp: e.target.value })} /></Field>
              <Field label="CVC"><input className="input" placeholder="123" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })} /></Field>
            </div>

            {error && <div className="rounded-lg border border-err/40 bg-err/10 p-3 text-sm text-err">{error}</div>}
          </>
        )}

        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="btn-secondary !px-4 !py-2 text-sm disabled:opacity-50"
            disabled={step === 0 || processing}
          >
            ← Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={(step === 1 && !date) || (step === 2 && !time)}
              className="btn-primary !px-4 !py-2 text-sm disabled:opacity-50"
            >
              Continue →
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePay}
              disabled={processing}
              className="btn-primary !px-4 !py-2 text-sm disabled:opacity-50"
            >
              {processing ? 'Processing…' : `Pay $${exp.price}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</div>
      {children}
    </label>
  );
}
