import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Phone, Lock, User, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function CustomerAuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, login, loginWithDemo } = useAuth();
  const { lang } = useLanguage();
  const [tab, setTab] = useState('signin'); // 'signin' | 'signup'

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('Battambang');
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!phone) {
      setError(lang === 'km' ? 'សូមបញ្ចូលលេខទូរស័ព្ទ' : 'Please enter your phone number');
      return;
    }
    login({ phone, name: fullName || 'Valued Customer' });
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!fullName || !phone) {
      setError(lang === 'km' ? 'សូមបំពេញព័ត៌មានឱ្យបានគ្រប់គ្រាន់' : 'Please fill all required fields');
      return;
    }
    login({ phone, name: fullName });
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
        onClick={() => setIsAuthModalOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            maxWidth: '440px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #e5e7eb',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '24px 28px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #f3f4f6',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>
                {tab === 'signin'
                  ? lang === 'km'
                    ? 'ចូលគណនី ZANDO'
                    : 'Sign in to ZANDO'
                  : lang === 'km'
                  ? 'បង្កើតគណនីថ្មី'
                  : 'Create Account'}
              </h3>
              <p style={{ fontSize: '0.84rem', color: '#6b7280', marginTop: '2px' }}>
                {lang === 'km'
                  ? 'ទទួលបានពិន្ទុបញ្ចុះតម្លៃ & តាមដានការដឹកជញ្ជូន'
                  : 'Earn loyalty rewards & track purchases'}
              </p>
            </div>
            <button
              onClick={() => setIsAuthModalOpen(false)}
              style={{
                background: '#f3f4f6',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#4b5563',
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Tab Pill Buttons */}
          <div style={{ padding: '16px 28px 0' }}>
            <div
              style={{
                display: 'flex',
                backgroundColor: '#f3f4f6',
                borderRadius: '10px',
                padding: '4px',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setTab('signin');
                  setError('');
                }}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: tab === 'signin' ? '#ffffff' : 'transparent',
                  color: tab === 'signin' ? '#000000' : '#6b7280',
                  fontWeight: tab === 'signin' ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: tab === 'signin' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {lang === 'km' ? 'ចូលគណនី' : 'Sign In'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('signup');
                  setError('');
                }}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: tab === 'signup' ? '#ffffff' : 'transparent',
                  color: tab === 'signup' ? '#000000' : '#6b7280',
                  fontWeight: tab === 'signup' ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: tab === 'signup' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {lang === 'km' ? 'ចុះឈ្មោះ' : 'Register'}
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div style={{ padding: '20px 28px 28px' }}>
            {error && (
              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  color: '#dc2626',
                  fontSize: '0.85rem',
                  marginBottom: '16px',
                }}
              >
                {error}
              </div>
            )}

            {tab === 'signin' ? (
              <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    {lang === 'km' ? 'លេខទូរស័ព្ទ' : 'Phone Number'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input
                      type="tel"
                      placeholder="012 345 678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 38px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.92rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    {lang === 'km' ? 'ពាក្យសម្ងាត់' : 'Password'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 38px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.92rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <span>{lang === 'km' ? 'ចូលគណនី' : 'Sign In'}</span>
                  <ArrowRight size={16} />
                </button>

                {/* 1-Click Demo Login */}
                <div style={{ marginTop: '8px', paddingTop: '16px', borderTop: '1px dashed #e5e7eb', textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={loginWithDemo}
                    style={{
                      width: '100%',
                      backgroundColor: '#f8fafc',
                      color: '#0f172a',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '10px',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    <Sparkles size={15} color="#f59e0b" />
                    <span>{lang === 'km' ? 'ចូលប្រើគណនីសាកល្បង (1-Click Demo Nha)' : '1-Click Demo Customer (Nha Panha)'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    {lang === 'km' ? 'ឈ្មោះពេញ' : 'Full Name'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input
                      type="text"
                      placeholder="e.g. Sokha Chan"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 38px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.92rem',
                        outline: 'none',
                      }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    {lang === 'km' ? 'លេខទូរស័ព្ទ' : 'Phone Number'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input
                      type="tel"
                      placeholder="012 889 900"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 38px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.92rem',
                        outline: 'none',
                      }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    {lang === 'km' ? 'ខេត្ត / ក្រុង' : 'City / Province'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 38px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.92rem',
                        outline: 'none',
                        backgroundColor: '#fff',
                      }}
                    >
                      <option value="Battambang">បាត់ដំបង (Battambang)</option>
                      <option value="Phnom Penh">ភ្នំពេញ (Phnom Penh)</option>
                      <option value="Siem Reap">សៀមរាប (Siem Reap)</option>
                      <option value="Banteay Meanchey">បន្ទាយមានជ័យ (Banteay Meanchey)</option>
                      <option value="Kandal">កណ្តាល (Kandal)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: '6px',
                  }}
                >
                  {lang === 'km' ? 'បង្កើតគណនីថ្មី' : 'Create My Account'}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
