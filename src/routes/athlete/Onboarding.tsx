import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useAthletesStore } from '../../store/useAthletesStore';
import type { Experience } from '../../lib/seed';

const STEPS = ['Profile', 'Career', 'First experience', 'Availability'] as const;
const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#22d3ee', '#10b981', '#f59e0b', '#ef4444', '#1e3a8a'];

export default function Onboarding() {
  const navigate = useNavigate();
  const user = useAuthStore((s) =>
    s.currentUserId ? s.users.find((u) => u.id === s.currentUserId) ?? null : null
  );
  const linkAthleteId = useAuthStore((s) => s.linkAthleteId);
  const createAthlete = useAthletesStore((s) => s.createAthlete);
  const addExperience = useAthletesStore((s) => s.addExperience);
  const setAvailability = useAthletesStore((s) => s.setAvailability);

  const [step, setStep] = useState(0);

  // Profile
  const [name, setName] = useState(user?.name ?? '');
  const [sport, setSport] = useState('Hockey');
  const [position, setPosition] = useState('');
  const [team, setTeam] = useState('');
  const [location, setLocation] = useState('Toronto, ON');
  const [bio, setBio] = useState('');
  const [photo, setPhoto] = useState<string>('');
  const [color, setColor] = useState(COLORS[0]);

  // Career
  const [gamesPlayed, setGamesPlayed] = useState('');
  const [goals, setGoals] = useState('');
  const [assists, setAssists] = useState('');
  const [championships, setChampionships] = useState('');

  // Experience
  const [expTitle, setExpTitle] = useState('');
  const [expDesc, setExpDesc] = useState('');
  const [expCategory, setExpCategory] = useState<Experience['category']>('Training');
  const [expDuration, setExpDuration] = useState('60 min');
  const [expPrice, setExpPrice] = useState(200);

  // Availability — simple: pick a few date+time chips
  const [selectedDates, setSelectedDates] = useState<Record<string, string[]>>({});
  const next7Days = useMemo(() => {
    const out: { iso: string; label: string }[] = [];
    for (let i = 1; i <= 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().slice(0, 10);
      out.push({ iso, label: d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) });
    }
    return out;
  }, []);
  const TIMES = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  const toggleDateTime = (date: string, time: string) => {
    setSelectedDates((cur) => {
      const day = cur[date] ?? [];
      const nextDay = day.includes(time) ? day.filter((t) => t !== time) : [...day, time].sort();
      const out = { ...cur, [date]: nextDay };
      if (nextDay.length === 0) delete out[date];
      return out;
    });
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const canAdvance = () => {
    if (step === 0) return name.trim() && sport && position.trim() && bio.trim();
    if (step === 1) return true;
    if (step === 2) return expTitle.trim() && expDesc.trim() && expPrice > 0;
    if (step === 3) return Object.keys(selectedDates).length > 0;
    return true;
  };

  const finish = () => {
    if (!user) return;
    const initials = name
      .split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const athlete = createAthlete({
      name,
      sport,
      position,
      team: team || 'Independent',
      location,
      initials,
      photo: photo || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      responseTime: 'Usually responds in a few hours',
      bio,
      color,
      career: {
        gamesPlayed: gamesPlayed || '—',
        goals: goals || '—',
        assists: assists || '—',
        championships: championships || undefined,
      },
      tags: [sport.toLowerCase()],
      ownerUserId: user.id,
    });

    addExperience(athlete.id, {
      title: expTitle,
      description: expDesc,
      category: expCategory,
      duration: expDuration,
      price: expPrice,
      active: true,
    });

    setAvailability(athlete.id, selectedDates);
    linkAthleteId(athlete.id);
    navigate('/athlete/dashboard');
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 animate-fade-in">
      <h1 className="mb-2 text-3xl font-extrabold">Welcome, {user.name.split(' ')[0]}</h1>
      <p className="mb-6 text-ink-muted">Let's set up your athlete profile in 4 quick steps.</p>

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
            <Field label="Full name">
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Sport">
                <select className="input" value={sport} onChange={(e) => setSport(e.target.value)}>
                  {['Hockey', 'Basketball', 'Soccer', 'Tennis', 'Baseball', 'Football', 'Golf', 'Gymnastics', 'Esports', 'Other'].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Position / Title">
                <input className="input" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="e.g. Former NHL Forward" />
              </Field>
              <Field label="Team (optional)">
                <input className="input" value={team} onChange={(e) => setTeam(e.target.value)} placeholder="e.g. Toronto Maple Leafs" />
              </Field>
              <Field label="Location">
                <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} />
              </Field>
            </div>
            <Field label="Bio">
              <textarea className="textarea h-28" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell fans about yourself…" />
            </Field>
            <Field label="Photo (optional)">
              <input type="file" accept="image/*" onChange={handlePhoto} className="text-sm" />
              {photo && <img src={photo} alt="" className="mt-3 h-24 w-24 rounded-xl object-cover" />}
            </Field>
            <Field label="Brand color">
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`h-8 w-8 rounded-full border-2 ${color === c ? 'border-white' : 'border-transparent'}`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <p className="text-sm text-ink-muted">Career stats are optional but help fans get to know you.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Games played"><input className="input" value={gamesPlayed} onChange={(e) => setGamesPlayed(e.target.value)} placeholder="e.g. 800" /></Field>
              <Field label="Goals / Wins / Points"><input className="input" value={goals} onChange={(e) => setGoals(e.target.value)} placeholder="e.g. 200" /></Field>
              <Field label="Assists / More"><input className="input" value={assists} onChange={(e) => setAssists(e.target.value)} placeholder="e.g. 312" /></Field>
              <Field label="Championships (optional)"><input className="input" value={championships} onChange={(e) => setChampionships(e.target.value)} placeholder="e.g. 1 Cup" /></Field>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-sm text-ink-muted">Create your first bookable experience. You can add more later.</p>
            <Field label="Title"><input className="input" value={expTitle} onChange={(e) => setExpTitle(e.target.value)} placeholder="e.g. 1-on-1 Hockey Training" /></Field>
            <Field label="Description"><textarea className="textarea h-24" value={expDesc} onChange={(e) => setExpDesc(e.target.value)} placeholder="What's included?" /></Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Category">
                <select className="input" value={expCategory} onChange={(e) => setExpCategory(e.target.value as Experience['category'])}>
                  <option>Training</option>
                  <option>Golf</option>
                  <option>Skating</option>
                  <option>Other</option>
                </select>
              </Field>
              <Field label="Duration"><input className="input" value={expDuration} onChange={(e) => setExpDuration(e.target.value)} /></Field>
              <Field label="Price ($)"><input className="input" type="number" value={expPrice} onChange={(e) => setExpPrice(Number(e.target.value))} /></Field>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <p className="text-sm text-ink-muted">Tap days and times you're available. You can edit this anytime.</p>
            <div className="space-y-3">
              {next7Days.map((d) => (
                <div key={d.iso} className="rounded-lg border border-white/10 bg-bg-secondary/40 p-3">
                  <div className="mb-2 text-sm font-semibold">{d.label}</div>
                  <div className="flex flex-wrap gap-2">
                    {TIMES.map((t) => {
                      const on = (selectedDates[d.iso] ?? []).includes(t);
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => toggleDateTime(d.iso, t)}
                          className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
                            on ? 'bg-hero-gradient text-white' : 'border border-white/10 text-ink-secondary hover:text-white'
                          }`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="btn-secondary !px-4 !py-2 text-sm disabled:opacity-50"
            disabled={step === 0}
          >
            ← Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canAdvance()}
              className="btn-primary !px-4 !py-2 text-sm disabled:opacity-50"
            >
              Continue →
            </button>
          ) : (
            <button
              type="button"
              onClick={finish}
              disabled={!canAdvance()}
              className="btn-primary !px-4 !py-2 text-sm disabled:opacity-50"
            >
              Finish setup ✓
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
