import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// 1. Procedural 3D Logo Mesh ("N" Monogram + Crystal Book Motif)
const Neo3DLogo = ({ mousePosition, isMobile }) => {
  const groupRef = useRef();

  // Create geometric 3D stylized "N" logo shape with extrude geometry
  const logoGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    // Stylized modern bold "N" letter path
    shape.moveTo(-1.2, -1.5);
    shape.lineTo(-0.6, -1.5);
    shape.lineTo(-0.6, 0.4);
    shape.lineTo(0.6, -1.5);
    shape.lineTo(1.2, -1.5);
    shape.lineTo(1.2, 1.5);
    shape.lineTo(0.6, 1.5);
    shape.lineTo(0.6, -0.4);
    shape.lineTo(-0.6, 1.5);
    shape.lineTo(-1.2, 1.5);
    shape.closePath();

    const extrudeSettings = {
      steps: 1,
      depth: 0.5,
      bevelEnabled: true,
      bevelThickness: 0.15,
      bevelSize: 0.1,
      bevelSegments: 4,
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  // Open Book Wings Base Geometry
  const bookBaseGeometry = useMemo(() => {
    return new THREE.TorusGeometry(2.4, 0.08, 16, 64, Math.PI * 1.5);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Idle rotation
    groupRef.current.rotation.y += delta * 0.4;
    groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.6) * 0.1;

    // Desktop Mouse Parallax
    if (!isMobile && mousePosition) {
      const targetX = mousePosition.x * 0.3;
      const targetY = mousePosition.y * 0.3;
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.05);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.05);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Central 3D Logo Mesh with Iridescent Material */}
      <mesh geometry={logoGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#6366f1"
          emissive="#4338ca"
          emissiveIntensity={0.3}
          roughness={0.2}
          metalness={0.8}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
          reflectivity={0.9}
        />
      </mesh>

      {/* Floating Holographic Ring around Logo */}
      <mesh geometry={bookBaseGeometry} rotation={[Math.PI / 3, 0, 0]}>
        <meshStandardMaterial
          color="#a855f7"
          emissive="#9333ea"
          emissiveIntensity={0.6}
          wireframe
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Outer Floating Knowledge Ring */}
      <mesh rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
        <torusGeometry args={[3.2, 0.04, 16, 64]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.5}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
};

// 2. Ambient Floating Low-Poly Geometric Background Elements
const AmbientFloatingShapes = () => {
  const shapesRef = useRef();

  const particleData = useMemo(() => {
    const items = [];
    const count = 18; // Keep count low for high performance
    for (let i = 0; i < count; i++) {
      items.push({
        position: [
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 8 - 3,
        ],
        scale: Math.random() * 0.4 + 0.2,
        speed: Math.random() * 0.3 + 0.1,
        color: ['#818cf8', '#a855f7', '#38bdf8', '#fbbf24'][Math.floor(Math.random() * 4)],
      });
    }
    return items;
  }, []);

  useFrame((state, delta) => {
    if (!shapesRef.current) return;
    shapesRef.current.rotation.y -= delta * 0.05;
  });

  return (
    <group ref={shapesRef}>
      {particleData.map((data, index) => (
        <Float
          key={index}
          speed={data.speed * 2}
          rotationIntensity={1}
          floatIntensity={1.5}
          position={data.position}
        >
          <mesh scale={data.scale}>
            {index % 3 === 0 ? (
              <octahedronGeometry args={[1, 0]} />
            ) : index % 3 === 1 ? (
              <dodecahedronGeometry args={[0.8, 0]} />
            ) : (
              <tetrahedronGeometry args={[0.9, 0]} />
            )}
            <meshStandardMaterial
              color={data.color}
              wireframe={index % 2 === 0}
              transparent
              opacity={0.45}
              roughness={0.4}
              metalness={0.6}
            />
          </mesh>
        </Float>
      ))}

      {/* Sparkles Particle Layer */}
      <Sparkles count={35} scale={[14, 10, 6]} size={2} speed={0.4} opacity={0.6} color="#c084fc" />
    </group>
  );
};

// 3. Fallback Static 2D Hero (For reduced motion / low-end devices)
export const Static2DHeroFallback = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
    <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-brand-600/30 via-purple-600/20 to-sky-500/20 blur-3xl" />
    <div className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-3xl border-2 border-brand-500/30 bg-slate-900/60 backdrop-blur-xl flex items-center justify-center shadow-2xl">
      <span className="text-7xl sm:text-8xl font-black bg-gradient-to-tr from-brand-400 via-indigo-200 to-sky-300 bg-clip-text text-transparent">
        N
      </span>
    </div>
  </div>
);

// 4. Main Hero3DScene Component
export default function Hero3DScene({ isVisible = true }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleMotionChange = e => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);

    // Mobile / Touch check
    const checkTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsMobile(checkTouch || window.innerWidth < 768);

    // Low end device heuristic (concurrency < 4 or low memory)
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    const isLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
    if (hardwareConcurrency < 4 || isLowMemory) {
      setIsLowEndDevice(true);
    }

    // Mouse movement listener on desktop
    const handleMouseMove = e => {
      if (checkTouch) return;
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // If user prefers reduced motion or device is low capability, render static 2D hero
  if (prefersReducedMotion || isLowEndDevice) {
    return <Static2DHeroFallback />;
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 45 }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        frameloop={isVisible ? 'always' : 'demand'}
        className="w-full h-full"
      >
        {/* Ambient & Directional Brand Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-5, -5, -3]} intensity={0.8} color="#a855f7" />
        <pointLight position={[5, 2, 4]} intensity={0.9} color="#38bdf8" />

        {/* 3D Focal Model + Ambient Floating Particles */}
        <Neo3DLogo mousePosition={mousePosition} isMobile={isMobile} />
        <AmbientFloatingShapes />
      </Canvas>
    </div>
  );
}
