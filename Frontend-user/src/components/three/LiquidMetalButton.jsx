import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, ArrowRight } from 'lucide-react';

export function LiquidMetalButton({ 
  label = 'Liquid Metal Button', 
  onClick, 
  variant = 'chrome', // 'chrome' | 'emerald' | 'violet'
  style = {} 
}) {
  const canvasRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const hoveredRef = useRef(false);

  const colors = {
    chrome: { a: '#12161f', b: '#d4d8e0' },
    emerald: { a: '#05241b', b: '#00e599' },
    violet: { a: '#1a0b2e', b: '#c084fc' }
  };

  const activeColor = colors[variant] || colors.chrome;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.clientWidth || 240;
    const height = canvas.clientHeight || 56;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance' 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Plane geometry with custom liquid fragment shader
    const geometry = new THREE.PlaneGeometry(2, 2);
    
    const material = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uHover;
        uniform vec3 uColorA;
        uniform vec3 uColorB;

        void main() {
          vec2 p = vUv * 2.0 - 1.0;
          p.x *= 2.5; // aspect ratio adjustment

          // Liquid wave distortion
          float d = length(p - uMouse);
          float ripple = sin(d * 14.0 - uTime * 3.5) * exp(-d * 2.0) * (0.2 + uHover * 0.4);
          
          float wave = sin(p.x * 3.0 + uTime * 1.5) * cos(p.y * 3.0 + uTime * 1.2) * 0.25;
          float pattern = sin((p.x + p.y + wave + ripple) * 6.0);

          // Metallic chrome gradient
          vec3 col = mix(uColorA, uColorB, smoothstep(-0.6, 0.8, pattern));
          
          // Glossy highlight edge
          float edge = 1.0 - smoothstep(0.0, 0.4, abs(pattern));
          col += vec3(edge * 0.35);

          gl_FragColor = vec4(col, 1.0);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uHover: { value: 0 },
        uColorA: { value: new THREE.Color(activeColor.a) },
        uColorB: { value: new THREE.Color(activeColor.b) }
      }
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationId;
    const startTime = performance.now();

    const render = () => {
      animationId = requestAnimationFrame(render);
      const elapsed = (performance.now() - startTime) * 0.001;
      
      material.uniforms.uTime.value = elapsed;
      material.uniforms.uHover.value += ((hoveredRef.current ? 1.0 : 0.0) - material.uniforms.uHover.value) * 0.1;
      
      renderer.render(scene, camera);
    };

    render();

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      material.uniforms.uMouse.value.set(x, y);
    };

    canvas.addEventListener('pointermove', handlePointerMove);

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('pointermove', handlePointerMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [variant]);

  return (
    <div
      onMouseEnter={() => { setHovered(true); hoveredRef.current = true; }}
      onMouseLeave={() => { setHovered(false); hoveredRef.current = false; }}
      onClick={onClick}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2px',
        borderRadius: '999px',
        cursor: 'pointer',
        overflow: 'hidden',
        boxShadow: hovered ? '0 10px 30px rgba(0, 229, 153, 0.3)' : '0 4px 16px rgba(0, 0, 0, 0.5)',
        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease',
        transform: hovered ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
        minWidth: '220px',
        height: '52px',
        ...style
      }}
    >
      {/* 3D WebGL Canvas Surface */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          borderRadius: '999px',
          display: 'block'
        }}
      />

      {/* Button Text Layer with Glass Overlay */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#ffffff',
        fontWeight: 700,
        fontSize: '0.92rem',
        textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
        userSelect: 'none',
        padding: '0 24px'
      }}>
        <Sparkles size={16} color="#00e599" />
        <span>{label}</span>
        <ArrowRight size={15} style={{ transform: hovered ? 'translateX(3px)' : 'translateX(0)', transition: 'transform 0.2s ease' }} />
      </div>
    </div>
  );
}
