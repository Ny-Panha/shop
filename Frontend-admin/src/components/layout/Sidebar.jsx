import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Warehouse,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export default function Sidebar({ collapsed, setCollapsed, productsCount, ordersCount, customersCount, categoriesCount }) {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/inventory', label: 'Warehouse (ឃ្លាំងស្តុក)', icon: Warehouse },
    { to: '/products', label: 'Products & SKUs', icon: Package, count: productsCount },
    { to: '/categories', label: 'Categories', icon: Layers, count: categoriesCount },
    { to: '/orders', label: 'Orders & Receipts', icon: ShoppingBag, count: ordersCount },
    { to: '/customers', label: 'Customers & Users', icon: Users, count: customersCount },
    { to: '/settings', label: 'Shop Settings', icon: Settings },
  ];

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <NavLink to="/dashboard" className="brand-badge">
          <div className="brand-logo-icon">Z</div>
          {!collapsed && (
            <div className="brand-info">
              <h1>ZANDO POS</h1>
              <span>Admin Manager</span>
            </div>
          )}
        </NavLink>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="btn-icon"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          style={{ width: '28px', height: '28px' }}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {!collapsed && <div className="nav-section-title">Store Management</div>}

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.count !== undefined && (
                <span className="nav-counter">{item.count}</span>
              )}
            </NavLink>
          );
        })}

        {!collapsed && (
          <div style={{ marginTop: '24px' }}>
            <div className="nav-section-title">Live Storefront</div>
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-item"
              style={{ color: 'var(--accent-emerald)' }}
            >
              <ExternalLink size={18} style={{ flexShrink: 0 }} />
              <span>Open Customer Shop</span>
            </a>
          </div>
        )}
      </nav>

      {/* Footer Info */}
      <div className="sidebar-footer">
        <div className="store-status-pill">
          <div className="status-dot"></div>
          {!collapsed && (
            <div className="store-info">
              <div style={{ fontWeight: 600, fontSize: '12px', color: '#fff' }}>POS Terminal</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Bakong KHQR Active</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
