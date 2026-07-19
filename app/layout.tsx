import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI SaaS Starter',
  description: 'An AI SaaS starter with cost and margin tracking built in from day one.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
