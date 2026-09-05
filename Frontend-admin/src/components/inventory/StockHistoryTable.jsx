import React from 'react';
import { ArrowDownRight, ArrowUpRight, Clock, User } from 'lucide-react';

export default function StockHistoryTable({ movements = [] }) {
  if (movements.length === 0) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
        No stock movement history recorded yet.
      </div>
    );
  }

  return (
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
            <th>Reason / Notes</th>
            <th>Staff</th>
            <th>Date & Time</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((m) => (
            <tr key={m.id}>
              <td className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {m.id}
              </td>
              <td style={{ fontWeight: 600, color: '#fff' }}>{m.productName}</td>
              <td className="font-mono">{m.sku}</td>
              <td>
                <span
                  className={`badge-delphi ${
                    m.delta > 0 ? 'badge-emerald' : m.delta < 0 ? 'badge-rose' : 'badge-zinc'
                  }`}
                >
                  {m.delta > 0 ? <ArrowDownRight size={11} /> : <ArrowUpRight size={11} />}
                  {m.delta > 0 ? 'STOCK IN' : 'STOCK OUT'}
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
              <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{m.reason}</td>
              <td style={{ fontSize: '12px' }}>{m.user}</td>
              <td style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{m.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
