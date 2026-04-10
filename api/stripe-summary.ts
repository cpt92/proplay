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

    // Pull the last 50 payment intents (most recent first)
    const intents = await stripe.paymentIntents.list({ limit: 50 });

    let totalCents = 0;
    let succeededCount = 0;
    let refundedCount = 0;
    let failedCount = 0;

    const payments = intents.data.map((pi) => {
      if (pi.status === 'succeeded') {
        succeededCount += 1;
        totalCents += pi.amount_received ?? pi.amount;
      }
      if (pi.status === 'canceled') failedCount += 1;
      // Note: refunds are tracked separately on charges, but we can detect refunded PIs
      // via amount_received < amount or via the latest_charge.refunded flag.

      return {
        id: pi.id,
        amount: pi.amount,
        currency: pi.currency,
        status: pi.status,
        description: pi.description ?? '',
        created: pi.created,
        athleteName: (pi.metadata?.athleteName as string) ?? null,
        experienceTitle: (pi.metadata?.experienceTitle as string) ?? null,
      };
    });

    // Pull recent refunds separately
    const refunds = await stripe.refunds.list({ limit: 50 });
    refundedCount = refunds.data.length;
    const refundedPaymentIds = new Set(refunds.data.map((r) => r.payment_intent as string));

    const paymentsAnnotated = payments.map((p) => ({
      ...p,
      refunded: refundedPaymentIds.has(p.id),
    }));

    return res.status(200).json({
      summary: {
        totalCents,
        totalDollars: totalCents / 100,
        succeededCount,
        refundedCount,
        failedCount,
      },
      payments: paymentsAnnotated,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('stripe-summary error:', message);
    return res.status(500).json({ error: message });
  }
}
