import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Bonus demo. Reads your own Weckr usage with the same key the SDK writes with,
// so the dashboard can show live cost and request counts. Totally optional, you
// can delete this route and the card it feeds.
const BASE = process.env.WECKR_API_BASE ?? 'https://app.useweckr.com';

export async function GET() {
  const key = process.env.WECKR_API_KEY;
  if (!key) return NextResponse.json({ error: 'WECKR_API_KEY is not set' }, { status: 500 });

  const headers = { 'x-api-key': key };

  // Resolve the project that owns this key, then read its stats.
  const meRes = await fetch(`${BASE}/api/v1/me`, { headers, cache: 'no-store' });
  if (!meRes.ok) return NextResponse.json({ error: 'Weckr key was rejected' }, { status: 502 });
  const { project } = await meRes.json();

  const statsRes = await fetch(`${BASE}/api/v1/stats/${project.id}`, { headers, cache: 'no-store' });
  const usage = await statsRes.json();

  return NextResponse.json({ project: project.name, usage });
}
