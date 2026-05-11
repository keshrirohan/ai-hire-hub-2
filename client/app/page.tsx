'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Bot, Zap, Shield, Star, ArrowRight, CheckCircle, Users,
  Briefcase, TrendingUp, Globe, ChevronRight, Play, Award,
  DollarSign, Clock, Code, Palette, BarChart3, MessageSquare
} from 'lucide-react';

const features = [
  {
    icon: Bot,
    title: 'AI Project Assistant',
    description: 'Chat with our AI to plan your project, generate milestones, and get budget estimates automatically.',
    gradient: 'from-purple-500/20 to-indigo-500/20',
    border: 'border-purple-500/30',
  },
  {
    icon: Users,
    title: 'Smart Freelancer Matching',
    description: 'AI analyzes skills, ratings, and experience to recommend the perfect freelancers for your project.',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/30',
  },
  {
    icon: Shield,
    title: 'Milestone Escrow',
    description: 'Funds are held securely in escrow and released only when milestones are approved by AI + Client.',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/30',
  },
  {
    icon: Zap,
    title: 'AI Work Verification',
    description: 'Every submission is reviewed by AI for quality and requirement compliance before client approval.',
    gradient: 'from-amber-500/20 to-orange-500/20',
    border: 'border-amber-500/30',
  },
  {
    icon: MessageSquare,
    title: 'Real-time Chat',
    description: 'Live messaging with file sharing, typing indicators, and project-specific chat rooms.',
    gradient: 'from-pink-500/20 to-rose-500/20',
    border: 'border-pink-500/30',
  },
  {
    icon: DollarSign,
    title: 'Instant Payments',
    description: 'Add credits via Razorpay and freelancers receive payments instantly upon milestone approval.',
    gradient: 'from-violet-500/20 to-purple-500/20',
    border: 'border-violet-500/30',
  },
];

const steps = [
  {
    step: '01',
    title: 'Describe Your Project',
    description: 'Chat with our AI assistant and explain what you want to build. No technical knowledge required.',
    icon: Bot,
  },
  {
    step: '02',
    title: 'AI Plans Everything',
    description: 'AI generates project scope, milestones, budget estimates, and required skills automatically.',
    icon: Zap,
  },
  {
    step: '03',
    title: 'Get Matched with Experts',
    description: 'Our algorithm recommends top freelancers based on skills, ratings, and project requirements.',
    icon: Users,
  },
  {
    step: '04',
    title: 'Ship with Confidence',
    description: 'Track progress, review work with AI assistance, and release payments milestone by milestone.',
    icon: Shield,
  },
];

const testimonials = [
  {
    name: 'Rajesh Kumar',
    role: 'Startup Founder',
    avatar: 'RK',
    rating: 5,
    text: 'AI Hire Hub transformed how I hire freelancers. The AI planned my entire e-commerce project in minutes!',
  },
  {
    name: 'Priya Sharma',
    role: 'Full-Stack Developer',
    avatar: 'PS',
    rating: 5,
    text: 'As a freelancer, the milestone system ensures I get paid on time. The AI review feature is brilliant.',
  },
  {
    name: 'Arjun Mehta',
    role: 'Product Manager',
    avatar: 'AM',
    rating: 5,
    text: 'The escrow system gives me peace of mind. Best platform for managing remote freelancers.',
  },
];

