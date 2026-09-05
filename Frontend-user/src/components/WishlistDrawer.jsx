import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export function WishlistDrawer({ onQuickView }) {
  const { wishlistItems, isWishlistOpen, setIsWishlistOpen, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart, formatPrice } = useCart();
  const { lang } = useLanguage();

  return (
    <AnimatePresence>
      {isWishlistOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 120,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            justifyContent: 'flex-end'
          }}
          onClick={() => setIsWishlistOpen(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '430px',
              height: '100%',
              backgroundColor: '#ffffff',
              color: '#111827',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.2)'
            }}
          >
        {/* Drawer Header */}
        <div style={{
          padding: '18px 20px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={20} color="#e11d48" fill="#e11d48" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              {lang === 'km' ? 'ទំនិញពេញចិត្ត' : 'Saved Wishlist'}
            </h2>
            <span style={{
              fontSize: '0.75rem',
              backgroundColor: '#f1f5f9',
              color: '#0f172a',
              padding: '2px 8px',
              borderRadius: '999px',
              fontWeight: 700
            }}>
              {wishlistItems.length}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {wishlistItems.length > 0 && (
              <button
                onClick={clearWishlist}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                {lang === 'km' ? 'លុបទាំងអស់' : 'Clear all'}
              </button>
            )}
            <button
              onClick={() => setIsWishlistOpen(false)}
              aria-label="Close wishlist drawer"
              style={{
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Wishlist Items List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {wishlistItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>❤️</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                {lang === 'km' ? 'គ្មានទំនិញពេញចិត្តនៅឡើយទេ' : 'Your wishlist is empty'}
              </h3>
              <p style={{ fontSize: '0.85rem', marginBottom: '20px', lineHeight: 1.5 }}>
                {lang === 'km' 
                  ? 'ចុចលើសញ្ញាបេះដូងលើម៉ូដសម្លៀកបំពាក់ដែលអ្នកស្រលាញ់ ដើម្បីរក្សាទុកនៅទីនេះ។' 
                  : 'Tap the heart icon on any fashion piece to save it for later.'}
              </p>
              <button
                onClick={() => setIsWishlistOpen(false)}
                style={{
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '10px 24px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                {lang === 'km' ? 'ស្វែងរកសម្លៀកបំពាក់' : 'Explore Fashion'}
              </button>
            </div>
          ) : (
            wishlistItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '14px',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #f1f5f9',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  transition: 'transform 0.15s ease'
                }}
              >
                {/* Product Image */}
                <div
                  onClick={() => {
                    if (onQuickView) onQuickView(item);
                    setIsWishlistOpen(false);
                  }}
                  style={{
                    width: '80px',
                    height: '106px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: '#f8fafc',
                    flexShrink: 0,
                    cursor: 'pointer'
                  }}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                        {item.brand || 'ZANDO'}
                      </span>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        aria-label="Remove from wishlist"
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <h4
                      onClick={() => {
                        if (onQuickView) onQuickView(item);
                        setIsWishlistOpen(false);
                      }}
                      style={{
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        color: '#0f172a',
                        margin: '4px 0 6px 0',
                        lineHeight: 1.3,
                        cursor: 'pointer'
                      }}
                    >
                      {lang === 'km' && item.name ? item.name : (item.nameEn || item.name)}
                    </h4>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                        {formatPrice(item.price)}
                      </span>
                      {item.compareAtPrice && Number(item.compareAtPrice) > Number(item.price) && (
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                          ${Number(item.compareAtPrice).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Add to Bag Button */}
                  <button
                    onClick={() => {
                      addToCart(item, 1);
                      removeFromWishlist(item.id);
                    }}
                    style={{
                      marginTop: '10px',
                      backgroundColor: '#000000',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}
                  >
                    <ShoppingBag size={14} />
                    <span>{lang === 'km' ? 'ដាក់ចូលកន្ត្រក' : 'Move to Bag'}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
  );
}
