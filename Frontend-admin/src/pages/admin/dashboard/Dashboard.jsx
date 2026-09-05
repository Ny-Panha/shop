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
  Warehouse,
  Boxes,
  Users,
  Settings,
  ArrowRight,
} from 'lucide-react';
import { adminStore } from '../../../data/adminStore';

export default function Dashboard({ onOpenAddProduct }) {
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
      products.filter((p) => p.stock <= (p.lowStockThreshold || sett.lowStockAlertLevel || 5))
    );
  }, []);

  if (!telemetry) return null;

  // Feature Hub modules list
  const FEATURE_MODULES = [
    {
      title: 'Warehouse & Stock (ឃ្លាំងស្តុក)',
      desc: 'Stock In/Out, inventory audits, and movement logs',
      to: '/inventory',
      icon: Warehouse,
      color: 'var(--accent-emerald)',
      badge: `${lowStockProducts.length} Alerts`,
    },
    {
      title: 'Products & SKUs (ទំនិញ)',
      desc: 'Manage catalog, prices, barcode SKUs, and sizes',
      to: '/products',
      icon: Boxes,
      color: 'var(--accent-indigo)',
      badge: `${telemetry.productsCount} SKUs`,
    },
    {
      title: 'Gender Categories (ប្រភេទទំនិញ)',
      desc: 'Men & Women department collection categories',
      to: '/categories',
      icon: Layers,
      color: 'var(--accent-sky)',
      badge: 'Men & Women',
    },
    {
      title: 'POS Orders & Receipts (វិក្កយបត្រ)',
      desc: 'Customer sale orders, Bakong KHQR, and receipt print',
      to: '/orders',
      icon: Receipt,
      color: 'var(--accent-amber)',
      badge: `${telemetry.ordersCount} Invoices`,
    },
    {
      title: 'Customer Accounts (អតិថិជន & សមាជិក)',
      desc: 'Customer CRM, loyalty points, and purchase history',
      to: '/customers',
      icon: Users,
      color: 'var(--accent-violet)',
      badge: `${telemetry.customersCount || 5} Members`,
    },
    {
      title: 'POS Settings (ការកំណត់)',
      desc: 'Exchange rate ($1 = 4,100 ៛), shop name, and Bakong ID',
      to: '/settings',
      icon: Settings,
      color: 'var(--text-secondary)',
      badge: 'USD & KHR',
    },
    {
      title: 'Live Storefront (ហាងអនឡាញ)',
      desc: 'Preview customer online shop on port 5173',
      href: 'http://localhost:5173',
      icon: ExternalLink,
      color: 'var(--accent-rose)',
      badge: 'Port 5173',
    },
  ];

  return (
    <div className="page-container">
      {/* Title */}
      <div className="page-title-row">
        <div className="page-title-info">
          <h2>Store Telemetry & POS Command Center</h2>
          <p>Real-time revenue, warehouse stock, and unified feature launcher</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <NavLink to="/inventory" className="btn-secondary">
            <Warehouse size={15} />
            <span>ឃ្លាំងស្តុក (Warehouse)</span>
          </NavLink>
          <button onClick={onOpenAddProduct} className="btn-primary">
            <Plus size={16} />
            <span>New Product</span>
          </button>
        </div>
      </div>

      {/* Top Level: Primary Metrics */}
      <div className="bento-grid">
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

      {/* FEATURE HUB (All Apps & Modules Center) */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Sparkles size={16} style={{ color: 'var(--accent-emerald)' }} />
          <h3 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
            Central Feature Hub (ឃ្លាំងប្រមូលផ្តុំ Feature)
          </h3>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '14px',
          }}
        >
          {FEATURE_MODULES.map((m) => {
            const Icon = m.icon;
            const cardContent = (
              <div
                className="bento-card"
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '16px 18px',
                  cursor: 'pointer',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  textDecoration: 'none',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(255, 255, 255, 0.04)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--border-subtle)',
                        color: m.color,
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <span className="badge-delphi badge-zinc">{m.badge}</span>
                  </div>

                  <h4 style={{ fontSize: '14.5px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
                    {m.title}
                  </h4>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {m.desc}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: m.color,
                    marginTop: '14px',
                  }}
                >
                  <span>Launch Feature</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            );

            if (m.href) {
              return (
                <a key={m.title} href={m.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  {cardContent}
                </a>
              );
            }

            return (
              <NavLink key={m.title} to={m.to} style={{ textDecoration: 'none' }}>
                {cardContent}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Recent Invoices Table */}
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
