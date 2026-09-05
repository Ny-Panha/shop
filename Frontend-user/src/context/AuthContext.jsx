import React, { createContext, useContext, useState, useEffect } from 'react';
import { syncBridge } from '../services/syncBridge';

const AuthContext = createContext();

const STORAGE_KEY_USER = 'zando_customer_user_v1';
const STORAGE_KEY_ORDERS = 'zando_admin_orders_v1';

const DEMO_USER = {
  id: 'CUST-8801',
  name: 'Nha Panha',
  phone: '012 889 900',
  email: 'nha.panha@bbu.edu.kh',
  address: 'Street 102, Sangkat Svay Por, Battambang City',
  city: 'Battambang',
  points: 240,
  tier: 'VIP Gold',
  joinedDate: '2026-01-15',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      try {
        syncBridge.updateCustomerProfile(user);
      } catch (_) {}
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [user]);

  const login = ({ phone, name, email }) => {
    const loggedUser = {
      id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name || 'Customer',
      phone: phone || '012 345 678',
      email: email || '',
      address: 'Phnom Penh / Battambang, Cambodia',
      city: 'Battambang',
      points: 50,
      tier: 'Standard Member',
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };
    setUser(loggedUser);
    setIsAuthModalOpen(false);
    return loggedUser;
  };

  const loginWithDemo = () => {
    setUser(DEMO_USER);
    setIsAuthModalOpen(false);
    return DEMO_USER;
  };

  const logout = () => {
    setUser(null);
    setIsProfileDrawerOpen(false);
  };

  const updateProfile = (data) => {
    setUser((prev) => {
      if (!prev) return null;
      return { ...prev, ...data };
    });
  };

  // Get orders belonging to this customer
  const getMyOrders = () => {
    try {
      const allOrders = JSON.parse(localStorage.getItem(STORAGE_KEY_ORDERS) || '[]');
      if (!user) return [];
      // Filter by customer phone or customer name, or show default demo orders if matching demo
      return allOrders.filter(
        (o) =>
          o.phone === user.phone ||
          (o.customer && o.customer.toLowerCase().includes(user.name.toLowerCase()))
      );
    } catch {
      return [];
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isAuthModalOpen,
        setIsAuthModalOpen,
        isProfileDrawerOpen,
        setIsProfileDrawerOpen,
        login,
        loginWithDemo,
        logout,
        updateProfile,
        getMyOrders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
