import React, { useState, useEffect } from 'react';
import { Search, Compass, Package, CheckCircle2, Clock, Truck, Home, ShieldAlert, ArrowLeft, QrCode, Printer, MapPin, User, Phone, Mail, FileText, Check, ShieldCheck, XCircle } from 'lucide-react';
import { getOrderByNumber, getOrdersByPhone, getOrdersByEmail, getCurrentUser, getAuthToken } from '../api/client';
import { BakongKhqrCard } from './BakongKhqrCard';
import { useLanguage } from '../context/LanguageContext';

export function OrderTrackingView({ initialOrderNumber, onBackToShop }) {
  const { lang, t } = useLanguage();

  const [query, setQuery] = useState(initialOrderNumber || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [showKhqrModal, setShowKhqrModal] = useState(false);
  const [activeTab, setActiveTab] = useState('lookup'); // 'lookup' | 'history'
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    checkLoggedInUser();
    if (initialOrderNumber) {
      handleSearch(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const checkLoggedInUser = async () => {
    const token = getAuthToken();
    if (token) {
      try {
        const user = await getCurrentUser();
        if (user) {
          setCurrentUser(user);
          loadCustomerHistory(user.email || user.phone);
        }
      } catch (_) {}
    }
  };

  const loadCustomerHistory = async (identifier) => {
    if (!identifier) return;
    try {
      let orders = [];
      if (identifier.includes('@')) {
        orders = await getOrdersByEmail(identifier);
      } else {
        orders = await getOrdersByPhone(identifier);
      }
      if (orders && orders.length > 0) {
        setCustomerOrders(orders);
        if (!initialOrderNumber) {
          setOrder(orders[0]);
        }
      }
    } catch (_) {}
  };

  const handleSearch = async (lookupQuery) => {
    const term = (lookupQuery !== undefined ? lookupQuery : query).trim();
    if (!term) return;

    try {
      setLoading(true);
      setError('');
      setOrder(null);
      setCustomerOrders([]);

      if (term.toUpperCase().startsWith('CH-')) {
        try {
          const res = await getOrderByNumber(term);
          setOrder(res);
        } catch (backendErr) {
          const localOrders = JSON.parse(localStorage.getItem('casehaven_orders') || '[]');
          const found = localOrders.find(o => o.orderNumber?.toUpperCase() === term.toUpperCase());
          if (found) {
            setOrder(found);
          } else {
            throw backendErr;
          }
        }
      } else if (term.includes('@')) {
        try {
          const results = await getOrdersByEmail(term);
          if (results && results.length > 0) {
            setCustomerOrders(results);
            setOrder(results[0]);
          } else {
            throw new Error('Not found');
          }
        } catch (_) {
          const localOrders = JSON.parse(localStorage.getItem('casehaven_orders') || '[]');
          const matched = localOrders.filter(o => o.customerEmail?.toLowerCase() === term.toLowerCase());
          if (matched.length > 0) {
            setCustomerOrders(matched);
            setOrder(matched[0]);
          } else {
            setError(lang === 'km' ? 'រកមិនឃើញការបញ្ជាទិញសម្រាប់អ៊ីមែលនេះទេ។' : 'No orders found for this email address.');
          }
        }
      } else {
        try {
          const results = await getOrdersByPhone(term);
          if (results && results.length > 0) {
            setCustomerOrders(results);
            setOrder(results[0]);
          } else {
            throw new Error('Not found');
          }
        } catch (_) {
          const localOrders = JSON.parse(localStorage.getItem('casehaven_orders') || '[]');
          const matched = localOrders.filter(o => o.customerPhone === term);
          if (matched.length > 0) {
            setCustomerOrders(matched);
            setOrder(matched[0]);
          } else {
            setError(lang === 'km' ? 'រកមិនឃើញការបញ្ជាទិញសម្រាប់លេខទូរស័ព្ទនេះទេ។' : 'No orders found for this phone number.');
          }
        }
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(lang === 'km'
        ? `រកមិនឃើញលេខបញ្ជាទិញ "${term}" ទេ។ សូមពិនិត្យមើលម្តងទៀត។`
        : `Could not find order "${term}". Please check the order number.`);
    }
  };

  const getStepIndex = (status, paymentStatus) => {
    if (status === 'CANCELLED') return -1;
    if (status === 'DELIVERED') return 4;
    if (status === 'SHIPPED') return 3;
    if (status === 'PROCESSING') return 2;
    if (paymentStatus === 'PAID') return 1;
    return 0; // PENDING
  };

  const currentStep = order ? getStepIndex(order.orderStatus, order.paymentStatus) : 0;

  const steps = [
    {
      label: lang === 'km' ? 'បានបញ្ជាទិញ' : 'Order Placed',
      desc: lang === 'km' ? 'ប្រព័ន្ធបានទទួលទិន្នន័យ' : 'Received by system',
      icon: Package
    },
    {
      label: lang === 'km' ? 'ផ្ទៀងផ្ទាត់ការទូទាត់' : 'Payment Confirmed',
      desc: order?.paymentStatus === 'PAID' ? 'Bakong KHQR ✓' : (lang === 'km' ? 'កំពុងរង់ចាំការទូទាត់' : 'Pending payment'),
      icon: CheckCircle2
    },
    {
      label: lang === 'km' ? 'វេចខ្ចប់ទំនិញ' : 'Quality Inspection & Packing',
      desc: lang === 'km' ? 'ត្រួតពិនិត្យស្រោមទូរស័ព្ទ' : 'Armor check & boxing',
      icon: Clock
    },
    {
      label: lang === 'km' ? 'កំពុងដឹកជញ្ជូន' : 'Out for Delivery',
      desc: lang === 'km' ? 'ជាមួយអ្នកដឹកជញ្ជូនរហ័ស' : 'With express rider',
      icon: Truck
    },
    {
      label: lang === 'km' ? 'បានទទួលទំនិញ' : 'Delivered',
      desc: lang === 'km' ? 'ទំនិញបានដល់ដៃអតិថិជន' : 'Package received',
      icon: Home
    }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Back Button */}
      <button
        onClick={onBackToShop}
        style={{
          background: 'none',
          border: 'none',
          color: '#94a3b8',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          fontSize: '0.88rem',
          marginBottom: '20px'
        }}
      >
        <ArrowLeft size={16} />
        <span>{lang === 'km' ? 'ត្រឡប់ទៅកាន់ទំព័រមុខទំនិញ' : 'Back to Store Catalog'}</span>
      </button>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '14px',
          background: 'rgba(59, 130, 246, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px auto'
        }}>
          <Compass size={24} color="#3b82f6" />
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#ffffff', marginBottom: '6px' }}>
          {lang === 'km' ? 'តាមដានស្ថានភាពការបញ្ជាទិញ' : 'Customer Order Tracking & History'}
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          {lang === 'km'
            ? 'ពិនិត្យមើលដំណាក់កាលដឹកជញ្ជូន វិក្កយបត្រឌីជីថល និងការបញ្ជាក់ការទូទាត់ បាគង KHQR ក្នុងពេលជាក់ស្តែង។'
            : 'Track express courier progress, digital invoice breakdown, and NBC Bakong KHQR verification in real time.'}
        </p>
      </div>

      {/* Tabs: Search vs Account History */}
      {currentUser && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '8px' }}>
          <button
            onClick={() => setActiveTab('lookup')}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'lookup' ? '#3b82f6' : '#64748b',
              fontWeight: activeTab === 'lookup' ? '700' : '400',
              borderBottom: activeTab === 'lookup' ? '2px solid #3b82f6' : 'none',
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: '0.88rem'
            }}
          >
            {lang === 'km' ? 'ស្វែងរកការបញ្ជាទិញ' : 'Order Lookup'}
          </button>
          <button
            onClick={() => {
              setActiveTab('history');
              loadCustomerHistory(currentUser.email || currentUser.phone);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'history' ? '#3b82f6' : '#64748b',
              fontWeight: activeTab === 'history' ? '700' : '400',
              borderBottom: activeTab === 'history' ? '2px solid #3b82f6' : 'none',
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: '0.88rem'
            }}
          >
            {lang === 'km' ? `ប្រវត្តិបញ្ជាទិញរបស់ខ្ញុំ (${customerOrders.length})` : `My Past Orders (${customerOrders.length})`}
          </button>
        </div>
      )}

      {/* Search Box */}
      {activeTab === 'lookup' && (
        <div style={{
          background: '#111927',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '18px',
          marginBottom: '28px'
        }}>
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ position: 'relative', flex: '1 1 280px' }}>
              <Search size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder={lang === 'km' ? 'បញ្ចូលលេខកូដបញ្ជាទិញ (ឧ. CH-2026-XXXX) ឬលេខទូរស័ព្ទ ឬអ៊ីមែល...' : 'Enter Order Reference (e.g. CH-2026-XXXX), Phone Number, or Email...'}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '38px', fontSize: '0.85rem' }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ padding: '10px 22px', flexShrink: 0, fontSize: '0.88rem' }}
            >
              {loading ? (lang === 'km' ? 'កំពុងស្វែងរក...' : 'Locating...') : (lang === 'km' ? 'តាមដាន' : 'Track Order')}
            </button>
          </form>

          {error && (
            <div style={{ marginTop: '10px', fontSize: '0.82rem', color: '#f87171' }}>
              {error}
            </div>
          )}
        </div>
      )}

      {/* Multiple Orders / History Selector */}
      {customerOrders.length > 1 && (
        <div style={{ marginBottom: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            {lang === 'km' ? 'ជ្រើសរើសការបញ្ជាទិញ:' : 'Select Order:'}
          </span>
          {customerOrders.map(o => (
            <button
              key={o.orderNumber}
              onClick={() => setOrder(o)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: order?.orderNumber === o.orderNumber ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                background: order?.orderNumber === o.orderNumber ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.04)',
                color: '#ffffff',
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              {o.orderNumber} • ${Number(o.totalAmount).toFixed(2)} ({o.orderStatus})
            </button>
          ))}
        </div>
      )}

      {/* Order Details & Timeline Card */}
      {order && (
        <div className="glass-panel animate-fade" style={{ padding: '28px' }}>
          {/* Order Header */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '18px', marginBottom: '24px' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {lang === 'km' ? 'លេខកូដបញ្ជាទិញ' : 'Order Reference'}
              </span>
              <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#38bdf8' }}>{order.orderNumber}</h2>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                {lang === 'km' ? 'បានបញ្ជាទិញនៅ: ' : 'Placed on: '} {new Date(order.createdAt).toLocaleString()}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{
                background: order.paymentStatus === 'PAID' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                color: order.paymentStatus === 'PAID' ? '#34d399' : '#fbbf24',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: '700'
              }}>
                {order.paymentStatus === 'PAID' ? '✓ PAID (Bakong KHQR)' : `${order.paymentStatus} (${order.paymentMethod})`}
              </span>

              {order.paymentStatus !== 'PAID' && order.paymentMethod === 'KHQR' && (
                <button
                  onClick={() => setShowKhqrModal(true)}
                  className="btn-primary"
                  style={{
                    padding: '6px 14px',
                    fontSize: '0.8rem',
                    background: 'linear-gradient(135deg, #d61827, #b91c1c)'
                  }}
                >
                  <QrCode size={15} />
                  <span>{lang === 'km' ? 'ស្កេន KHQR ឥឡូវនេះ' : 'Scan KHQR Now'}</span>
                </button>
              )}

              <button
                onClick={handlePrint}
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Printer size={15} />
                <span>{lang === 'km' ? 'បោះពុម្ពវិក្កយបត្រ' : 'Print Receipt'}</span>
              </button>
            </div>
          </div>

          {/* Fulfillment Progress Timeline */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: '700', color: '#ffffff', marginBottom: '16px' }}>
              {lang === 'km' ? 'ដំណាក់កាលនៃការដឹកជញ្ជូន' : 'Fulfillment & Delivery Stepper'}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', position: 'relative' }}>
              {steps.map((s, idx) => {
                const Icon = s.icon;
                const isCompleted = idx <= currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <div
                    key={idx}
                    style={{
                      background: isCurrent ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      border: isCurrent ? '1px solid #3b82f6' : isCompleted ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '12px 10px',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: isCompleted ? '#10b981' : 'rgba(255, 255, 255, 0.08)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 8px auto'
                    }}>
                      <Icon size={17} />
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: '700', color: isCompleted ? '#ffffff' : '#64748b' }}>
                      {s.label}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                      {s.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer & Delivery Destination Details */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            marginBottom: '28px',
            background: '#0a0e17',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                {lang === 'km' ? 'ព័ត៌មានអ្នកទទួល' : 'Customer & Contact'}
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#ffffff' }}>{order.customerName}</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Phone: {order.customerPhone}</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Email: {order.customerEmail}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                {lang === 'km' ? 'អាសយដ្ឋានដឹកជញ្ជូននៅកម្ពុជា' : 'Cambodian Shipping Destination'}
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>{order.shippingAddress}</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                {order.province || order.city} {order.district ? `• ${order.district}` : ''} {order.commune ? `• ${order.commune}` : ''}
              </div>
              {order.notes && (
                <div style={{ fontSize: '0.78rem', color: '#fbbf24', marginTop: '4px' }}>
                  Note: {order.notes}
                </div>
              )}
            </div>

            {/* Bakong KHQR Verification Badge */}
            {order.paymentMethod === 'KHQR' && (
              <div style={{
                background: 'rgba(214, 24, 39, 0.08)',
                border: '1px solid rgba(214, 24, 39, 0.25)',
                borderRadius: '8px',
                padding: '10px',
                gridColumn: '1 / -1'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <ShieldCheck size={16} color="#f87171" />
                  <span style={{ fontWeight: '700', color: '#f87171', fontSize: '0.8rem' }}>
                    NBC Bakong KHQR EMVCo Verified
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', wordBreak: 'break-all' }}>
                  Transaction MD5: {order.khqrMd5 || 'Verified on Bakong Network'} • Settled: {order.paidAt ? new Date(order.paidAt).toLocaleString() : 'Awaiting Settlement'}
                </div>
              </div>
            )}
          </div>

          {/* Ordered Line Items List */}
          <div>
            <h3 style={{ fontSize: '0.92rem', fontWeight: '700', color: '#ffffff', marginBottom: '12px' }}>
              {lang === 'km' ? 'មុខទំនិញក្នុងកញ្ចប់នេះ' : 'Package Contents & Line Items'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {order.items && order.items.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: '#131b29',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '6px', overflow: 'hidden', background: '#0a0e17', flexShrink: 0 }}>
                      <img src={item.imageUrl} alt={item.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#ffffff' }}>{item.productName}</div>
                      <div style={{ fontSize: '0.74rem', color: '#60a5fa' }}>
                        {item.productModel} • {item.selectedColor} ({lang === 'km' ? 'ចំនួន' : 'Qty'}: {item.quantity})
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '700', color: '#ffffff', fontSize: '0.9rem' }}>
                      ${Number(item.subtotal).toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                      ({Math.round(Number(item.subtotal) * 4100).toLocaleString()} ៛)
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Breakdown */}
            <div style={{
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              fontSize: '0.82rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>{t('subtotal')}</span>
                <span>${Number(order.subtotal || order.totalAmount).toFixed(2)}</span>
              </div>
              {Number(order.discountAmount || 0) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                  <span>{lang === 'km' ? 'បញ្ចុះតម្លៃ' : 'Discount'}</span>
                  <span>-${Number(order.discountAmount).toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>{t('delivery_fee')}</span>
                <span>{Number(order.deliveryFee || 0) === 0 ? <strong style={{ color: '#10b981' }}>{t('free')}</strong> : `$${Number(order.deliveryFee).toFixed(2)}`}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '8px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '1.15rem',
                fontWeight: '800',
                color: '#ffffff'
              }}>
                <span>{t('total')}</span>
                <div style={{ textAlign: 'right' }}>
                  <div>${Number(order.totalAmount).toFixed(2)}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500' }}>
                    {Number(order.amountKhr || Math.round(Number(order.totalAmount) * 4100)).toLocaleString()} ៛
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Re-Open KHQR Modal if pending payment */}
      {showKhqrModal && order && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 80,
          background: 'rgba(0,0,0,0.82)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowKhqrModal(false)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                color: '#ffffff',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
            <BakongKhqrCard
              order={order}
              onPaymentSuccess={(updated) => {
                setOrder(updated);
                setShowKhqrModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
