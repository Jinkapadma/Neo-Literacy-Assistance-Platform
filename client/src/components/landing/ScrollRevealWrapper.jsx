import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export const ScrollRevealWrapper = ({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  yOffset = 30,
  threshold = 0.15,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold,
  });

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: yOffset }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: yOffset }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
