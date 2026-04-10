import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

// Returns a snapshot of recent Stripe activity for the admin dashboard.
// Uses STRIPE_SECRET_KEY (server-only).

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return res.status(500).json({ error: 'Stripe not configured' });

  try {
    const stripe = new Stripe(secret);

    // Pull the last 50 payment intents and refunds in parallel
    const [intents, refunds] = await Promise.all([
      stripe.paymentIntents.list({ limit: 50 }),
      stripe.refunds.list({ limit: 50 }),
    ]);

    // Map refunds by the PaymentIntent they belong to, summing partial refunds
    const refundedByIntent = new Map<string, number>();
    for (const r of refunds.data) {
      const pi = r.payment_intent as string | null;
      if (!pi) continue;
      refundedByIntent.set(pi, (refundedByIntent.get(pi) ?? 0) + r.amount);
    }

    let grossCents = 0;
    let refundedCents = 0;
    let succeededCount = 0;
    let refundedCount = 0;
    let failedCount = 0;

    const payments = intents.data.map((pi) => {
      const refundAmount = refundedByIntent.get(pi.id) ?? 0;
      const isRefunded = refundAmount > 0;

      if (pi.status === 'succeeded') {
        succeededCount += 1;
        grossCents += pi.amount_received ?? pi.amount;
      }
      if (isRefunded) {
        refundedCount += 1;
        refundedCents += refundAmount;
      }
      if (pi.status === 'canceled') failedCount += 1;

      return {
        id: pi.id,
        amount: pi.amount,
        currency: pi.currency,
        status: pi.status,
        description: pi.description ?? '',
        created: pi.created,
        athleteName: (pi.metadata?.athleteName as string) ?? null,
        experienceTitle: (pi.metadata?.experienceTitle as string) ?? null,
        refunded: isRefunded,
      };
    });

    const netCents = grossCents - refundedCents;

    return res.status(200).json({
      summary: {
        totalCents: netCents,
        totalDollars: netCents / 100,
        grossDollars: grossCents / 100,
        refundedDollars: refundedCents / 100,
        succeededCount,
        refundedCount,
        failedCount,
      },
      payments,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('stripe-summary error:', message);
    return res.status(500).json({ error: message });
  }
}
