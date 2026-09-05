import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Printer,
  QrCode,
  CheckCircle,
  Clock,
  Search,
  X,
  CreditCard,
  Banknote,
  Package,
  RotateCcw,
  Eye,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { adminStore } from '../data/adminStore';

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState({ exchangeRate: 4100 });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);
  const [selectedDetailOrder, setSelectedDetailOrder] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const loadData = () => {
    setOrders(adminStore.getOrders());
    setProducts(adminStore.getProducts());
    setSettings(adminStore.getSettings());
  };

  useEffect(() => {
    loadData();

    const handleSync = () => loadData();
    window.addEventListener('zando_store_sync', handleSync);
    return () => window.removeEventListener('zando_store_sync', handleSync);
  }, []);

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleStatusChange = (orderId, newStatus) => {
    const result = adminStore.updateOrderStatus(orderId, newStatus);
    loadData();

    if (result && result.message) {
      showToast(result.message, newStatus === 'Refunded' ? 'warning' : 'success');
    } else {
      showToast(`Order #${orderId} status updated to ${newStatus}`);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      o.id.toLowerCase().includes(query) ||
      o.customer.toLowerCase().includes(query) ||
      o.phone.toLowerCase().includes(query);

    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate order stats
  const totalCompleted = orders.filter((o) => o.status === 'Completed' || o.status === 'Paid').length;
  const totalPending = orders.filter((o) => o.status === 'Pending').length;
  const totalRevenueUsd = orders
    .filter((o) => o.status === 'Completed' || o.status === 'Paid')
    .reduce((sum, o) => sum + (Number(o.totalUsd) || 0), 0);

  const getProductStock = (item) => {
    if (!item) return null;
    const prod = products.find(
      (p) => p.id === item.id || (item.sku && p.sku === item.sku) || p.name === item.name
    );
    return prod ? prod.stock : null;
  };

  return (
    <div className="page-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 9999,
            background:
              toastMessage.type === 'warning'
                ? 'linear-gradient(135deg, #1c1917, #292524)'
                : 'linear-gradient(135deg, #064e3b, #022c22)',
            border: `1px solid ${
              toastMessage.type === 'warning' ? 'var(--accent-amber)' : 'var(--accent-emerald)'
            }`,
            color: '#fff',
            padding: '14px 20px',
            borderRadius: '10px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            maxWidth: '450px',
            animation: 'slideInRight 0.25s ease-out',
          }}
        >
          {toastMessage.type === 'warning' ? (
            <RotateCcw size={18} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />
          ) : (
            <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
          )}
          <div style={{ fontSize: '13px', lineHeight: 1.4 }}>{toastMessage.text}</div>
          <button
            onClick={() => setToastMessage(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              marginLeft: 'auto',
              padding: '2px',
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Title */}
      <div className="page-title-row">
        <div className="page-title-info">
          <h2>POS Orders & Sale Receipts (ការបញ្ជាទិញ និងវិក្កយបត្រ)</h2>
          <p>Live sales tracking, automated warehouse stock deduction, Bakong KHQR, and thermal receipts</p>
        </div>
        <div className="page-title-actions">
          <button
            onClick={() => navigate('/inventory')}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Package size={15} />
            <span>Go to Warehouse (ឃ្លាំងទំនិញ)</span>
          </button>
        </div>
      </div>

      {/* Top Stat Bento Cards */}
      <div className="bento-grid" style={{ marginBottom: '24px' }}>
        <div className="bento-card" style={{ gridColumn: 'span 3' }}>
          <div className="stat-header">
            <span className="stat-label">Total Invoices</span>
            <div
              className="stat-icon-wrapper"
              style={{ background: 'rgba(255, 255, 255, 0.05)', borderColor: 'var(--border-subtle)' }}
            >
              <FileText size={18} style={{ color: '#fff' }} />
            </div>
          </div>
          <div className="stat-value">{orders.length}</div>
          <div className="stat-footer">
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              POS + Online Storefront
            </span>
          </div>
        </div>

        <div className="bento-card" style={{ gridColumn: 'span 3' }}>
          <div className="stat-header">
            <span className="stat-label">Completed Sales</span>
            <div
              className="stat-icon-wrapper"
              style={{ background: 'var(--accent-emerald-glow)', borderColor: 'rgba(16, 185, 129, 0.2)' }}
            >
              <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)' }} />
            </div>
          </div>
          <div className="stat-value" style={{ color: 'var(--accent-emerald)' }}>
            {totalCompleted}
          </div>
          <div className="stat-footer">
            <span style={{ fontSize: '12px', color: 'var(--accent-emerald)' }}>
              📦 Warehouse Stock Cut
            </span>
          </div>
        </div>

        <div className="bento-card" style={{ gridColumn: 'span 3' }}>
          <div className="stat-header">
            <span className="stat-label">Pending / Unpaid</span>
            <div
              className="stat-icon-wrapper"
              style={{ background: 'var(--accent-amber-glow)', borderColor: 'rgba(245, 158, 11, 0.2)' }}
            >
              <Clock size={18} style={{ color: 'var(--accent-amber)' }} />
            </div>
          </div>
          <div className="stat-value" style={{ color: 'var(--accent-amber)' }}>
            {totalPending}
          </div>
          <div className="stat-footer">
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Awaiting completion
            </span>
          </div>
        </div>

        <div className="bento-card" style={{ gridColumn: 'span 3' }}>
          <div className="stat-header">
            <span className="stat-label">Total Realized Revenue</span>
            <div
              className="stat-icon-wrapper"
              style={{ background: 'var(--accent-indigo-glow)', borderColor: 'rgba(99, 102, 241, 0.2)' }}
            >
              <Banknote size={18} style={{ color: 'var(--accent-indigo)' }} />
            </div>
          </div>
          <div className="stat-value font-mono">${totalRevenueUsd.toFixed(2)}</div>
          <div className="stat-footer">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
              {(totalRevenueUsd * settings.exchangeRate).toLocaleString()} ៛ KHR
            </span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ position: 'relative', width: '320px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            placeholder="Search invoice ID, customer, phone..."
            className="form-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '38px' }}
          />
        </div>

        <div className="pill-filter-bar">
          {['ALL', 'Paid', 'Completed', 'Pending', 'Refunded'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`pill-btn ${statusFilter === st ? 'active' : ''}`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total ($)</th>
              <th>Total (KHR)</th>
              <th>Payment</th>
              <th>Order Status</th>
              <th>Warehouse Stock (ឃ្លាំង)</th>
              <th>Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((ord) => {
              const isStockCut = ord.stockDeducted || ord.status === 'Completed' || ord.status === 'Paid';
              const isRefunded = ord.status === 'Refunded';

              return (
                <tr key={ord.id}>
                  <td className="font-mono" style={{ fontWeight: 600, color: '#fff' }}>
                    <span
                      onClick={() => setSelectedDetailOrder(ord)}
                      style={{ cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px' }}
                      title="Click to view full order details"
                    >
                      {ord.id}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{ord.customer}</div>
                      {ord.source?.includes('Storefront') ? (
                        <span className="badge-delphi badge-emerald" style={{ fontSize: '9.5px', padding: '1px 5px' }}>
                          Online
                        </span>
                      ) : (
                        <span className="badge-delphi badge-zinc" style={{ fontSize: '9.5px', padding: '1px 5px' }}>
                          POS
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{ord.phone}</div>
                  </td>
                  <td>
                    <button
                      onClick={() => setSelectedDetailOrder(ord)}
                      className="btn-secondary"
                      style={{
                        padding: '3px 8px',
                        fontSize: '11.5px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                      title="Inspect items breakdown"
                    >
                      <Package size={12} />
                      <span>
                        {ord.itemsCount} {ord.itemsCount === 1 ? 'item' : 'items'}
                      </span>
                    </button>
                  </td>
                  <td className="font-mono" style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>
                    ${ord.totalUsd.toFixed(2)}
                  </td>
                  <td className="font-mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {ord.totalKhr.toLocaleString()} ៛
                  </td>
                  <td>
                    <span className="badge-delphi badge-emerald">
                      {ord.paymentMethod === 'Bakong KHQR' ? <QrCode size={11} /> : <Banknote size={11} />}
                      {ord.paymentMethod}
                    </span>
                  </td>
                  <td>
                    <select
                      value={ord.status}
                      onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                      style={{
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        color:
                          ord.status === 'Paid' || ord.status === 'Completed'
                            ? 'var(--accent-emerald)'
                            : ord.status === 'Refunded'
                            ? 'var(--accent-rose)'
                            : 'var(--accent-amber)',
                        fontSize: '12px',
                        padding: '4px 8px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <option value="Paid">Paid</option>
                      <option value="Completed">Completed</option>
                      <option value="Pending">Pending</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </td>
                  <td>
                    {/* Warehouse Stock Deduction Indicator */}
                    {isRefunded ? (
                      <span className="badge-delphi badge-zinc" title="Stock returned back to warehouse">
                        <RotateCcw size={11} /> Restocked
                      </span>
                    ) : isStockCut ? (
                      <span
                        className="badge-delphi badge-emerald"
                        title="Stock automatically cut from warehouse inventory"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Package size={11} /> Stock Cut (កាត់ស្តុក)
                      </span>
                    ) : (
                      <span
                        className="badge-delphi badge-amber"
                        title="Awaiting completion to deduct warehouse stock"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Clock size={11} /> Pending Cut
                      </span>
                    )}
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{ord.date}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      <button
                        onClick={() => setSelectedDetailOrder(ord)}
                        className="btn-secondary"
                        style={{ padding: '5px 8px', fontSize: '12px' }}
                        title="View details & items"
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        onClick={() => setSelectedReceiptOrder(ord)}
                        className="btn-secondary"
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                        title="View & Print Thermal Receipt"
                      >
                        <Printer size={13} />
                        <span>Receipt</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Order Details & Warehouse Inspection Modal */}
      {selectedDetailOrder && (
        <div className="modal-backdrop" onClick={() => setSelectedDetailOrder(null)}>
          <div
            className="modal-dialog"
            style={{ maxWidth: '620px', background: 'var(--bg-card)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Package size={18} style={{ color: 'var(--accent-emerald)' }} />
                <div>
                  <h3 className="modal-title" style={{ fontSize: '15px' }}>
                    Invoice #{selectedDetailOrder.id} Details
                  </h3>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    Channel: {selectedDetailOrder.source || 'POS Terminal'} • Date: {selectedDetailOrder.date}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedDetailOrder(null)} className="btn-icon">
                <X size={16} />
              </button>
            </div>

            <div className="modal-body" style={{ padding: '20px' }}>
              {/* Customer summary */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                  background: 'var(--bg-body)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '16px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Customer Name</div>
                  <div style={{ fontWeight: 600, color: '#fff', fontSize: '13px' }}>
                    {selectedDetailOrder.customer}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Phone Number</div>
                  <div style={{ fontWeight: 600, color: '#fff', fontSize: '13px' }}>
                    {selectedDetailOrder.phone || 'N/A'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Payment Method</div>
                  <div style={{ fontWeight: 600, color: 'var(--accent-emerald)', fontSize: '13px' }}>
                    {selectedDetailOrder.paymentMethod}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Status</div>
                  <div style={{ fontWeight: 600, color: '#fff', fontSize: '13px' }}>
                    <span
                      className={`badge-delphi ${
                        selectedDetailOrder.status === 'Completed' || selectedDetailOrder.status === 'Paid'
                          ? 'badge-emerald'
                          : selectedDetailOrder.status === 'Refunded'
                          ? 'badge-rose'
                          : 'badge-amber'
                      }`}
                    >
                      {selectedDetailOrder.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Warehouse Sync Status Banner */}
              <div
                style={{
                  background:
                    selectedDetailOrder.stockDeducted ||
                    selectedDetailOrder.status === 'Completed' ||
                    selectedDetailOrder.status === 'Paid'
                      ? 'rgba(16, 185, 129, 0.08)'
                      : 'rgba(245, 158, 11, 0.08)',
                  border: `1px solid ${
                    selectedDetailOrder.stockDeducted ||
                    selectedDetailOrder.status === 'Completed' ||
                    selectedDetailOrder.status === 'Paid'
                      ? 'rgba(16, 185, 129, 0.3)'
                      : 'rgba(245, 158, 11, 0.3)'
                  }`,
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 16px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {selectedDetailOrder.stockDeducted ||
                  selectedDetailOrder.status === 'Completed' ||
                  selectedDetailOrder.status === 'Paid' ? (
                    <CheckCircle2 size={20} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
                  ) : (
                    <Clock size={20} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />
                  )}
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                      {selectedDetailOrder.stockDeducted ||
                      selectedDetailOrder.status === 'Completed' ||
                      selectedDetailOrder.status === 'Paid'
                        ? '📦 Warehouse Stock Auto-Deducted'
                        : '⏳ Pending Warehouse Stock Cut'}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      {selectedDetailOrder.stockDeducted ||
                      selectedDetailOrder.status === 'Completed' ||
                      selectedDetailOrder.status === 'Paid'
                        ? 'ស្តុកទំនិញត្រូវបានកាត់ចេញពីឃ្លាំងរួចរាល់ និងបានកត់ត្រាក្នុង Movement History'
                        : 'នៅពេល Status ត្រូវប្តូរទៅ Completed ប្រព័ន្ធនឹងកាត់ស្តុកចេញពីឃ្លាំងដោយស្វ័យប្រវត្តិ'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedDetailOrder(null);
                    navigate('/inventory');
                  }}
                  className="btn-secondary"
                  style={{
                    padding: '6px 10px',
                    fontSize: '11.5px',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>Check Warehouse</span>
                  <ArrowRight size={12} />
                </button>
              </div>

              {/* Items Table */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                  ORDERED ITEMS & WAREHOUSE INVENTORY ({selectedDetailOrder.items?.length || 0})
                </div>

                <div
                  style={{
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                  }}
                >
                  <table className="data-table" style={{ margin: 0 }}>
                    <thead>
                      <tr>
                        <th>Item Description</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Subtotal</th>
                        <th>Remaining in Warehouse</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedDetailOrder.items && selectedDetailOrder.items.length > 0 ? (
                        selectedDetailOrder.items.map((it, idx) => {
                          const remainingStock = getProductStock(it);

                          return (
                            <tr key={idx}>
                              <td>
                                <div style={{ fontWeight: 600, color: '#fff' }}>{it.name}</div>
                                {it.sku && (
                                  <div className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                    {it.sku}
                                  </div>
                                )}
                              </td>
                              <td className="font-mono" style={{ fontWeight: 600 }}>
                                x{it.qty || it.quantity || 1}
                              </td>
                              <td className="font-mono">${Number(it.price || 0).toFixed(2)}</td>
                              <td className="font-mono" style={{ fontWeight: 600, color: 'var(--accent-emerald)' }}>
                                ${(Number(it.price || 0) * Number(it.qty || it.quantity || 1)).toFixed(2)}
                              </td>
                              <td>
                                {remainingStock !== null ? (
                                  <span
                                    className="font-mono"
                                    style={{
                                      fontSize: '12px',
                                      fontWeight: 600,
                                      color:
                                        remainingStock === 0
                                          ? 'var(--accent-rose)'
                                          : remainingStock <= 5
                                          ? 'var(--accent-amber)'
                                          : 'var(--accent-emerald)',
                                    }}
                                  >
                                    {remainingStock} units left
                                  </span>
                                ) : (
                                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                    External / Generic
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '16px' }}>
                            No item breakdown available for this invoice.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total calculation */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--bg-body)',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Total Invoice Amount
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="font-mono" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                    ${selectedDetailOrder.totalUsd.toFixed(2)}
                  </div>
                  <div className="font-mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {selectedDetailOrder.totalKhr.toLocaleString()} ៛ KHR
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    const currentOrd = selectedDetailOrder;
                    setSelectedDetailOrder(null);
                    setSelectedReceiptOrder(currentOrd);
                  }}
                  className="btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
                >
                  <Printer size={13} />
                  <span>Print Receipt</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDetailOrder(null)}
                className="btn-primary"
                style={{ padding: '6px 18px', fontSize: '12px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedReceiptOrder && (
        <div className="modal-backdrop" onClick={() => setSelectedReceiptOrder(null)}>
          <div
            className="modal-dialog"
            style={{ maxWidth: '420px', background: '#111' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 className="modal-title" style={{ fontSize: '15px' }}>
                Customer Invoice #{selectedReceiptOrder.id}
              </h3>
              <button onClick={() => setSelectedReceiptOrder(null)} className="btn-icon">
                <X size={16} />
              </button>
            </div>

            <div className="modal-body" style={{ background: '#18181d', padding: '20px' }}>
              {/* Thermal Receipt Simulation */}
              <div className="receipt-paper">
                <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800 }}>ZANDO STORE</h3>
                  <div style={{ fontSize: '11px', color: '#555' }}>Battambang Official Store</div>
                  <div style={{ fontSize: '11px', color: '#555' }}>Tel: 012 345 678</div>
                  <div style={{ margin: '8px 0', borderBottom: '1px dashed #aaa' }}></div>
                </div>

                <div style={{ fontSize: '11px', marginBottom: '10px', lineHeight: 1.5 }}>
                  <div>
                    <strong>Invoice:</strong> {selectedReceiptOrder.id}
                  </div>
                  <div>
                    <strong>Date:</strong> {selectedReceiptOrder.date}
                  </div>
                  <div>
                    <strong>Customer:</strong> {selectedReceiptOrder.customer}
                  </div>
                  <div>
                    <strong>Payment:</strong> {selectedReceiptOrder.paymentMethod}
                  </div>
                  <div>
                    <strong>Status:</strong> {selectedReceiptOrder.status}
                  </div>
                </div>

                <div style={{ borderBottom: '1px dashed #aaa', margin: '8px 0' }}></div>

                {/* Items */}
                <div style={{ fontSize: '11px', marginBottom: '12px' }}>
                  {selectedReceiptOrder.items &&
                    selectedReceiptOrder.items.map((it, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          margin: '4px 0',
                        }}
                      >
                        <span>
                          {it.qty || it.quantity || 1}x {it.name}
                        </span>
                        <strong>
                          $
                          {(
                            Number(it.price || 0) * Number(it.qty || it.quantity || 1)
                          ).toFixed(2)}
                        </strong>
                      </div>
                    ))}
                </div>

                <div style={{ borderBottom: '1px dashed #aaa', margin: '8px 0' }}></div>

                {/* Totals */}
                <div style={{ fontSize: '13px', textAlign: 'right', lineHeight: 1.6 }}>
                  <div>
                    <strong>Total USD: </strong>
                    <span style={{ fontSize: '16px', fontWeight: 800 }}>
                      ${selectedReceiptOrder.totalUsd.toFixed(2)}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#555' }}>
                    <strong>Total KHR: </strong>
                    {selectedReceiptOrder.totalKhr.toLocaleString()} ៛
                  </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '10px', color: '#777' }}>
                  THANK YOU FOR SHOPPING AT ZANDO!
                  <br />
                  PLEASE COME AGAIN
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                onClick={() => setSelectedReceiptOrder(null)}
                className="btn-secondary"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="btn-primary"
              >
                <Printer size={16} />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
