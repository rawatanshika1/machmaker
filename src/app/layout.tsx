import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Starlit - Where meaningful connections begin',
  description: 'Starlit matchmaking dashboard - elegant, modern, and intuitive.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FAFAFA] text-[#1A1A2E] antialiased">{children}</body>
    </html>
  );
}
