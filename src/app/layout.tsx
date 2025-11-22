import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PokéSavings - 8-bit Savings Tracker',
  description:
    'A retro Game Boy-styled savings tracker inspired by Pokémon FireRed/LeafGreen. Track your savings goals with your favorite starter Pokémon!',
  keywords: [
    'savings tracker',
    'pokemon',
    'retro',
    '8-bit',
    'game boy',
    'finance',
    'budget',
  ],
  authors: [{ name: 'PokéSavings' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#C41E3A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
