import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore, type Role } from '../store/useAuthStore';
import { toast } from '../store/useToastStore';

type Mode = 'signin' | 'signup';

export default function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get('next');
  const signup = useAuthStore((s) => s.signup);
  const login = useAuthStore((s) => s.login);

  const [role, setRole] = useState<Role>('fan');
  const [mode, setMode] = useState<Mode>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (mode === 'signup') {
      if (!name.trim()) return setError('Name is required.');
      if (!email.trim()) return setError('Email is required.');
      if (password.length < 4) return setError('Password must be at least 4 characters.');
      const result = signup({ role, name, email, password });
      if ('error' in result) return setError(result.error);
      toast.success(`Welcome to ProPlay, ${result.name.split(' ')[0]}!`);
      navigate(next || (role === 'athlete' ? '/athlete/onboarding' : '/browse'));
    } else {
      const result = login(email, password);
      if ('error' in result) return setError(result.error);
      toast.success(`Welcome back, ${result.name.split(' ')[0]}!`);
      navigate(next || (result.role === 'athlete' ? '/athlete/dashboard' : '/browse'));
    }
  };

  return (
    <div className="mx-auto max-w-md px-6 py-16 animate-fade-in">
      <h1 className="mb-2 text-center text-4xl font-extrabold">
        {mode === 'signup' ? 'Join ProPlay' : 'Welcome back'}
      </h1>
      <p className="mb-8 text-center text-ink-muted">
        {mode === 'signup' ? 'Sign up as a fan or a pro athlete.' : 'Sign in to your account.'}
      </p>

      {/* Role tabs (only for signup) */}
      {mode === 'signup' && (
        <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-card p-1">
          {(['fan', 'athlete'] as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`rounded-lg px-3 py-2 text-sm font-semibold capitalize transition ${
                role === r ? 'bg-hero-gradient text-white' : 'text-ink-secondary hover:text-white'
              }`}
            >
              {r === 'fan' ? "I'm a fan" : "I'm an athlete"}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={submit} className="card space-y-4">
        {mode === 'signup' && (
          <Field label="Full name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="Jane Smith"
            />
          </Field>
        )}
        <Field label="Email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="you@example.com"
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="••••••••"
          />
        </Field>

        {error && (
          <div className="rounded-lg border border-err/40 bg-err/10 p-3 text-sm text-err">{error}</div>
        )}

        <button type="submit" className="btn-primary w-full">
          {mode === 'signup' ? 'Create account' : 'Sign in'}
        </button>

        <div className="text-center text-sm text-ink-muted">
          {mode === 'signup' ? 'Already have an account?' : 'Need an account?'}{' '}
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signup' ? 'signin' : 'signup');
              setError(null);
            }}
            className="font-semibold text-accent-primary hover:underline"
          >
            {mode === 'signup' ? 'Sign in' : 'Sign up'}
          </button>
        </div>
      </form>

      <p className="mt-4 text-center text-xs text-ink-muted">
        Mock auth — accounts are stored in your browser's localStorage. No server, no real passwords.
      </p>
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
