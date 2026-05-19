'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Bot, Zap, Users, Shield } from 'lucide-react';

const steps = [
  { step: '01', title: 'Describe Your Project', desc: 'Chat with our AI assistant and explain what you want to build. No technical knowledge required.', icon: Bot },
  { step: '02', title: 'AI Plans Everything', desc: 'AI generates project scope, milestones, budget estimates, and required skills automatically.', icon: Zap },
  { step: '03', title: 'Get Matched with Experts', desc: 'Our algorithm recommends top freelancers based on skills, ratings, and project requirements.', icon: Users },
  { step: '04', title: 'Ship with Confidence', desc: 'Track progress, review work with AI assistance, and release payments milestone by milestone.', icon: Shield },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};

export function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const stepsRef = useRef<HTMLDivElement>(null);
  const stepsInView = useInView(stepsRef, { once: true, margin: '-60px' });

  return (
    <section id="how-it-works" aria-labelledby="hiw-heading" className="py-24 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/[0.08] text-xs text-[#6b6760] uppercase tracking-widest mb-5"
          >
            Simple Process
          </motion.div>
          <motion.h2
            id="hiw-heading"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#e8e4dc] mb-4 tracking-tight"
          >
            How <span className="gradient-text">AI Hire Hub</span> Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[#6b6760] text-lg"
          >
            From idea to shipped product in 4 simple steps
          </motion.p>
        </div>

        <div className="relative">
          {/* Connector line desktop */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[#e8b86d]/20 to-transparent pointer-events-none" />

          <motion.div
            ref={stepsRef}
            variants={container}
            initial="hidden"
            animate={stepsInView ? 'show' : 'hidden'}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {steps.map((s, i) => (
              <motion.div
                key={i}
                variants={cardVariant}
                className="group relative text-center"
              >
                <div className="relative inline-flex mb-6">
                  <div className="w-20 h-20 rounded-2xl glass border border-[#e8b86d]/15 flex items-center justify-center group-hover:border-[#e8b86d]/35 group-hover:bg-[#e8b86d]/[0.04] transition-all duration-300">
                    <s.icon className="w-8 h-8 text-[#e8b86d]" />
                  </div>
                  <div className="absolute -top-2.5 -right-2.5 w-8 h-8 rounded-full bg-[#e8b86d] flex items-center justify-center text-[10px] font-black text-[#0f1117] shadow-lg shadow-[#e8b86d]/30">
                    {s.step}
                  </div>
                </div>
                <h3 className="text-base font-semibold text-[#e8e4dc] mb-2">{s.title}</h3>
                <p className="text-sm text-[#6b6760] leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
