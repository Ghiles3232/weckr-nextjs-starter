import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Weckr } from '@weckr/sdk';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

/*
 * This is the whole point of the template.
 *
 * You create one Weckr instance and wrap your normal OpenAI call with wk.chat.
 * That single line records cost and revenue per user, per feature, in your
 * Weckr dashboard. Nothing else in this file is Weckr specific.
 */
const wk = new Weckr({
  apiKey: process.env.WECKR_API_KEY!,
  plans: { free: 0, pro: 29 },
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function POST(req: Request) {
  // Verify the Supabase session so userId is trustworthy, not client supplied.
  const token = (req.headers.get('authorization') ?? '').replace('Bearer ', '');
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });

  const { messages } = await req.json();
  const plan = (user.user_metadata?.plan as string) ?? 'free';

  // The one wrapped call. Same arguments you would pass to OpenAI, plus the
  // userId, feature, and plan that Weckr needs to attribute cost and margin.
  const result = await wk.chat(openai, {
    model: 'gpt-4o-mini',
    messages,
    userId: user.id,
    feature: 'chat',
    plan,
  });

  const reply = (result as any).choices?.[0]?.message?.content ?? '';
  return NextResponse.json({ reply });
}
