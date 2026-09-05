import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Package,
  ArrowDownRight,
  ArrowUpRight,
  RefreshCw,
  AlertTriangle,
  History,
  DollarSign,
  Search,
  CheckCircle2,
  TrendingDown,
} from 'lucide-react';
import { productService } from '../../../services/inventory/product.service';
import { inventoryService } from '../../../services/inventory/inventory.service';
import { settingsService } from '../../../services/system/settings.service';
import StockAdjustModal from '../../../components/inventory/StockAdjustModal';
import StockHistoryTable from '../../../components/inventory/StockHistoryTable';

export default function Inventory() {
  const [searchParams] = useSearchParams();
  const urlTab = searchParams.get('tab');
  const urlSearch = searchParams.get('search');

  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [valuation, setValuation] = useState(null);
  const [settings, setSettings] = useState({ exchangeRate: 4100 });
  const [activeTab, setActiveTab] = useState(urlTab || 'catalog'); // 'catalog' | 'history' | 'alerts'
  const [searchQuery, setSearchQuery] = useState(urlSearch || '');

  useEffect(() => {
    const t = searchParams.get('tab');
    const s = searchParams.get('search');
    if (t) setActiveTab(t);
    if (s) setSearchQuery(s);
  }, [searchParams]);

  const [selectedProductForAdjust, setSelectedProductForAdjust] = useState(null);

  const loadData = () => {
    setProducts(productService.getAll());
    setMovements(inventoryService.getHistory());
    setValuation(inventoryService.getInventoryValuation());
    setSettings(settingsService.get());
  };

  useEffect(() => {
    loadData();

    const handleSync = () => loadData();
    window.addEventListener('zando_store_sync', handleSync);
    return () => window.removeEventListener('zando_store_sync', handleSync);
  }, []);

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)
    );
  });

  const lowStockItems = products.filter(
    (p) => p.stock <= (p.lowStockThreshold || settings.lowStockAlertLevel || 5)
  );

  return (
    <div className="page-container">
      {/* Title */}
      <div className="page-title-row">
        <div className="page-title-info">
          <h2>Warehouse & Inventory Management (ឃ្លាំងទំនិញ)</h2>
          <p>Real-time stock balances, stock-in shipments, audits, and movement history</p>
        </div>
      </div>

      {/* Top Telemetry Bento Grid */}
      {valuation && (
        <div className="bento-grid">
          <div className="bento-card" style={{ gridColumn: 'span 3' }}>
            <div className="stat-header">
              <span className="stat-label">Total Stock Units</span>
              <div
                className="stat-icon-wrapper"
                style={{ background: 'var(--accent-emerald-glow)', borderColor: 'rgba(16, 185, 129, 0.2)' }}
              >
                <Package size={18} style={{ color: 'var(--accent-emerald)' }} />
              </div>
            </div>
            <div className="stat-value">{valuation.totalUnits.toLocaleString()}</div>
            <div className="stat-footer">
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Across {products.length} active SKUs
              </span>
            </div>
          </div>

          <div className="bento-card" style={{ gridColumn: 'span 3' }}>
            <div className="stat-header">
              <span className="stat-label">Inventory Asset Cost</span>
              <div
                className="stat-icon-wrapper"
                style={{ background: 'var(--accent-indigo-glow)', borderColor: 'rgba(99, 102, 241, 0.2)' }}
              >
                <DollarSign size={18} style={{ color: 'var(--accent-indigo)' }} />
              </div>
            </div>
            <div className="stat-value">${valuation.totalAssetValueUsd.toFixed(2)}</div>
            <div className="stat-footer">
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                {valuation.totalAssetValueKhr.toLocaleString()} ៛ KHR
              </span>
            </div>
          </div>

          <div className="bento-card" style={{ gridColumn: 'span 3' }}>
            <div className="stat-header">
              <span className="stat-label">Retail Value</span>
              <div
                className="stat-icon-wrapper"
                style={{ background: 'rgba(255, 255, 255, 0.05)', borderColor: 'var(--border-subtle)' }}
              >
                <DollarSign size={18} style={{ color: '#fff' }} />
              </div>
            </div>
            <div className="stat-value">${valuation.totalRetailValueUsd.toFixed(2)}</div>
            <div className="stat-footer">
              <span style={{ fontSize: '11px', color: 'var(--accent-emerald)' }}>
                Potential Gross Revenue
              </span>
            </div>
          </div>

          <div className="bento-card" style={{ gridColumn: 'span 3' }}>
            <div className="stat-header">
              <span className="stat-label">Stock Alert Warnings</span>
              <div
                className="stat-icon-wrapper"
                style={{
                  background: lowStockItems.length > 0 ? 'var(--accent-rose-glow)' : 'var(--accent-emerald-glow)',
                  borderColor:
                    lowStockItems.length > 0 ? 'rgba(244, 63, 94, 0.3)' : 'rgba(16, 185, 129, 0.2)',
                }}
              >
                <AlertTriangle
                  size={18}
                  style={{ color: lowStockItems.length > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}
                />
              </div>
            </div>
            <div
              className="stat-value"
              style={{ color: lowStockItems.length > 0 ? 'var(--accent-rose)' : '#fff' }}
            >
              {lowStockItems.length} SKUs
            </div>
            <div className="stat-footer">
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {valuation.outOfStockItems.length} out of stock
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <div className="pill-filter-bar">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`pill-btn ${activeTab === 'catalog' ? 'active' : ''}`}
          >
            <Package size={14} /> Warehouse Stock List ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pill-btn ${activeTab === 'history' ? 'active' : ''}`}
          >
            <History size={14} /> Stock Movements ({movements.length})
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`pill-btn ${activeTab === 'alerts' ? 'active' : ''}`}
          >
            <AlertTriangle size={14} /> Low Stock Warnings ({lowStockItems.length})
          </button>
        </div>

        {activeTab === 'catalog' && (
          <div style={{ position: 'relative', width: '280px' }}>
            <Search
              size={15}
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
              placeholder="Search SKU, product..."
              className="form-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '34px', fontSize: '12.5px', padding: '6px 12px 6px 34px' }}
            />
          </div>
        )}
      </div>

      {/* Tab 1: Catalog Stock Table */}
      {activeTab === 'catalog' && (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Department</th>
                <th>Category</th>
                <th>Cost Price</th>
                <th>Selling Price</th>
                <th>Stock Units</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Stock Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        style={{ width: '36px', height: '36px', borderRadius: '4px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = '/zando-products/insane_main.jpg';
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: '#fff' }}>{p.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="font-mono">{p.sku}</td>
                  <td>
                    <span className="badge-delphi badge-zinc" style={{ textTransform: 'uppercase' }}>
                      {p.gender}
                    </span>
                  </td>
                  <td>{p.category}</td>
                  <td className="font-mono" style={{ color: 'var(--text-muted)' }}>
                    ${(p.costPrice || 0).toFixed(2)}
                  </td>
                  <td className="font-mono" style={{ fontWeight: 600, color: '#fff' }}>
                    ${p.price.toFixed(2)}
                  </td>
                  <td>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: '15px',
                        fontWeight: 700,
                        color:
                          p.stock === 0
                            ? 'var(--accent-rose)'
                            : p.stock <= (p.lowStockThreshold || 5)
                            ? 'var(--accent-amber)'
                            : 'var(--accent-emerald)',
                      }}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td>
                    {p.stock === 0 ? (
                      <span className="badge-delphi badge-rose">Out of Stock</span>
                    ) : p.stock <= (p.lowStockThreshold || 5) ? (
                      <span className="badge-delphi badge-amber">Low ({p.stock})</span>
                    ) : (
                      <span className="badge-delphi badge-emerald">Healthy</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedProductForAdjust(p)}
                      className="btn-secondary"
                      style={{ padding: '5px 12px', fontSize: '12px' }}
                    >
                      <RefreshCw size={13} />
                      <span>Adjust Stock</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Stock Movements History */}
      {activeTab === 'history' && <StockHistoryTable movements={movements} initialSearch={searchQuery} />}

      {/* Tab 3: Low Stock Warnings */}
      {activeTab === 'alerts' && (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Current Units</th>
                <th>Threshold Level</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        style={{ width: '36px', height: '36px', borderRadius: '4px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = '/zando-products/insane_main.jpg';
                        }}
                      />
                      <div style={{ fontWeight: 600, color: '#fff' }}>{p.name}</div>
                    </div>
                  </td>
                  <td className="font-mono">{p.sku}</td>
                  <td className="font-mono" style={{ fontWeight: 700, color: 'var(--accent-rose)' }}>
                    {p.stock}
                  </td>
                  <td className="font-mono">{p.lowStockThreshold || 5} units</td>
                  <td>
                    <span className="badge-delphi badge-rose">
                      <AlertTriangle size={11} /> Reorder Urgently
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedProductForAdjust(p)}
                      className="btn-primary"
                      style={{ padding: '5px 12px', fontSize: '12px' }}
                    >
                      <ArrowDownRight size={13} />
                      <span>Stock In (+)</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      <StockAdjustModal
        isOpen={Boolean(selectedProductForAdjust)}
        product={selectedProductForAdjust}
        onClose={() => setSelectedProductForAdjust(null)}
        onAdjusted={loadData}
      />
    </div>
  );
}
