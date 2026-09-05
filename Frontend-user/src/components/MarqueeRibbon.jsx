import React from 'react';
import { Shield, Sparkles, QrCode, Zap, Award, CheckCircle } from 'lucide-react';

export function MarqueeRibbon() {
  const items = [
    { text: 'TITANIUM MAGSAFE ARMOR', icon: Shield, color: '#00e599' },
    { text: 'NBC BAKONG KHQR 0% FEE', icon: QrCode, color: '#38bdf8' },
    { text: '13FT MILITARY DROP TESTED', icon: Award, color: '#00e599' },
    { text: 'FREE PHNOM PENH DELIVERY >$25', icon: Zap, color: '#fbbf24' },
    { text: '7-DAY REPLACEMENT WARRANTY', icon: CheckCircle, color: '#a78bfa' },
    { text: 'PRECISION CNC TACTILE BUTTONS', icon: Sparkles, color: '#00e599' },
  ];

  return (
    <div style={{
      width: '100%',
      overflow: 'hidden',
      backgroundColor: '#030508',
      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
      borderBottom: '1px solid rgba(0, 229, 153, 0.15)',
      padding: '12px 0',
      position: 'relative'
    }}>
      {/* Left/Right Edge Blur Vignettes */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '120px',
        height: '100%',
        background: 'linear-gradient(to right, #030508 20%, transparent)',
        zIndex: 2,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '120px',
        height: '100%',
        background: 'linear-gradient(to left, #030508 20%, transparent)',
        zIndex: 2,
        pointerEvents: 'none'
      }} />

      <div className="ambient-marquee-track">
        {[...items, ...items, ...items].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0 24px',
                whiteSpace: 'nowrap',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#cbd5e1',
                textTransform: 'uppercase'
              }}
            >
              <Icon size={14} color={item.color} />
              <span>{item.text}</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.2)', marginLeft: '16px' }}>●</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
