import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  User,
  ShoppingBag,
  MapPin,
  Award,
  LogOut,
  ExternalLink,
  Shield,
  ChevronRight,
  PackageCheck,
  Clock,
  Phone,
  Edit2,
  Save,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function CustomerProfileDrawer() {
  const { user, isProfileDrawerOpen, setIsProfileDrawerOpen, logout, updateProfile, getMyOrders } =
    useAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'address'
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressInput, setAddressInput] = useState('');

  if (!isProfileDrawerOpen || !user) return null;

  const orders = getMyOrders();

  const handleSaveAddress = () => {
    if (addressInput.trim()) {
      updateProfile({ address: addressInput.trim() });
    }
    setIsEditingAddress(false);
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 100,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
        onClick={() => setIsProfileDrawerOpen(false)}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 350, damping: 35 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '460px',
            backgroundColor: '#ffffff',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.15)',
          }}
        >
          {/* Header Profile Bar */}
          <div
            style={{
              padding: '24px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={16} style={{ color: '#10b981' }} />
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8' }}>
                  Zando Customer Account
                </span>
              </div>
              <button
                onClick={() => setIsProfileDrawerOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#ffffff',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* User Info Avatar Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  border: '2px solid #10b981',
                  overflow: 'hidden',
                  backgroundColor: '#1e293b',
                  flexShrink: 0,
                }}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
                  }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
                  {user.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: '#94a3b8', marginTop: '3px' }}>
                  <Phone size={13} />
                  <span>{user.phone}</span>
                </div>
              </div>

              {/* Loyalty Points Pill */}
              <div
                style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '6px 12px',
                  borderRadius: '999px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 600 }}>POINTS</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fbbf24' }}>{user.points || 150}</div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: '#f8fafc',
            }}
          >
            <button
              onClick={() => setActiveTab('orders')}
              style={{
                flex: 1,
                padding: '14px 0',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === 'orders' ? '2px solid #000000' : '2px solid transparent',
                color: activeTab === 'orders' ? '#000000' : '#64748b',
                fontWeight: activeTab === 'orders' ? 700 : 500,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <ShoppingBag size={16} />
              <span>{lang === 'km' ? 'ប្រវត្តិបញ្ជាទិញ' : 'My Orders'} ({orders.length})</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('address');
                setAddressInput(user.address || '');
              }}
              style={{
                flex: 1,
                padding: '14px 0',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === 'address' ? '2px solid #000000' : '2px solid transparent',
                color: activeTab === 'address' ? '#000000' : '#64748b',
                fontWeight: activeTab === 'address' ? 700 : 500,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <MapPin size={16} />
              <span>{lang === 'km' ? 'អាសយដ្ឋាន' : 'Saved Address'}</span>
            </button>
          </div>

          {/* Tab 1: Orders List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            {activeTab === 'orders' && (
              <div>
                {orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                    <PackageCheck size={44} style={{ color: '#cbd5e1', margin: '0 auto 12px' }} />
                    <h4 style={{ fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      {lang === 'km' ? 'មិនទាន់មានការបញ្ជាទិញទេ' : 'No orders yet'}
                    </h4>
                    <p style={{ fontSize: '0.85rem' }}>
                      {lang === 'km' ? 'ទំនិញដែលអ្នកបានកុម្ម៉ង់នឹងបង្ហាញនៅទីនេះ' : 'Orders you place will appear here'}
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        style={{
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '16px',
                          backgroundColor: '#ffffff',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <div>
                            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>
                              #{ord.id}
                            </span>
                            <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                              <Clock size={12} />
                              <span>{ord.date}</span>
                            </div>
                          </div>

                          <span
                            style={{
                              backgroundColor: ord.status === 'Paid' || ord.status === 'Completed' ? '#dcfce7' : '#fef3c7',
                              color: ord.status === 'Paid' || ord.status === 'Completed' ? '#15803d' : '#b45309',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              padding: '4px 10px',
                              borderRadius: '999px',
                            }}
                          >
                            {ord.status}
                          </span>
                        </div>

                        {/* Order Items preview */}
                        {ord.items && (
                          <div style={{ fontSize: '0.84rem', color: '#334155', margin: '8px 0', borderTop: '1px dashed #f1f5f9', paddingTop: '8px' }}>
                            {ord.items.map((it, idx) => (
                              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0' }}>
                                <span>{it.qty}x {it.name}</span>
                                <span style={{ fontWeight: 600 }}>${(it.price * it.qty).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Order Footer */}
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '12px',
                            paddingTop: '10px',
                            borderTop: '1px solid #f1f5f9',
                          }}
                        >
                          <div>
                            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Total: </span>
                            <strong style={{ fontSize: '1rem', color: '#0f172a' }}>${ord.totalUsd.toFixed(2)}</strong>
                          </div>

                          <button
                            onClick={() => {
                              setIsProfileDrawerOpen(false);
                              navigate(`/track?order=${ord.id}`);
                            }}
                            style={{
                              backgroundColor: '#0f172a',
                              color: '#ffffff',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <span>Track Order</span>
                            <ChevronRight size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Address */}
            {activeTab === 'address' && (
              <div style={{ padding: '8px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontWeight: 700, color: '#1e293b' }}>Default Shipping Address</h4>
                  {!isEditingAddress && (
                    <button
                      onClick={() => setIsEditingAddress(true)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#2563eb',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                  )}
                </div>

                {isEditingAddress ? (
                  <div>
                    <textarea
                      value={addressInput}
                      onChange={(e) => setAddressInput(e.target.value)}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => setIsEditingAddress(false)}
                        style={{
                          padding: '6px 12px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          background: '#fff',
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveAddress}
                        style={{
                          padding: '6px 14px',
                          border: 'none',
                          borderRadius: '6px',
                          background: '#000',
                          color: '#fff',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Save size={14} /> Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      padding: '14px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.9rem',
                      lineHeight: 1.5,
                      color: '#334155',
                    }}
                  >
                    <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{user.name} ({user.phone})</div>
                    <div>{user.address}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '6px' }}>City: {user.city}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Drawer Footer Actions */}
          <div
            style={{
              padding: '16px 20px',
              borderTop: '1px solid #e5e7eb',
              backgroundColor: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {/* Logout Button */}
            <button
              onClick={logout}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                border: '1px solid #fee2e2',
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <LogOut size={16} />
              <span>{lang === 'km' ? 'ចាកចេញពីគណនី (Sign Out)' : 'Sign Out'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
