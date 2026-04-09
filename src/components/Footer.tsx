import { Link } from 'react-router-dom';
import { FaStar, FaXTwitter, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5 bg-bg-secondary/30">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <Link to="/" className="mb-4 inline-flex items-center gap-2 text-xl font-extrabold">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-hero-gradient text-white shadow-lg shadow-accent-primary/30">
                <FaStar className="h-4 w-4" />
              </span>
              <span className="bg-hero-gradient bg-clip-text text-transparent">PlayWithAStar</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-ink-muted">
              Hire a real pro athlete for the day. Real experiences with real stars — golf, hockey,
              skating, training, or whatever you're into.
            </p>
            <div className="mt-5 flex gap-3">
              <SocialLink Icon={FaXTwitter} label="Twitter" />
              <SocialLink Icon={FaInstagram} label="Instagram" />
              <SocialLink Icon={FaTiktok} label="TikTok" />
              <SocialLink Icon={FaYoutube} label="YouTube" />
            </div>
          </div>

          <FooterCol
            title="Platform"
            links={[
              { label: 'Browse athletes', to: '/browse' },
              { label: 'Favorites', to: '/favorites' },
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
            title="Help & Legal"
            links={[
              { label: 'FAQ', to: '/faq' },
              { label: 'Privacy Policy', to: '/privacy' },
              { label: 'Terms of Service', to: '/terms' },
              { label: 'Contact', to: '/faq' },
            ]}
          />
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-ink-muted sm:flex-row">
          <div>© {new Date().getFullYear()} PlayWithAStar. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span>Toronto, Canada</span>
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

function SocialLink({ Icon, label }: { Icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm text-ink-secondary transition hover:border-accent-primary/40 hover:text-white"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
