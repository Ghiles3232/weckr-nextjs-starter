import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

// Minimal one plan checkout. Sends the user to Stripe and back. On return you
// set their plan to "pro" (Supabase user metadata is the easy spot) so the chat
// route starts sending plan "pro" to Weckr. Left as a small exercise on purpose.
export async function POST() {
  const secret = process.env.STRIPE_SECRET_KEY;
  const price = process.env.STRIPE_PRICE_ID;
  if (!secret || !price) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 });
  }

  const stripe = new Stripe(secret);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price, quantity: 1 }],
    success_url: `${appUrl}/dashboard?upgraded=1`,
    cancel_url: `${appUrl}/dashboard`,
  });

  return NextResponse.json({ url: session.url });
}
