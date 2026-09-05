import React from 'react';
import { Home, Grid, Tag, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';

export function MobileBottomNav({ activeView, setActiveView, onOpenCategories, onOpenBrands }) {
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistCount, setIsWishlistOpen } = useWishlist();
  const { lang } = useLanguage();

  return (
    <nav
      className="md:hidden"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 95,
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e5e7eb',
        boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.06)',
        padding: '6px 12px calc(8px + env(safe-area-inset-bottom, 8px)) 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
      }}
      aria-label="Mobile Navigation"
    >
      {/* 1. Home */}
      <button
        onClick={() => {
          try {
            window.history.pushState(null, '', '/');
            window.dispatchEvent(new Event('popstate'));
          } catch (e) {
            window.location.hash = '#/';
          }
          setActiveView('home');
        }}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: activeView === 'home' ? '#000000' : '#64748b',
          fontSize: '0.68rem',
          fontWeight: activeView === 'home' ? 800 : 500,
          cursor: 'pointer',
          minWidth: '54px'
        }}
      >
        <Home size={19} strokeWidth={activeView === 'home' ? 2.5 : 2} />
        <span>{lang === 'km' ? 'ទំព័រដើម' : 'Home'}</span>
      </button>

      {/* 2. Categories */}
      <button
        onClick={() => {
          if (onOpenCategories) {
            onOpenCategories();
          } else {
            try {
              window.history.pushState(null, '', '/clothing');
              window.dispatchEvent(new Event('popstate'));
            } catch (e) {
              window.location.hash = '#/clothing';
            }
            setActiveView('shop');
          }
        }}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: activeView === 'shop' ? '#000000' : '#64748b',
          fontSize: '0.68rem',
          fontWeight: activeView === 'shop' ? 800 : 500,
          cursor: 'pointer',
          minWidth: '54px'
        }}
      >
        <Grid size={19} strokeWidth={activeView === 'shop' ? 2.5 : 2} />
        <span>{lang === 'km' ? 'ប្រភេទ' : 'Category'}</span>
      </button>

      {/* 3. Brands */}
      <button
        onClick={() => {
          if (onOpenBrands) {
            onOpenBrands();
          } else {
            try {
              window.history.pushState(null, '', '/brand/routine');
              window.dispatchEvent(new Event('popstate'));
            } catch (e) {
              window.location.hash = '#/brand/routine';
            }
            setActiveView('shop');
          }
        }}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: '#64748b',
          fontSize: '0.68rem',
          fontWeight: 500,
          cursor: 'pointer',
          minWidth: '54px'
        }}
      >
        <Tag size={19} strokeWidth={2} />
        <span>{lang === 'km' ? 'ម៉ាកយីហោ' : 'Brands'}</span>
      </button>

      {/* 4. Wishlist */}
      <button
        onClick={() => setIsWishlistOpen(true)}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: '#64748b',
          fontSize: '0.68rem',
          fontWeight: 500,
          cursor: 'pointer',
          position: 'relative',
          minWidth: '54px'
        }}
      >
        <div style={{ position: 'relative' }}>
          <Heart size={19} strokeWidth={2} />
          {wishlistCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-5px',
              right: '-8px',
              backgroundColor: '#e11d48',
              color: '#ffffff',
              fontSize: '0.62rem',
              fontWeight: 800,
              borderRadius: '999px',
              padding: '1px 4px',
              minWidth: '15px',
              textAlign: 'center',
              lineHeight: 1.2
            }}>
              {wishlistCount}
            </span>
          )}
        </div>
        <span>{lang === 'km' ? 'ពេញចិត្ត' : 'Wishlist'}</span>
      </button>

      {/* 5. Bag */}
      <button
        onClick={() => setIsCartOpen(true)}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: '#000000',
          fontSize: '0.68rem',
          fontWeight: 700,
          cursor: 'pointer',
          position: 'relative',
          minWidth: '54px'
        }}
      >
        <div style={{ position: 'relative' }}>
          <ShoppingBag size={19} strokeWidth={2.5} />
          {cartCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-5px',
              right: '-8px',
              backgroundColor: '#000000',
              color: '#ffffff',
              fontSize: '0.62rem',
              fontWeight: 800,
              borderRadius: '999px',
              padding: '1px 4px',
              minWidth: '15px',
              textAlign: 'center',
              lineHeight: 1.2
            }}>
              {cartCount}
            </span>
          )}
        </div>
        <span>{lang === 'km' ? 'កន្ត្រក' : 'Bag'}</span>
      </button>
    </nav>
  );
}
