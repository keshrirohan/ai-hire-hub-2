'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Reviews', href: '#testimonials' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        aria-label="Main navigation"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass border-b border-white/[0.07] shadow-2xl shadow-black/30' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[#e8b86d] flex items-center justify-center shadow-lg shadow-[#e8b86d]/20">
              <Bot className="w-5 h-5 text-[#0f1117]" />
            </div>
            <span className="text-[#e8e4dc] font-bold text-lg tracking-tight hidden sm:block">
              AI Hire Hub
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7 text-sm text-[#6b6760]">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="hover:text-[#e8e4dc] transition-colors duration-150 relative group"
              >
                {l.label}
                <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#e8b86d] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-[#6b6760] hover:text-[#e8e4dc] transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="btn-premium text-sm px-5 py-2.5 rounded-xl"
            >
              Get Started →
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            id="mobile-menu-toggle"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-[#6b6760] hover:text-[#e8e4dc] hover:bg-white/5 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[68px] left-0 right-0 z-40 glass border-b border-white/[0.07] px-6 py-5 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="text-[#a9a49e] hover:text-[#e8e4dc] text-base py-1 transition-colors"
              >
                {l.label}
              </a>
            ))}
            <div className="border-t border-white/[0.07] pt-4 flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="text-center py-2.5 rounded-xl text-sm text-[#a9a49e] hover:text-[#e8e4dc] border border-white/10 hover:bg-white/5 transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="btn-premium text-center py-2.5 rounded-xl text-sm"
              >
                Get Started Free →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
