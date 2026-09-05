import React, { useState } from 'react';
import { Shield, ShoppingBag, Search, Languages, X, Link2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export function Navbar({ activeView, setActiveView, selectedBrand, setSelectedBrand, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery, onOpenUrlsModal }) {
  const { cartCount, currency, setCurrency, setIsCartOpen } = useCart();
  const { lang, toggleLanguage, t } = useLanguage();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: lang === 'km' ? 'ទំព័រដើម' : 'Home', action: () => { window.location.hash = '#/'; setActiveView('home'); setSelectedBrand('ALL'); if (setSelectedCategory) setSelectedCategory('ALL'); } },
    { id: 'new_in', label: lang === 'km' ? '🌟 ចូលថ្មី' : '🌟 New In', action: () => { window.location.hash = '#/clothes/men-new-in'; setActiveView('shop'); setSelectedBrand('ALL'); if (setSelectedCategory) setSelectedCategory('NEW_IN'); } },
    { id: 'clothes', label: lang === 'km' ? 'សម្លៀកបំពាក់' : 'Clothes', action: () => { window.location.hash = '#/clothes'; setActiveView('shop'); setSelectedBrand('ALL'); if (setSelectedCategory) setSelectedCategory('CLOTHES'); } },
    { id: 'shoes', label: lang === 'km' ? 'ស្បែកជើង' : 'Shoes', action: () => { window.location.hash = '#/clothes/men-shoes'; setActiveView('shop'); setSelectedBrand('ALL'); if (setSelectedCategory) setSelectedCategory('SHOES'); } },
    { id: 'jeans', label: lang === 'km' ? 'ខោខូវប៊យ' : 'Jeans', action: () => { window.location.hash = '#/clothes/men-jeans'; setActiveView('shop'); setSelectedBrand('ALL'); if (setSelectedCategory) setSelectedCategory('Jeans'); } },
    { id: 't_shirts', label: lang === 'km' ? 'អាវយឺត' : 'T-Shirts', action: () => { window.location.hash = '#/clothes/men-t-shirts'; setActiveView('shop'); setSelectedBrand('ALL'); if (setSelectedCategory) setSelectedCategory('T-Shirts'); } },
    { id: 'sale', label: lang === 'km' ? '🔥 Flash Sale' : '🔥 Flash Sale', action: () => { window.location.hash = '#/clothes/flash-sale'; setActiveView('shop'); setSelectedBrand('ALL'); if (setSelectedCategory) setSelectedCategory('SALE'); } },
    { id: 'track', label: lang === 'km' ? 'តាមដានការបញ្ជាទិញ' : 'Track Order', action: () => { window.location.hash = '#/track'; setActiveView('track'); } }
  ];

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, width: '100%' }}>
      {/* 1. TOP UTILITY STRIP - Grid-aligned and sleek */}
      <div style={{
        background: '#040d09',
        borderBottom: '1px solid rgba(0, 229, 153, 0.12)',
        color: '#a1a1aa',
        fontSize: '0.72rem',
        padding: '5px 20px'
      }}>
        <div style={{
          maxWidth: '1360px',
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
            <span style={{ color: '#00e599', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              🇰🇭 {lang === 'km' ? 'ដឹកជញ្ជូនឥតគិតថ្លៃ > $25' : 'Free Delivery > $25'}
            </span>
            <span className="hidden sm:inline" style={{ opacity: 0.2 }}>|</span>
            <span className="hidden sm:inline" style={{ whiteSpace: 'nowrap' }}>
              {lang === 'km' ? 'ទូទាត់រហ័សតាមបាគង KHQR 0% Fee' : 'Instant NBC Bakong KHQR'}
            </span>
          </div>

          {/* Currency & Language Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Currency Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.7rem' }}>
              <button
                onClick={() => setCurrency('USD')}
                aria-label="Set currency to USD"
                style={{
                  background: currency === 'USD' ? 'rgba(0, 229, 153, 0.2)' : 'transparent',
                  color: currency === 'USD' ? '#00e599' : '#a1a1aa',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '2px 5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                $
              </button>
              <button
                onClick={() => setCurrency('KHR')}
                aria-label="Set currency to KHR"
                style={{
                  background: currency === 'KHR' ? 'rgba(0, 229, 153, 0.2)' : 'transparent',
                  color: currency === 'KHR' ? '#00e599' : '#a1a1aa',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '2px 5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                ៛
              </button>
            </div>

            <span style={{ opacity: 0.2 }}>|</span>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              aria-label="Toggle language"
              style={{
                background: 'none',
                border: 'none',
                color: '#d4f9e0',
                fontSize: '0.7rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <Languages size={11} color="#00e599" />
              <span>{lang === 'en' ? 'KM' : 'EN'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR - 3-Column Luxury Centered Layout */}
      <nav style={{
        backgroundColor: 'rgba(5, 7, 10, 0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '0 20px',
        height: '62px',
        display: 'flex',
        alignItems: 'center',
        width: '100%'
      }}>
        <div style={{
          maxWidth: '1360px',
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          
          {/* Left: Brand Logo (flex: 1 for perfect center alignment) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            justifyContent: 'flex-start',
            minWidth: 0
          }}>
            <div
              onClick={() => { setActiveView('home'); setSelectedBrand('ALL'); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000000',
                boxShadow: '0 0 14px rgba(255, 255, 255, 0.2)'
              }}>
                <ShoppingBag size={19} color="#000000" />
              </div>
              <div>
                <span style={{
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                  color: '#ffffff',
                  lineHeight: 1,
                  display: 'block'
                }}>
                  ZANDO
                </span>
                <div style={{ fontSize: '0.62rem', color: '#00e599', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  MEN • FASHION
                </div>
              </div>
            </div>
          </div>

          {/* Center: Clean Nav Links (Mathematically centered) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            flexShrink: 0
          }} className="hidden md:flex">
            {navLinks.map((link) => {
              const isActive = (link.id === 'home' && activeView === 'home') ||
                (link.id === 'new_in' && selectedCategory === 'NEW_IN' && activeView === 'shop') ||
                (link.id === 'clothes' && selectedCategory === 'CLOTHES' && activeView === 'shop') ||
                (link.id === 'shoes' && selectedCategory === 'SHOES' && activeView === 'shop') ||
                (link.id === 'jeans' && selectedCategory === 'Jeans' && activeView === 'shop') ||
                (link.id === 't_shirts' && selectedCategory === 'T-Shirts' && activeView === 'shop') ||
                (link.id === 'sale' && selectedCategory === 'SALE' && activeView === 'shop') ||
                (link.id === 'track' && activeView === 'track');

              return (
                <button
                  key={link.id}
                  onClick={link.action}
                  style={{
                    background: isActive ? 'rgba(0, 229, 153, 0.08)' : 'transparent',
                    border: isActive ? '1px solid rgba(0, 229, 153, 0.25)' : '1px solid transparent',
                    color: isActive ? '#00e599' : '#cbd5e1',
                    fontSize: '0.86rem',
                    fontWeight: isActive ? 700 : 500,
                    padding: '6px 13px',
                    borderRadius: '999px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#cbd5e1';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {isActive && (
                    <span style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      backgroundColor: '#00e599',
                      boxShadow: '0 0 8px #00e599'
                    }} />
                  )}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Search + Controls + Cart (flex: 1 for balance) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            flex: 1,
            gap: '10px',
            minWidth: 0
          }}>
            
            {/* Mobile Search Toggle Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Toggle search"
              className="lg:hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                width: '35px',
                height: '35px',
                color: isSearchOpen ? '#00e599' : '#cbd5e1',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Search size={15} />
            </button>

            {/* Desktop Search Input Box */}
            <div style={{
              position: 'relative',
              width: '210px'
            }} className="hidden lg:block">
              <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#71717a' }} />
              <input
                type="text"
                placeholder={lang === 'km' ? 'ស្វែងរកស្រោម...' : 'Search cases...'}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeView !== 'shop') setActiveView('shop');
                }}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '999px',
                  padding: '7px 12px 7px 34px',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  outline: 'none',
                  transition: 'all 0.15s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#00e599';
                  e.target.style.boxShadow = '0 0 12px rgba(0, 229, 153, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search query"
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#71717a',
                    cursor: 'pointer'
                  }}
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Admin Portal Link */}
            <button
              onClick={() => setActiveView('admin')}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '999px',
                color: '#cbd5e1',
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              className="hidden sm:inline-flex"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#00e599';
                e.currentTarget.style.borderColor = 'rgba(0, 229, 153, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#cbd5e1';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
              }}
            >
              Admin
            </button>

            {/* Zando Target URLs Inspector Button */}
            <button
              onClick={onOpenUrlsModal}
              title="Inspect 40 ZANDO Target URLs"
              style={{
                backgroundColor: 'rgba(0, 229, 153, 0.1)',
                border: '1px solid rgba(0, 229, 153, 0.3)',
                color: '#00e599',
                borderRadius: '999px',
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 229, 153, 0.22)';
                e.currentTarget.style.borderColor = 'rgba(0, 229, 153, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 229, 153, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(0, 229, 153, 0.3)';
              }}
            >
              <Link2 size={13} />
              <span>40 URLs</span>
            </button>

            {/* Luxury Emerald Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Open shopping cart"
              style={{
                backgroundColor: '#00e599',
                color: '#000000',
                border: 'none',
                borderRadius: '999px',
                padding: '7px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0, 229, 153, 0.3)',
                transition: 'all 0.15s ease',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 229, 153, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 229, 153, 0.3)';
              }}
            >
              <ShoppingBag size={15} color="#000000" />
              <span className="hidden sm:inline">{lang === 'km' ? 'កន្ត្រក' : 'Cart'}</span>
              <span style={{
                backgroundColor: '#000000',
                color: '#00e599',
                borderRadius: '999px',
                padding: '1px 6px',
                fontSize: '0.72rem',
                fontWeight: 800
              }}>
                {cartCount}
              </span>
            </button>

          </div>

        </div>
      </nav>

      {/* Mobile Search Dropdown Drawer */}
      {isSearchOpen && (
        <div style={{
          backgroundColor: '#0a0e16',
          padding: '10px 16px',
          borderBottom: '1px solid rgba(0, 229, 153, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }} className="lg:hidden">
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#71717a' }} />
            <input
              type="text"
              placeholder={lang === 'km' ? 'ស្វែងរកស្រោម ឬម៉ូឌែល...' : 'Search cases or models...'}
              value={searchQuery}
              autoFocus
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeView !== 'shop') setActiveView('shop');
              }}
              style={{
                width: '100%',
                backgroundColor: '#05070a',
                border: '1px solid rgba(0, 229, 153, 0.4)',
                borderRadius: '999px',
                padding: '8px 32px 8px 34px',
                color: '#ffffff',
                fontSize: '0.84rem',
                outline: 'none'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#71717a',
                  cursor: 'pointer'
                }}
              >
                <X size={13} />
              </button>
            )}
          </div>
          <button
            onClick={() => setIsSearchOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#00e599',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Done
          </button>
        </div>
      )}
    </header>
  );
}
