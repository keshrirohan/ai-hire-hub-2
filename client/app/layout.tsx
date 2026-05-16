import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, DM_Serif_Display, DM_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['300', '400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AI Hire Hub — Intelligent Freelancer Marketplace',
  description:
    'Hire top freelancers powered by AI. Chat with AI to plan your project, get matched with experts, and manage milestones with smart payments.',
  keywords: 'freelancer, hire, AI, project management, milestones, payments',
  openGraph: {
    title: 'AI Hire Hub',
    description: 'Intelligent Freelancer Marketplace',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${plusJakarta.variable} ${dmSerif.variable} ${dmMono.variable}`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1d27',
              color: '#e8e4dc',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              fontFamily: 'var(--font-jakarta)',
              fontSize: '14px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            },
            success: {
              iconTheme: { primary: '#6ee7b7', secondary: '#1a1d27' },
            },
            error: {
              iconTheme: { primary: '#fca5a5', secondary: '#1a1d27' },
            },
          }}
        />
      </body>
    </html>
  );
}
