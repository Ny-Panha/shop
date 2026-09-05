import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Package,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  Plus,
  Layers,
  Sparkles,
  ExternalLink,
  Receipt,
  QrCode,
} from 'lucide-react';
import { adminStore } from '../data/adminStore';

export default function DashboardPage({ onOpenAddProduct }) {
  const [telemetry, setTelemetry] = useState(null);
  const [settings, setSettings] = useState({ exchangeRate: 4100 });
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    const stats = adminStore.getDashboardTelemetry();
    const products = adminStore.getProducts();
    const sett = adminStore.getSettings();

    setTelemetry(stats);
    setSettings(sett);
    setLowStockProducts(
      products.filter((p) => p.stock <= (p.lowStockThreshold || sett.lowStockAlertLevel))
    );
  }, []);

  if (!telemetry) return null;

  return (
    <div className="page-container">
      {/* Welcome Title */}
      <div className="page-title-row">
        <div className="page-title-info">
          <h2>Store Telemetry & POS Operations</h2>
          <p>Real-time sales, inventory alerts, and performance metrics</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onOpenAddProduct} className="btn-primary">
            <Plus size={16} />
            <span>New Product</span>
          </button>
        </div>
      </div>

      {/* Bento Grid Top Level: 4 Primary Stats */}
      <div className="bento-grid">
        {/* Card 1: Total Revenue ($ + KHR) - 4 cols */}
        <div className="bento-card" style={{ gridColumn: 'span 4' }}>
          <div className="stat-header">
            <span className="stat-label">Total Revenue</span>
            <div
              className="stat-icon-wrapper"
              style={{ background: 'var(--accent-emerald-glow)', borderColor: 'rgba(16, 185, 129, 0.2)' }}
            >
              <DollarSign size={18} style={{ color: 'var(--accent-emerald)' }} />
            </div>
          </div>
          <div className="stat-value">${telemetry.totalRevenueUsd.toFixed(2)}</div>
          <div className="stat-footer">
            <span className="stat-trend-pill trend-up">
              <TrendingUp size={11} /> +18.4%
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
              {telemetry.totalRevenueKhr.toLocaleString()} ៛ KHR
            </span>
          </div>
        </div>

        {/* Card 2: Total Orders - 4 cols */}
        <div className="bento-card" style={{ gridColumn: 'span 4' }}>
          <div className="stat-header">
            <span className="stat-label">Sales & Orders</span>
            <div
              className="stat-icon-wrapper"
              style={{ background: 'var(--accent-indigo-glow)', borderColor: 'rgba(99, 102, 241, 0.2)' }}
            >
              <ShoppingBag size={18} style={{ color: 'var(--accent-indigo)' }} />
            </div>
          </div>
          <div className="stat-value">{telemetry.ordersCount} Invoices</div>
          <div className="stat-footer">
            <span className="badge-delphi badge-emerald">
              <QrCode size={11} /> Bakong KHQR Active
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>100% Fulfilled</span>
          </div>
        </div>

        {/* Card 3: Products & Stock - 4 cols */}
        <div className="bento-card" style={{ gridColumn: 'span 4' }}>
          <div className="stat-header">
            <span className="stat-label">Inventory Assets</span>
            <div
              className="stat-icon-wrapper"
              style={{ background: 'rgba(255, 255, 255, 0.05)', borderColor: 'var(--border-subtle)' }}
            >
              <Package size={18} style={{ color: '#fff' }} />
            </div>
          </div>
          <div className="stat-value">{telemetry.productsCount} SKUs</div>
          <div className="stat-footer">
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Men: <strong style={{ color: '#fff' }}>{telemetry.menCount}</strong> | Women:{' '}
              <strong style={{ color: '#fff' }}>{telemetry.womenCount}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Bento Grid Middle: Low Stock Alerts (7 cols) + Storefront Live Card (5 cols) */}
      <div className="bento-grid">
        {/* Low Stock Alert Center */}
        <div className="bento-card" style={{ gridColumn: 'span 7' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} style={{ color: 'var(--accent-amber)' }} />
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>
                Inventory Warnings ({lowStockProducts.length})
              </h3>
            </div>
            <NavLink
              to="/products"
              style={{
                fontSize: '12px',
                color: 'var(--accent-emerald)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Manage Stock <ArrowUpRight size={13} />
            </NavLink>
          </div>

          {lowStockProducts.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              All inventory levels are healthy!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {lowStockProducts.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: 'var(--radius-sm)',
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        e.target.src = '/zando-products/insane_main.jpg';
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        SKU: <span className="font-mono">{item.sku}</span> | Dept: {item.gender}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span
                      className={`badge-delphi ${
                        item.stock === 0 ? 'badge-rose' : 'badge-amber'
                      }`}
                    >
                      {item.stock === 0 ? 'Out of Stock' : `${item.stock} left`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Storefront Status & Quick Jump */}
        <div
          className="bento-card"
          style={{
            gridColumn: 'span 5',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'linear-gradient(145deg, #131317 0%, #1a1a24 100%)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={16} style={{ color: 'var(--accent-emerald)' }} />
              <span className="stat-label">Storefront Sync</span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
              Zando Online Customer Shop
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Your customer-facing shop runs on port 5173 with Gender-specific collection routing
              (/men, /women, /kids).
            </p>
          </div>

          <div style={{ marginTop: '20px' }}>
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <span>Preview Live Shop</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bento-card" style={{ gridColumn: 'span 12' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Receipt size={18} style={{ color: 'var(--accent-emerald)' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>Recent POS Invoices</h3>
          </div>
          <NavLink
            to="/orders"
            style={{
              fontSize: '12px',
              color: 'var(--accent-emerald)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            View All Invoices <ArrowUpRight size={13} />
          </NavLink>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Customer</th>
                <th>Payment</th>
                <th>Amount ($)</th>
                <th>Amount (KHR)</th>
                <th>Status</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {telemetry.recentOrders.map((ord) => (
                <tr key={ord.id}>
                  <td className="font-mono" style={{ fontWeight: 600, color: '#fff' }}>
                    {ord.id}
                  </td>
                  <td>
                    <div>{ord.customer}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{ord.phone}</div>
                  </td>
                  <td>
                    <span className="badge-delphi badge-emerald">
                      {ord.paymentMethod === 'Bakong KHQR' ? <QrCode size={11} /> : null}
                      {ord.paymentMethod}
                    </span>
                  </td>
                  <td className="font-mono" style={{ fontWeight: 600, color: '#fff' }}>
                    ${ord.totalUsd.toFixed(2)}
                  </td>
                  <td className="font-mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {ord.totalKhr.toLocaleString()} ៛
                  </td>
                  <td>
                    <span
                      className={`badge-delphi ${
                        ord.status === 'Paid' || ord.status === 'Completed'
                          ? 'badge-emerald'
                          : 'badge-amber'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{ord.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
