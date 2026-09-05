import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, ShieldCheck, QrCode, Banknote, ArrowRight, CheckCircle2, MapPin, Phone, User, Mail, Printer, ExternalLink, Lock, LogIn, UserPlus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { createOrder, login, register, getCurrentUser, getAuthToken } from '../api/client';
import { BakongKhqrCard } from './BakongKhqrCard';
import { syncBridge } from '../services/syncBridge';

// Comprehensive Cambodian Administrative Structure
const CAMBODIA_LOCATIONS = {
  'Phnom Penh': {
    districts: {
      'Khan Boeng Keng Kang': ['Sangkat Boeng Keng Kang 1', 'Sangkat Boeng Keng Kang 2', 'Sangkat Boeng Keng Kang 3', 'Sangkat Olympic', 'Sangkat Tuol Svay Prey 1', 'Sangkat Tuol Svay Prey 2', 'Sangkat Tumnob Tuek'],
      'Khan Chamkar Mon': ['Sangkat Tonle Bassac', 'Sangkat Tuol Tumpoung 1', 'Sangkat Tuol Tumpoung 2', 'Sangkat Boeng Trabaek', 'Sangkat Phsar Daeum Thkov'],
      'Khan Daun Penh': ['Sangkat Phsar Thmei 1', 'Sangkat Phsar Thmei 2', 'Sangkat Phsar Thmei 3', 'Sangkat Boeng Reang', 'Sangkat Phsar Kandal 1', 'Sangkat Phsar Kandal 2', 'Sangkat Chaktomuk', 'Sangkat Voat Phnum'],
      'Khan Tuol Kouk': ['Sangkat Boeng Kak 1', 'Sangkat Boeng Kak 2', 'Sangkat Phsar Depou 1', 'Sangkat Phsar Depou 2', 'Sangkat Teuk La\'ak 1', 'Sangkat Teuk La\'ak 2', 'Sangkat Boeng Salang'],
      'Khan Sen Sok': ['Sangkat Phnom Penh Thmei', 'Sangkat Tuek Thla', 'Sangkat Khmuonh', 'Sangkat Ou Baek K\'am'],
      'Khan Mean Chey': ['Sangkat Stueng Mean Chey 1', 'Sangkat Stueng Mean Chey 2', 'Sangkat Chak Angre Leu', 'Sangkat Chak Angre Kraom'],
      'Khan Chroy Changvar': ['Sangkat Chroy Changvar', 'Sangkat Prek Leap', 'Sangkat Prek Ta Sek']
    }
  },
  'Battambang': {
    districts: {
      'Krong Battambang': ['Sangkat Svay Pao', 'Sangkat Prek Preah Sdach', 'Sangkat Ratanak', 'Sangkat Chamkar Samraong', 'Sangkat Kdol Doun Teav', 'Sangkat Voat Kor'],
      'Moung Ruessei': ['Kakaoh', 'Moung', 'Prey Touch', 'Robas Mongkol'],
      'Thma Koul': ['Ta Pung', 'Ta Mean', 'Ou Ta Ki', 'Chrouy Sdau'],
      'Banan': ['Kanteu 1', 'Kanteu 2', 'Bay Damram', 'Chheu Teal']
    }
  },
  'Siem Reap': {
    districts: {
      'Krong Siem Reap': ['Sangkat Sala Kamreuk', 'Sangkat Svay Dangkum', 'Sangkat Kouk Chak', 'Sangkat Sla Kram', 'Sangkat Nokor Thum'],
      'Prasat Bakong': ['Bakong', 'Roluos', 'Trapeang Thum'],
      'Banteay Srei': ['Kbal Spean', 'Preah Dak', 'Khun Ream']
    }
  },
  'Sihanoukville': {
    districts: {
      'Krong Preah Sihanouk': ['Sangkat 1', 'Sangkat 2', 'Sangkat 3', 'Sangkat 4', 'Koh Rong'],
      'Prey Nob': ['Prey Nob', 'Tuek Thla', 'Veal Renh']
    }
  },
  'Kandal': {
    districts: {
      'Krong Ta Khmau': ['Sangkat Ta Khmau', 'Sangkat Prek Ho', 'Sangkat Doeum Mien'],
      'Kien Svay': ['Banteay Daek', 'Chheu Teal', 'Dei Edth']
    }
  }
};

