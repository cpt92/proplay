import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5 bg-bg-secondary/30">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <Link to="/" className="mb-4 inline-flex items-center gap-2 text-xl font-extrabold">
              <span className="text-2xl">⭐</span>
              <span className="bg-hero-gradient bg-clip-text text-transparent">PlayWithAStar</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-ink-muted">
              Hire a real pro athlete for the day. Real experiences with real stars — golf, hockey,
              skating, training, or whatever you're into.
            </p>
            <div className="mt-5 flex gap-3">
              <SocialLink icon="𝕏" label="Twitter" />
              <SocialLink icon="📷" label="Instagram" />
              <SocialLink icon="🎵" label="TikTok" />
              <SocialLink icon="▶" label="YouTube" />
            </div>
          </div>

          <FooterCol
            title="Platform"
            links={[
              { label: 'Browse athletes', to: '/browse' },
              { label: 'How it works', to: '/' },
              { label: 'Sign in', to: '/login' },
            ]}
          />
          <FooterCol
            title="For athletes"
            links={[
              { label: 'Become a pro', to: '/login' },
              { label: 'Athlete dashboard', to: '/athlete/dashboard' },
              { label: 'Earnings', to: '/athlete/dashboard' },
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              { label: 'About', to: '/' },
              { label: 'Contact', to: '/' },
              { label: 'Privacy', to: '/' },
              { label: 'Terms', to: '/' },
            ]}
          />
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-ink-muted sm:flex-row">
          <div>© {new Date().getFullYear()} PlayWithAStar. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">🇨🇦 Canada</span>
            <span>·</span>
            <span>Made with ❤ in Toronto</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; to: string }[];
}) {
  return (
    <div>
      <div className="mb-3 text-sm font-semibold text-ink-primary">{title}</div>
      <ul className="space-y-2 text-sm text-ink-muted">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="transition hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({ icon, label }: { icon: string; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm transition hover:border-accent-primary/40 hover:text-white"
    >
      {icon}
    </button>
  );
}
