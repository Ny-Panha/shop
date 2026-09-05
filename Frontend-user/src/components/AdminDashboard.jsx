import React, { useState, useEffect } from 'react';
import {
  Package, ShoppingCart, DollarSign, AlertTriangle, Plus, Edit2, Trash2,
  RefreshCw, Check, X, ShieldAlert, SlidersHorizontal, ArrowLeft,
  Warehouse, ArrowUpRight, Layers, BarChart3, Search,
  Lock, CheckCircle2, QrCode
} from 'lucide-react';
import {
  getProducts, createProduct, updateProduct, deleteProduct, adjustProductStock,
  getAllOrders, updateOrderStatus, getAdminStats, getStockLogs, login, getCurrentUser, getAuthToken
} from '../api/client';
import { FALLBACK_PRODUCTS } from '../data/mockProducts';
import { useLanguage } from '../context/LanguageContext';
import { ShopToolsModal } from './ShopToolsModal';

export function AdminDashboard({ onBackToShop }) {
  const { lang, t } = useLanguage();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'products', 'orders', 'stockLogs'
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stockLogs, setStockLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Admin Auth Gate
  const [adminUser, setAdminUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState('admin@casehaven.kh');
  const [loginPassword, setLoginPassword] = useState('Admin@123456');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [stockAdjustProduct, setStockAdjustProduct] = useState(null);
  const [showToolsModal, setShowToolsModal] = useState(false);

  // Filters
  const [productSearch, setProductSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('ALL');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');

  // Stock Adjust Form
  const [adjustType, setAdjustType] = useState('STOCK_IN'); // 'STOCK_IN', 'STOCK_OUT', 'ADJUSTMENT', 'RETURN'
  const [adjustQty, setAdjustQty] = useState(10);
  const [adjustReason, setAdjustReason] = useState('Supplier restock delivery');
  const [adjustReference, setAdjustReference] = useState('PO-2026-001');

  // Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    sku: '',
    brand: 'APPLE',
    model: 'iPhone 16 Pro',
    category: 'MAGSAFE',
    price: '34.99',
    compareAtPrice: '42.00',
    stock: 25,
    lowStockThreshold: 8,
    shortDescription: 'Military-grade protective phone case with MagSafe alignment.',
    fullDescription: 'Crafted from aerospace-grade polycarbonate and shock-absorbing bumper.',
    features: 'MagSafe Ready, 13ft Drop Defense, Camera Control Cutout',
    specifications: 'Material: PC + TPU, Weight: 38g, Magnet: N52 Neodymium',
    compatibility: 'Apple iPhone 16 Pro (6.3-inch display)',
    imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
    colorOptions: 'Obsidian Black, Titanium Gray, Deep Blue',
    dropProtectionRating: '13ft / 4.0m Tested',
    isFeatured: true
  });

  useEffect(() => {
    checkAdminSession();
  }, []);

  const checkAdminSession = async () => {
    const token = getAuthToken();
    if (token) {
      try {
        const user = await getCurrentUser();
        if (user && (user.role === 'ROLE_ADMIN' || user.email === 'admin@casehaven.kh')) {
          setAdminUser(user);
          loadAllData();
          return;
        }
      } catch (_) {}
    }
    // Automatically login with seeded admin if local dev
    handleAdminLogin();
  };

  const handleAdminLogin = async (e) => {
    if (e) e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await login(loginEmail, loginPassword);
      localStorage.setItem('casehaven_token', res.token);
      setAdminUser(res.user);
      loadAllData();
    } catch (err) {
      setLoginError(err.message || 'Admin login failed');
      // If backend offline, allow demo admin session
      setAdminUser({ fullName: 'Administrator', email: loginEmail, role: 'ROLE_ADMIN' });
      loadAllData();
    } finally {
      setLoginLoading(false);
    }
  };

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [sData, pData, oData, lData] = await Promise.allSettled([
        getAdminStats(),
        getProducts({}),
        getAllOrders({}),
        getStockLogs()
      ]);

      const localOrders = JSON.parse(localStorage.getItem('casehaven_orders') || '[]');
      const fetchedOrders = (oData.status === 'fulfilled' && oData.value) ? oData.value : [];
      const allOrders = [...fetchedOrders];
      localOrders.forEach(lo => {
        if (!allOrders.some(ao => ao.orderNumber === lo.orderNumber)) {
          allOrders.push(lo);
        }
      });
      setOrders(allOrders);

      setProducts((pData.status === 'fulfilled' && pData.value && pData.value.length > 0) ? pData.value : FALLBACK_PRODUCTS);
      setStockLogs((lData.status === 'fulfilled' && lData.value) ? lData.value : []);

      if (sData.status === 'fulfilled' && sData.value) {
        setStats(sData.value);
      } else {
        const totalSales = allOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
        setStats({
          totalRevenue: totalSales,
          totalRevenueKhr: Math.round(totalSales * 4100),
          totalOrders: allOrders.length,
          paidOrders: allOrders.filter(o => o.paymentStatus === 'PAID').length,
          pendingOrders: allOrders.filter(o => o.paymentStatus === 'PENDING').length,
          lowStockProducts: 2,
          totalProducts: FALLBACK_PRODUCTS.length
        });
      }
      setLoading(false);
    } catch (err) {
      console.error('Error loading admin data:', err);
      setLoading(false);
    }
  };

  const handleGenerateSku = () => {
    const brandCode = (productForm.brand || 'AP').substring(0, 2).toUpperCase();
    const modelCode = (productForm.model || 'IPHONE').replace(/[^a-zA-Z0-9]/g, '').substring(0, 5).toUpperCase();
    const catCode = (productForm.category || 'MAG').substring(0, 3).toUpperCase();
    const rand = Math.floor(100 + Math.random() * 900);
    const sku = `CH-${brandCode}-${modelCode}-${catCode}-${rand}`;
    setProductForm(prev => ({ ...prev, sku }));
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        price: parseFloat(productForm.price),
        compareAtPrice: productForm.compareAtPrice ? parseFloat(productForm.compareAtPrice) : null,
        stock: parseInt(productForm.stock, 10),
        lowStockThreshold: parseInt(productForm.lowStockThreshold || 8, 10)
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await createProduct(payload);
      }

      setShowAddModal(false);
      setEditingProduct(null);
      loadAllData();
    } catch (err) {
      alert('Error saving product: ' + err.message);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from catalog?`)) {
      try {
        await deleteProduct(id);
        loadAllData();
      } catch (err) {
        alert('Error deleting product: ' + err.message);
      }
    }
  };

  const handleStockAdjust = async (e) => {
    e.preventDefault();
    try {
      await adjustProductStock(stockAdjustProduct.id, {
        type: adjustType,
        quantity: parseInt(adjustQty, 10),
        reason: adjustReason,
        reference: adjustReference
      });
      setStockAdjustProduct(null);
      loadAllData();
    } catch (err) {
      alert('Stock adjustment failed: ' + err.message);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      loadAllData();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      sku: p.sku || '',
      brand: p.brand,
      model: p.model,
      category: p.category,
      price: String(p.price),
      compareAtPrice: p.compareAtPrice ? String(p.compareAtPrice) : '',
      stock: p.stock,
      lowStockThreshold: p.lowStockThreshold || 8,
      shortDescription: p.shortDescription || p.description || '',
      fullDescription: p.fullDescription || p.description || '',
      features: p.features || '',
      specifications: p.specifications || '',
      compatibility: p.compatibility || '',
      imageUrl: p.imageUrl || '',
      colorOptions: p.colorOptions || '',
      dropProtectionRating: p.dropProtectionRating || '13ft / 4.0m Tested',
      isFeatured: p.isFeatured || false
    });
    setShowAddModal(true);
  };

  // Filtered lists
  const filteredProducts = products.filter(p => {
    const matchBrand = brandFilter === 'ALL' || p.brand === brandFilter;
    const matchQuery = !productSearch ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(productSearch.toLowerCase())) ||
      p.model.toLowerCase().includes(productSearch.toLowerCase());
    return matchBrand && matchQuery;
  });

  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter === 'ALL') return true;
    return o.orderStatus === orderStatusFilter;
  });

  // If not authenticated as Admin, show Admin Login Gate
  if (!adminUser) {
    return (
      <div style={{ maxWidth: '440px', margin: '80px auto', padding: '20px' }}>
        <div className="glass-panel animate-fade" style={{ padding: '32px', textAlign: 'center' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'rgba(59, 130, 246, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            color: '#3b82f6'
          }}>
            <Lock size={26} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff', marginBottom: '6px' }}>
            CaseHaven Admin Portal
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '24px' }}>
            Enter administrator credentials to access inventory, product CRUD, and orders.
          </p>

          {loginError && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '10px', color: '#f87171', fontSize: '0.82rem', marginBottom: '16px' }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="email"
              required
              placeholder="admin@casehaven.kh"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="input-field"
              style={{ fontSize: '0.85rem' }}
            />
            <input
              type="password"
              required
              placeholder="Admin password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="input-field"
              style={{ fontSize: '0.85rem' }}
            />
            <button
              type="submit"
              disabled={loginLoading}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.9rem', marginTop: '6px' }}
            >
              {loginLoading ? 'Authenticating...' : 'Sign In as Administrator'}
            </button>
          </form>

          <button
            onClick={onBackToShop}
            style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.8rem', marginTop: '16px', cursor: 'pointer' }}
          >
            ← Back to Storefront
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '28px 20px' }}>
      {/* Top Navigation Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div>
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
              fontSize: '0.82rem',
              marginBottom: '6px'
            }}
          >
            <ArrowLeft size={15} />
            <span>{lang === 'km' ? 'ត្រឡប់ទៅកាន់ទំព័រហាង' : 'Back to Storefront'}</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#ffffff' }}>
              {lang === 'km' ? 'ផ្ទាំងគ្រប់គ្រង CaseHaven (Admin Portal)' : 'CaseHaven Enterprise Portal'}
            </h1>
            <span style={{
              background: 'rgba(59, 130, 246, 0.2)',
              color: '#60a5fa',
              fontSize: '0.72rem',
              fontWeight: '700',
              padding: '3px 8px',
              borderRadius: '6px'
            }}>
              ROLE_ADMIN
            </span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '2px' }}>
            {adminUser.fullName} ({adminUser.email}) • Real-time Cambodian E-Commerce Back Office
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setShowToolsModal(true)}
            style={{
              padding: '8px 14px',
              fontSize: '0.82rem',
              backgroundColor: '#1e293b',
              color: '#38bdf8',
              border: '1px solid #334155',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            <QrCode size={14} />
            <span>🏷️ Barcode & Tools</span>
          </button>
          <button
            onClick={loadAllData}
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.82rem' }}
          >
            <RefreshCw size={14} />
            <span>{lang === 'km' ? 'ផ្ទុកឡើងវិញ' : 'Refresh'}</span>
          </button>
          <button
            onClick={() => {
              setEditingProduct(null);
              setProductForm({
                name: '',
                sku: '',
                brand: 'APPLE',
                model: 'iPhone 16 Pro Max',
                category: 'MAGSAFE',
                price: '34.99',
                compareAtPrice: '42.00',
                stock: 30,
                lowStockThreshold: 8,
                shortDescription: 'Engineered protective phone case with military-grade drop defense.',
                fullDescription: 'Features reinforced corners, scratch-proof coating, and instant MagSafe snap.',
                features: 'MagSafe Ready, 13ft Drop Protection, Anti-Yellowing',
                specifications: 'Material: PC + Bayer TPU, Weight: 39g, Magnet: N52',
                compatibility: 'Apple iPhone 16 Pro Max (6.9-inch display)',
                imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
                colorOptions: 'Obsidian Black, Titanium Gray, Deep Blue',
                dropProtectionRating: '13ft / 4.0m Tested',
                isFeatured: true
              });
              handleGenerateSku();
              setShowAddModal(true);
            }}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.82rem' }}
          >
            <Plus size={15} />
            <span>{lang === 'km' ? 'បន្ថែមស្រោមទូរស័ព្ទថ្មី' : 'Add New Phone Case'}</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        {/* KPI 1: Revenue USD & KHR */}
        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.78rem', marginBottom: '6px' }}>
            <span>{lang === 'km' ? 'ចំណូលលក់សរុប' : 'Total Revenue (Paid)'}</span>
            <DollarSign size={16} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>
            ${stats ? Number(stats.totalRevenue).toFixed(2) : '0.00'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '3px' }}>
            ៛{stats ? Number(stats.totalRevenueKhr || 0).toLocaleString() : '0'} KHR (4,100 rate)
          </div>
        </div>

        {/* KPI 2: Total Orders */}
        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.78rem', marginBottom: '6px' }}>
            <span>{lang === 'km' ? 'ការបញ្ជាទិញសរុប' : 'Total Customer Orders'}</span>
            <ShoppingCart size={16} color="#3b82f6" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#3b82f6' }}>
            {stats ? stats.totalOrders : 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '3px' }}>
            {stats ? stats.paidOrders : 0} {lang === 'km' ? 'បានទូទាត់' : 'paid'} • {stats ? stats.pendingOrders : 0} {lang === 'km' ? 'កំពុងរង់ចាំ' : 'pending'}
          </div>
        </div>

        {/* KPI 3: Catalog Phone Cases */}
        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.78rem', marginBottom: '6px' }}>
            <span>{lang === 'km' ? 'មុខទំនិញក្នុងប្រព័ន្ធ' : 'Catalog Products'}</span>
            <Package size={16} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ffffff' }}>
            {stats ? stats.totalProducts : products.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '3px' }}>
            {stats ? stats.totalStock : 0} {lang === 'km' ? 'គ្រឿងក្នុងស្តុកសរុប' : 'units in warehouse'}
          </div>
        </div>

        {/* KPI 4: Low Stock Alerts */}
        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.78rem', marginBottom: '6px' }}>
            <span>{lang === 'km' ? 'ការជូនដំណឹងស្តុកទាប' : 'Low Stock Alerts'}</span>
            <AlertTriangle size={16} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: (stats?.lowStockCount > 0) ? '#f59e0b' : '#10b981' }}>
            {stats ? stats.lowStockCount : 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '3px' }}>
            {stats?.lowStockCount > 0 ? (lang === 'km' ? 'ទាមទារការនាំចូលបន្ថែម' : 'Requires replenishment') : (lang === 'km' ? 'ស្តុកមានសុវត្ថិភាព' : 'Optimal levels')}
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '20px', paddingBottom: '4px' }}>
        {[
          { id: 'overview', label: lang === 'km' ? 'ទិដ្ឋភាពទូទៅ (Overview)' : 'Overview & Catalog', icon: Layers },
          { id: 'products', label: lang === 'km' ? `ផលិតផល (${products.length})` : `Products CRUD (${products.length})`, icon: Package },
          { id: 'orders', label: lang === 'km' ? `ការបញ្ជាទិញ (${orders.length})` : `Orders & Fulfillment (${orders.length})`, icon: ShoppingCart },
          { id: 'stockLogs', label: lang === 'km' ? `ប្រវត្តិចលនាស្តុក (${stockLogs.length})` : `Stock Movements (${stockLogs.length})`, icon: Warehouse }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                color: isActive ? '#3b82f6' : '#64748b',
                fontWeight: isActive ? '700' : '400',
                borderBottom: isActive ? '2px solid #3b82f6' : 'none',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Overview Quick View */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Quick fulfillment queue */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff' }}>
                {lang === 'km' ? 'ការបញ្ជាទិញទើបទទួលបាន (Pending Orders Queue)' : 'Recent Orders Pending Dispatch'}
              </h3>
              <button
                onClick={() => setActiveTab('orders')}
                style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.78rem', cursor: 'pointer' }}
              >
                View all orders →
              </button>
            </div>

            {orders.slice(0, 5).map(o => (
              <div
                key={o.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: '#0d1522',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  fontSize: '0.82rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: '700', color: '#60a5fa' }}>{o.orderNumber} • {o.customerName}</div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{o.shippingAddress}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: '700', color: '#ffffff' }}>${Number(o.totalAmount).toFixed(2)}</span>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    background: o.paymentStatus === 'PAID' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: o.paymentStatus === 'PAID' ? '#34d399' : '#fbbf24'
                  }}>
                    {o.paymentStatus}
                  </span>
                  <select
                    value={o.orderStatus}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    className="input-field"
                    style={{ padding: '3px 6px', fontSize: '0.75rem', width: 'auto' }}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Low Stock Warning Banner */}
          {stats?.lowStockCount > 0 && (
            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fbbf24' }}>
                <AlertTriangle size={20} />
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                  {lang === 'km'
                    ? `មានទំនិញចំនួន ${stats.lowStockCount} មុខកំពុងស្ថិតក្នុងកម្រិតស្តុកទាប! សូមពិនិត្យដើម្បីបន្ថែមស្តុក។`
                    : `Warning: ${stats.lowStockCount} phone case models are running low on stock. Restock needed.`}
                </span>
              </div>
              <button
                onClick={() => setActiveTab('products')}
                className="btn-primary"
                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
              >
                Inspect Catalog
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Products CRUD Management */}
      {activeTab === 'products' && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          {/* Controls Bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '10px', flex: '1 1 300px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} color="#64748b" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Filter products by name, model, or SKU..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '32px', fontSize: '0.8rem', padding: '6px 10px 6px 32px' }}
                />
              </div>

              <select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="input-field"
                style={{ width: 'auto', fontSize: '0.8rem', padding: '6px 10px' }}
              >
                <option value="ALL">All Brands</option>
                <option value="APPLE">Apple</option>
                <option value="SAMSUNG">Samsung</option>
                <option value="XIAOMI">Xiaomi</option>
              </select>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#64748b', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>Product</th>
                  <th style={{ padding: '10px' }}>SKU</th>
                  <th style={{ padding: '10px' }}>Brand / Model</th>
                  <th style={{ padding: '10px' }}>Category</th>
                  <th style={{ padding: '10px' }}>Price (USD / KHR)</th>
                  <th style={{ padding: '10px' }}>Stock Status</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={p.imageUrl} alt={p.name} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover', background: '#0a0e17' }} />
                      <div>
                        <div style={{ fontWeight: '700', color: '#ffffff' }}>{p.name}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{p.slug}</div>
                      </div>
                    </td>
                    <td style={{ padding: '10px', color: '#60a5fa', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                      {p.sku || 'CH-GEN-001'}
                    </td>
                    <td style={{ padding: '10px', color: '#cbd5e1' }}>
                      <div><strong>{p.brand}</strong></div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{p.model}</div>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <span className="badge badge-magsafe">{p.category}</span>
                    </td>
                    <td style={{ padding: '10px', fontWeight: '700', color: '#ffffff' }}>
                      <div>${Number(p.price).toFixed(2)}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '400' }}>
                        {Math.round(Number(p.price) * 4100).toLocaleString()} ៛
                      </div>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <span style={{
                        fontWeight: '700',
                        color: p.stock <= (p.lowStockThreshold || 8) ? '#f87171' : '#10b981',
                        background: p.stock <= (p.lowStockThreshold || 8) ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem'
                      }}>
                        {p.stock} units
                      </span>
                    </td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                        <button
                          onClick={() => {
                            setStockAdjustProduct(p);
                            setAdjustQty(10);
                            setAdjustType('STOCK_IN');
                          }}
                          style={{
                            background: 'rgba(59, 130, 246, 0.15)',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            color: '#60a5fa',
                            cursor: 'pointer',
                            fontSize: '0.74rem',
                            fontWeight: '600'
                          }}
                        >
                          Stock In/Out
                        </button>
                        <button
                          onClick={() => openEditModal(p)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            color: '#ffffff',
                            cursor: 'pointer'
                          }}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            color: '#f87171',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Orders Management & Fulfillment */}
      {activeTab === 'orders' && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Filter Status:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="input-field"
                style={{ width: 'auto', fontSize: '0.78rem', padding: '4px 8px' }}
              >
                <option value="ALL">All Orders</option>
                <option value="PENDING">PENDING</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#64748b', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>Order Ref</th>
                  <th style={{ padding: '10px' }}>Customer Contact</th>
                  <th style={{ padding: '10px' }}>Cambodian Delivery Address</th>
                  <th style={{ padding: '10px' }}>Items</th>
                  <th style={{ padding: '10px' }}>Total Amount</th>
                  <th style={{ padding: '10px' }}>Payment Status</th>
                  <th style={{ padding: '10px' }}>Fulfillment Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '10px' }}>
                      <div style={{ fontWeight: '800', color: '#38bdf8' }}>{o.orderNumber}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        {new Date(o.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </div>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <div style={{ fontWeight: '700', color: '#ffffff' }}>{o.customerName}</div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{o.customerPhone}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{o.customerEmail}</div>
                    </td>
                    <td style={{ padding: '10px', color: '#cbd5e1', maxWidth: '240px' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>{o.shippingAddress}</div>
                      <div style={{ fontSize: '0.72rem', color: '#38bdf8' }}>
                        {o.province || o.city} {o.district ? `• ${o.district}` : ''} {o.commune ? `• ${o.commune}` : ''}
                      </div>
                    </td>
                    <td style={{ padding: '10px', color: '#94a3b8' }}>
                      {o.items ? `${o.items.length} case(s)` : '1 item'}
                    </td>
                    <td style={{ padding: '10px', fontWeight: '800', color: '#ffffff' }}>
                      <div>${Number(o.totalAmount).toFixed(2)}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '400' }}>
                        {Number(o.amountKhr || Math.round(Number(o.totalAmount) * 4100)).toLocaleString()} ៛
                      </div>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        fontWeight: '700',
                        background: o.paymentStatus === 'PAID' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: o.paymentStatus === 'PAID' ? '#34d399' : '#fbbf24'
                      }}>
                        {o.paymentMethod}: {o.paymentStatus}
                      </span>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <select
                        value={o.orderStatus}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className="input-field"
                        style={{ padding: '3px 6px', fontSize: '0.78rem', width: 'auto' }}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Stock Movements Audit Trail */}
      {activeTab === 'stockLogs' && (
        <div className="glass-panel" style={{ padding: '20px', overflowX: 'auto' }}>
          <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff' }}>
              {lang === 'km' ? 'កំណត់ត្រាចលនាស្តុក (Stock Movement Audit Logs)' : 'Inventory Movement History & Audit Trail'}
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{stockLogs.length} logged events</span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#64748b', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Timestamp</th>
                <th style={{ padding: '10px' }}>Product & SKU</th>
                <th style={{ padding: '10px' }}>Movement Type</th>
                <th style={{ padding: '10px' }}>Quantity Delta</th>
                <th style={{ padding: '10px' }}>Inventory (Before → After)</th>
                <th style={{ padding: '10px' }}>Reason & Reference</th>
                <th style={{ padding: '10px' }}>Operator</th>
              </tr>
            </thead>
            <tbody>
              {stockLogs.map(l => {
                const isPositive = l.type === 'STOCK_IN' || l.type === 'RETURN' || l.type === 'IN';
                return (
                  <tr key={l.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '10px', color: '#94a3b8' }}>
                      {new Date(l.createdAt).toLocaleString()}
                    </td>
                    <td style={{ padding: '10px', fontWeight: '600', color: '#ffffff' }}>
                      <div>{l.productName}</div>
                      <div style={{ fontSize: '0.7rem', color: '#60a5fa', fontFamily: 'monospace' }}>{l.productSku}</div>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        background: isPositive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: isPositive ? '#34d399' : '#f87171'
                      }}>
                        {l.type}
                      </span>
                    </td>
                    <td style={{ padding: '10px', fontWeight: '700', color: isPositive ? '#34d399' : '#f87171' }}>
                      {isPositive ? `+${l.quantity}` : `-${l.quantity}`}
                    </td>
                    <td style={{ padding: '10px', color: '#cbd5e1' }}>
                      {(l.previousStock ?? l.stockBefore ?? 0)} → <strong>{(l.resultingStock ?? l.stockAfter ?? 0)}</strong>
                    </td>
                    <td style={{ padding: '10px', color: '#94a3b8' }}>
                      <div>{l.reason}</div>
                      {l.reference && <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Ref: {l.reference}</div>}
                    </td>
                    <td style={{ padding: '10px', color: '#64748b', fontSize: '0.72rem' }}>
                      {l.createdBy || 'system'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL: Stock In / Out / Adjustment */}
      {stockAdjustProduct && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 80,
          background: 'rgba(0,0,0,0.78)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="glass-modal animate-fade" style={{ width: '100%', maxWidth: '460px', borderRadius: '20px', padding: '26px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff' }}>
                Inventory Movement
              </h3>
              <button onClick={() => setStockAdjustProduct(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '16px' }}>
              Target: <strong style={{ color: '#ffffff' }}>{stockAdjustProduct.name}</strong><br />
              Current Stock: <strong style={{ color: '#60a5fa' }}>{stockAdjustProduct.stock} units</strong>
            </p>

            <form onSubmit={handleStockAdjust} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                  Movement Operation Type
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {[
                    { id: 'STOCK_IN', label: '+ STOCK IN (Supplier)', color: '#10b981' },
                    { id: 'STOCK_OUT', label: '- STOCK OUT (Damaged)', color: '#ef4444' },
                    { id: 'ADJUSTMENT', label: '↻ ADJUSTMENT (Audit)', color: '#38bdf8' },
                    { id: 'RETURN', label: '+ RETURN (Restock)', color: '#8b5cf6' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setAdjustType(opt.id)}
                      style={{
                        padding: '6px 8px',
                        borderRadius: '6px',
                        border: adjustType === opt.id ? `2px solid ${opt.color}` : '1px solid rgba(255,255,255,0.1)',
                        background: adjustType === opt.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                        color: adjustType === opt.id ? '#ffffff' : '#94a3b8',
                        fontWeight: '600',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                  Quantity Units *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                  className="input-field"
                  style={{ fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                  Reason / Audit Notes *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Warehouse shipment delivery batch #204"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="input-field"
                  style={{ fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                  Reference Code (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. PO-2026-99"
                  value={adjustReference}
                  onChange={(e) => setAdjustReference(e.target.value)}
                  className="input-field"
                  style={{ fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setStockAdjustProduct(null)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
                >
                  Confirm Movement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add / Edit Product */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 80,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="glass-modal animate-fade" style={{ width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '20px', padding: '26px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#ffffff' }}>
                {editingProduct ? 'Edit Phone Case Product' : 'Add New Phone Case'}
              </h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AeroShield Titanium MagSafe Case"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="input-field"
                  style={{ fontSize: '0.85rem' }}
                />
              </div>

              {/* SKU Generator */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.76rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CH-AP-IP16P-MAG-101"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="input-field"
                    style={{ fontSize: '0.82rem', fontFamily: 'monospace' }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGenerateSku}
                  className="btn-secondary"
                  style={{ padding: '9px 12px', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                >
                  Generate SKU
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Brand *
                  </label>
                  <select
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="input-field"
                    style={{ fontSize: '0.82rem' }}
                  >
                    <option value="APPLE">APPLE</option>
                    <option value="SAMSUNG">SAMSUNG</option>
                    <option value="XIAOMI">XIAOMI</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Model *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. iPhone 16 Pro"
                    value={productForm.model}
                    onChange={(e) => setProductForm({ ...productForm, model: e.target.value })}
                    className="input-field"
                    style={{ fontSize: '0.82rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Category *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="input-field"
                    style={{ fontSize: '0.82rem' }}
                  >
                    <option value="MAGSAFE">MAGSAFE</option>
                    <option value="SILICONE">SILICONE</option>
                    <option value="CLEAR">CLEAR</option>
                    <option value="LEATHER">LEATHER</option>
                    <option value="WALLET">WALLET</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="input-field"
                    style={{ fontSize: '0.82rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Compare-At Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="40.00"
                    value={productForm.compareAtPrice}
                    onChange={(e) => setProductForm({ ...productForm, compareAtPrice: e.target.value })}
                    className="input-field"
                    style={{ fontSize: '0.82rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Initial Stock *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="input-field"
                    style={{ fontSize: '0.82rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Low Threshold
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={productForm.lowStockThreshold}
                    onChange={(e) => setProductForm({ ...productForm, lowStockThreshold: e.target.value })}
                    className="input-field"
                    style={{ fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                  Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  className="input-field"
                  style={{ fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                  Color Options (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Natural Titanium, Matte Obsidian, Deep Blue"
                  value={productForm.colorOptions}
                  onChange={(e) => setProductForm({ ...productForm, colorOptions: e.target.value })}
                  className="input-field"
                  style={{ fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                  Device Compatibility Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apple iPhone 16 Pro (6.3-inch). Compatible with Qi2 wireless chargers."
                  value={productForm.compatibility}
                  onChange={(e) => setProductForm({ ...productForm, compatibility: e.target.value })}
                  className="input-field"
                  style={{ fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={productForm.shortDescription}
                  onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                  className="input-field"
                  style={{ resize: 'vertical', fontSize: '0.82rem' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={productForm.isFeatured}
                  onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                  style={{ width: '16px', height: '16px', accentColor: '#3b82f6' }}
                />
                <label htmlFor="featuredCheck" style={{ fontSize: '0.82rem', color: '#cbd5e1', cursor: 'pointer' }}>
                  Mark as Featured / Showcase in Hero section
                </label>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delphi-inspired Shop Tools Modal */}
      <ShopToolsModal
        isOpen={showToolsModal}
        onClose={() => setShowToolsModal(false)}
      />
    </div>
  );
}
