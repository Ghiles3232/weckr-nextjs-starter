'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

// The signed in view. Shows a chat box that hits /api/chat, plus a live usage
// card fed by /api/usage (your real Weckr numbers).
export default function Dashboard() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [usage, setUsage] = useState<any>(null);
  const [input, setInput] = useState('');
  const [reply, setReply] = useState('');
  const [busy, setBusy] = useState(false);

  function loadUsage() {
    fetch('/api/usage').then((r) => r.json()).then(setUsage).catch(() => {});
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push('/login');
        return;
      }
      setToken(data.session.access_token);
    });
    loadUsage();
  }, [router]);

  async function send() {
    if (!input || !token) return;
    setBusy(true);
    setReply('');
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({ messages: [{ role: 'user', content: input }] }),
    });
    const data = await res.json();
    setReply(data.reply || data.error || 'No response');
    setBusy(false);
    loadUsage();
  }

  async function upgrade() {
    const res = await fetch('/api/checkout', { method: 'POST' });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  const totals = usage?.usage ?? {};

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <button onClick={upgrade} className="rounded-md border border-line px-3 py-1.5 text-sm text-neutral-300 hover:border-neutral-600">
          Upgrade to Pro
        </button>
      </div>

      <section className="mb-8 grid grid-cols-3 gap-3">
        <Stat label="Total cost" value={fmt(totals.totalCostUsd)} />
        <Stat label="Requests" value={totals.requestCount ?? 0} />
        <Stat label="Margin" value={fmt(totals.totalMarginUsd)} />
      </section>

      <section className="rounded-lg border border-line bg-panel p-4">
        <label className="mb-2 block text-sm text-neutral-400">Try the AI feature</label>
        <textarea
          className="mb-3 h-24 w-full rounded-md border border-line bg-ink px-3 py-2 outline-none focus:border-neutral-600"
          placeholder="Ask anything"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={send}
          disabled={busy}
          className="rounded-md bg-accent px-4 py-2 font-medium text-black transition hover:opacity-90 disabled:opacity-50"
        >
          {busy ? 'Thinking' : 'Send'}
        </button>
        {reply && <p className="mt-4 whitespace-pre-wrap text-neutral-200">{reply}</p>}
      </section>

      <p className="mt-8 text-xs text-neutral-600">
        Cost, requests, and margin above come straight from your Weckr project.
      </p>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-line bg-panel p-4">
      <div className="text-xs text-neutral-500">{label}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
    </div>
  );
}

function fmt(n: unknown): string {
  const v = typeof n === 'number' ? n : 0;
  return `$${v.toFixed(2)}`;
}
