import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ShoppingBag, QrCode, Check, RotateCw } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

export function ProductViewer3D({ onAddToCart }) {
  const containerRef = useRef(null);
  const { lang } = useLanguage();
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState('#222831'); // Titanium Black
  const [isRotating, setIsRotating] = useState(true);
  const [justAdded, setJustAdded] = useState(false);

  const finishes = [
    { name: 'Natural Titanium', hex: '#393e46', ring: '#94a3b8' },
    { name: 'Emerald Forest', hex: '#064e3b', ring: '#00e599' },
    { name: 'Deep Nebula', hex: '#312e81', ring: '#a78bfa' },
    { name: 'Desert Gold', hex: '#78350f', ring: '#fbbf24' }
  ];

  const caseMaterialRef = useRef(null);
  const caseGroupRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 460;
    const height = container.clientHeight || 420;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    camera.position.set(0, 0, 5.0);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3. Studio Lighting (Clean, soft, Apple-like)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00e599, 1.0);
    rimLight.position.set(-3, -2, -2);
    scene.add(rimLight);

    // 4. Create 3D Phone Case Geometry
    const caseGroup = new THREE.Group();
    caseGroup.rotation.y = 0.2; // slight initial 3D hero angle
    scene.add(caseGroup);
    caseGroupRef.current = caseGroup;

    // Case Body (Rounded Box)
    const bodyGeo = new THREE.BoxGeometry(1.9, 3.7, 0.26);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(selectedColor),
      roughness: 0.25,
      metalness: 0.8
    });
    caseMaterialRef.current = bodyMat;

    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    caseGroup.add(bodyMesh);

    // Corner Bumpers
    const bumperMat = new THREE.MeshStandardMaterial({ color: 0x090d14, roughness: 0.4, metalness: 0.6 });
    const cornerGeo = new THREE.SphereGeometry(0.16, 16, 16);
    const cornerPositions = [
      [-0.92, 1.8, 0], [0.92, 1.8, 0],
      [-0.92, -1.8, 0], [0.92, -1.8, 0]
    ];
    cornerPositions.forEach(([cx, cy, cz]) => {
      const cornerMesh = new THREE.Mesh(cornerGeo, bumperMat);
      cornerMesh.position.set(cx, cy, cz);
      caseGroup.add(cornerMesh);
    });

    // MagSafe Magnetic Ring
    const ringGeo = new THREE.RingGeometry(0.52, 0.62, 48);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.95,
      side: THREE.DoubleSide
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.set(0, 0.1, 0.14);
    caseGroup.add(ringMesh);

    // Camera Island (Top Left)
    const camIslandGeo = new THREE.BoxGeometry(0.75, 0.75, 0.12);
    const camIslandMat = new THREE.MeshStandardMaterial({ color: 0x0a0f16, roughness: 0.1, metalness: 0.9 });
    const camIsland = new THREE.Mesh(camIslandGeo, camIslandMat);
    camIsland.position.set(-0.45, 1.25, 0.16);
    caseGroup.add(camIsland);

    // Camera Lenses
    const lensGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.06, 24);
    const lensMat = new THREE.MeshStandardMaterial({ color: 0x05070a, metalness: 0.95, roughness: 0.05 });
    const lensPositions = [[-0.6, 1.4, 0.23], [-0.3, 1.4, 0.23], [-0.45, 1.1, 0.23]];
    lensPositions.forEach(([lx, ly, lz]) => {
      const lensMesh = new THREE.Mesh(lensGeo, lensMat);
      lensMesh.rotation.x = Math.PI / 2;
      lensMesh.position.set(lx, ly, lz);
      caseGroup.add(lensMesh);
    });

    // 5. Mouse & Touch Drag Controls (360 Orbit)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      setIsRotating(false);
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      caseGroup.rotation.y += deltaX * 0.01;
      caseGroup.rotation.x += deltaY * 0.01;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        setIsRotating(false);
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      caseGroup.rotation.y += deltaX * 0.01;
      caseGroup.rotation.x += deltaY * 0.01;

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    // 6. Animation Loop
    let animationId;
    let lastTime = performance.now();
    const startTime = performance.now();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = Math.min((now - lastTime) * 0.001, 0.1);
      lastTime = now;
      const elapsed = (now - startTime) * 0.001;

      // Smooth floating bobbing motion
      caseGroup.position.y = Math.sin(elapsed * 1.5) * 0.08;

      if (isRotating && !isDragging) {
        caseGroup.rotation.y += 0.5 * delta;
        caseGroup.rotation.x = Math.sin(elapsed * 0.6) * 0.08;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      bodyGeo.dispose();
      bodyMat.dispose();
      cornerGeo.dispose();
      bumperMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      camIslandGeo.dispose();
      camIslandMat.dispose();
      lensGeo.dispose();
      lensMat.dispose();
      renderer.dispose();
    };
  }, []);

  // Update 3D case material color on finish change
  useEffect(() => {
    if (caseMaterialRef.current) {
      caseMaterialRef.current.color.set(selectedColor);
    }
  }, [selectedColor]);

  const handleAddToCart = () => {
    const selectedFinishName = finishes.find(f => f.hex === selectedColor)?.name || 'Natural Titanium';
    const productItem = {
      id: 999,
      name: `AeroShield MagSafe Titanium (${selectedFinishName})`,
      price: 28.00,
      priceKhr: 114800,
      imageUrl: 'https://images.unsplash.com/photo-1535157412991-2ef801c1748b?auto=format&fit=crop&w=800&q=80',
      brand: 'APPLE',
      deviceModel: 'iPhone 15/16 Pro Max'
    };

    if (onAddToCart) {
      onAddToCart(productItem);
    } else {
      addToCart(productItem, 1);
    }

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const selectedFinish = finishes.find(f => f.hex === selectedColor) || finishes[0];

  return (
    <div style={{
      backgroundColor: '#090d14',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '24px',
      padding: '48px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '50px',
        alignItems: 'center'
      }}>

        {/* Left: Clean Studio 3D Canvas */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* Pause / Resume Rotation */}
          <button
            onClick={() => setIsRotating(!isRotating)}
            style={{
              position: 'absolute',
              top: '0',
              right: '0',
              zIndex: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#cbd5e1',
              borderRadius: '999px',
              padding: '6px 14px',
              fontSize: '0.75rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <RotateCw size={12} className={isRotating ? 'animate-spin' : ''} />
            <span>{isRotating ? 'Auto Rotate' : 'Paused'}</span>
          </button>

          {/* 3D Mount Container */}
          <div
            ref={containerRef}
            style={{
              width: '100%',
              height: '380px',
              cursor: 'grab',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Drag with mouse to rotate 360°"
          />

          <div style={{
            fontSize: '0.78rem',
            color: '#71717a',
            textAlign: 'center',
            marginTop: '8px',
            letterSpacing: '0.04em'
          }}>
            {lang === 'km' ? 'អូស Mouse ដើម្បីបង្វិល ៣៦០ ដឺក្រេ' : 'Drag mouse to inspect 360°'}
          </div>
        </div>

        {/* Right: Clean Apple-Style Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#00e599', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
              TITANIUM ARMOR SERIES • 2026
            </div>

            <h3 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, color: '#ffffff', lineHeight: 1.15 }}>
              AeroShield MagSafe Titanium
            </h3>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '10px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>$28.00</span>
              <span style={{ fontSize: '1.05rem', color: '#71717a' }}>• ៛114,800 KHR</span>
              <span style={{
                backgroundColor: 'rgba(0, 229, 153, 0.1)',
                color: '#00e599',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '6px'
              }}>
                In Stock
              </span>
            </div>
          </div>

          <p style={{ fontSize: '0.92rem', color: '#a1a1aa', lineHeight: 1.6 }}>
            {lang === 'km'
              ? 'ស្រោមការពារកម្រិតយោធាការពារធ្លាក់ 13ft បំពាក់មេដែក N52 MagSafe ខ្លាំងក្លា និងគែមការពារកាមេរ៉ាធ្វើពីលោហៈទីតានីញ៉ូម។'
              : 'Precision CNC machined titanium bezel with 13ft drop defense and 38 ultra-strong N52 neodymium MagSafe magnets.'}
          </p>

          {/* Minimalist Color Swatches */}
          <div>
            <div style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '10px' }}>
              Finish: <strong style={{ color: '#ffffff' }}>{selectedFinish.name}</strong>
            </div>
            <div style={{ display: 'flex', gap: '14px' }}>
              {finishes.map((f) => {
                const isSelected = selectedColor === f.hex;
                return (
                  <button
                    key={f.hex}
                    onClick={() => setSelectedColor(f.hex)}
                    title={f.name}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: f.hex,
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      outline: isSelected ? '2px solid #00e599' : 'none',
                      outlineOffset: '3px',
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease',
                      transform: isSelected ? 'scale(1.15)' : 'scale(1)'
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Clean Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingTop: '8px' }}>
            <button
              onClick={handleAddToCart}
              style={{
                backgroundColor: '#ffffff',
                color: '#000000',
                border: 'none',
                padding: '14px 30px',
                borderRadius: '999px',
                fontSize: '0.92rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(255, 255, 255, 0.15)',
                transition: 'transform 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {justAdded ? (
                <>
                  <Check size={18} color="#008060" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  <span>Add to Cart • $28.00</span>
                </>
              )}
            </button>

            <button
              onClick={handleAddToCart}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                padding: '14px 22px',
                borderRadius: '999px',
                fontSize: '0.9rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <QrCode size={18} color="#00e599" />
              <span>Bakong KHQR</span>
            </button>
          </div>

          {/* Clean Specs Row */}
          <div style={{
            fontSize: '0.78rem',
            color: '#71717a',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '14px',
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <div>✓ 13ft Drop Defense</div>
            <div>✓ N52 MagSafe Matrix</div>
            <div>✓ Free Delivery Phnom Penh</div>
          </div>

        </div>

      </div>
    </div>
  );
}
