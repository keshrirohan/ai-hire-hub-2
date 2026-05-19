'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { Bot, ArrowRight, Briefcase } from 'lucide-react';

export function CtaSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-24 px-5 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl p-10 sm:p-16 overflow-hidden border border-[#e8b86d]/20 text-center"
          style={{ background: 'rgba(22,24,31,0.95)', backdropFilter: 'blur(32px)' }}
        >
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-[#e8b86d]/[0.05] blur-[80px]" />
          </div>

          {/* Floating bot icon */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-10 w-16 h-16 rounded-2xl bg-[#e8b86d] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-[#e8b86d]/30"
          >
            <Bot className="w-8 h-8 text-[#0f1117]" />
          </motion.div>

          <h2 className="relative z-10 text-3xl sm:text-4xl md:text-5xl font-bold text-[#e8e4dc] mb-4 tracking-tight">
            Ready to Build Something
            <br />
            <span className="gradient-text">Amazing?</span>
          </h2>
          <p className="relative z-10 text-[#6b6760] text-lg mb-10 max-w-xl mx-auto">
            Join thousands of clients and freelancers who use AI Hire Hub to create exceptional products.
          </p>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register?role=client"
              className="group flex items-center gap-2 px-8 py-4 rounded-2xl btn-premium font-semibold text-base transition-all duration-200"
            >
              Start as Client
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/register?role=freelancer"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl glass border border-white/10 text-[#a9a49e] hover:text-[#e8e4dc] hover:border-white/20 hover:bg-white/[0.03] font-semibold text-base transition-all duration-200"
            >
              <Briefcase className="w-5 h-5" />
              Join as Freelancer
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
