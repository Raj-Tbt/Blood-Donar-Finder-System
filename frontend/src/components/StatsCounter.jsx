/**
 * StatsCounter Component
 *
 * Animated counter that increments from zero to the target value
 * when the element scrolls into view. Uses IntersectionObserver
 * for visibility detection and requestAnimationFrame for smooth animation.
 *
 * @param {Object} props
 * @param {number} props.value - Target counter value.
 * @param {string} props.label - Description text below the counter.
 * @param {React.ReactNode} props.icon - Icon element displayed above the counter.
 * @param {string} [props.suffix=''] - Optional suffix appended to the count (e.g., '+').
 */

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function StatsCounter({ value, label, icon, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCount();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  /** Animate the counter from 0 to the target value over 2 seconds */
  function animateCount() {
    const duration = 2000;
    const target = parseInt(value) || 0;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      /* Ease-out cubic for natural deceleration */
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className="inline-flex items-center justify-center w-14 h-14 bg-blood-50 dark:bg-blood-900/20 rounded-2xl mb-3 text-blood-500 text-2xl">
        {icon}
      </div>
      <div className="font-display text-4xl font-bold text-gray-900 dark:text-white">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</div>
    </motion.div>
  );
}
