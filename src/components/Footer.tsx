export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5 bg-bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2 text-lg font-extrabold">
            <span className="text-2xl">🏒</span>
            <span className="bg-hero-gradient bg-clip-text text-transparent">ProPlay</span>
          </div>
          <p className="text-sm text-ink-muted">Play with the pros. Real experiences with real athletes.</p>
        </div>
        <FooterCol title="Platform" links={['Browse', 'How it works', 'Pricing']} />
        <FooterCol title="For athletes" links={['Become a pro', 'Athlete dashboard', 'Resources']} />
        <FooterCol title="Company" links={['About', 'Contact', 'Privacy']} />
      </div>
      <div className="border-t border-white/5 py-6 text-center text-xs text-ink-muted">
        © {new Date().getFullYear()} ProPlay. All rights reserved.
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <div className="mb-3 text-sm font-semibold text-ink-primary">{title}</div>
      <ul className="space-y-2 text-sm text-ink-muted">
        {links.map((l) => (
          <li key={l} className="cursor-pointer transition hover:text-white">{l}</li>
        ))}
      </ul>
    </div>
  );
}
