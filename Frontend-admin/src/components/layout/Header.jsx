import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Plus, DollarSign, Bell, User, LogOut } from 'lucide-react';
import { authService } from '../../services/authService';

export default function Header({ onOpenAddProduct, exchangeRate = 4100 }) {
  const location = useLocation();
  const navigate = useNavigate();

  const getBreadcrumbTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Overview';
      case '/products':
        return 'Products & Inventory';
      case '/categories':
        return 'Categories & Collections';
      case '/orders':
        return 'POS Orders & Invoices';
      case '/settings':
        return 'Shop Settings';
      default:
        return 'Admin';
    }
  };

  return (
    <header className="admin-header">
      {/* Left: Breadcrumbs */}
      <div className="header-left">
        <div className="breadcrumb-trail">
          <span>Zando Admin</span>
          <span>/</span>
          <span className="breadcrumb-active">{getBreadcrumbTitle()}</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="header-right">
        {/* Currency Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '5px 10px',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
          }}
        >
          <span style={{ color: 'var(--accent-emerald)' }}>$1</span> ={' '}
          <span>{exchangeRate.toLocaleString()} ៛</span>
        </div>

        {/* Quick Add Product Button */}
        <button
          onClick={() => {
            if (onOpenAddProduct) {
              onOpenAddProduct();
            } else {
              navigate('/products?action=new');
            }
          }}
          className="btn-primary"
        >
          <Plus size={16} />
          <span>Add Product</span>
        </button>

        {/* Admin Profile & Logout */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            paddingLeft: '12px',
            borderLeft: '1px solid var(--border-subtle)',
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '13px',
              color: '#fff',
            }}
          >
            {(authService.getStoredUser()?.fullName || 'Admin')[0]?.toUpperCase()}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#fff' }}>
              {authService.getStoredUser()?.fullName || 'Admin'}
            </span>
            <span style={{ fontSize: '10px', color: 'var(--accent-emerald)', textTransform: 'uppercase', fontWeight: 700 }}>
              {authService.getStoredUser()?.role === 'ROLE_ADMIN' ? 'Admin Manager' : 'Shop Manager'}
            </span>
          </div>

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm('តើអ្នកពិតជាចង់ Sign Out ចេញពី POS Admin មែនទេ?')) {
                authService.logout();
                navigate('/login');
              }
            }}
            title="Sign Out (ចាកចេញ)"
            style={{
              background: 'rgba(244, 63, 94, 0.08)',
              border: '1px solid rgba(244, 63, 94, 0.25)',
              borderRadius: '8px',
              padding: '6px 8px',
              color: 'var(--accent-rose)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: 600,
              marginLeft: '4px',
              transition: 'all 0.15s ease'
            }}
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
