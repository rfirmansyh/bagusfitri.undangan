import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard — Kondangan',
  description: 'Admin dashboard untuk mengelola RSVP dan ucapan pernikahan.',
  robots: 'noindex, nofollow',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
