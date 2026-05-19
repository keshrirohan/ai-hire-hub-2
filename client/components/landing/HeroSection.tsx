'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Bot, ArrowRight, Briefcase, Zap, CheckCircle } from 'lucide-react';

const stats = [
  { value: '50K+', label: 'Active Freelancers' },
  { value: '₹2Cr+', label: 'Paid Out' },
  { value: '15K+', label: 'Projects Completed' },
  { value: '4.9★', label: 'Average Rating' },
];

const demoItems = [
  '🎨 UI/UX Design & Frontend — ₹15,000 (2 weeks)',
  '⚙️ Backend API & Database — ₹20,000 (3 weeks)',
  '💳 Payment Gateway Integration — ₹10,000 (1 week)',
  '📊 Admin Dashboard — ₹12,000 (2 weeks)',
  '🧪 Testing & Launch — ₹8,000 (1 week)',
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { ease: [0.16, 1, 0.3, 1], duration: 0.65 } },
};

export function HeroSection() {
  return (
    <section aria-label="Hero" className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-5 sm:px-8 overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#e8b86d]/[0.06] rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-purple-500/[0.04] rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#e8b86d]/[0.03] rounded-full blur-[120px]" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-5xl mx-auto text-center relative z-10"
      >
        {/* Badge */}
        <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#e8b86d]/25 text-sm text-[#e8b86d] mb-8">
          <Zap className="w-3.5 h-3.5" />
          <span>Powered by Groq AI (Llama 3.3 70B)</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#e8b86d] animate-pulse" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={item}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#e8e4dc] mb-6 leading-[1.05] tracking-tight"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Hire Smarter with
          <br />
          <span className="gradient-text">AI-Powered</span>
          <br />
          Freelancing
        </motion.h1>

        <motion.p
          variants={item}
          className="text-lg sm:text-xl text-[#6b6760] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Describe your project to AI, get instant project plans with milestones,
          match with expert freelancers, and release payments securely — all in one platform.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/register?role=client"
            className="group flex items-center gap-2 px-8 py-4 rounded-2xl btn-premium text-base font-semibold shadow-2xl shadow-[#e8b86d]/15 hover:shadow-[#e8b86d]/25 transition-all duration-200"
          >
            <Bot className="w-5 h-5" />
            Start with AI
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/register?role=freelancer"
            className="group flex items-center gap-2 px-8 py-4 rounded-2xl glass border border-white/10 text-[#a9a49e] hover:text-[#e8e4dc] hover:border-white/20 hover:bg-white/[0.03] font-semibold text-base transition-all duration-200"
          >
            <Briefcase className="w-5 h-5" />
            Find Work
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-16">
          {stats.map((s, i) => (
            <div key={i} className="glass rounded-2xl p-4 text-center border border-white/[0.05] hover:border-[#e8b86d]/20 transition-colors group">
              <div className="text-2xl font-black gradient-text group-hover:scale-105 transition-transform">{s.value}</div>
              <div className="text-xs text-[#4a4845] mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* AI Demo Preview */}
        <motion.div variants={item} className="glass-premium rounded-3xl p-5 sm:p-7 border border-white/[0.07] shadow-2xl text-left max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="ml-3 text-xs text-[#4a4845] font-mono">AI Project Assistant</span>
          </div>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1e2130] flex items-center justify-center text-xs font-bold text-[#6b6760] shrink-0 border border-white/[0.06]">You</div>
              <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-[#a9a49e]">
                I want to build an e-commerce website for my clothing brand with payment integration
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#e8b86d] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-[#0f1117]" />
              </div>
              <div className="ai-bubble rounded-2xl rounded-tl-sm px-4 py-4 text-sm text-[#a9a49e] flex-1">
                <p className="mb-3 text-[#c4bfb8]">Here&apos;s your complete project plan:</p>
                <div className="space-y-2">
                  {demoItems.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <CheckCircle className="w-3.5 h-3.5 text-[#6ee7b7] shrink-0" />
                      {d}
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-white/[0.07] text-xs text-[#e8b86d]">
                  Total: ₹65,000 • Timeline: 9 weeks • 5 Milestones
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