export function CheckoutModal({ isOpen, onClose, onOrderCompleted, onViewOrderTrack }) {
  const { cartItems, cartSubtotal, discountCode, discountPercent, discountAmount, formatPrice, clearCart, currency } = useCart();
  const { lang, t } = useLanguage();
  const { user: authUser } = useAuth();

  const [step, setStep] = useState(1); // 1: Contact & Address, 2: Payment, 3: KHQR Scan, 4: Confirmation
  
  // Auth state
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Contact info
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Cambodian 4-level Address
  const [province, setProvince] = useState('Phnom Penh');
  const [district, setDistrict] = useState('Khan Boeng Keng Kang');
  const [commune, setCommune] = useState('Sangkat Boeng Keng Kang 1');
  const [streetAddress, setStreetAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState('KHQR');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdOrder, setCreatedOrder] = useState(null);

  // Check current auth token on open
  useEffect(() => {
    if (isOpen) {
      if (authUser) {
        if (!customerName) setCustomerName(authUser.name || '');
        if (!customerPhone) setCustomerPhone(authUser.phone || '');
        if (!customerEmail) setCustomerEmail(authUser.email || '');
        if (!streetAddress && authUser.address) setStreetAddress(authUser.address);
      }
      checkAuthStatus();
    }
  }, [isOpen, authUser]);

  const checkAuthStatus = async () => {
    const token = getAuthToken();
    if (token) {
      try {
        const user = await getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setCustomerName(user.fullName || '');
          setCustomerEmail(user.email || '');
          setCustomerPhone(user.phone || '');
          if (user.city) setProvince(user.city);
          if (user.address) setStreetAddress(user.address);
        }
      } catch (_) {}
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      if (authMode === 'login') {
        const res = await login(authEmail, authPassword);
        localStorage.setItem('casehaven_token', res.token);
        setCurrentUser(res.user);
        setCustomerName(res.user.fullName || '');
        setCustomerEmail(res.user.email || '');
        setCustomerPhone(res.user.phone || '');
        setShowAuthForm(false);
      } else {
        const res = await register({
          fullName: authName,
          email: authEmail,
          password: authPassword,
          phone: authPhone,
          address: streetAddress,
          city: province
        });
        localStorage.setItem('casehaven_token', res.token);
        setCurrentUser(res.user);
        setCustomerName(res.user.fullName || '');
        setCustomerEmail(res.user.email || '');
        setCustomerPhone(res.user.phone || '');
        setShowAuthForm(false);
      }
    } catch (err) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  if (!isOpen) return null;

  // Derived location dropdown options
  const provinceList = Object.keys(CAMBODIA_LOCATIONS);
  const districtList = CAMBODIA_LOCATIONS[province]?.districts ? Object.keys(CAMBODIA_LOCATIONS[province].districts) : [];
  const communeList = (district && CAMBODIA_LOCATIONS[province]?.districts?.[district]) || [];

  const handleProvinceChange = (p) => {
    setProvince(p);
    const firstDistrict = CAMBODIA_LOCATIONS[p]?.districts ? Object.keys(CAMBODIA_LOCATIONS[p].districts)[0] : '';
    setDistrict(firstDistrict);
    const firstCommune = (firstDistrict && CAMBODIA_LOCATIONS[p]?.districts?.[firstDistrict]?.[0]) || '';
    setCommune(firstCommune);
  };

  const handleDistrictChange = (d) => {
    setDistrict(d);
    const firstCommune = CAMBODIA_LOCATIONS[province]?.districts?.[d]?.[0] || '';
    setCommune(firstCommune);
  };

  // Delivery calculations
  const deliveryFee = cartSubtotal >= 25.00 ? 0 : 1.50;
  const calculatedGrandTotal = cartSubtotal + deliveryFee;
  const grandTotalKhr = Math.round(calculatedGrandTotal * 4100);

  const handleCreateOrder = async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      const fullShippingAddress = `${streetAddress ? streetAddress + ', ' : ''}${commune ? commune + ', ' : ''}${district ? district + ', ' : ''}${province}`;

      const orderPayload = {
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress: fullShippingAddress,
        city: province,
        province,
        district,
        commune,
        couponCode: discountCode || '',
        notes,
        paymentMethod,
        currency: 'USD',
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          selectedColor: item.selectedColor
        }))
      };

      let order;
      try {
        order = await createOrder(orderPayload);
      } catch (backendErr) {
        console.warn('Backend unavailable, creating local resilient order:', backendErr.message);
        // Fallback local order creation
        const orderNumber = "CH-2026-" + Math.floor(10000 + Math.random() * 90000);
        order = {
          orderNumber,
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress: fullShippingAddress,
          city: province,
          province,
          district,
          commune,
          notes,
          paymentMethod,
          paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
          orderStatus: 'PENDING',
          currency: 'USD',
          subtotal: cartSubtotal,
          deliveryFee,
          discountAmount: discountAmount || 0,
          totalAmount: calculatedGrandTotal,
          amountKhr: grandTotalKhr,
          createdAt: new Date().toISOString(),
          items: cartItems.map(item => ({
            productName: item.product.name,
            deviceModel: item.product.model || item.product.deviceModel,
            selectedColor: item.selectedColor,
            price: item.price,
            quantity: item.quantity,
            itemTotal: Number(item.price) * item.quantity,
            imageUrl: item.product.imageUrl
          }))
        };
        // Persist to localStorage so OrderTrackingView & Admin can read it!
        try {
          const existing = JSON.parse(localStorage.getItem('casehaven_orders') || '[]');
          localStorage.setItem('casehaven_orders', JSON.stringify([order, ...existing]));

          // Also sync to Zando POS Admin Orders & Customer via syncBridge!
          const posOrder = {
            id: order.orderNumber || `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
            customer: customerName || order.customerName || 'Online Customer',
            phone: customerPhone || order.customerPhone || '012 345 678',
            email: customerEmail || order.customerEmail || '',
            itemsCount: cartItems.length,
            totalUsd: Number(order.finalTotalUsd || cartSubtotal),
            totalKhr: Math.round(Number(order.finalTotalUsd || cartSubtotal) * 4100),
            paymentMethod: paymentMethod === 'KHQR' ? 'Bakong KHQR' : 'Cash on Delivery',
            status: paymentMethod === 'KHQR' ? 'Pending' : 'Completed',
            source: 'Storefront Web',
            date: new Date().toLocaleString(),
            items: cartItems.map(it => ({
              id: it.id,
              name: it.name,
              qty: it.quantity,
              price: it.price
            }))
          };
          const custProfile = {
            name: customerName || order.customerName || 'Online Customer',
            phone: customerPhone || order.customerPhone || '012 345 678',
            email: customerEmail || order.customerEmail || '',
            address: `${streetAddress ? streetAddress + ', ' : ''}${commune}, ${district}, ${province}`,
            city: province,
            tier: 'Standard Member'
          };
          syncBridge.recordOrder(posOrder, custProfile);
        } catch (_) {}
      }

      setCreatedOrder(order);
      setLoading(false);

      if (paymentMethod === 'KHQR') {
        setStep(3); // Proceed to KHQR scan screen
      } else {
        // COD order is placed directly
        clearCart();
        setStep(4);
        triggerSuccessCelebration();
      }
    } catch (err) {
      setLoading(false);
      setErrorMessage(err.message || 'Failed to place order. Please check item stock.');
    }
  };

  const handleKhqrPaymentSuccess = (updatedOrder) => {
    const finalOrder = {
      ...createdOrder,
      ...updatedOrder,
      paymentStatus: 'PAID',
      paidAt: new Date().toISOString(),
      orderStatus: 'CONFIRMED'
    };
    setCreatedOrder(finalOrder);
    // Update local storage copy if exists
    try {
      const existing = JSON.parse(localStorage.getItem('casehaven_orders') || '[]');
      const updatedList = existing.map(o => o.orderNumber === finalOrder.orderNumber ? finalOrder : o);
      localStorage.setItem('casehaven_orders', JSON.stringify(updatedList));

      // Also update status to Paid in POS Admin Orders via syncBridge
      const adminOrders = JSON.parse(localStorage.getItem('zando_admin_orders_v1') || '[]');
      const updatedAdmin = adminOrders.map(o => (o.id === finalOrder.orderNumber ? { ...o, status: 'Paid' } : o));
      localStorage.setItem('zando_admin_orders_v1', JSON.stringify(updatedAdmin));
      const targetOrder = updatedAdmin.find(o => o.id === finalOrder.orderNumber);
      if (targetOrder) {
        syncBridge.recordOrder(targetOrder, null);
      }
    } catch (_) {}
    clearCart();
    setStep(4);
    triggerSuccessCelebration();
  };

  const triggerSuccessCelebration = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (_) {}
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 70,
      background: 'rgba(0, 0, 0, 0.82)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div
        className="glass-modal animate-fade"
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '92vh',
          overflowY: 'auto',
          borderRadius: '24px',
          padding: '30px',
          position: 'relative'
        }}
      >
        {/* Header & Close */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff' }}>
              {step === 1 && (lang === 'km' ? '១. ព័ត៌មានអតិថិជន & អាសយដ្ឋានដឹកជញ្ជូន' : '1. Contact & Cambodian Address')}
              {step === 2 && (lang === 'km' ? '២. វិធីសាស្ត្រទូទាត់ប្រាក់' : '2. Payment Method')}
              {step === 3 && (lang === 'km' ? '៣. ស្កេនទូទាត់ជាមួយ បាគង KHQR' : '3. Scan with Bakong KHQR')}
              {step === 4 && (lang === 'km' ? 'ការបញ្ជាទិញជោគជ័យ!' : 'Order Confirmed!')}
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              {step < 4 ? `Step ${step} of 3 • CaseHaven Fast Checkout` : 'Your phone case order is reserved and being processed'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Step Indicator */}
        {step < 4 && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            {[1, 2, 3].map(s => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: '2px',
                  background: step >= s ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)',
                  transition: 'background 0.3s ease'
                }}
              />
            ))}
          </div>
        )}

        {errorMessage && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            padding: '12px',
            color: '#f87171',
            fontSize: '0.85rem',
            marginBottom: '20px'
          }}>
            {errorMessage}
          </div>
        )}

        {/* STEP 1: Customer Contact & Cambodian 4-Level Address */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Customer Account Banner */}
            {currentUser ? (
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                borderRadius: '12px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.82rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#93c5fd' }}>
                  <User size={16} />
                  <span>{lang === 'km' ? 'បានចូលគណនីជា:' : 'Signed in as:'} <strong>{currentUser.fullName}</strong> ({currentUser.email})</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('casehaven_token');
                    setCurrentUser(null);
                  }}
                  style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.75rem' }}
                >
                  {lang === 'km' ? 'ចាកចេញ' : 'Sign out'}
                </button>
              </div>
            ) : (
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.82rem'
              }}>
                <span style={{ color: '#cbd5e1' }}>
                  {lang === 'km' ? 'មានគណនីរួចហើយ?' : 'Already have an account?'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowAuthForm(!showAuthForm)}
                  style={{
                    background: 'rgba(59, 130, 246, 0.2)',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    color: '#60a5fa',
                    borderRadius: '8px',
                    padding: '4px 10px',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontWeight: '600'
                  }}
                >
                  {showAuthForm ? (lang === 'km' ? 'បិទ' : 'Close') : (lang === 'km' ? 'ចូលគណនី' : 'Sign In')}
                </button>
              </div>
            )}

            {/* In-Line Customer Login / Register Form */}
            {showAuthForm && !currentUser && (
              <form onSubmit={handleAuthSubmit} style={{
                background: '#0e1624',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: authMode === 'login' ? '#3b82f6' : '#64748b',
                      fontWeight: authMode === 'login' ? '700' : '400',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    {lang === 'km' ? 'ចូលគណនី' : 'Sign In'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: authMode === 'register' ? '#3b82f6' : '#64748b',
                      fontWeight: authMode === 'register' ? '700' : '400',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    {lang === 'km' ? 'ចុះឈ្មោះគណនីថ្មី' : 'Create Account'}
                  </button>
                </div>

                {authError && (
                  <div style={{ color: '#f87171', fontSize: '0.78rem' }}>{authError}</div>
                )}

                {authMode === 'register' && (
                  <input
                    type="text"
                    required
                    placeholder="Full Name (e.g. Nha)"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="input-field"
                    style={{ fontSize: '0.82rem', padding: '8px 12px' }}
                  />
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <input
                    type="email"
                    required
                    placeholder="Email address"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="input-field"
                    style={{ fontSize: '0.82rem', padding: '8px 12px' }}
                  />
                  <input
                    type="password"
                    required
                    placeholder="Password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="input-field"
                    style={{ fontSize: '0.82rem', padding: '8px 12px' }}
                  />
                </div>

                {authMode === 'register' && (
                  <input
                    type="tel"
                    placeholder="Phone (e.g. 012 345 678)"
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    className="input-field"
                    style={{ fontSize: '0.82rem', padding: '8px 12px' }}
                  />
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="btn-primary"
                  style={{ padding: '8px', fontSize: '0.85rem', width: '100%' }}
                >
                  {authLoading ? 'Processing...' : (authMode === 'login' ? 'Sign In & Auto-fill' : 'Create Account & Auto-fill')}
                </button>
              </form>
            )}

            {/* Contact Information Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                  {lang === 'km' ? 'ឈ្មោះអ្នកទទួល *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nha Developer"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="input-field"
                  style={{ fontSize: '0.85rem', padding: '9px 12px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                  {lang === 'km' ? 'លេខទូរស័ព្ទដឹកជញ្ជូន *' : 'Phone Number (for delivery) *'}
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 012 345 678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="input-field"
                  style={{ fontSize: '0.85rem', padding: '9px 12px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                  {lang === 'km' ? 'អ៊ីមែល (សម្រាប់វិក្កយបត្រ) *' : 'Email (for digital invoice) *'}
                </label>
                <input
                  type="email"
                  required
                  placeholder="nha@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="input-field"
                  style={{ fontSize: '0.85rem', padding: '9px 12px' }}
                />
              </div>
            </div>

            {/* Cambodian 4-Level Address Selectors */}
            <div style={{
              background: '#0d1522',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} />
                <span>{lang === 'km' ? 'អាសយដ្ឋានដឹកជញ្ជូននៅកម្ពុជា (Cambodian Delivery Address)' : 'Cambodian Administrative Delivery Address'}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                {/* Level 1: Province / Capital */}
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: '600', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    {lang === 'km' ? '១. រាជធានី / ខេត្ត *' : '1. Province / Capital *'}
                  </label>
                  <select
                    value={province}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                    className="input-field"
                    style={{ fontSize: '0.82rem', padding: '8px 10px' }}
                  >
                    {provinceList.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* Level 2: District / Khan */}
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: '600', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    {lang === 'km' ? '២. ក្រុង / ស្រុក / ខណ្ឌ *' : '2. District / Khan *'}
                  </label>
                  <select
                    value={district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="input-field"
                    style={{ fontSize: '0.82rem', padding: '8px 10px' }}
                  >
                    {districtList.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Level 3: Commune / Sangkat */}
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: '600', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    {lang === 'km' ? '៣. ឃុំ / សង្កាត់ *' : '3. Commune / Sangkat *'}
                  </label>
                  <select
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    className="input-field"
                    style={{ fontSize: '0.82rem', padding: '8px 10px' }}
                  >
                    {communeList.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Level 4: Street / House No / Landmark */}
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: '600', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                  {lang === 'km' ? '៤. ផ្លូវលេខ / ផ្ទះលេខ / ទីតាំងចំណាំ *' : '4. Street / Building / House No. / Landmark *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'km' ? 'ឧ. ផ្ទះលេខ 24B, ផ្លូវ 106, ក្បែរផ្សារ' : 'e.g. House #24B, Street 106, Near BKK Market'}
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="input-field"
                  style={{ fontSize: '0.82rem', padding: '8px 12px' }}
                />
              </div>
            </div>

            {/* Delivery Instructions */}
            <div>
              <label style={{ fontSize: '0.76rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                {lang === 'km' ? 'កំណត់សម្គាល់បន្ថែម (ស្រេចចិត្ត)' : 'Order Notes / Delivery Notes (Optional)'}
              </label>
              <textarea
                rows={2}
                placeholder={lang === 'km' ? 'ឧ. សូមទូរស័ព្ទមុនពេលមកដល់ ឬផ្ញើទុកនៅតុទទួលភ្ញៀវ' : 'e.g. Call 10 mins before arrival or leave with security'}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input-field"
                style={{ resize: 'vertical', fontSize: '0.8rem', padding: '8px 10px' }}
              />
            </div>

            {/* Subtotal & Next Step CTA */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              padding: '14px 18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  {lang === 'km' ? 'តម្លៃទំនិញសរុប:' : 'Order Total:'} ({cartItems.reduce((s, i) => s + i.quantity, 0)} {lang === 'km' ? 'គ្រឿង' : 'cases'})
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff' }}>
                  ${calculatedGrandTotal.toFixed(2)}
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginLeft: '6px' }}>
                    ({grandTotalKhr.toLocaleString()} ៛)
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  if (!customerName || !customerPhone || !customerEmail || !streetAddress) {
                    setErrorMessage(lang === 'km' ? 'សូមបំពេញ ឈ្មោះ, លេខទូរស័ព្ទ, អ៊ីមែល និងអាសយដ្ឋានផ្លូវលេខ' : 'Please fill in your name, phone number, email, and street address');
                    return;
                  }
                  setErrorMessage('');
                  setStep(2);
                }}
                className="btn-primary"
                style={{ padding: '10px 22px', fontSize: '0.9rem' }}
              >
                <span>{lang === 'km' ? 'បន្តទៅជ្រើសរើសការទូទាត់' : 'Continue to Payment'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Payment Method Selection */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Option 1: Bakong KHQR */}
              <div
                onClick={() => setPaymentMethod('KHQR')}
                style={{
                  border: paymentMethod === 'KHQR' ? '2px solid #d61827' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '16px',
                  background: paymentMethod === 'KHQR' ? 'rgba(214, 24, 39, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: '#d61827',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    flexShrink: 0
                  }}>
                    <QrCode size={24} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: '700', color: '#ffffff', fontSize: '1rem' }}>Bakong KHQR</span>
                      <span style={{
                        background: 'rgba(214, 24, 39, 0.2)',
                        color: '#f87171',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        {lang === 'km' ? 'ណែនាំខ្លាំង' : 'RECOMMENDED'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                      {lang === 'km'
                        ? 'ស្កេនទូទាត់រហ័សជាមួយ ABA, ACLEDA, Bakong, Wing ឬ App ធនាគារទាំងអស់នៅកម្ពុជា។'
                        : 'Scan with ABA Mobile, ACLEDA, Bakong, Wing, or any Cambodian banking app.'}
                    </p>
                  </div>
                </div>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: paymentMethod === 'KHQR' ? '5px solid #d61827' : '2px solid rgba(255, 255, 255, 0.2)',
                  background: paymentMethod === 'KHQR' ? '#ffffff' : 'transparent'
                }} />
              </div>

              {/* Option 2: Cash on Delivery (COD) */}
              <div
                onClick={() => setPaymentMethod('COD')}
                style={{
                  border: paymentMethod === 'COD' ? '2px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '16px',
                  background: paymentMethod === 'COD' ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: '#1e3a8a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#60a5fa',
                    flexShrink: 0
                  }}>
                    <Banknote size={24} />
                  </div>
                  <div>
                    <span style={{ fontWeight: '700', color: '#ffffff', fontSize: '1rem' }}>
                      {lang === 'km' ? 'ទូទាត់ពេលទទួលទំនិញ (COD)' : 'Cash on Delivery (COD)'}
                    </span>
                    <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                      {lang === 'km'
                        ? 'ទូទាត់ជាសាច់ប្រាក់សុទ្ធ ឬផ្ទេរប្រាក់ពេលអ្នកដឹកជញ្ជូនយកមកដល់ផ្ទះ។'
                        : 'Pay cash directly to the delivery rider upon inspecting the package.'}
                    </p>
                  </div>
                </div>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: paymentMethod === 'COD' ? '5px solid #3b82f6' : '2px solid rgba(255, 255, 255, 0.2)',
                  background: paymentMethod === 'COD' ? '#ffffff' : 'transparent'
                }} />
              </div>
            </div>

            {/* Detailed Order Breakdown */}
            <div style={{
              background: '#0d1522',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontSize: '0.82rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>{t('subtotal')} ({cartItems.reduce((s, i) => s + i.quantity, 0)} {lang === 'km' ? 'គ្រឿង' : 'cases'})</span>
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                  <span>{lang === 'km' ? `បញ្ចុះតម្លៃ (${discountPercent}%)` : `Discount (${discountPercent}%)`}</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>{lang === 'km' ? 'សេវាដឹកជញ្ជូនរហ័សកម្ពុជា' : 'Cambodia Express Delivery'}</span>
                <span>{deliveryFee === 0 ? <strong style={{ color: '#10b981' }}>{t('free')}</strong> : '$1.50 (6,150 ៛)'}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '8px',
                fontSize: '1.15rem',
                fontWeight: '800',
                color: '#ffffff'
              }}>
                <span>{t('total')}</span>
                <div style={{ textAlign: 'right' }}>
                  <div>${calculatedGrandTotal.toFixed(2)}</div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: '500' }}>
                    {grandTotalKhr.toLocaleString()} ៛
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-secondary"
                style={{ flex: 1, padding: '12px', fontSize: '0.9rem' }}
              >
                {lang === 'km' ? 'ថយក្រោយ' : 'Back to Contact'}
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={handleCreateOrder}
                className="btn-primary"
                style={{
                  flex: 2,
                  padding: '12px',
                  fontSize: '0.95rem',
                  background: paymentMethod === 'KHQR' ? 'linear-gradient(135deg, #d61827, #b91c1c)' : undefined
                }}
              >
                {loading ? (
                  <span>{lang === 'km' ? 'កំពុងដំណើរការ...' : 'Placing Order...'}</span>
                ) : paymentMethod === 'KHQR' ? (
                  <>
                    <QrCode size={18} />
                    <span>{lang === 'km' ? 'បង្កើតបាគង KHQR ឥឡូវនេះ' : 'Generate Bakong KHQR'}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    <span>{lang === 'km' ? 'បញ្ជាក់ការបញ្ជាទិញ (COD)' : 'Confirm Order (COD)'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Real-Time Bakong KHQR Payment Screen */}
        {step === 3 && createdOrder && (
          <BakongKhqrCard
            order={createdOrder}
            onPaymentSuccess={handleKhqrPaymentSuccess}
            onCancel={() => setStep(2)}
          />
        )}

        {/* STEP 4: Order Confirmation / Success View */}
        {step === 4 && createdOrder && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff', marginBottom: '4px' }}>
              {lang === 'km' ? 'ការបញ្ជាទិញបានជោគជ័យ!' : 'Order Placed Successfully!'}
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '20px' }}>
              {lang === 'km'
                ? 'យើងខ្ញុំបានទទួលការបញ្ជាទិញរបស់អ្នកហើយ។ វិក្កយបត្រត្រូវបានផ្ញើទៅកាន់អ៊ីមែលរបស់អ្នក។'
                : 'Thank you for shopping at CaseHaven. Your phone case will be dispatched shortly.'}
            </p>

            {/* Order Receipt Box */}
            <div style={{
              background: '#0d1522',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'left',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '12px', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>{lang === 'km' ? 'លេខកូដបញ្ជាទិញ' : 'Order Reference'}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#38bdf8' }}>{createdOrder.orderNumber}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>{lang === 'km' ? 'ស្ថានភាពការទូទាត់' : 'Payment Status'}</div>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    background: createdOrder.paymentStatus === 'PAID' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: createdOrder.paymentStatus === 'PAID' ? '#34d399' : '#fbbf24'
                  }}>
                    {createdOrder.paymentStatus} ({createdOrder.paymentMethod})
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                <div>
                  <span style={{ color: '#64748b' }}>{lang === 'km' ? 'អតិថិជន:' : 'Customer:'}</span> {createdOrder.customerName}
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>{lang === 'km' ? 'ទូរស័ព្ទ:' : 'Phone:'}</span> {createdOrder.customerPhone}
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ color: '#64748b' }}>{lang === 'km' ? 'អាសយដ្ឋានដឹក:' : 'Delivery To:'}</span> {createdOrder.shippingAddress}
                </div>
                <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '8px' }}>
                  <span style={{ color: '#64748b' }}>{lang === 'km' ? 'ទឹកប្រាក់សរុប:' : 'Total Amount:'}</span>
                  <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>
                    ${Number(createdOrder.totalAmount).toFixed(2)} ({Number(createdOrder.amountKhr || 0).toLocaleString()} ៛)
                  </strong>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  onClose();
                  if (onViewOrderTrack) onViewOrderTrack(createdOrder.orderNumber);
                }}
                className="btn-primary"
                style={{ flex: 1, padding: '12px', fontSize: '0.9rem' }}
              >
                {lang === 'km' ? 'តាមដានស្ថានភាពទំនិញ' : 'Track Order Status'}
              </button>
              <button
                onClick={onClose}
                className="btn-secondary"
                style={{ flex: 1, padding: '12px', fontSize: '0.9rem' }}
              >
                {lang === 'km' ? 'បន្តទិញទំនិញ' : 'Back to Store'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
