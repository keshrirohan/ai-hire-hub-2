'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '0',
    description: 'Perfect for small projects',
    features: ['3 AI project plans/month', '5 Freelancer recommendations', 'Basic chat', '5% platform fee', 'Email support'],
    cta: 'Get Started Free',
    href: '/register',
    highlight: false,
  },
  {
    name: 'Professional',
    price: '999',
    description: 'For growing businesses',
    features: ['Unlimited AI project plans', 'Priority matching', 'Real-time chat + file sharing', '3% platform fee', '24/7 Priority support', 'Analytics dashboard'],
    cta: 'Start Pro Trial',
    href: '/register',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations',
    features: ['Everything in Pro', 'Dedicated AI project manager', 'Custom integrations', '1% platform fee', 'SLA guarantee', 'Custom contracts'],
    cta: 'Contact Sales',
    href: '/register',
    highlight: false,
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

export function PricingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const cardsRef = useRef<HTMLDivElement>(null);
  const cardsInView = useInView(cardsRef, { once: true, margin: '-60px' });

  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="py-24 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/[0.08] text-xs text-[#6b6760] uppercase tracking-widest mb-5"
          >
            Pricing Plans
          </motion.div>
          <motion.h2
            id="pricing-heading"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#e8e4dc] mb-4 tracking-tight"
          >
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[#6b6760]"
          >
            No hidden fees. Pay only when projects succeed.
          </motion.p>
        </div>

        <motion.div
          ref={cardsRef}
          variants={container}
          initial="hidden"
          animate={cardsInView ? 'show' : 'hidden'}
          className="grid md:grid-cols-3 gap-6 items-start"
        >
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              variants={cardVariant}
              className={`relative rounded-2xl p-7 border transition-all duration-300 hover:-translate-y-1 ${
                plan.highlight
                  ? 'bg-gradient-to-br from-[#e8b86d]/[0.08] to-[#d4914a]/[0.04] border-[#e8b86d]/30 shadow-2xl shadow-[#e8b86d]/10'
                  : 'surface-raised border-white/[0.06] hover:border-[#e8b86d]/15'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#e8b86d] text-[10px] font-black text-[#0f1117] tracking-wider uppercase shadow-lg shadow-[#e8b86d]/30">
                  Most Popular
                </div>
              )}

              <h3 className="text-lg font-bold text-[#e8e4dc] mb-1">{plan.name}</h3>
              <p className="text-xs text-[#4a4845] mb-5">{plan.description}</p>

              <div className="mb-6">
                {plan.price === 'Custom' ? (
                  <span className="text-4xl font-black text-[#e8e4dc]">Custom</span>
                ) : (
                  <>
                    <span className="text-[#6b6760] text-lg">₹</span>
                    <span className="text-4xl font-black text-[#e8e4dc]">{plan.price}</span>
                    {plan.price !== '0' && <span className="text-[#4a4845] text-sm ml-1">/month</span>}
                  </>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2.5 text-sm text-[#a9a49e]">
                    <CheckCircle className="w-4 h-4 text-[#6ee7b7] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  plan.highlight
                    ? 'btn-premium'
                    : 'glass border border-white/10 text-[#a9a49e] hover:text-[#e8e4dc] hover:border-white/20 hover:bg-white/[0.03]'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
