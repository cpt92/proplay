import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

// Vercel serverless function: creates a Stripe PaymentIntent and returns the client_secret.
// The client uses the client_secret to confirm the payment via Stripe Elements on the frontend.
//
// Required env var (set in Vercel project settings → Environment Variables):
//   STRIPE_SECRET_KEY = sk_test_...   (test mode for now)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return res.status(500).json({ error: 'Stripe is not configured on the server.' });
  }

  try {
    const { amount, athleteName, experienceTitle } = req.body ?? {};

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount.' });
    }

    const stripe = new Stripe(secret);

    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // dollars → cents
      currency: 'cad',
      automatic_payment_methods: { enabled: true },
      description: `${experienceTitle ?? 'Experience'} with ${athleteName ?? 'an athlete'}`,
      metadata: {
        athleteName: athleteName ?? '',
        experienceTitle: experienceTitle ?? '',
      },
    });

    return res.status(200).json({ clientSecret: intent.client_secret, id: intent.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('PaymentIntent error:', message);
    return res.status(500).json({ error: message });
  }
}
