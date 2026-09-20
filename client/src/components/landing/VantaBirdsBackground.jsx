import React, { useEffect, useRef } from 'react';

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
  const effectRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const loadScript = src => {
      return new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
          if (existing.getAttribute('data-loaded') === 'true' || (window.VANTA && window.VANTA.BIRDS)) {
            resolve();
          } else {
            existing.addEventListener('load', () => resolve());
            existing.addEventListener('error', e => reject(e));
          }
          return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => {
          script.setAttribute('data-loaded', 'true');
          resolve();
        };
        script.onerror = e => reject(e);
        document.head.appendChild(script);
      });
    };

    const initVanta = async () => {
      try {
        // 1. Ensure Three.js r134 is loaded for Vanta.js compatibility
        if (!window.THREE || typeof window.THREE.WebGLRenderer === 'undefined') {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js');
        }

        // 2. Ensure Vanta Birds script is loaded
        if (!window.VANTA || !window.VANTA.BIRDS) {
          await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.birds.min.js');
        }

        if (!isMounted || !vantaRef.current || !window.VANTA || !window.VANTA.BIRDS) return;

        // Cleanup existing effect if any
        if (effectRef.current) {
          effectRef.current.destroy();
        }

        // 3. Initialize VANTA.BIRDS
        effectRef.current = window.VANTA.BIRDS({
          el: vantaRef.current,
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
      } catch (err) {
        console.warn('Vanta Birds init warning:', err);
      }
    };

    initVanta();

    return () => {
      isMounted = false;
      if (effectRef.current) {
        try {
          effectRef.current.destroy();
          effectRef.current = null;
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
      style={{ width: '100%', height: '100%', minHeight: '100%' }}
    />
  );
};

export default VantaBirdsBackground;
