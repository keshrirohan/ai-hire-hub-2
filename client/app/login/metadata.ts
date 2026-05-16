import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
  description:
    'Sign in to your AI Hire Hub account to manage projects, communicate with freelancers, and track milestone payments.',
  alternates: {
    canonical: '/login',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Sign In | AI Hire Hub',
    description:
      'Sign in to your AI Hire Hub account to manage projects and connect with top freelancers.',
    url: '/login',
    type: 'website',
  },
};
