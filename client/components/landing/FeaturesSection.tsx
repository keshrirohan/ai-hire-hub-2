'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Bot, Users, Shield, Zap, MessageSquare, DollarSign } from 'lucide-react';

const features = [
  { icon: Bot, title: 'AI Project Assistant', description: 'Chat with AI to plan your project, generate milestones, and get budget estimates automatically.', accent: '#e8b86d', tag: 'Core' },
  { icon: Users, title: 'Smart Freelancer Matching', description: 'AI analyzes skills, ratings, and experience to recommend the perfect freelancers for your project.', accent: '#93b4f0', tag: 'Matching' },
  { icon: Shield, title: 'Milestone Escrow', description: 'Funds are held securely in escrow and released only when milestones are approved by AI + Client.', accent: '#6ee7b7', tag: 'Security' },
  { icon: Zap, title: 'AI Work Verification', description: 'Every submission is reviewed by AI for quality and requirement compliance before client approval.', accent: '#fbbf24', tag: 'AI' },
  { icon: MessageSquare, title: 'Real-time Chat', description: 'Live messaging with file sharing, typing indicators, and project-specific chat rooms.', accent: '#c084fc', tag: 'Communication' },
  { icon: DollarSign, title: 'Instant Payments', description: 'Add credits via Razorpay and freelancers receive payments instantly upon milestone approval.', accent: '#34d399', tag: 'Payments' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export function FeaturesSection() {
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true });
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: '-60px' });

  return (
    <section id="features" aria-labelledby="features-heading" className="py-24 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div ref={titleRef} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/[0.08] text-xs text-[#6b6760] uppercase tracking-widest mb-5"
          >
            Platform Features
          </motion.div>
          <motion.h2
            id="features-heading"
            initial={{ opacity: 0, y: 24 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#e8e4dc] mb-4 tracking-tight"
          >
            Everything You Need to{' '}
            <span className="gradient-text">Hire &amp; Get Hired</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="text-[#6b6760] text-lg max-w-2xl mx-auto"
          >
            A complete platform with AI superpowers for both clients and freelancers.
          </motion.p>
        </div>

        <motion.div
          ref={gridRef}
          variants={container}
          initial="hidden"
          animate={gridInView ? 'show' : 'hidden'}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={cardVariant}
              className="group relative surface-raised rounded-2xl p-6 border border-white/[0.06] hover:border-[#e8b86d]/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 overflow-hidden"
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{ background: `radial-gradient(ellipse at top left, ${feature.accent}08, transparent 70%)` }}
              />
              <div className="relative z-10">
                <div
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase mb-4"
                  style={{ background: `${feature.accent}12`, color: feature.accent, border: `1px solid ${feature.accent}25` }}
                >
                  {feature.tag}
                </div>
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${feature.accent}14`, border: `1px solid ${feature.accent}20` }}
                >
                  <feature.icon className="w-5 h-5" style={{ color: feature.accent }} />
                </div>
                <h3 className="text-base font-semibold text-[#e8e4dc] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#6b6760] leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
