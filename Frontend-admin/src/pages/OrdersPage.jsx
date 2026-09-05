import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { adminStore } from '../data/adminStore';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState({ exchangeRate: 4100 });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);

  const loadOrders = () => {
    setOrders(adminStore.getOrders());
    setSettings(adminStore.getSettings());
  };

  useEffect(() => {
    loadOrders();

    const handleSync = () => loadOrders();
    window.addEventListener('zando_store_sync', handleSync);
    return () => window.removeEventListener('zando_store_sync', handleSync);
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    adminStore.updateOrderStatus(orderId, newStatus);
    loadOrders();
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

  return (
    <div className="page-container">
      {/* Title */}
      <div className="page-title-row">
        <div className="page-title-info">
          <h2>POS Orders & Sale Receipts</h2>
          <p>Review customer purchases, Bakong KHQR transactions, and print receipts</p>
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
          {['ALL', 'Paid', 'Completed', 'Pending'].map((st) => (
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
              <th>Status</th>
              <th>Date</th>
              <th style={{ textAlign: 'right' }}>Receipt</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((ord) => (
              <tr key={ord.id}>
                <td className="font-mono" style={{ fontWeight: 600, color: '#fff' }}>
                  {ord.id}
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
                  <span style={{ fontSize: '12px' }}>
                    {ord.itemsCount} {ord.itemsCount === 1 ? 'item' : 'items'}
                  </span>
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
                          : 'var(--accent-amber)',
                      fontSize: '12px',
                      padding: '3px 8px',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="Paid">Paid</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </td>
                <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{ord.date}</td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    onClick={() => setSelectedReceiptOrder(ord)}
                    className="btn-secondary"
                    style={{ padding: '5px 10px', fontSize: '12px' }}
                    title="View & Print Receipt"
                  >
                    <Printer size={13} />
                    <span>Receipt</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
                          {it.qty}x {it.name}
                        </span>
                        <strong>${(it.price * it.qty).toFixed(2)}</strong>
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
