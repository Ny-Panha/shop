import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle, Store, DollarSign, QrCode, Bell } from 'lucide-react';
import { adminStore } from '../data/adminStore';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    shopName: 'ZANDO FASHION STORE',
    branch: 'Battambang Main Store',
    phone: '012 345 678',
    exchangeRate: 4100,
    bakongAccountId: 'zandostore@aclb',
    currency: 'USD',
    lowStockAlertLevel: 5,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setSettings(adminStore.getSettings());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    adminStore.saveSettings({
      ...settings,
      exchangeRate: Number(settings.exchangeRate) || 4100,
      lowStockAlertLevel: Number(settings.lowStockAlertLevel) || 5,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="page-container">
      {/* Title */}
      <div className="page-title-row">
        <div className="page-title-info">
          <h2>Shop Configuration & POS Settings</h2>
          <p>Manage exchange rates, Bakong KHQR integration, and store details</p>
        </div>

        {savedSuccess && (
          <div className="badge-delphi badge-emerald" style={{ padding: '8px 14px', fontSize: '13px' }}>
            <CheckCircle size={15} />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: '840px' }}>
        {/* Section 1: Store Profile */}
        <div className="bento-card" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <Store size={18} style={{ color: 'var(--accent-emerald)' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>Store Profile</h3>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Shop Name</label>
              <input
                type="text"
                className="form-input"
                value={settings.shopName}
                onChange={(e) => setSettings({ ...settings, shopName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Store Branch</label>
              <input
                type="text"
                className="form-input"
                value={settings.branch}
                onChange={(e) => setSettings({ ...settings, branch: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contact Phone</label>
            <input
              type="text"
              className="form-input"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
            />
          </div>
        </div>

        {/* Section 2: Currency & Exchange Rate */}
        <div className="bento-card" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <DollarSign size={18} style={{ color: 'var(--accent-emerald)' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>
              Currency & Exchange Rate
            </h3>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">USD to KHR Rate ($1 = ? ៛)</label>
              <input
                type="number"
                className="form-input font-mono"
                value={settings.exchangeRate}
                onChange={(e) => setSettings({ ...settings, exchangeRate: e.target.value })}
                required
              />
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Standard market rate: 4,100 KHR per USD
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Low Stock Warning Threshold</label>
              <input
                type="number"
                className="form-input font-mono"
                value={settings.lowStockAlertLevel}
                onChange={(e) => setSettings({ ...settings, lowStockAlertLevel: e.target.value })}
              />
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Trigger warning when stock drops to or below this quantity
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Bakong KHQR Payment */}
        <div className="bento-card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <QrCode size={18} style={{ color: 'var(--accent-emerald)' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>
              Bakong KHQR Integration
            </h3>
          </div>

          <div className="form-group">
            <label className="form-label">Bakong Merchant Account ID</label>
            <input
              type="text"
              className="form-input font-mono"
              value={settings.bakongAccountId}
              onChange={(e) => setSettings({ ...settings, bakongAccountId: e.target.value })}
            />
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Customer app uses this ID to generate real Bakong KHQR payment codes
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>
            <Save size={16} />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
