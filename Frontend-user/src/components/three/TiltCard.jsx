import React, { useRef, useState } from 'react';

export function TiltCard({ children, style = {}, className = '', maxTilt = 10, glare = true, onClick }) {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState('');
  const [glareStyle, setGlareStyle] = useState({ opacity: 0, x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px) scale3d(1.02, 1.02, 1.02)`);
    setGlareStyle({
      opacity: 0.15,
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100
    });
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)');
    setGlareStyle({ opacity: 0, x: 50, y: 50 });
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        transform: transformStyle,
        transition: transformStyle ? 'transform 0.1s ease-out' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d',
        position: 'relative',
        ...style
      }}
    >
      {children}

      {/* Dynamic Specular 3D Glare Surface */}
      {glare && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            borderRadius: 'inherit',
            background: `radial-gradient(circle at ${glareStyle.x}% ${glareStyle.y}%, rgba(255, 255, 255, 0.35) 0%, transparent 60%)`,
            opacity: glareStyle.opacity,
            transition: 'opacity 0.2s ease',
            zIndex: 15
          }}
        />
      )}
    </div>
  );
}
