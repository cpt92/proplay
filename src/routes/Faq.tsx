import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa6';

const FAQS: { q: string; a: string }[] = [
  {
    q: 'How does PlayWithAStar work?',
    a: 'Browse pro athletes, pick the experience you want (golf round, training session, kids skate, etc.), choose a date and time from their real availability calendar, and pay securely. The athlete confirms within hours and you message them in-app to coordinate the details.',
  },
  {
    q: 'Are these real professional athletes?',
    a: 'Yes — every athlete on the platform is a verified former or current professional. Look for the blue ✓ badge on their profile. We confirm credentials before they\'re listed.',
  },
  {
    q: 'How much does it cost?',
    a: 'Each athlete sets their own price for each experience. Most experiences range from $150 to $800, depending on the activity, duration, and athlete. The price you see is the price you pay — no hidden fees.',
  },
  {
    q: 'What if it rains or the athlete cancels?',
    a: 'If the athlete needs to cancel, you get a full refund automatically. For weather cancellations on outdoor experiences (golf, soccer, etc.), you and the athlete can reschedule for free using the in-app chat.',
  },
  {
    q: 'Can I cancel my booking?',
    a: 'Yes. You can cancel for a full refund up to 24 hours before the experience start time. Within 24 hours, cancellations are at the athlete\'s discretion.',
  },
  {
    q: 'How is payment handled?',
    a: 'Payments are processed securely via Stripe. We hold the funds until after the experience is complete, then release payment to the athlete. This protects both sides.',
  },
  {
    q: 'Can I gift a booking to someone?',
    a: 'Gift bookings are coming soon — for now, you can book on someone else\'s behalf and just put their name in the message to the athlete.',
  },
  {
    q: 'How do I become a pro athlete on the platform?',
    a: 'Click "Become a pro" or "Get started" in the top nav, sign up as an athlete, and complete the 4-step onboarding (profile, career stats, your first experience, and availability). Your profile goes live after our team verifies your credentials.',
  },
  {
    q: 'Is my chat with the athlete private?',
    a: 'Yes. Messages are only visible to you and the athlete you\'re booked with. Our team only reviews messages if there\'s a complaint or safety issue.',
  },
  {
    q: 'Where do experiences happen?',
    a: 'Most experiences are in the GTA (Greater Toronto Area) right now. We\'re expanding to other Canadian cities soon. The athlete and the fan agree on the exact location via in-app chat after booking.',
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-accent-primary/15 blur-[100px]" />
        </div>
        <div className="mx-auto max-w-4xl px-6 py-14 text-center">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-primary">
            Help center
          </div>
          <h1 className="mb-3 text-5xl font-extrabold tracking-tight">Frequently asked questions</h1>
          <p className="text-ink-muted">Everything you need to know before booking.</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="space-y-3">
          {FAQS.map((item, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-white/10 bg-card">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/[0.02]"
              >
                <span className="text-base font-semibold text-ink-primary">{item.q}</span>
                <FaChevronDown
                  className={`h-4 w-4 flex-shrink-0 text-ink-muted transition-transform ${
                    open === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {open === i && (
                <div className="border-t border-white/5 px-5 py-4 text-sm leading-relaxed text-ink-secondary">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 card text-center">
          <h2 className="mb-2 text-xl font-bold">Still have questions?</h2>
          <p className="mb-4 text-sm text-ink-muted">We're happy to help.</p>
          <a href="mailto:hello@playwithastar.com" className="btn-primary !px-5 !py-2.5 text-sm">
            Contact us
          </a>
        </div>
      </div>
    </div>
  );
}
