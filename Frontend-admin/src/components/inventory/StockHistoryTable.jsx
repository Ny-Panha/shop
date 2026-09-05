import React, { useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  User,
  Search,
  Receipt,
  Package,
  Layers,
} from 'lucide-react';

export default function StockHistoryTable({ movements = [] }) {
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'SALES' | 'STOCK_IN' | 'ADJUST'
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = movements.filter((m) => {
    // Type filter
    if (filterType === 'SALES') {
      const isSale =
        m.delta < 0 ||
        m.reason?.toUpperCase().includes('SALE') ||
        m.reason?.toUpperCase().includes('ORDER') ||
        m.reason?.toUpperCase().includes('INVOICE');
      if (!isSale) return false;
    } else if (filterType === 'STOCK_IN') {
      const isStockIn =
        m.delta > 0 &&
        (m.reason?.toUpperCase().includes('STOCK_IN') || m.reason?.toUpperCase().includes('SHIPMENT'));
      if (!isStockIn) return false;
    } else if (filterType === 'ADJUST') {
      const isAdjust =
        m.reason?.toUpperCase().includes('ADJUST') ||
        m.reason?.toUpperCase().includes('AUDIT') ||
        m.reason?.toUpperCase().includes('REFUND');
      if (!isAdjust) return false;
    }

    // Search query filter
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.productName?.toLowerCase().includes(q) ||
      m.sku?.toLowerCase().includes(q) ||
      m.reason?.toLowerCase().includes(q) ||
      m.id?.toLowerCase().includes(q) ||
      m.invoiceId?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      {/* Sub-toolbar for History Filtering */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '16px',
          flexWrap: 'wrap',
        }}
      >
        <div className="pill-filter-bar">
          <button
            onClick={() => setFilterType('ALL')}
            className={`pill-btn ${filterType === 'ALL' ? 'active' : ''}`}
          >
            <Layers size={13} />
            <span>All ({movements.length})</span>
          </button>
          <button
            onClick={() => setFilterType('SALES')}
            className={`pill-btn ${filterType === 'SALES' ? 'active' : ''}`}
          >
            <Receipt size={13} />
            <span>POS & Sales Orders (កាត់ស្តុកលក់)</span>
          </button>
          <button
            onClick={() => setFilterType('STOCK_IN')}
            className={`pill-btn ${filterType === 'STOCK_IN' ? 'active' : ''}`}
          >
            <ArrowDownRight size={13} />
            <span>Stock In (នាំចូល)</span>
          </button>
          <button
            onClick={() => setFilterType('ADJUST')}
            className={`pill-btn ${filterType === 'ADJUST' ? 'active' : ''}`}
          >
            <Package size={13} />
            <span>Adjustments & Refunds</span>
          </button>
        </div>

        <div style={{ position: 'relative', width: '260px' }}>
          <Search
            size={14}
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
            placeholder="Search SKU, invoice, note..."
            className="form-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '34px', fontSize: '12px', padding: '6px 12px 6px 34px' }}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <Package size={32} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>No matching stock movements found</div>
          <div style={{ fontSize: '12px', marginTop: '4px' }}>
            Try adjusting your search query or switching filter tabs.
          </div>
        </div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Ref ID</th>
                <th>Product</th>
                <th>SKU</th>
                <th>Type</th>
                <th>Units Change</th>
                <th>Stock After</th>
                <th>Reason / Invoice Reference</th>
                <th>Staff / Source</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => {
                const isSale =
                  m.delta < 0 &&
                  (m.reason?.toUpperCase().includes('SALE') ||
                    m.reason?.toUpperCase().includes('ORDER') ||
                    m.reason?.toUpperCase().includes('INVOICE'));
                const isRefund = m.reason?.toUpperCase().includes('REFUND');

                return (
                  <tr key={m.id}>
                    <td className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {m.id}
                    </td>
                    <td style={{ fontWeight: 600, color: '#fff' }}>{m.productName}</td>
                    <td className="font-mono">{m.sku}</td>
                    <td>
                      <span
                        className={`badge-delphi ${
                          isRefund
                            ? 'badge-zinc'
                            : m.delta > 0
                            ? 'badge-emerald'
                            : 'badge-rose'
                        }`}
                      >
                        {m.delta > 0 ? <ArrowDownRight size={11} /> : <ArrowUpRight size={11} />}
                        {isRefund
                          ? 'RESTOCKED'
                          : m.delta > 0
                          ? 'STOCK IN'
                          : isSale
                          ? 'SALE CUT'
                          : 'STOCK OUT'}
                      </span>
                    </td>
                    <td
                      className="font-mono"
                      style={{
                        fontWeight: 700,
                        color: m.delta > 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                      }}
                    >
                      {m.delta > 0 ? `+${m.delta}` : m.delta}
                    </td>
                    <td className="font-mono" style={{ fontWeight: 600 }}>
                      {m.newStock}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {isSale && (
                          <span
                            className="badge-delphi badge-zinc"
                            style={{ fontSize: '10px', padding: '1px 6px', fontFamily: 'var(--font-mono)' }}
                          >
                            <Receipt size={10} /> POS
                          </span>
                        )}
                        <span style={{ fontSize: '12px', color: '#fff', fontWeight: 500 }}>
                          {m.reason}
                        </span>
                      </div>
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{m.user}</td>
                    <td style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{m.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
