import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';

export function ProductCard({ product, onQuickView }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { lang } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  const priceUsd = Number(product.price || 0);
  const compareUsd = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const isDiscounted = compareUsd && compareUsd > priceUsd;
  const discountPercent = product.discountPercent || (
    isDiscounted ? Math.round(((compareUsd - priceUsd) / compareUsd) * 100) : null
  );

  const isWished = isInWishlist(product.id);
  const currentImage = (isHovered && product.hoverImageUrl) ? product.hoverImageUrl : product.imageUrl;

  const handleToggleWish = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <motion.div
      className="zando-clean-card group"
      onClick={() => onQuickView && onQuickView(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      style={{
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        userSelect: 'none'
      }}
    >
      {/* 1. Tall Portrait Image Stage (Clean, No border) */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '3 / 4.4',
          backgroundColor: '#f8fafc',
          overflow: 'hidden',
          borderRadius: '2px'
        }}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'opacity 0.25s ease'
          }}
        />
        {product.hoverImageUrl && product.hoverImageUrl !== product.imageUrl && (
          <img
            src={product.hoverImageUrl}
            alt={`${product.name} alternate`}
            loading="lazy"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.25s ease',
              pointerEvents: 'none'
            }}
          />
        )}

        {/* Top-Left: New In Badge */}
        {product.badge && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              zIndex: 4,
              backgroundColor: 'rgba(26, 26, 26, 0.92)',
              color: '#ffffff',
              padding: '2px 7px',
              fontSize: '0.68rem',
              fontWeight: 700,
              borderRadius: '2px',
              letterSpacing: '0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
            }}
          >
            <span>⭐</span>
            <span>New In</span>
          </motion.div>
        )}

        {/* Bottom-Left: Bright Red Discount Tag (-10%, -25%) */}
        {discountPercent && discountPercent > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              zIndex: 4,
              backgroundColor: '#da2a2e',
              color: '#ffffff',
              padding: '2px 8px',
              fontSize: '0.72rem',
              fontWeight: 700,
              borderRadius: '0 2px 0 0'
            }}
          >
            -{discountPercent}%
          </motion.div>
        )}
      </div>

      {/* 2. Product Details Block */}
      <div style={{ padding: '8px 0 4px 0', display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {/* Row 1: Brand on Left, Heart Icon on Right */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '#1f2937'
          }}>
            {product.brand || 'ZANDO'}
          </span>
          <motion.button
            onClick={handleToggleWish}
            aria-label="Add to wishlist"
            whileHover={{ scale: 1.25 }}
            whileTap={{ scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            style={{
              background: 'none',
              border: 'none',
              padding: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Heart
              size={17}
              color={isWished ? '#ef4444' : '#1f2937'}
              fill={isWished ? '#ef4444' : 'none'}
              strokeWidth={1.5}
            />
          </motion.button>
        </div>

        {/* Row 2: Product Name */}
        <h4 style={{
          fontSize: '0.82rem',
          fontWeight: 400,
          color: '#111827',
          margin: '2px 0 0 0',
          lineHeight: '1.3',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {lang === 'km' && product.name ? product.name : (product.nameEn || product.name)}
        </h4>

        {/* Row 3: Price (Red if on sale + strikethrough compare price) */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
          <span style={{
            fontSize: '0.92rem',
            fontWeight: 700,
            color: (discountPercent && discountPercent > 0) ? '#da2a2e' : '#111827'
          }}>
            ${priceUsd.toFixed(2)}
          </span>
          {compareUsd && compareUsd > priceUsd && (
            <span style={{
              fontSize: '0.78rem',
              color: '#9ca3af',
              textDecoration: 'line-through',
              fontWeight: 400
            }}>
              ${compareUsd.toFixed(2)}
            </span>
          )}
        </div>

        {/* Row 4: Color Swatches */}
        {product.colorDots && product.colorDots.length > 0 && (
          <div style={{ display: 'flex', gap: '5px', marginTop: '4px' }}>
            {product.colorDots.map((c, i) => (
              <motion.span
                key={i}
                whileHover={{ scale: 1.35 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '1px',
                  backgroundColor: c,
                  border: '1px solid #d1d5db',
                  display: 'inline-block',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
