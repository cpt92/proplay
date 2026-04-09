export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 animate-fade-in">
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-primary">
        Legal
      </div>
      <h1 className="mb-2 text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
      <p className="mb-10 text-sm text-ink-muted">Last updated: April 2026</p>

      <Section title="What we collect">
        <p>
          When you sign up, we collect your name, email, and (optionally) a profile photo. When you
          book an experience, we collect payment details via our processor (Stripe) — we never
          store full card numbers ourselves.
        </p>
        <p>
          When athletes onboard, we collect career details, photos, and availability. When you
          message another user, those messages are stored so the conversation can persist.
        </p>
      </Section>

      <Section title="How we use your information">
        <p>
          We use your information to power the marketplace: matching fans with athletes, processing
          payments, sending booking confirmations, and providing customer support. We never sell
          your personal data to third parties.
        </p>
      </Section>

      <Section title="Cookies & tracking">
        <p>
          We use minimal analytics to understand how visitors use the site. We do not use
          third-party advertising cookies.
        </p>
      </Section>

      <Section title="Data retention">
        <p>
          Account data is retained as long as your account is active. You can request deletion at
          any time by contacting <a href="mailto:hello@playwithastar.com" className="text-accent-primary hover:underline">hello@playwithastar.com</a>.
        </p>
      </Section>

      <Section title="Your rights">
        <p>
          Under Canadian privacy law (PIPEDA), you have the right to access, correct, or delete
          your personal information. Contact us to exercise these rights.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions? Email <a href="mailto:hello@playwithastar.com" className="text-accent-primary hover:underline">hello@playwithastar.com</a>.
        </p>
      </Section>

      <p className="mt-10 rounded-xl border border-warn/30 bg-warn/5 p-4 text-xs text-warn">
        ⚠️ This is a starter privacy policy. Before launching to the public, have it reviewed by a
        lawyer to make sure it covers your specific business operations and complies with all
        applicable laws (PIPEDA, GDPR, etc.).
      </p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-xl font-bold">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-ink-secondary">{children}</div>
    </section>
  );
}
