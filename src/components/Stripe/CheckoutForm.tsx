import { useState } from 'react';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';

type Props = {
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
};

export default function CheckoutForm({ amount, onSuccess }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setError(null);
    setProcessing(true);

    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (submitError) {
      setError(submitError.message ?? 'Payment failed.');
      setProcessing(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent.id);
    } else {
      setError('Payment did not complete. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-xl border border-white/10 bg-bg-secondary/40 p-4">
        <PaymentElement />
      </div>
      {error && (
        <div className="rounded-lg border border-err/40 bg-err/10 p-3 text-sm text-err">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || !elements || processing}
        className="btn-primary w-full disabled:opacity-50"
      >
        {processing ? 'Processing…' : `Pay $${amount}`}
      </button>
      <p className="text-center text-[11px] text-ink-muted">
        Test mode — use card{' '}
        <code className="rounded bg-white/5 px-1.5 py-0.5">4242 4242 4242 4242</code>, any future
        expiry, any CVC.
      </p>
    </form>
  );
}
