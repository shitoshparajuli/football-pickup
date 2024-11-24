import './globals.css';

import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: 'Everest Warriors Football',
  description:
    'Game scheduler for Everest Warriors pickup football game'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen w-full flex-col">{children}</body>
      <Analytics />
    </html>
  );
}
