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

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://airehub.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'AI Hire Hub — Intelligent Freelancer Marketplace',
    template: '%s | AI Hire Hub',
  },
  description:
    'Hire top freelancers powered by AI. Chat with AI to plan your project, get matched with expert developers & designers, and release payments milestone by milestone — all in one platform.',
  keywords: [
    'freelancer marketplace',
    'AI hiring platform',
    'hire freelancers online',
    'AI project planning',
    'milestone payments',
    'escrow payments freelancers',
    'find freelance developers',
    'Groq AI',
    'remote work platform',
    'AI hire hub',
  ],
  authors: [{ name: 'AI Hire Hub', url: BASE_URL }],
  creator: 'AI Hire Hub',
  publisher: 'AI Hire Hub',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'AI Hire Hub',
    title: 'AI Hire Hub — Intelligent Freelancer Marketplace',
    description:
      'Hire top freelancers powered by AI. Plan projects, get matched with experts, and release payments securely — all in one place.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Hire Hub — Intelligent Freelancer Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Hire Hub — Intelligent Freelancer Marketplace',
    description:
      'Hire top freelancers powered by AI. Plan projects, get matched with experts, and release payments securely.',
    images: ['/og-image.png'],
    creator: '@airehub',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  category: 'technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" dir="ltr">
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
