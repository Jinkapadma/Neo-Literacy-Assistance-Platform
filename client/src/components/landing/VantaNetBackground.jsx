import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';

export const VantaNetBackground = ({
  color = 0xffe600, // Vibrant clean yellow lines
  backgroundColor = 0x14051a, // Deep minimal backdrop
  points = 6.0, // Reduced from 12 to 6 for a much lighter, simpler network
  maxDistance = 18.0, // Crisp connections without clutter
  spacing = 22.0, // Spacious node distribution
  className = '',
}) => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    let effect = null;
    if (vantaRef.current) {
      try {
        effect = NET({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: color,
          backgroundColor: backgroundColor,
          points: points,
          maxDistance: maxDistance,
          spacing: spacing,
          showDots: true,
        });
        setVantaEffect(effect);
      } catch (err) {
        console.warn('Vanta.NET initialization error:', err);
      }
    }

    return () => {
      if (effect) {
        try {
          effect.destroy();
        } catch (e) {
          // ignore cleanup errors
        }
      }
    };
  }, [color, backgroundColor, points, maxDistance, spacing]);

  return (
    <div
      ref={vantaRef}
      className={`absolute inset-0 w-full h-full pointer-events-auto ${className}`}
    />
  );
};

export default VantaNetBackground;
