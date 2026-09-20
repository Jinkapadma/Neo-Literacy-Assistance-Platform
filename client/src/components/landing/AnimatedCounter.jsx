import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

export const AnimatedCounter = ({
  value,
  prefix = '',
  suffix = '',
  duration = 2000,
  className = '',
}) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const end = typeof value === 'number' ? value : parseInt(value, 10) || 0;
    if (start === end) return;

    const startTime = performance.now();

    const updateCounter = currentTime => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeOut * (end - start) + start);

      setCount(currentVal);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setCount(end);
      }
    };

    const frameId = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(frameId);
  }, [inView, value, duration]);

  const formattedValue = count.toLocaleString();

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
};
