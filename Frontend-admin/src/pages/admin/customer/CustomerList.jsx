import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Award,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  Clock,
  Sparkles,
  Edit2,
  Trash2,
  X,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { adminStore } from '../../../data/adminStore';

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('ALL');
  const [selectedCity, setSelectedCity] = useState('ALL');

  // Drawer / Modal states
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const loadData = () => {
    setCustomers(adminStore.getCustomers());
    setOrders(adminStore.getOrders());
  };

  useEffect(() => {
    loadData();

    const handleSync = () => loadData();
    window.addEventListener('zando_store_sync', handleSync);
    return () => window.removeEventListener('zando_store_sync', handleSync);
  }, []);

  // Filter logic
  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      (c.nameKm && c.nameKm.toLowerCase().includes(q)) ||
      (c.phone && c.phone.includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q));

    const matchTier = selectedTier === 'ALL' || c.tier === selectedTier;
    const matchCity = selectedCity === 'ALL' || (c.city && c.city.toLowerCase() === selectedCity.toLowerCase());

    return matchSearch && matchTier && matchCity;
  });

  // Calculate stats
  const totalPoints = customers.reduce((sum, c) => sum + (c.points || 0), 0);
  const totalRevenue = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
  const vipCount = customers.filter((c) => (c.tier || '').includes('VIP') || (c.tier || '').includes('Gold')).length;

  const handleSaveCustomer = (e) => {
    e.preventDefault();
    if (!editingCustomer.name) return;

    if (editingCustomer.id && customers.some((c) => c.id === editingCustomer.id)) {
      adminStore.updateCustomer(editingCustomer.id, editingCustomer);
    } else {
      adminStore.addCustomer(editingCustomer);
    }
    setIsEditModalOpen(false);
    setEditingCustomer(null);
    loadData();
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete customer account "${name}"?`)) {
      adminStore.deleteCustomer(id);
      if (activeCustomer?.id === id) setActiveCustomer(null);
      loadData();
    }
  };

  const handleAdjustPoints = (cust, delta) => {
    const newPts = Math.max(0, (cust.points || 0) + delta);
    adminStore.updateCustomer(cust.id, { points: newPts });
    loadData();
    if (activeCustomer?.id === cust.id) {
      setActiveCustomer((prev) => ({ ...prev, points: newPts }));
    }
  };

  // Get orders belonging to selected customer
  const customerOrders = activeCustomer
    ? orders.filter(
        (o) =>
          o.customerId === activeCustomer.id ||
          o.phone === activeCustomer.phone ||
          (o.customer && o.customer.toLowerCase().includes(activeCustomer.name.toLowerCase()))
      )
    : [];

  return (
    <div className="page-container">
      {/* Title Row */}
      <div className="page-title-row">
        <div className="page-title-info">
          <h2>Customer Accounts & Loyalty Members</h2>
          <p>Manage customer profiles, order history, and VIP points synced with Storefront</p>
        </div>

        <button
          onClick={() => {
            setEditingCustomer({
              name: '',
              nameKm: '',
              phone: '',
              email: '',
              address: '',
              city: 'Battambang',
              tier: 'Standard Member',
              points: 50,
            });
            setIsEditModalOpen(true);
          }}
          className="btn-primary"
        >
          <Plus size={16} />
          <span>Add Member</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div className="bento-card">
          <div className="bento-header">
            <span className="bento-title">Registered Accounts</span>
            <Users size={16} className="bento-icon" style={{ color: 'var(--accent-emerald)' }} />
          </div>
          <div className="bento-value font-mono">{customers.length}</div>
          <div className="bento-desc">Storefront + POS registered members</div>
        </div>

        <div className="bento-card">
          <div className="bento-header">
            <span className="bento-title">VIP & Gold Tier</span>
            <Award size={16} className="bento-icon" style={{ color: 'var(--accent-amber)' }} />
          </div>
          <div className="bento-value font-mono">{vipCount}</div>
          <div className="bento-desc">High value loyal repeat shoppers</div>
        </div>

        <div className="bento-card">
          <div className="bento-header">
            <span className="bento-title">Total Loyalty Points</span>
            <Sparkles size={16} className="bento-icon" style={{ color: 'var(--accent-violet)' }} />
          </div>
          <div className="bento-value font-mono">{totalPoints.toLocaleString()} PTS</div>
          <div className="bento-desc">Accumulated reward balances</div>
        </div>

        <div className="bento-card">
          <div className="bento-header">
            <span className="bento-title">Member Purchases</span>
            <TrendingUp size={16} className="bento-icon" style={{ color: 'var(--accent-cyan)' }} />
          </div>
          <div className="bento-value font-mono">${totalRevenue.toFixed(2)}</div>
          <div className="bento-desc">Total customer lifetime value</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        {/* Search */}
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
            placeholder="Search customer name, phone, email..."
            className="form-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '38px' }}
          />
        </div>

        {/* Tier Pills */}
        <div className="pill-filter-bar">
          {['ALL', 'VIP Gold', 'Gold Member', 'Silver Member', 'Standard Member'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTier(t)}
              className={`pill-btn ${selectedTier === t ? 'active' : ''}`}
            >
              {t === 'ALL' ? 'All Tiers' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact Details</th>
              <th>Loyalty Tier</th>
              <th>Points</th>
              <th>Orders & Spent</th>
              <th>Location</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((cust) => (
              <tr
                key={cust.id}
                onClick={() => setActiveCustomer(cust)}
                style={{ cursor: 'pointer' }}
              >
                {/* Customer Identity */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={cust.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                      alt={cust.name}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '1px solid var(--border-medium)',
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{cust.name}</div>
                      {cust.nameKm && (
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          {cust.nameKm}
                        </div>
                      )}
                      <div style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                        {cust.id}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Contact */}
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--accent-emerald)' }}>
                      <Phone size={12} />
                      <span className="font-mono">{cust.phone}</span>
                    </div>
                    {cust.email && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                        <Mail size={12} />
                        <span>{cust.email}</span>
                      </div>
                    )}
                  </div>
                </td>

                {/* Tier */}
                <td>
                  <span
                    className={`badge-delphi ${
                      cust.tier?.includes('VIP')
                        ? 'badge-emerald'
                        : cust.tier?.includes('Gold')
                        ? 'badge-amber'
                        : cust.tier?.includes('Silver')
                        ? 'badge-cyan'
                        : 'badge-zinc'
                    }`}
                  >
                    {cust.tier}
                  </span>
                </td>

                {/* Points */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="font-mono" style={{ fontWeight: 700, color: 'var(--accent-amber)' }}>
                      {cust.points || 0}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>PTS</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAdjustPoints(cust, 25);
                      }}
                      title="Add 25 Loyalty Points"
                      style={{
                        background: 'rgba(245, 158, 11, 0.12)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        borderRadius: '4px',
                        color: 'var(--accent-amber)',
                        fontSize: '10px',
                        padding: '1px 5px',
                        cursor: 'pointer',
                      }}
                    >
                      +25
                    </button>
                  </div>
                </td>

                {/* Orders & Total */}
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '12px', color: '#fff', fontWeight: 600 }}>
                      {cust.totalOrders || 0} Orders
                    </span>
                    <span className="font-mono" style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                      ${Number(cust.totalSpent || 0).toFixed(2)}
                    </span>
                  </div>
                </td>

                {/* Location */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <MapPin size={12} style={{ color: 'var(--text-muted)' }} />
                    <span>{cust.city || 'Cambodia'}</span>
                  </div>
                </td>

                {/* Actions */}
                <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => {
                        setEditingCustomer(cust);
                        setIsEditModalOpen(true);
                      }}
                      className="btn-icon"
                      title="Edit Customer"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(cust.id, cust.name)}
                      className="btn-icon"
                      title="Delete Customer"
                      style={{ color: 'var(--accent-rose)' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Detail Drawer */}
      {activeCustomer && (
        <div className="modal-backdrop" onClick={() => setActiveCustomer(null)}>
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '600px' }}
          >
            {/* Header */}
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={activeCustomer.avatar}
                  alt={activeCustomer.name}
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h3 className="modal-title">{activeCustomer.name}</h3>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    ID: {activeCustomer.id} • Joined: {activeCustomer.joinedDate}
                  </div>
                </div>
              </div>
              <button onClick={() => setActiveCustomer(null)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="modal-body">
              {/* Top Banner Stats */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '10px',
                  marginBottom: '20px',
                  background: 'var(--bg-card-hover)',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Membership</div>
                  <div style={{ fontWeight: 600, color: 'var(--accent-amber)', fontSize: '13px' }}>
                    {activeCustomer.tier}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Loyalty Points</div>
                  <div className="font-mono" style={{ fontWeight: 700, color: '#fff', fontSize: '14px' }}>
                    {activeCustomer.points} PTS
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Spent</div>
                  <div className="font-mono" style={{ fontWeight: 700, color: 'var(--accent-emerald)', fontSize: '14px' }}>
                    ${Number(activeCustomer.totalSpent || 0).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} style={{ color: 'var(--accent-emerald)' }} />
                  <span>Delivery Address</span>
                </label>
                <div
                  style={{
                    background: 'var(--bg-input)',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '12.5px',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {activeCustomer.address || 'No street address recorded'} • {activeCustomer.city}
                </div>
              </div>

              {/* Customer Order History */}
              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  <ShoppingBag size={14} style={{ color: 'var(--accent-cyan)' }} />
                  <span>Order Purchase History ({customerOrders.length})</span>
                </label>

                {customerOrders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '12px' }}>
                    No purchase records found for this customer.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
                    {customerOrders.map((ord) => (
                      <div
                        key={ord.id}
                        style={{
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-md)',
                          padding: '10px 14px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="font-mono" style={{ fontWeight: 700, color: '#fff', fontSize: '12.5px' }}>
                              {ord.id}
                            </span>
                            <span
                              className={`badge-delphi ${
                                ord.status === 'Paid' || ord.status === 'Completed'
                                  ? 'badge-emerald'
                                  : 'badge-amber'
                              }`}
                              style={{ fontSize: '10px' }}
                            >
                              {ord.status}
                            </span>
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {ord.date} • {ord.paymentMethod}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div className="font-mono" style={{ fontWeight: 700, color: '#fff', fontSize: '13px' }}>
                            ${Number(ord.totalUsd).toFixed(2)}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {ord.itemsCount || ord.items?.length || 1} items
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                type="button"
                onClick={() => handleAdjustPoints(activeCustomer, 50)}
                className="btn-secondary"
                style={{ color: 'var(--accent-amber)' }}
              >
                <Sparkles size={14} />
                <span>Award +50 PTS</span>
              </button>
              <button type="button" onClick={() => setActiveCustomer(null)} className="btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Customer Modal */}
      {isEditModalOpen && editingCustomer && (
        <div className="modal-backdrop" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingCustomer.id ? 'Edit Member Profile' : 'Register New Member'}
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="modal-body">
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Full Name (English)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingCustomer.name}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Khmer Name (ឈ្មោះខ្មែរ)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingCustomer.nameKm || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, nameKm: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Phone Number (Bakong / Contact)</label>
                  <input
                    type="text"
                    className="form-input font-mono"
                    value={editingCustomer.phone}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={editingCustomer.email || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Membership Tier</label>
                  <select
                    className="form-select"
                    value={editingCustomer.tier}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, tier: e.target.value })}
                  >
                    <option value="Standard Member">Standard Member</option>
                    <option value="Silver Member">Silver Member</option>
                    <option value="Gold Member">Gold Member</option>
                    <option value="VIP Gold">VIP Gold</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Initial Points</label>
                  <input
                    type="number"
                    className="form-input font-mono"
                    value={editingCustomer.points}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, points: parseInt(e.target.value, 10) || 0 })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">City / Province</label>
                  <select
                    className="form-select"
                    value={editingCustomer.city}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, city: e.target.value })}
                  >
                    <option value="Battambang">Battambang</option>
                    <option value="Phnom Penh">Phnom Penh</option>
                    <option value="Siem Reap">Siem Reap</option>
                    <option value="Sihanoukville">Sihanoukville</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Street / Sangkat</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingCustomer.address || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ padding: '16px 0 0 0', marginTop: '16px' }}>
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
