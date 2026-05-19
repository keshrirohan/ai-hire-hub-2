'use client';

import Link from 'next/link';
import { Bot, Github, Twitter, Linkedin } from 'lucide-react';

const footerLinks = {
  Product: ['Features', 'Pricing', 'Changelog', 'Roadmap'],
  Company: ['About', 'Blog', 'Careers', 'Press'],
  Legal: ['Privacy', 'Terms', 'Cookies', 'Licenses'],
};

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] pt-14 pb-8 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-[#e8b86d] flex items-center justify-center">
                <Bot className="w-4 h-4 text-[#0f1117]" />
              </div>
              <span className="text-base font-bold text-[#e8e4dc]">AI Hire Hub</span>
            </Link>
            <p className="text-sm text-[#4a4845] leading-relaxed max-w-xs">
              Intelligent freelancer marketplace powered by Groq AI. Plan, hire, and ship with confidence.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg glass border border-white/[0.07] flex items-center justify-center text-[#4a4845] hover:text-[#e8b86d] hover:border-[#e8b86d]/25 transition-all duration-150"
                >
                  <s.icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <div className="text-xs font-semibold text-[#e8e4dc] uppercase tracking-widest mb-4">{group}</div>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-[#4a4845] hover:text-[#a9a49e] transition-colors duration-150">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.05] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#4a4845]">
          <span>© 2025 AI Hire Hub, Inc. All rights reserved.</span>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6ee7b7] animate-pulse" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
