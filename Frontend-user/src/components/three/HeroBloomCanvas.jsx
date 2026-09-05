import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { LiquidMetalShader, ParticleBloomShader } from './threeShaders';

export function HeroBloomCanvas({ 
  distortion = 0.22, 
  particleCount = 2500, 
  metalColor = '#00e599',
  showTorus = false
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 9);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3. Central Liquid Metal Geometry (Torus Knot) - ONLY IF showTorus is TRUE
    let torusGeo = null;
    let metalMat = null;
    let torusMesh = null;

    if (showTorus) {
      torusGeo = new THREE.TorusKnotGeometry(1.6, 0.48, 128, 32);
      metalMat = new THREE.ShaderMaterial({
        vertexShader: LiquidMetalShader.vertexShader,
        fragmentShader: LiquidMetalShader.fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uDistortion: { value: distortion },
          uRoughness: { value: 0.15 },
          uColorA: { value: new THREE.Color('#0e141a') },
          uColorB: { value: new THREE.Color(metalColor) }
        },
        wireframe: false
      });
      torusMesh = new THREE.Mesh(torusGeo, metalMat);
      scene.add(torusMesh);
    }

    // 4. Semantic Bloom Particle Field (Subtle Stardust)
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    const pScale = new Float32Array(particleCount);
    const pRandom = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const r = 3.5 + Math.random() * 5.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPos[i * 3 + 2] = r * Math.cos(phi);

      pScale[i] = 0.4 + Math.random() * 1.0;
      pRandom[i * 3] = Math.random();
      pRandom[i * 3 + 1] = Math.random();
      pRandom[i * 3 + 2] = Math.random();
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('aScale', new THREE.BufferAttribute(pScale, 1));
    pGeo.setAttribute('aRandom', new THREE.BufferAttribute(pRandom, 3));

    const pMat = new THREE.ShaderMaterial({
      vertexShader: ParticleBloomShader.vertexShader,
      fragmentShader: ParticleBloomShader.fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const pSystem = new THREE.Points(pGeo, pMat);
    scene.add(pSystem);

    // 5. Mouse Interaction & Parallax
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = x;
      mouse.targetY = y;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 6. Animation Loop
    let animationFrameId;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Smooth mouse interpolation (lerp)
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Update shader uniforms if torus exists
      if (metalMat) {
        metalMat.uniforms.uTime.value = elapsedTime;
        metalMat.uniforms.uDistortion.value = distortion;
        metalMat.uniforms.uColorB.value.set(metalColor);
      }

      pMat.uniforms.uTime.value = elapsedTime;
      pMat.uniforms.uMouse.value.set(mouse.x, mouse.y);

      // Rotate central mesh if present
      if (torusMesh) {
        torusMesh.rotation.x = elapsedTime * 0.35 + mouse.y * 0.5;
        torusMesh.rotation.y = elapsedTime * 0.45 + mouse.x * 0.8;
      }

      // Rotate particle field slowly in space
      pSystem.rotation.y = -elapsedTime * 0.04;
      pSystem.rotation.x = Math.sin(elapsedTime * 0.03) * 0.1;

      // Subtle camera parallax
      camera.position.x = mouse.x * 0.5;
      camera.position.y = mouse.y * 0.5;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // 7. Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // 8. Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      if (torusGeo) torusGeo.dispose();
      if (metalMat) metalMat.dispose();
      pGeo.dispose();
      pMat.dispose();
      renderer.dispose();
    };
  }, [distortion, particleCount, metalColor, showTorus]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none'
      }}
    />
  );
}
