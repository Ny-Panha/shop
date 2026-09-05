import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { adminStore } from '../../data/adminStore';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(4100);
  const navigate = useNavigate();

  const refreshCounts = () => {
    const p = adminStore.getProducts();
    const o = adminStore.getOrders();
    const c = adminStore.getCustomers();
    const cats = adminStore.getCategories();
    const s = adminStore.getSettings();
    setProductsCount(p.length);
    setOrdersCount(o.length);
    setCustomersCount(c.length);
    setCategoriesCount(cats.length);
    setExchangeRate(s.exchangeRate || 4100);
  };

  useEffect(() => {
    refreshCounts();

    const handleSync = () => refreshCounts();
    window.addEventListener('zando_store_sync', handleSync);
    return () => window.removeEventListener('zando_store_sync', handleSync);
  }, []);

  const handleOpenAddProduct = () => {
    navigate('/products');
  };

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        productsCount={productsCount}
        ordersCount={ordersCount}
        customersCount={customersCount}
        categoriesCount={categoriesCount}
      />

      {/* Main Panel */}
      <div className={`admin-main ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <Header onOpenAddProduct={handleOpenAddProduct} exchangeRate={exchangeRate} />
        <main style={{ flex: 1 }}>
          <Outlet context={{ refreshCounts }} />
        </main>
      </div>
    </div>
  );
}