const pricingPlans = [
  {
    name: 'Starter',
    price: '0',
    description: 'Perfect for small projects',
    features: ['3 AI project plans/month', '5 Freelancer recommendations', 'Basic chat', '5% platform fee', 'Email support'],
    cta: 'Get Started Free',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '999',
    description: 'For growing businesses',
    features: ['Unlimited AI project plans', 'Priority matching', 'Real-time chat + file sharing', '3% platform fee', '24/7 Priority support', 'Analytics dashboard'],
    cta: 'Start Pro Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations',
    features: ['Everything in Pro', 'Dedicated AI project manager', 'Custom integrations', '1% platform fee', 'SLA guarantee', 'Custom contracts'],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

const stats = [
  { value: '50K+', label: 'Active Freelancers' },
  { value: '₹2Cr+', label: 'Paid Out' },
  { value: '15K+', label: 'Projects Completed' },
  { value: '4.9★', label: 'Average Rating' },
];

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen hero-gradient overflow-hidden">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'glass border-b border-white/10' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">AI Hire Hub</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Reviews</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-slate-400 hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 transition-all duration-200 shadow-lg shadow-purple-500/25"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative">
        {/* Background orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-purple-500/30 text-sm text-purple-300 mb-8 animate-fade-in">
            <Zap className="w-4 h-4" />
            <span>Powered by Groq AI (Llama 3.3 70B)</span>
            <ChevronRight className="w-4 h-4" />
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight animate-slide-up">
            Hire Smarter with
            <br />
            <span className="gradient-text">AI-Powered</span>
            <br />
            Freelancing
          </h1>

          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10 animate-slide-up">
            Describe your project to AI, get instant project plans with milestones,
            match with expert freelancers, and release payments securely — all in one platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up">
            <Link
              href="/register?role=client"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-lg hover:from-purple-500 hover:to-indigo-500 transition-all duration-200 shadow-2xl shadow-purple-500/30 glow-purple"
            >
              <Bot className="w-5 h-5" />
              Start with AI
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/register?role=freelancer"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl glass border border-white/20 text-white font-semibold text-lg hover:bg-white/10 transition-all duration-200"
            >
              <Briefcase className="w-5 h-5" />
              Find Work
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="glass rounded-2xl p-4 text-center">
                <div className="text-2xl font-black gradient-text">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Demo Preview */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="glass-strong rounded-3xl p-6 border border-white/10 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-3 text-xs text-slate-500">AI Project Assistant</span>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                  You
                </div>
                <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-300">
                  I want to build an e-commerce website for my clothing brand with payment integration
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="ai-bubble rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-200 max-w-lg">
                  <p className="mb-3">Great! I&apos;ll create a complete project plan for your clothing e-commerce website. Here&apos;s what I&apos;ve generated:</p>
                  <div className="space-y-2">
                    {['🎨 UI/UX Design & Frontend — ₹15,000 (2 weeks)', '⚙️ Backend API & Database — ₹20,000 (3 weeks)', '💳 Payment Gateway Integration — ₹10,000 (1 week)', '📊 Admin Dashboard — ₹12,000 (2 weeks)', '🧪 Testing & Launch — ₹8,000 (1 week)'].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10 text-xs text-purple-300">
                    Total Budget: ₹65,000 • Timeline: 9 weeks • 5 Milestones
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Everything You Need to
              <span className="gradient-text"> Hire & Get Hired</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              A complete platform with AI superpowers for both clients and freelancers.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className={`card-hover glass rounded-2xl p-6 border ${feature.border} bg-gradient-to-br ${feature.gradient}`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              How <span className="gradient-text">AI Hire Hub</span> Works
            </h2>
            <p className="text-slate-400 text-lg">From idea to shipped product in 4 simple steps</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center mx-auto">
                    <step.icon className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-xs font-black text-white">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">
              Loved by <span className="gradient-text">Thousands</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="glass rounded-2xl p-6 border border-white/10 card-hover">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm mb-6 leading-relaxed">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">
              Simple, <span className="gradient-text">Transparent</span> Pricing
            </h2>
            <p className="text-slate-400">No hidden fees. Pay only when projects succeed.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <div
                key={i}
                className={`rounded-2xl p-6 relative ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border-2 border-purple-500/50 glow-purple'
                    : 'glass border border-white/10'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-xs font-bold text-white">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-slate-500 text-sm mb-4">{plan.description}</p>
                <div className="mb-6">
                  {plan.price === 'Custom' ? (
                    <span className="text-4xl font-black text-white">Custom</span>
                  ) : (
                    <>
                      <span className="text-slate-400 text-lg">₹</span>
                      <span className="text-4xl font-black text-white">{plan.price}</span>
                      {plan.price !== '0' && <span className="text-slate-400 text-sm">/month</span>}
                    </>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`w-full block text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500'
                      : 'glass border border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-strong rounded-3xl p-12 border border-purple-500/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 pointer-events-none" />
            <Bot className="w-16 h-16 text-purple-400 mx-auto mb-6 animate-float" />
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Ready to Build Something
              <span className="gradient-text"> Amazing?</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of clients and freelancers who use AI Hire Hub to create exceptional products.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register?role=client"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:from-purple-500 hover:to-indigo-500 transition-all duration-200 shadow-2xl shadow-purple-500/30"
              >
                Start as Client <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/register?role=freelancer"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl glass border border-white/20 text-white font-semibold hover:bg-white/10 transition-all duration-200"
              >
                Join as Freelancer <Briefcase className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">AI Hire Hub</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-slate-500">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <div className="text-sm text-slate-600">
              © 2025 AI Hire Hub. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
