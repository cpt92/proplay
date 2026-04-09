import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useAthletesStore } from '../../store/useAthletesStore';
import type { Experience } from '../../lib/seed';

type Draft = {
  id?: string;
  title: string;
  description: string;
  category: Experience['category'];
  duration: string;
  price: number;
  active: boolean;
};

const empty: Draft = { title: '', description: '', category: 'Training', duration: '60 min', price: 200, active: true };

export default function Experiences() {
  const userId = useAuthStore((s) => s.currentUserId);
  const athlete = useAthletesStore((s) => (userId ? s.getByOwner(userId) : undefined));
  const addExperience = useAthletesStore((s) => s.addExperience);
  const updateExperience = useAthletesStore((s) => s.updateExperience);
  const deleteExperience = useAthletesStore((s) => s.deleteExperience);

  const [draft, setDraft] = useState<Draft | null>(null);

  if (!athlete) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="mb-3 text-2xl font-bold">Finish onboarding first</h1>
        <a href="/athlete/onboarding" className="btn-primary">Go to onboarding</a>
      </div>
    );
  }

  const save = () => {
    if (!draft) return;
    if (draft.id) {
      const { id, ...patch } = draft;
      updateExperience(athlete.id, id, patch);
    } else {
      const { id: _ignore, ...rest } = draft;
      void _ignore;
      addExperience(athlete.id, rest);
    }
    setDraft(null);
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Your experiences</h1>
          <p className="text-ink-muted">{athlete.experiences.length} listed</p>
        </div>
        <button onClick={() => setDraft({ ...empty })} className="btn-primary !px-4 !py-2 text-sm">
          + Add experience
        </button>
      </div>

      {athlete.experiences.length === 0 ? (
        <div className="card text-center text-ink-muted">No experiences yet. Click "Add experience" to create one.</div>
      ) : (
        <div className="grid gap-4">
          {athlete.experiences.map((e) => (
            <div key={e.id} className="card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="text-lg font-semibold">{e.title}</div>
                  <span className="chip">{e.category}</span>
                  {!e.active && <span className="chip border-warn/40 text-warn">Hidden</span>}
                </div>
                <div className="text-xs text-ink-muted">{e.duration} · ${e.price}</div>
                <p className="mt-1 text-sm text-ink-secondary">{e.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setDraft({ id: e.id, title: e.title, description: e.description, category: e.category, duration: e.duration, price: e.price, active: e.active })}
                  className="btn-secondary !px-3 !py-2 text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => updateExperience(athlete.id, e.id, { active: !e.active })}
                  className="btn-secondary !px-3 !py-2 text-xs"
                >
                  {e.active ? 'Hide' : 'Show'}
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${e.title}"?`)) deleteExperience(athlete.id, e.id);
                  }}
                  className="rounded-xl border border-err/40 bg-err/10 px-3 py-2 text-xs font-semibold text-err transition hover:bg-err/20"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {draft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="card w-full max-w-lg space-y-4">
            <div className="text-xl font-bold">{draft.id ? 'Edit experience' : 'New experience'}</div>
            <Field label="Title">
              <input className="input" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            </Field>
            <Field label="Description">
              <textarea className="textarea h-24" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
            </Field>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Category">
                <select className="input" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as Experience['category'] })}>
                  <option>Training</option>
                  <option>Golf</option>
                  <option>Skating</option>
                  <option>Other</option>
                </select>
              </Field>
              <Field label="Duration">
                <input className="input" value={draft.duration} onChange={(e) => setDraft({ ...draft, duration: e.target.value })} />
              </Field>
              <Field label="Price ($)">
                <input className="input" type="number" value={draft.price} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })} />
              </Field>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button className="btn-secondary !px-4 !py-2 text-sm" onClick={() => setDraft(null)}>Cancel</button>
              <button className="btn-primary !px-4 !py-2 text-sm" onClick={save}>Save</button>
            </div>
          </div>
        </div>
      )}
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
