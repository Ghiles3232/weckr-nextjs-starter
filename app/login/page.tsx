'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

// Email and password auth with Supabase. Two buttons: sign in and create account.
export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function submit(mode: 'signin' | 'signup') {
    setMessage('');
    const { error } =
      mode === 'signin'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else router.push('/dashboard');
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="mb-6 text-2xl font-semibold">Sign in</h1>
      <input
        className="mb-3 rounded-md border border-line bg-panel px-3 py-2 outline-none focus:border-neutral-600"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="mb-4 rounded-md border border-line bg-panel px-3 py-2 outline-none focus:border-neutral-600"
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex gap-3">
        <button
          onClick={() => submit('signin')}
          className="flex-1 rounded-md bg-accent px-4 py-2 font-medium text-black transition hover:opacity-90"
        >
          Sign in
        </button>
        <button
          onClick={() => submit('signup')}
          className="flex-1 rounded-md border border-line px-4 py-2 font-medium text-neutral-300 transition hover:border-neutral-600"
        >
          Create account
        </button>
      </div>
      {message && <p className="mt-4 text-sm text-red-400">{message}</p>}
    </main>
  );
}
