import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

// Refunds a Stripe PaymentIntent. Called from the admin dashboard.
// Body: { paymentIntentId: string }

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return res.status(500).json({ error: 'Stripe not configured' });

  try {
    const { paymentIntentId } = req.body ?? {};
    if (!paymentIntentId || typeof paymentIntentId !== 'string') {
      return res.status(400).json({ error: 'paymentIntentId is required' });
    }

    const stripe = new Stripe(secret);
    const refund = await stripe.refunds.create({ payment_intent: paymentIntentId });

    return res.status(200).json({
      id: refund.id,
      status: refund.status,
      amount: refund.amount,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('refund-payment error:', message);
    return res.status(500).json({ error: message });
  }
}
