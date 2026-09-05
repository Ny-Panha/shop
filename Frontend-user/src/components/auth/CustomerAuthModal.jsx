import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Phone,
  Lock,
  User,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function CustomerAuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, login, loginWithDemo } = useAuth();
  const { lang } = useLanguage();
  
  // Tabs: 'signin' | 'signup' | 'forgot'
  const [tab, setTab] = useState('signin');

  // Form Fields
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('Battambang');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Status & Feedback
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  // Handle Sign In
  const handleSignIn = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!phone.trim()) {
      setError(lang === 'km' ? 'សូមបញ្ចូលលេខទូរស័ព្ទ ឬ អ៊ីមែល' : 'Please enter your phone number or email');
      return;
    }
    if (!password) {
      setError(lang === 'km' ? 'សូមបញ្ចូលពាក្យសម្ងាត់' : 'Please enter your password');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      login({ phone, name: fullName || 'Valued Customer' });
      setSubmitting(false);
    }, 400);
  };

  // Handle Sign Up
  const handleSignUp = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!fullName.trim() || !phone.trim()) {
      setError(lang === 'km' ? 'សូមបំពេញឈ្មោះ និង លេខទូរស័ព្ទ' : 'Please fill all required fields');
      return;
    }
    if (!password || password.length < 6) {
      setError(lang === 'km' ? 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ ៦ ខ្ទង់' : 'Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError(lang === 'km' ? 'ពាក្យសម្ងាត់ផ្ទៀងផ្ទាត់មិនត្រូវគ្នាទេ' : 'Passwords do not match');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      login({ phone, name: fullName, city });
      setSubmitting(false);
    }, 400);
  };

  // Handle Forgot Password
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!phone.trim()) {
      setError(lang === 'km' ? 'សូមបញ្ចូលលេខទូរស័ព្ទដែលបានចុះឈ្មោះ' : 'Please enter your registered phone number');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError(lang === 'km' ? 'ពាក្យសម្ងាត់ថ្មីត្រូវមានយ៉ាងហោច ៦ ខ្ទង់' : 'New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(lang === 'km' ? 'ពាក្យសម្ងាត់ផ្ទៀងផ្ទាត់មិនត្រូវគ្នាទេ' : 'Passwords do not match');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccessMsg(lang === 'km' ? 'ប្តូរពាក្យសម្ងាត់ជោគជ័យ! សូមចូលគណនីជាមួយពាក្យសម្ងាត់ថ្មី។' : 'Password reset successfully! Please sign in with your new password.');
      setPassword(newPassword);
      setTimeout(() => {
        setTab('signin');
        setNewPassword('');
        setConfirmPassword('');
        setSuccessMsg('');
      }, 1500);
    }, 500);
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
        onClick={() => setIsAuthModalOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', stiffness: 450, damping: 32 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            maxWidth: '450px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(0,0,0,0.06)',
            position: 'relative',
          }}
        >
          {/* Header Banner */}
          <div
            style={{
              padding: '28px 28px 18px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  background: tab === 'forgot'
                    ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                    : 'linear-gradient(135deg, #09090b, #27272a)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: tab === 'forgot'
                    ? '0 8px 16px -4px rgba(245, 158, 11, 0.4)'
                    : '0 8px 16px -4px rgba(0, 0, 0, 0.3)',
                  flexShrink: 0
                }}
              >
                {tab === 'forgot' ? (
                  <KeyRound size={22} />
                ) : tab === 'signup' ? (
                  <Sparkles size={22} color="#fbbf24" />
                ) : (
                  <ShoppingBag size={22} />
                )}
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#09090b', letterSpacing: '-0.02em', margin: 0 }}>
                  {tab === 'signin'
                    ? lang === 'km' ? 'ចូលគណនី ZANDO' : 'Sign in to ZANDO'
                    : tab === 'signup'
                    ? lang === 'km' ? 'បង្កើតគណនីថ្មី' : 'Create Account'
                    : lang === 'km' ? 'កំណត់ពាក្យសម្ងាត់' : 'Reset Password'}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '3px', margin: 0 }}>
                  {tab === 'signin'
                    ? lang === 'km' ? 'ទទួលបានពិន្ទុបញ្ចុះតម្លៃ & តាមដានការទិញ' : 'Earn loyalty rewards & track purchases'
                    : tab === 'signup'
                    ? lang === 'km' ? 'ចូលរួមជាសមាជិកដើម្បីទទួលអត្ថប្រយោជន៍' : 'Join to unlock exclusive member privileges'
                    : lang === 'km' ? 'បញ្ចូលលេខទូរស័ព្ទដើម្បីបង្កើតពាក្យសម្ងាត់ថ្មី' : 'Enter your registered phone to reset password'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAuthModalOpen(false)}
              style={{
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.color = '#64748b'; }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Segmented Tab Switcher */}
          <div style={{ padding: '16px 28px 0' }}>
            <div
              style={{
                display: 'flex',
                backgroundColor: '#f1f5f9',
                borderRadius: '12px',
                padding: '4px',
                gap: '4px',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setTab('signin');
                  setError('');
                  setSuccessMsg('');
                }}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  border: 'none',
                  borderRadius: '9px',
                  backgroundColor: tab === 'signin' ? '#ffffff' : 'transparent',
                  color: tab === 'signin' ? '#09090b' : '#64748b',
                  fontWeight: tab === 'signin' ? 700 : 500,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  boxShadow: tab === 'signin' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {lang === 'km' ? 'ចូលគណនី' : 'Sign In'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('signup');
                  setError('');
                  setSuccessMsg('');
                }}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  border: 'none',
                  borderRadius: '9px',
                  backgroundColor: tab === 'signup' ? '#ffffff' : 'transparent',
                  color: tab === 'signup' ? '#09090b' : '#64748b',
                  fontWeight: tab === 'signup' ? 700 : 500,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  boxShadow: tab === 'signup' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {lang === 'km' ? 'ចុះឈ្មោះ' : 'Register'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('forgot');
                  setError('');
                  setSuccessMsg('');
                }}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  border: 'none',
                  borderRadius: '9px',
                  backgroundColor: tab === 'forgot' ? '#ffffff' : 'transparent',
                  color: tab === 'forgot' ? '#09090b' : '#64748b',
                  fontWeight: tab === 'forgot' ? 700 : 500,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  boxShadow: tab === 'forgot' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {lang === 'km' ? 'ភ្លេចលេខកូដ' : 'Forgot'}
              </button>
            </div>
          </div>

          {/* Form Content Area */}
          <div style={{ padding: '20px 28px 28px' }}>
            {/* Feedback Notifications */}
            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '11px 14px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '10px',
                  color: '#dc2626',
                  fontSize: '0.84rem',
                  marginBottom: '16px',
                  lineHeight: 1.4,
                }}
              >
                <AlertCircle size={17} style={{ flexShrink: 0, marginTop: '1px' }} />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '11px 14px',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '10px',
                  color: '#16a34a',
                  fontSize: '0.84rem',
                  marginBottom: '16px',
                  lineHeight: 1.4,
                }}
              >
                <CheckCircle2 size={17} style={{ flexShrink: 0, marginTop: '1px' }} />
                <span>{successMsg}</span>
              </div>
            )}

            {/* ─── TAB 1: SIGN IN ────────────────────────────────────────────── */}
            {tab === 'signin' && (
              <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    {lang === 'km' ? 'លេខទូរស័ព្ទ / អ៊ីមែល' : 'Phone Number or Email'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text"
                      placeholder="012 345 678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '11px 14px 11px 40px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '10px',
                        fontSize: '0.92rem',
                        outline: 'none',
                        transition: 'border-color 0.15s ease',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#09090b')}
                      onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                      {lang === 'km' ? 'ពាក្យសម្ងាត់' : 'Password'}
                    </label>
                    <button
                      type="button"
                      onClick={() => { setTab('forgot'); setError(''); setSuccessMsg(''); }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#2563eb',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        padding: 0,
                        fontWeight: 600,
                      }}
                    >
                      {lang === 'km' ? 'ភ្លេចពាក្យសម្ងាត់?' : 'Forgot Password?'}
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '11px 40px 11px 40px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '10px',
                        fontSize: '0.92rem',
                        outline: 'none',
                        transition: 'border-color 0.15s ease',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#09090b')}
                      onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    backgroundColor: '#09090b',
                    color: '#ffffff',
                    padding: '12px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.94rem',
                    border: 'none',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{submitting ? (lang === 'km' ? 'កំពុងចូល...' : 'Signing in...') : (lang === 'km' ? 'ចូលគណនី' : 'Sign In')}</span>
                  <ArrowRight size={16} />
                </button>

                {/* 1-Click Demo Customer Login */}
                <div style={{ marginTop: '8px', paddingTop: '16px', borderTop: '1px dashed #e2e8f0', textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={loginWithDemo}
                    style={{
                      width: '100%',
                      backgroundColor: '#f8fafc',
                      color: '#0f172a',
                      border: '1px solid #cbd5e1',
                      borderRadius: '10px',
                      padding: '10px',
                      fontWeight: 600,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                  >
                    <Sparkles size={15} color="#f59e0b" />
                    <span>{lang === 'km' ? '⚡ ចូលគណនីសាកល្បងរហ័ស (1-Click Demo Customer)' : '⚡ 1-Click Demo Customer (Sokha Pich)'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* ─── TAB 2: REGISTER ───────────────────────────────────────────── */}
            {tab === 'signup' && (
              <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                    {lang === 'km' ? 'ឈ្មោះពេញ' : 'Full Name'} *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text"
                      placeholder="e.g. Sokha Chan"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 14px 10px 40px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '10px',
                        fontSize: '0.90rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                    {lang === 'km' ? 'លេខទូរស័ព្ទ' : 'Phone Number'} *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="tel"
                      placeholder="012 889 900"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 14px 10px 40px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '10px',
                        fontSize: '0.90rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                    {lang === 'km' ? 'ខេត្ត / ក្រុង' : 'City / Province'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px 10px 40px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '10px',
                        fontSize: '0.90rem',
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                      {lang === 'km' ? 'ពាក្យសម្ងាត់' : 'Password'} *
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '10px',
                        fontSize: '0.90rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                      {lang === 'km' ? 'ផ្ទៀងផ្ទាត់' : 'Confirm'} *
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '10px',
                        fontSize: '0.90rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    backgroundColor: '#09090b',
                    color: '#ffffff',
                    padding: '12px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.94rem',
                    border: 'none',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    marginTop: '4px',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {submitting ? (lang === 'km' ? 'កំពុងបង្កើត...' : 'Creating...') : (lang === 'km' ? 'បង្កើតគណនីថ្មី' : 'Create My Account')}
                </button>
              </form>
            )}

            {/* ─── TAB 3: FORGOT PASSWORD ────────────────────────────────────── */}
            {tab === 'forgot' && (
              <form onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    {lang === 'km' ? 'លេខទូរស័ព្ទគណនីរបស់អ្នក' : 'Your Registered Phone Number'} *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="tel"
                      placeholder="012 345 678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '11px 14px 11px 40px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '10px',
                        fontSize: '0.92rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    {lang === 'km' ? 'ពាក្យសម្ងាត់ថ្មី' : 'New Password'} *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '11px 40px 11px 40px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '10px',
                        fontSize: '0.92rem',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    {lang === 'km' ? 'ផ្ទៀងផ្ទាត់ពាក្យសម្ងាត់ថ្មី' : 'Confirm New Password'} *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '11px 14px 11px 40px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '10px',
                        fontSize: '0.92rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    backgroundColor: '#d97706',
                    color: '#ffffff',
                    padding: '12px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.94rem',
                    border: 'none',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(217, 119, 6, 0.3)',
                  }}
                >
                  <span>{submitting ? (lang === 'km' ? 'កំពុងផ្លាស់ប្តូរ...' : 'Resetting...') : (lang === 'km' ? 'កំណត់ពាក្យសម្ងាត់ថ្មី' : 'Reset Password')}</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => { setTab('signin'); setError(''); setSuccessMsg(''); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    textAlign: 'center',
                    marginTop: '6px',
                  }}
                >
                  {lang === 'km' ? '← ត្រឡប់ទៅចូលគណនី (Back to Sign In)' : '← Back to Sign In'}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
