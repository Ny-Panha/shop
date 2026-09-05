import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Lock,
  Mail,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  RefreshCw,
  Phone,
  Store
} from 'lucide-react';
import { authService } from '../../services/authService';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [mode, setMode] = useState('signin'); // 'signin' | 'register' | 'forgot'
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  // 1-Click Autofill Demo Admin
  const fillDemoAdmin = () => {
    setEmail('admin@casehaven.kh');
    setPassword('Admin@123456');
    setError('');
  };

  // 1-Click Autofill Demo Manager
  const fillDemoManager = () => {
    setEmail('manager@casehaven.kh');
    setPassword('Admin@123456');
    setError('');
  };

  // Handle Sign In
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim() || !password) {
      setError('សូមបញ្ចូល Email និង ពាក្យសម្ងាត់ឱ្យបានត្រឹមត្រូវ (Please enter email & password)');
      return;
    }

    setLoading(true);
    try {
      await authService.login(email, password, rememberMe);
      setSuccessMsg('ចូលគណនីជោគជ័យ! កំពុងបញ្ជូនទៅ Dashboard...');
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 600);
    } catch (err) {
      setError(err.message || 'ការចូលគណនីមិនជោគជ័យ សូមពិនិត្យមើល Email ឬ Password ម្តងទៀត');
    } finally {
      setLoading(false);
    }
  };

  // Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!fullName.trim() || !email.trim() || !password) {
      setError('សូមបំពេញព័ត៌មានចាំបាច់ឱ្យបានគ្រប់គ្រាន់');
      return;
    }

    if (password.length < 6) {
      setError('ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ ៦ តួអក្សរ (Password must be at least 6 characters)');
      return;
    }

    if (password !== confirmPassword) {
      setError('ពាក្យសម្ងាត់បញ្ជាក់មិនត្រូវគ្នាទេ (Passwords do not match)');
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        fullName,
        email,
        password,
        phone,
        role: 'ROLE_ADMIN'
      }, rememberMe);
      setSuccessMsg('ចុះឈ្មោះគណនី Admin ជោគជ័យ! កំពុងចូលទៅកាន់ Dashboard...');
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 700);
    } catch (err) {
      setError(err.message || 'ការចុះឈ្មោះមិនជោគជ័យ សូមសាកល្បងម្តងទៀត');
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password - Step 1: Send OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim()) {
      setError('សូមបញ្ចូល Email របស់អ្នកដើម្បីទទួលលេខកូដ (Please enter your email)');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.requestPasswordReset(email);
      setGeneratedOtp(res.otp);
      setSuccessMsg(`លេខកូដផ្ទៀងផ្ទាត់ OTP របស់អ្នកគឺ៖ ${res.otp} (ប្រើសម្រាប់ Reset Password)`);
    } catch (err) {
      setError(err.message || 'មិនអាចផ្ញើលេខកូដបានទេ');
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password - Step 2: Reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!otpCode || !newPassword) {
      setError('សូមបញ្ចូលលេខកូដ OTP និងពាក្យសម្ងាត់ថ្មី');
      return;
    }

    if (newPassword.length < 6) {
      setError('ពាក្យសម្ងាត់ថ្មីត្រូវមានយ៉ាងហោច ៦ តួអក្សរ');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(email, otpCode, newPassword);
      setSuccessMsg('ប្តូរពាក្យសម្ងាត់ជោគជ័យ! សូម Sign In ជាមួយពាក្យសម្ងាត់ថ្មី។');
      setPassword(newPassword);
      setTimeout(() => {
        setMode('signin');
        setGeneratedOtp('');
        setOtpCode('');
        setNewPassword('');
      }, 1200);
    } catch (err) {
      setError(err.message || 'ការផ្លាស់ប្តូរពាក្យសម្ងាត់បរាជ័យ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 10%, #171720 0%, #09090b 100%)',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Decorative Glow Orbs */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '25%',
        width: '320px',
        height: '320px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '25%',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none'
      }} />

      {/* Main Glassmorphic Auth Card */}
      <div style={{
        width: '100%',
        maxWidth: '460px',
        backgroundColor: 'rgba(19, 19, 23, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.09)',
        borderRadius: '20px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
        padding: '36px 32px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            boxShadow: '0 8px 20px -4px rgba(16, 185, 129, 0.4)',
            marginBottom: '14px'
          }}>
            <Store size={26} color="#ffffff" />
          </div>
          <h1 style={{
            fontSize: '1.45rem',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            marginBottom: '4px'
          }}>
            ZANDO POS & Admin
          </h1>
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}>
            <ShieldCheck size={14} style={{ color: 'var(--accent-emerald)' }} />
            <span>ប្រព័ន្ធគ្រប់គ្រងការលក់ & ស្តុកទំនិញសុវត្ថិភាព</span>
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          background: 'rgba(0, 0, 0, 0.35)',
          padding: '4px',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          marginBottom: '24px'
        }}>
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(''); setSuccessMsg(''); }}
            style={{
              flex: 1,
              padding: '8px 12px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: '9px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              background: mode === 'signin' ? 'var(--bg-surface-elevated)' : 'transparent',
              color: mode === 'signin' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: mode === 'signin' ? '0 2px 8px rgba(0,0,0,0.4)' : 'none'
            }}
          >
            Sign In (ចូល)
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); }}
            style={{
              flex: 1,
              padding: '8px 12px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: '9px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              background: mode === 'register' ? 'var(--bg-surface-elevated)' : 'transparent',
              color: mode === 'register' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: mode === 'register' ? '0 2px 8px rgba(0,0,0,0.4)' : 'none'
            }}
          >
            Register (ចុះឈ្មោះ)
          </button>
          <button
            type="button"
            onClick={() => { setMode('forgot'); setError(''); setSuccessMsg(''); }}
            style={{
              flex: 1,
              padding: '8px 12px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: '9px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              background: mode === 'forgot' ? 'var(--bg-surface-elevated)' : 'transparent',
              color: mode === 'forgot' ? '#ffffff' : 'var(--text-muted)',
              boxShadow: mode === 'forgot' ? '0 2px 8px rgba(0,0,0,0.4)' : 'none'
            }}
          >
            Forgot (ភ្លេច)
          </button>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            backgroundColor: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: '10px',
            padding: '12px 14px',
            marginBottom: '20px',
            fontSize: '0.82rem',
            color: '#fecdd3',
            lineHeight: 1.4
          }}>
            <AlertCircle size={17} style={{ color: '#f43f5e', flexShrink: 0, marginTop: '1px' }} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '10px',
            padding: '12px 14px',
            marginBottom: '20px',
            fontSize: '0.82rem',
            color: '#a7f3d0',
            lineHeight: 1.4
          }}>
            <CheckCircle2 size={17} style={{ color: '#10b981', flexShrink: 0, marginTop: '1px' }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ─── TAB 1: SIGN IN FORM ────────────────────────────────────────────── */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* 1-Click Demo Accounts */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px dashed rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '10px 12px'
            }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Sparkles size={12} color="var(--accent-amber)" />
                <span>ចុច Autofill គណនីតេស្តរហ័ស (1-Click Fill Demo)៖</span>
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={fillDemoAdmin}
                  style={{
                    flex: 1,
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    color: 'var(--accent-emerald)',
                    borderRadius: '6px',
                    padding: '5px 8px',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  ⚡ Admin Account
                </button>
                <button
                  type="button"
                  onClick={fillDemoManager}
                  style={{
                    flex: 1,
                    background: 'rgba(99, 102, 241, 0.08)',
                    border: '1px solid rgba(99, 102, 241, 0.25)',
                    color: 'var(--accent-indigo)',
                    borderRadius: '6px',
                    padding: '5px 8px',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  ⚡ Manager Account
                </button>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Email Address (អ៊ីមែល)
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@casehaven.kh"
                  required
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 40px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    outline: 'none',
                    transition: 'border-color 0.15s ease'
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Password (ពាក្យសម្ងាត់)
                </label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-emerald)',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  ភ្លេចពាក្យសម្ងាត់?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '11px 40px 11px 40px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    outline: 'none',
                    transition: 'border-color 0.15s ease'
                  }}
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
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--accent-emerald)', width: '15px', height: '15px', borderRadius: '4px' }}
              />
              <span>ចងចាំការ Login (Remember this session)</span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 18px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.35)',
                transition: 'all 0.15s ease',
                marginTop: '6px'
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>កំពុងផ្ទៀងផ្ទាត់...</span>
                </>
              ) : (
                <>
                  <span>Sign In to POS Admin</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}

        {/* ─── TAB 2: REGISTER FORM ─────────────────────────────────────────── */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                ឈ្មោះពេញ (Full Name)
              </label>
              <div style={{ position: 'relative' }}>
                <User size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Sophea Rath"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '9px',
                    color: '#fff',
                    fontSize: '13px'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                អ៊ីមែលផ្លូវការ (Email)
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@zandokh.com"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '9px',
                    color: '#fff',
                    fontSize: '13px'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                លេខទូរស័ព្ទ (Phone Number)
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="012 345 678"
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '9px',
                    color: '#fff',
                    fontSize: '13px'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '9px',
                    color: '#fff',
                    fontSize: '13px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '9px',
                    color: '#fff',
                    fontSize: '13px'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 18px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                border: 'none',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)',
                marginTop: '6px'
              }}
            >
              {loading ? 'កំពុងបង្កើតគណនី...' : 'Create Admin Account'}
            </button>
          </form>
        )}

        {/* ─── TAB 3: FORGOT PASSWORD ───────────────────────────────────────── */}
        {mode === 'forgot' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {!generatedOtp ? (
              <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  បញ្ចូល Email គណនី Admin របស់អ្នក ប្រព័ន្ធនឹងបង្កើតលេខកូដសម្ងាត់ OTP ៦ ខ្ទង់ដើម្បី Reset Password។
                </p>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@casehaven.kh"
                      required
                      style={{
                        width: '100%',
                        padding: '11px 14px 11px 40px',
                        backgroundColor: 'var(--bg-input)',
                        border: '1px solid var(--border-medium)',
                        borderRadius: '10px',
                        color: '#ffffff',
                        fontSize: '13.5px'
                      }}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px 18px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'កំពុងផ្ញើ...' : 'Send Verification OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    លេខកូដ OTP (៦ ខ្ទង់)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <KeyRound size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder={generatedOtp || '123456'}
                      required
                      style={{
                        width: '100%',
                        padding: '11px 14px 11px 40px',
                        backgroundColor: 'var(--bg-input)',
                        border: '1px solid var(--border-medium)',
                        borderRadius: '10px',
                        color: '#ffffff',
                        fontSize: '14px',
                        letterSpacing: '2px',
                        fontWeight: 700
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    ពាក្យសម្ងាត់ថ្មី (New Password)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="ពាក្យសម្ងាត់ថ្មីយ៉ាងហោច ៦ តួ"
                      required
                      style={{
                        width: '100%',
                        padding: '11px 14px 11px 40px',
                        backgroundColor: 'var(--bg-input)',
                        border: '1px solid var(--border-medium)',
                        borderRadius: '10px',
                        color: '#ffffff',
                        fontSize: '13.5px'
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px 18px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'កំពុងផ្លាស់ប្តូរ...' : 'Set New Password & Sign In'}
                </button>
              </form>
            )}

            <button
              type="button"
              onClick={() => { setMode('signin'); setGeneratedOtp(''); }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '12.5px',
                cursor: 'pointer',
                textAlign: 'center',
                marginTop: '4px'
              }}
            >
              ← ត្រឡប់ទៅទំព័រ Sign In វិញ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
