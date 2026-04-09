export default function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 animate-fade-in">
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-primary">
        Legal
      </div>
      <h1 className="mb-2 text-4xl font-extrabold tracking-tight">Terms of Service</h1>
      <p className="mb-10 text-sm text-ink-muted">Last updated: April 2026</p>

      <Section title="1. Who we are">
        <p>
          PlayWithAStar is a marketplace that connects sports fans with professional athletes for
          in-person experiences. We facilitate the booking and payment but are not party to the
          actual experience itself.
        </p>
      </Section>

      <Section title="2. Eligibility">
        <p>
          You must be at least 18 years old to create an account. Bookings on behalf of minors are
          allowed but the booking adult is responsible for the minor's safety and conduct.
        </p>
      </Section>

      <Section title="3. Bookings & payments">
        <p>
          When you book, you authorize us to charge your payment method for the full amount. Funds
          are held in escrow and released to the athlete after the experience is complete or after
          a no-show is verified.
        </p>
      </Section>

      <Section title="4. Cancellations & refunds">
        <p>
          Fans can cancel for a full refund up to 24 hours before the experience start time.
          Within 24 hours, refunds are at the athlete's discretion. If the athlete cancels for any
          reason, the fan receives a full refund automatically.
        </p>
      </Section>

      <Section title="5. Athlete responsibilities">
        <p>
          Athletes agree to honor confirmed bookings, communicate clearly via in-app chat, and
          conduct themselves professionally. Repeated cancellations or complaints may result in
          account suspension.
        </p>
      </Section>

      <Section title="6. Conduct">
        <p>
          Both fans and athletes agree to treat each other with respect. Harassment, discrimination,
          or unsafe behavior will result in immediate account termination and may be reported to
          authorities where applicable.
        </p>
      </Section>

      <Section title="7. Liability">
        <p>
          PlayWithAStar is a platform — we are not responsible for injuries, accidents, or losses
          that occur during the experience itself. Both parties participate at their own risk and
          are encouraged to carry their own insurance for activities like contact sports.
        </p>
      </Section>

      <Section title="8. Changes to these terms">
        <p>
          We may update these terms from time to time. Continued use of the platform after changes
          constitutes acceptance of the new terms.
        </p>
      </Section>

      <Section title="9. Contact">
        <p>
          Questions? Email <a href="mailto:hello@playwithastar.com" className="text-accent-primary hover:underline">hello@playwithastar.com</a>.
        </p>
      </Section>

      <p className="mt-10 rounded-xl border border-warn/30 bg-warn/5 p-4 text-xs text-warn">
        ⚠️ This is a starter Terms of Service. Before launching to the public, have it reviewed by a
        lawyer. Liability waivers, especially for physical sports activities, need to be drafted
        carefully and tailored to your jurisdiction.
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
