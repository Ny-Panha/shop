import React, { useState } from 'react';
import { X, ArrowDownRight, ArrowUpRight, RefreshCw, Save } from 'lucide-react';
import { productService } from '../../services/inventory/product.service';

export default function StockAdjustModal({ isOpen, onClose, product, onAdjusted }) {
  const [actionType, setActionType] = useState('ADD'); // 'ADD' (Stock In) | 'SUBTRACT' (Stock Out) | 'SET' (Audit)
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('Supplier Shipment Received');

  if (!isOpen || !product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const qtyNum = parseInt(quantity, 10);
    if (isNaN(qtyNum) || qtyNum <= 0) return;

    let delta = 0;
    let fullReason = reason;

    if (actionType === 'ADD') {
      delta = qtyNum;
      fullReason = `STOCK_IN: ${reason}`;
    } else if (actionType === 'SUBTRACT') {
      delta = -qtyNum;
      fullReason = `STOCK_OUT: ${reason}`;
    } else if (actionType === 'SET') {
      delta = qtyNum - product.stock;
      fullReason = `STOCK_AUDIT_SET: ${reason}`;
    }

    productService.adjustStock(product.id, delta, fullReason);
    if (onAdjusted) onAdjusted();
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" style={{ maxWidth: '460px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RefreshCw size={18} style={{ color: 'var(--accent-emerald)' }} />
            <h3 className="modal-title">Adjust Stock Inventory (កែប្រែស្តុក)</h3>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Product Summary */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '18px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{ width: '44px', height: '44px', borderRadius: '4px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = '/zando-products/insane_main.jpg';
              }}
            />
            <div>
              <div style={{ fontWeight: 600, color: '#fff', fontSize: '13.5px' }}>{product.name}</div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                SKU: <span className="font-mono">{product.sku}</span> | Current Stock:{' '}
                <strong style={{ color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                  {product.stock}
                </strong>
              </div>
            </div>
          </div>

          {/* Action Tabs */}
          <div className="form-group">
            <label className="form-label">Adjustment Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  setActionType('ADD');
                  setReason('Supplier Shipment Received');
                }}
                className={`btn-secondary ${actionType === 'ADD' ? 'active' : ''}`}
                style={{
                  justifyContent: 'center',
                  borderColor: actionType === 'ADD' ? 'var(--accent-emerald)' : undefined,
                  color: actionType === 'ADD' ? 'var(--accent-emerald)' : undefined,
                }}
              >
                <ArrowDownRight size={14} /> Stock In (+)
              </button>
              <button
                type="button"
                onClick={() => {
                  setActionType('SUBTRACT');
                  setReason('Damaged / Expired Item');
                }}
                className={`btn-secondary ${actionType === 'SUBTRACT' ? 'active' : ''}`}
                style={{
                  justifyContent: 'center',
                  borderColor: actionType === 'SUBTRACT' ? 'var(--accent-rose)' : undefined,
                  color: actionType === 'SUBTRACT' ? 'var(--accent-rose)' : undefined,
                }}
              >
                <ArrowUpRight size={14} /> Stock Out (-)
              </button>
              <button
                type="button"
                onClick={() => {
                  setActionType('SET');
                  setReason('Warehouse Inventory Audit Count');
                }}
                className={`btn-secondary ${actionType === 'SET' ? 'active' : ''}`}
                style={{
                  justifyContent: 'center',
                  borderColor: actionType === 'SET' ? '#fff' : undefined,
                }}
              >
                Exact Count (=)
              </button>
            </div>
          </div>

          {/* Quantity */}
          <div className="form-group">
            <label className="form-label">
              {actionType === 'SET' ? 'New Exact Quantity in Stock' : 'Quantity Units'}
            </label>
            <input
              type="number"
              min="1"
              className="form-input font-mono"
              style={{ fontSize: '18px', fontWeight: 700 }}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          {/* Reason */}
          <div className="form-group">
            <label className="form-label">Adjustment Reason / Notes (មូលហេតុ)</label>
            <input
              type="text"
              className="form-input"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. New delivery from factory, damaged, return..."
              required
            />
          </div>
        </form>

        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" onClick={handleSubmit} className="btn-primary">
            <Save size={15} />
            <span>Apply Adjustment</span>
          </button>
        </div>
      </div>
    </div>
  );
}
