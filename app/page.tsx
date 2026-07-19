import Link from 'next/link';

// Landing page. Deliberately plain so you can restyle it in minutes.
export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6">
      <p className="mb-4 text-sm uppercase tracking-widest text-accent">AI SaaS Starter</p>
      <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
        Ship your AI product this weekend.
      </h1>
      <p className="mt-5 max-w-xl text-lg text-neutral-400">
        Auth, billing, and an AI endpoint are already wired together. Every model
        call is tracked per user for cost and margin, so you know who is profitable
        before the invoice arrives.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/login"
          className="rounded-md bg-accent px-5 py-2.5 font-medium text-black transition hover:opacity-90"
        >
          Get started
        </Link>
        <a
          href="https://useweckr.com"
          className="rounded-md border border-line px-5 py-2.5 font-medium text-neutral-300 transition hover:border-neutral-600"
        >
          What is Weckr
        </a>
      </div>
      <p className="mt-16 text-sm text-neutral-600">
        Cost and margin tracking by Weckr. Swap the branding, keep the plumbing.
      </p>
    </main>
  );
}
