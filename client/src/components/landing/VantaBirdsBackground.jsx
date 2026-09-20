import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import BIRDS from 'vanta/dist/vanta.birds.min';

export const VantaBirdsBackground = ({
  backgroundColor = 0x407c93,
  color1 = 0x001da2,
  color2 = 0xf7ad00,
  quantity = 4.0,
  birdSize = 1.2,
  wingSpan = 24.0,
  speedLimit = 5.0,
  separation = 40.0,
  alignment = 40.0,
  cohesion = 40.0,
  className = '',
}) => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    let effect = null;
    if (vantaRef.current) {
      try {
        effect = BIRDS({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          backgroundColor: backgroundColor,
          color1: color1,
          color2: color2,
          quantity: quantity,
          birdSize: birdSize,
          wingSpan: wingSpan,
          speedLimit: speedLimit,
          separation: separation,
          alignment: alignment,
          cohesion: cohesion,
        });
        setVantaEffect(effect);
      } catch (err) {
        console.warn('Vanta.BIRDS initialization error:', err);
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
  }, [
    backgroundColor,
    color1,
    color2,
    quantity,
    birdSize,
    wingSpan,
    speedLimit,
    separation,
    alignment,
    cohesion,
  ]);

  return (
    <div
      ref={vantaRef}
      className={`absolute inset-0 w-full h-full pointer-events-auto ${className}`}
    />
  );
};

export default VantaBirdsBackground;
