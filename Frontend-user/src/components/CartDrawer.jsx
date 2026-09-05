import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export function CartDrawer({ onCheckout, onContinueShopping }) {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartRawSubtotal,
    cartSubtotal,
    discountAmount,
    discountPercent,
    discountCode,
    applyDiscount,
    removeDiscount,
    formatPrice,
    currency
  } = useCart();
  const { lang, t } = useLanguage();

  const [promoInput, setPromoInput] = useState('');
  // Free shipping threshold: $30 as per Zando spec
  const FREE_SHIPPING_THRESHOLD = 30.00;
  const progressPercent = Math.min(100, (cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyDiscount(promoInput);
    setPromoMsg(res);
  };

  const deliveryFeeUsd = remainingForFree === 0 || cartSubtotal === 0 ? 0 : 1.50;
  const grandTotalUsd = cartSubtotal + deliveryFeeUsd;
  const grandTotalKhr = Math.round(grandTotalUsd * 4100);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 110,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            justifyContent: 'flex-end'
          }}
          onClick={() => setIsCartOpen(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '440px',
              height: '100%',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              borderLeft: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-12px 0 32px rgba(0, 0, 0, 0.18)'
            }}
          >
        {/* 1. Header */}
        <div style={{
          padding: '18px 20px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={18} color="#000000" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em', color: '#000000' }}>
              {lang === 'km' ? 'កន្ត្រកទំនិញ' : 'SHOPPING BAG'}
            </h2>
            <span style={{
              fontSize: '0.74rem',
              backgroundColor: '#f1f5f9',
              color: '#0f172a',
              padding: '2px 8px',
              borderRadius: '999px',
              fontWeight: 800
            }}>
              {cartItems.reduce((s, i) => s + i.quantity, 0)}
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart drawer"
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

        {/* 2. Free Shipping Progress ($30 threshold) */}
        <div style={{
          backgroundColor: '#f8fafc',
          padding: '12px 20px',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '0.78rem', color: '#334155', marginBottom: '7px', display: 'flex', justifyContent: 'space-between' }}>
            {remainingForFree === 0 ? (
              <span style={{ color: '#059669', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '5px' }}>
                🎉 {lang === 'km' ? 'ទទួលបានការដឹកជញ្ជូនឥតគិតថ្លៃនៅភ្នំពេញ!' : 'FREE Express Delivery Unlocked in Phnom Penh!'}
              </span>
            ) : (
              <span>
                {lang === 'km' ? (
                  <>ថែម <strong>${remainingForFree.toFixed(2)}</strong> ទៀតដើម្បីដឹកឥតគិតថ្លៃ</>
                ) : (
                  <>Add <strong>${remainingForFree.toFixed(2)}</strong> more for FREE Delivery</>
                )}
              </span>
            )}
            <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 800 }}>$30 GOAL</span>
          </div>

          <div style={{
            width: '100%',
            height: '6px',
            borderRadius: '9999px',
            backgroundColor: '#e2e8f0',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              backgroundColor: progressPercent >= 100 ? '#059669' : '#000000',
              transition: 'width 0.35s ease'
            }} />
          </div>
        </div>

        {/* 3. Items List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🛍️</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                {lang === 'km' ? 'កន្ត្រកទំនិញរបស់អ្នកនៅទទេ' : 'Your bag is empty'}
              </h3>
              <p style={{ fontSize: '0.85rem', marginBottom: '20px' }}>
                {lang === 'km' ? 'ស្វែងរកម៉ូដសម្លៀកបំពាក់ទាន់សម័យរបស់ ZANDO' : 'Explore modern Cambodian fashion collections.'}
              </p>
              <button
                onClick={() => { setIsCartOpen(false); if (onContinueShopping) onContinueShopping(); }}
                style={{
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '10px 24px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                {lang === 'km' ? 'ចាប់ផ្តើមទិញទំនិញ' : 'START SHOPPING'}
              </button>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div
                key={`${item.productId}-${item.selectedColor}-${item.selectedSize}-${index}`}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '12px',
                  display: 'flex',
                  gap: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                }}
              >
                {/* Thumbnail */}
                <div style={{
                  width: '74px',
                  height: '96px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  backgroundColor: '#f8fafc',
                  flexShrink: 0
                }}>
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.3, margin: 0 }}>
                        {lang === 'km' && item.product.name ? item.product.name : (item.product.nameEn || item.product.name)}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.productId, item.selectedColor, item.selectedSize)}
                        aria-label="Remove item"
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div style={{
                      fontSize: '0.74rem',
                      color: '#64748b',
                      marginTop: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{item.product.brand || 'ZANDO'}</span>
                      {item.selectedSize && (
                        <>
                          <span>•</span>
                          <span style={{ backgroundColor: '#f1f5f9', padding: '1px 6px', borderRadius: '3px', fontWeight: 600 }}>
                            Size: {item.selectedSize}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <button
                        onClick={() => updateQuantity(item.productId, item.selectedColor, item.quantity - 1, item.selectedSize)}
                        style={{
                          width: '26px',
                          height: '26px',
                          border: 'none',
                          backgroundColor: '#f8fafc',
                          color: '#0f172a',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        -
                      </button>
                      <span style={{ width: '30px', textAlign: 'center', fontSize: '0.82rem', fontWeight: 700 }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.selectedColor, item.quantity + 1, item.selectedSize)}
                        style={{
                          width: '26px',
                          height: '26px',
                          border: 'none',
                          backgroundColor: '#f8fafc',
                          color: '#0f172a',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        +
                      </button>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.94rem', fontWeight: 900, color: '#0f172a' }}>
                        {formatPrice(Number(item.price) * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 4. Footer & Checkout */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#ffffff'
          }}>
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
              <input
                type="text"
                placeholder={lang === 'km' ? 'កូដបញ្ចុះតម្លៃ (e.g. SAVE10)' : 'Promo code (e.g. SAVE10)'}
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                style={{
                  flex: 1,
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  padding: '7px 10px',
                  fontSize: '0.78rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0 14px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {lang === 'km' ? 'អនុវត្ត' : 'Apply'}
              </button>
            </form>

            {discountPercent > 0 && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.78rem',
                color: '#059669',
                marginBottom: '6px'
              }}>
                <span>Discount ({discountCode} -{discountPercent}%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            {/* Subtotal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px' }}>
              <span>{lang === 'km' ? 'សរុបបឋម' : 'Subtotal'}</span>
              <span>{formatPrice(cartSubtotal)}</span>
            </div>

            {/* Delivery Fee */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', marginBottom: '10px' }}>
              <span>{lang === 'km' ? 'ថ្លៃដឹកជញ្ជូន (ភ្នំពេញ)' : 'Delivery (Phnom Penh)'}</span>
              <span>{deliveryFeeUsd === 0 ? (lang === 'km' ? 'ឥតគិតថ្លៃ' : 'FREE') : `$${deliveryFeeUsd.toFixed(2)}`}</span>
            </div>

            {/* Grand Total Dual-Currency */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              paddingTop: '8px',
              borderTop: '1px solid #f1f5f9',
              marginBottom: '14px'
            }}>
              <div>
                <span style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a' }}>
                  {lang === 'km' ? 'សរុបរួម' : 'Estimated Total'}
                </span>
                <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b' }}>
                  ({currency === 'KHR' ? `$${grandTotalUsd.toFixed(2)} USD` : `${grandTotalKhr.toLocaleString()} ៛ KHR`})
                </span>
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#000000' }}>
                {formatPrice(grandTotalUsd)}
              </span>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                if (onCheckout) onCheckout();
              }}
              style={{
                width: '100%',
                backgroundColor: '#000000',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                padding: '13px',
                fontSize: '0.9rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}
            >
              <span>{lang === 'km' ? 'ទូទាត់ប្រាក់ឥឡូវនេះ' : 'PROCEED TO CHECKOUT'}</span>
              <ArrowRight size={16} />
            </button>

            {/* Local Payment Badges */}
            <div style={{
              marginTop: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              opacity: 0.75
            }}>
              <span style={{ fontSize: '0.66rem', fontWeight: 700, color: '#64748b' }}>WE ACCEPT:</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#e11d48', border: '1px solid #fecdd3', padding: '1px 5px', borderRadius: '3px' }}>
                ABA PAY
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0284c7', border: '1px solid #bae6fd', padding: '1px 5px', borderRadius: '3px' }}>
                KHQR
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#1e293b', border: '1px solid #e2e8f0', padding: '1px 5px', borderRadius: '3px' }}>
                VISA
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#d97706', border: '1px solid #fde68a', padding: '1px 5px', borderRadius: '3px' }}>
                MASTERCARD
              </span>
            </div>
          </div>
        )}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
  );
}
