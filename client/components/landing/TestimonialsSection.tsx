'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Rajesh Kumar',
    role: 'Startup Founder',
    avatar: 'RK',
    rating: 5,
    text: 'AI Hire Hub transformed how I hire freelancers. The AI planned my entire e-commerce project in minutes — something that used to take days!',
    company: 'TechVentures India',
  },
  {
    name: 'Priya Sharma',
    role: 'Full-Stack Developer',
    avatar: 'PS',
    rating: 5,
    text: "As a freelancer, the milestone system ensures I get paid on time, every time. The AI review feature is absolutely brilliant.",
    company: 'Freelance Developer',
  },
  {
    name: 'Arjun Mehta',
    role: 'Product Manager',
    avatar: 'AM',
    rating: 5,
    text: "The escrow system gives me complete peace of mind. Best platform I've used for managing remote freelancers across multiple projects.",
    company: 'ProductLab',
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};

export function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const cardsRef = useRef<HTMLDivElement>(null);
  const cardsInView = useInView(cardsRef, { once: true, margin: '-60px' });

  return (
    <section id="testimonials" aria-labelledby="testimonials-heading" className="py-24 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/[0.08] text-xs text-[#6b6760] uppercase tracking-widest mb-5"
          >
            Social Proof
          </motion.div>
          <motion.h2
            id="testimonials-heading"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#e8e4dc] mb-4 tracking-tight"
          >
            Loved by <span className="gradient-text">Thousands</span>
          </motion.h2>
        </div>

        <motion.div
          ref={cardsRef}
          variants={container}
          initial="hidden"
          animate={cardsInView ? 'show' : 'hidden'}
          className="grid md:grid-cols-3 gap-5"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={cardVariant}
              className="group surface-raised rounded-2xl p-6 border border-white/[0.06] hover:border-[#e8b86d]/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 transition-all duration-300"
            >
              <div className="flex items-center gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-[#fbbf24] text-[#fbbf24]" />
                ))}
              </div>
              <p className="text-sm text-[#a9a49e] leading-relaxed mb-6 italic">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#e8b86d] flex items-center justify-center text-xs font-bold text-[#0f1117] shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#e8e4dc]">{t.name}</div>
                  <div className="text-xs text-[#4a4845]">{t.role} · {t.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
