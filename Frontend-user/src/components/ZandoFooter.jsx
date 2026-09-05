import React, { useState, useEffect } from 'react';
import { ArrowUp, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function ZandoFooter() {
  const { lang } = useLanguage();
  const [showToTop, setShowToTop] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (window.pageYOffset > 300) {
        setShowToTop(true);
      } else {
        setShowToTop(false);
      }
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{ width: '100%', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* ========================================================================= */}
      {/* 1. FEATURED TRUST BLOCK (WHITE BACKGROUND MATCHING REAL ZANDO SCREENSHOT)  */}
      {/* ========================================================================= */}
      <section style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e5e7eb',
        borderBottom: '1px solid #e5e7eb',
        padding: '36px 20px'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          {/* Perk 1: Global Shipping */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <Truck size={28} strokeWidth={1.4} color="#111827" />
            <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#111827' }}>
              {lang === 'km' ? 'ដឹកជញ្ជូនទូទាំងពិភពលោក' : 'Global Shipping'}
            </span>
          </div>

          {/* Perk 2: 14-Day Return Policy */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <RotateCcw size={26} strokeWidth={1.4} color="#111827" />
            <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#111827' }}>
              {lang === 'km' ? 'គោលការណ៍ប្តូរទំនិញ ១៤ ថ្ងៃ' : '14-Day Return Policy'}
            </span>
          </div>

          {/* Perk 3: Secure Payment */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={28} strokeWidth={1.4} color="#111827" />
            <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#111827' }}>
              {lang === 'km' ? 'ការទូទាត់ប្រកបដោយសុវត្ថិភាព' : 'Secure Payment'}
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MAIN FOOTER (PURE BLACK #000000 MATCHING ksnip_20260904-183829.png)    */}
      {/* ========================================================================= */}
      <section style={{
        backgroundColor: '#000000',
        color: '#ffffff',
        padding: '52px 20px 28px 20px'
      }}>
        <div style={{
          maxWidth: '1360px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '28px',
          justifyContent: 'space-between'
        }}>
          
          {/* COLUMN 1: ZANDO APP */}
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '16px', color: '#ffffff' }}>
              ZANDO App
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img 
                src="/zando-assets/footer-app-badges.png" 
                alt="ZANDO App QR and Stores" 
                style={{ width: '150px', height: 'auto', display: 'block', borderRadius: '4px' }}
              />
            </div>
          </div>

          {/* COLUMN 2: HELP AND CONTACT */}
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '16px', color: '#ffffff' }}>
              {lang === 'km' ? 'ជំនួយ & ទំនាក់ទំនង' : 'Help and Contact'}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Online Exchange Policy', link: '#/' },
                { label: 'Privacy Policy', link: '#/' },
                { label: 'ZANDO Help Center', link: '#/' },
                { label: 'Contact Us', link: '#/' },
                { label: 'Find a Store', link: '#/' }
              ].map((item, idx) => (
                <li key={idx}>
                  <a 
                    href={item.link} 
                    style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.8rem', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: LOYALTY */}
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '16px', color: '#ffffff' }}>
              {lang === 'km' ? 'ភក្ដីភាព' : 'Loyalty'}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <a 
                  href="#/" 
                  style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.8rem', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  Membership & Benefits
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: CONTACT US */}
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '16px', color: '#ffffff' }}>
              {lang === 'km' ? 'ទំនាក់ទំនង' : 'Contact Us'}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <a 
                  href="mailto:info@zandokh.com" 
                  style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.8rem', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  info@zandokh.com
                </a>
              </li>
              <li style={{ color: '#9ca3af', fontSize: '0.8rem' }}>(+855) 081 999 716</li>
              <li style={{ color: '#9ca3af', fontSize: '0.8rem' }}>(+855) 061 330 330</li>
              <li>
                <a 
                  href="https://t.me/Mysupportcare" 
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.8rem', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                >
                  Telegram
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 5: FOLLOW US */}
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '16px', color: '#ffffff' }}>
              {lang === 'km' ? 'តាមដានយើង' : 'Follow Us'}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Facebook', 'Instagram', 'TikTok', 'Youtube', 'ZANDO Career'].map((soc, idx) => (
                <li key={idx}>
                  <a 
                    href="#/" 
                    style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.8rem', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                  >
                    {soc}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 6: WE ACCEPT */}
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '16px', color: '#ffffff' }}>
              We Accept
            </h4>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img 
                src="/zando-assets/footer-payments.png" 
                alt="Payment Methods: ABA, VISA, MasterCard, UnionPay, JCB, WingBank, Bank Transfer, Cash on Delivery" 
                style={{ width: '100%', maxWidth: '240px', height: 'auto', display: 'block', borderRadius: '4px' }}
              />
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div style={{
          marginTop: '44px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '0.75rem'
        }}>
          © 2015 - 2026 Zando. All rights reserved.
        </div>
      </section>

      {/* Floating Back to Top Button */}
      {showToTop && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          style={{
            position: 'fixed',
            bottom: '84px',
            right: '24px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#111827',
            color: '#ffffff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
            zIndex: 40,
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowUp size={18} />
        </button>
      )}
    </footer>
  );
}
