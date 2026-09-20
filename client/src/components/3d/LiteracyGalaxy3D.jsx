import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const LiteracyGalaxy3D = ({ className = '' }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Particle Sphere / Knowledge Graph Galaxy
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    const colorPalette = [
      new THREE.Color('#6366f1'), // Indigo
      new THREE.Color('#818cf8'), // Light Indigo
      new THREE.Color('#a855f7'), // Purple
      new THREE.Color('#ec4899'), // Pink
      new THREE.Color('#38bdf8'), // Sky
      new THREE.Color('#f59e0b'), // Amber
    ];

    for (let i = 0; i < particleCount; i++) {
      const radius = 18 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      scales[i] = Math.random() * 2 + 1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom circular particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(255,255,255,0.8)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const particleTexture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // 3D Floating Rings (Holographic Orbital Knowledge Rings)
    const ringGroup = new THREE.Group();

    const createGlowRing = (radius, tube, colorHex, rotX, rotY) => {
      const ringGeo = new THREE.TorusGeometry(radius, tube, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.25,
        wireframe: true,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = rotX;
      ringMesh.rotation.y = rotY;
      return ringMesh;
    };

    const ring1 = createGlowRing(16, 0.15, 0x6366f1, Math.PI / 4, 0);
    const ring2 = createGlowRing(22, 0.1, 0xa855f7, -Math.PI / 3, Math.PI / 6);
    const ring3 = createGlowRing(26, 0.08, 0x38bdf8, Math.PI / 6, -Math.PI / 4);

    ringGroup.add(ring1);
    ringGroup.add(ring2);
    ringGroup.add(ring3);
    scene.add(ringGroup);

    // Floating 3D geometric nodes (Icosahedron & Dodecahedron)
    const nodeGeo1 = new THREE.IcosahedronGeometry(1.8, 0);
    const nodeMat1 = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const node1 = new THREE.Mesh(nodeGeo1, nodeMat1);
    node1.position.set(-14, 8, -5);
    scene.add(node1);

    const nodeGeo2 = new THREE.DodecahedronGeometry(2.2, 0);
    const nodeMat2 = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const node2 = new THREE.Mesh(nodeGeo2, nodeMat2);
    node2.position.set(16, -6, -8);
    scene.add(node2);

    // Mouse interactive parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = event => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (event.clientX - windowHalfX) / 100;
      mouseY = (event.clientY - windowHalfY) / 100;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth camera parallax
      targetX = mouseX * 0.5;
      targetY = mouseY * 0.5;
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (-targetY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      // Rotate galaxy and rings
      particleSystem.rotation.y = elapsedTime * 0.05;
      particleSystem.rotation.x = Math.sin(elapsedTime * 0.03) * 0.1;

      ringGroup.rotation.y = elapsedTime * 0.08;
      ringGroup.rotation.z = Math.cos(elapsedTime * 0.05) * 0.15;

      node1.rotation.x = elapsedTime * 0.3;
      node1.rotation.y = elapsedTime * 0.4;
      node1.position.y = 8 + Math.sin(elapsedTime * 0.8) * 1.5;

      node2.rotation.x = -elapsedTime * 0.25;
      node2.rotation.y = -elapsedTime * 0.35;
      node2.position.y = -6 + Math.cos(elapsedTime * 0.7) * 1.5;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className={`absolute inset-0 pointer-events-none ${className}`} />;
};
