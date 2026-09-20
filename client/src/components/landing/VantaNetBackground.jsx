import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';

export const VantaNetBackground = ({
  color = 0xffef3f,
  backgroundColor = 0x34153c,
  points = 12.0,
  maxDistance = 22.0,
  spacing = 16.0,
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
