'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface AnimatedCounterProps {
  value: string;
  className?: string;
}

export function AnimatedCounter({ value, className = '' }: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [displayed, setDisplayed] = useState('0');

  // Extract numeric part and suffix
  const numMatch = value.match(/[\d.]+/);
  const num = numMatch ? parseFloat(numMatch[0]) : 0;
  const prefix = value.replace(/[\d.]+.*/, '');
  const suffix = value.replace(/^[^\d]*[\d.]+/, '');

  useEffect(() => {
    if (!isInView || num === 0) {
      setDisplayed(value);
      return;
    }

    let start = 0;
    const duration = 1800;
    const steps = 60;
    const increment = num / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= num) {
        current = num;
        clearInterval(interval);
      }
      const formatted = Number.isInteger(num)
        ? Math.round(current).toString()
        : current.toFixed(1);
      setDisplayed(`${prefix}${formatted}${suffix}`);
    }, duration / steps);

    return () => clearInterval(interval);
  }, [isInView, num, prefix, suffix, value]);

  return (
    <div ref={ref} className={className}>
      {displayed}
    </div>
  );
}
