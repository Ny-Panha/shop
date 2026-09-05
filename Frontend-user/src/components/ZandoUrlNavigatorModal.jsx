import React, { useState } from 'react';
import { 
  X, ExternalLink, Copy, Check, Link2, Sparkles, 
  ShoppingBag, Layers, Filter, CheckCircle2 
} from 'lucide-react';
import { ZANDO_ALL_40_URLS, findProductByZandoRoute } from '../data/zandoProducts';
import { useLanguage } from '../context/LanguageContext';

export function ZandoUrlNavigatorModal({ isOpen, onClose, onSelectUrl }) {
  const { lang } = useLanguage();
  const [copiedId, setCopiedId] = useState(null);
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'category' | 'product'
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const handleCopy = (item, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleNavigate = (item) => {
    if (onSelectUrl) {
      onSelectUrl(item);
    } else {
      window.location.hash = item.hash;
    }
    onClose();
  };

  const filteredItems = ZANDO_ALL_40_URLS.filter((item) => {
    if (filterType !== 'ALL') {
      if (filterType === 'category' && item.type === 'product') return false;
      if (filterType === 'product' && item.type !== 'product') return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchUrl = item.url.toLowerCase().includes(q);
      const matchHash = item.hash.toLowerCase().includes(q);
      if (!matchTitle && !matchUrl && !matchHash) return false;
    }
    return true;
  });

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      zIndex: 1100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '860px',
          maxHeight: '88vh',
          backgroundColor: '#0f172a',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          color: '#ffffff'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Link2 size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
                  ZANDO Target URLs Navigator
                </h3>
                <span style={{
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '999px'
                }}>
                  40 URLs Mapped
                </span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                {lang === 'km' 
                  ? 'ចុចលើ URL ណាមួយដើម្បីតេស្ត routing ឬបើកមើលទំនិញភ្លាមៗ'
                  : 'Click any URL to test route navigation or open product details directly'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94a3b8',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#94a3b8';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div style={{
          padding: '14px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.02)'
        }}>
          {/* Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {[
              { id: 'ALL', label: `All (${ZANDO_ALL_40_URLS.length})` },
              { id: 'category', label: 'Categories & Collections (4)' },
              { id: 'product', label: 'Products (36)' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                style={{
                  backgroundColor: filterType === tab.id ? '#ffffff' : 'rgba(255, 255, 255, 0.05)',
                  color: filterType === tab.id ? '#000000' : '#cbd5e1',
                  border: filterType === tab.id ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '999px',
                  padding: '5px 12px',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ flex: '1', minWidth: '200px', maxWidth: '300px' }}>
            <input
              type="text"
              placeholder={lang === 'km' ? 'ស្វែងរក URL ឬឈ្មោះទំនិញ...' : 'Filter URLs by keyword...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '7px 12px',
                fontSize: '0.8rem',
                color: '#ffffff',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* URL List Container */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {filteredItems.map((item, idx) => {
            const isProduct = item.type === 'product';
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '10px',
                  gap: '14px',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.07)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
                  e.currentTarget.style.transform = 'translateX(2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                {/* Index Number */}
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#64748b',
                  minWidth: '24px'
                }}>
                  #{idx + 1}
                </span>

                {/* Main Information */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      color: '#ffffff',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden'
                    }}>
                      {item.title}
                    </span>
                    <span style={{
                      backgroundColor: isProduct ? 'rgba(56, 189, 248, 0.15)' : 'rgba(168, 85, 247, 0.15)',
                      color: isProduct ? '#38bdf8' : '#c084fc',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: '4px',
                      border: isProduct ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(168, 85, 247, 0.3)'
                    }}>
                      {item.badge}
                    </span>
                  </div>

                  {/* URL Text */}
                  <div style={{
                    fontSize: '0.72rem',
                    color: '#94a3b8',
                    fontFamily: 'monospace',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    display: 'inline-block',
                    maxWidth: '100%'
                  }}>
                    {item.url}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  {/* Copy Button */}
                  <button
                    onClick={(e) => handleCopy(item, e)}
                    title="Copy URL"
                    style={{
                      backgroundColor: isCopied ? '#10b981' : 'rgba(255, 255, 255, 0.06)',
                      color: isCopied ? '#ffffff' : '#cbd5e1',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isCopied ? <Check size={13} /> : <Copy size={13} />}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>

                  {/* Test Route Button */}
                  <button
                    onClick={() => handleNavigate(item)}
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 14px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#e2e8f0';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                  >
                    <span>Test Route</span>
                    <ExternalLink size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.78rem',
          color: '#64748b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={15} color="#10b981" />
            <span style={{ color: '#cbd5e1' }}>100% of all 40 ZANDO URLs are fully mapped and reactive.</span>
          </div>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 16px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
