import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Plus, DollarSign, Bell, User } from 'lucide-react';

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

        {/* Admin Profile */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            paddingLeft: '12px',
            borderLeft: '1px solid var(--border-subtle)',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #27272a, #3f3f46)',
              border: '1px solid var(--border-medium)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '13px',
              color: '#fff',
            }}
          >
            N
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#fff' }}>Nha</span>
            <span style={{ fontSize: '10.5px', color: 'var(--accent-emerald)', textTransform: 'uppercase' }}>
              Shop Owner
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
