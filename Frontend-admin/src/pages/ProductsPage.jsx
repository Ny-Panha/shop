import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Filter,
  ArrowUpDown,
  TrendingDown,
  Tag,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { adminStore } from '../data/adminStore';
import ProductFormModal from '../components/products/ProductFormModal';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState({ exchangeRate: 4100 });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [stockFilter, setStockFilter] = useState('ALL'); // 'ALL' | 'LOW' | 'OUT' | 'IN'

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isRealMode, setIsRealMode] = useState(() => adminStore.isRealDataMode());

  // Load data
  const loadData = () => {
    setProducts(adminStore.getProducts());
    setCategories(adminStore.getCategories());
    setSettings(adminStore.getSettings());
    setIsRealMode(adminStore.isRealDataMode());
  };

  const handleClearMockData = () => {
    if (window.confirm('តើអ្នកពិតជាចង់សម្អាត Mock/Fake Data ទាំងអស់ (57 ទំនិញ) មែនទេ? អ្នកនឹងចាប់ផ្ដើមជាមួយ Real Data ទទេរ ដើម្បី Add Brand និង Add Product ផ្ទាល់ខ្លួនរបស់អ្នក។\n\nAre you sure you want to clear all 57 demo/mock products?')) {
      adminStore.clearMockProducts();
      loadData();
    }
  };

  const handleRestoreDemoData = () => {
    if (window.confirm('តើអ្នកចង់ទាញយកទិន្នន័យគំរូ (57 Demo Products) មកវិញមែនទេ?\n\nRestore demo catalog?')) {
      adminStore.restoreDemoCatalog();
      loadData();
    }
  };

  useEffect(() => {
    loadData();

    const handleSync = () => loadData();
    window.addEventListener('zando_store_sync', handleSync);
    return () => window.removeEventListener('zando_store_sync', handleSync);
  }, []);

  // Filter logic
  const filteredProducts = products.filter((p) => {
    // Search query filter
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      (p.name && p.name.toLowerCase().includes(query)) ||
      (p.nameEn && p.nameEn.toLowerCase().includes(query)) ||
      (p.sku && p.sku.toLowerCase().includes(query)) ||
      (p.brand && p.brand.toLowerCase().includes(query));

    // Gender filter
    const matchesGender = selectedGender === 'ALL' || p.gender === selectedGender;

    // Category filter
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;

    // Stock filter
    let matchesStock = true;
    const lowThreshold = p.lowStockThreshold || 5;
    if (stockFilter === 'LOW') {
      matchesStock = p.stock > 0 && p.stock <= lowThreshold;
    } else if (stockFilter === 'OUT') {
      matchesStock = p.stock === 0;
    } else if (stockFilter === 'IN') {
      matchesStock = p.stock > lowThreshold;
    }

    return matchesSearch && matchesGender && matchesCategory && matchesStock;
  });

  // Handle Save (Add or Edit)
  const handleSaveProduct = (formData) => {
    if (editingProduct) {
      adminStore.updateProduct(editingProduct.id, formData);
    } else {
      adminStore.addProduct(formData);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
    loadData();
  };

  // Handle Delete
  const handleDeleteProduct = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      adminStore.deleteProduct(id);
      loadData();
    }
  };

  // Handle Quick Stock Adjust
  const handleStockChange = (id, delta) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const newStock = Math.max(0, target.stock + delta);
    adminStore.updateProduct(id, { stock: newStock });
    loadData();
  };

  const getStockBadge = (stock, threshold = 5) => {
    if (stock === 0) {
      return (
        <span className="badge-delphi badge-rose">
          <AlertTriangle size={11} /> Out of Stock
        </span>
      );
    }
    if (stock <= threshold) {
      return (
        <span className="badge-delphi badge-amber">
          <TrendingDown size={11} /> Low: {stock} left
        </span>
      );
    }
    return (
      <span className="badge-delphi badge-emerald">
        <CheckCircle2 size={11} /> In Stock ({stock})
      </span>
    );
  };

  return (
    <div className="page-container">
      {/* Title & Action Bar */}
      <div className="page-title-row">
        <div className="page-title-info">
          <h2>Products & Inventory</h2>
          <p>Manage catalog, barcode SKUs, stock levels, and pricing</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Data Mode Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              className="badge-delphi badge-emerald"
              style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <Sparkles size={13} />
              Real Data Mode
            </span>

            {products.length > 0 && (
              <button
                type="button"
                onClick={handleClearMockData}
                className="btn-secondary"
                style={{ color: 'var(--accent-rose)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '7px 12px', fontSize: '12px' }}
                title="លុបទំនិញទាំងអស់ចោល"
              >
                <Trash2 size={14} />
                <span>Clear All Products</span>
              </button>
            )}
          </div>

          {/* View Toggle */}
          <div
            style={{
              display: 'flex',
              background: 'var(--bg-sidebar)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '2px',
            }}
          >
            <button
              onClick={() => setViewMode('grid')}
              className={`btn-icon ${viewMode === 'grid' ? 'active' : ''}`}
              style={{
                background: viewMode === 'grid' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                color: viewMode === 'grid' ? '#fff' : 'var(--text-muted)',
              }}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`btn-icon ${viewMode === 'table' ? 'active' : ''}`}
              style={{
                background: viewMode === 'table' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                color: viewMode === 'table' ? '#fff' : 'var(--text-muted)',
              }}
              title="Table View"
            >
              <List size={16} />
            </button>
          </div>

          {/* Add Product Button */}
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
            className="btn-primary"
          >
            <Plus size={16} />
            <span>Add Product</span>
          </button>
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
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {/* Top Filter Row: Search & Gender Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          {/* Search Box */}
          <div
            style={{
              position: 'relative',
              flex: '1',
              minWidth: '240px',
              maxWidth: '380px',
            }}
          >
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
              placeholder="Search product name, SKU, brand..."
              className="form-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '38px' }}
            />
          </div>

          {/* Gender Filter Pills */}
          <div className="pill-filter-bar">
            {['ALL', 'men', 'women', 'kids'].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGender(g)}
                className={`pill-btn ${selectedGender === g ? 'active' : ''}`}
              >
                {g === 'ALL' ? 'All Genders' : g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Filter Row: Stock Status & Category Dropdown */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Stock Status:</span>
            {[
              { id: 'ALL', label: 'All' },
              { id: 'IN', label: 'In Stock' },
              { id: 'LOW', label: 'Low Stock (< 5)' },
              { id: 'OUT', label: 'Out of Stock' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStockFilter(st.id)}
                style={{
                  background: stockFilter === st.id ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                  border: '1px solid',
                  borderColor: stockFilter === st.id ? 'var(--border-medium)' : 'transparent',
                  borderRadius: 'var(--radius-sm)',
                  padding: '3px 10px',
                  fontSize: '12px',
                  color: stockFilter === st.id ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Count Indicator */}
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Showing <strong style={{ color: '#fff' }}>{filteredProducts.length}</strong> of{' '}
            {products.length} products
          </div>
        </div>
      </div>

      {/* Product Display: Grid View vs Table View */}
      {products.length === 0 ? (
        <div
          style={{
            padding: '64px 24px',
            textAlign: 'center',
            background: 'var(--bg-card)',
            border: '1px dashed var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.1)',
              color: 'var(--accent-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
              Real Data Mode Activated (គ្មាន Fake Data)
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', maxWidth: '480px', margin: '0 auto', lineHeight: 1.5 }}>
              ប្រព័ន្ធត្រូវបានសម្អាតរួចរាល់។ អ្នកអាចបង្កើតទំនិញថ្មី (Add Product) ជាមួយនឹងរូបភាព និង Brand ផ្ទាល់ខ្លួនរបស់អ្នក។
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsModalOpen(true);
              }}
              className="btn-primary"
              style={{ padding: '10px 24px' }}
            >
              <Plus size={16} />
              <span>Add First Product (បន្ថែមទំនិញដំបូង)</span>
            </button>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--text-muted)',
          }}
        >
          <p style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>រកមិនឃើញទំនិញដែលត្រូវនឹងការស្វែងរកទេ</p>
          <p style={{ fontSize: '13px', marginTop: '4px' }}>សូមផ្លាស់ប្តូរ Filter ឬពាក្យគន្លឹះស្វែងរក</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="product-admin-grid">
          {filteredProducts.map((p) => (
            <div key={p.id} className="product-admin-card">
              {/* Card Thumbnail */}
              <div className="product-card-thumb">
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  onError={(e) => {
                    e.target.src = '/zando-products/insane_main.jpg';
                  }}
                />
                {p.badge && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: 'rgba(0, 0, 0, 0.75)',
                      backdropFilter: 'blur(6px)',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#fff',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {p.badge}
                  </div>
                )}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                  }}
                >
                  {getStockBadge(p.stock, p.lowStockThreshold)}
                </div>
              </div>

              {/* Card Content */}
              <div className="product-card-content">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {p.sku}
                  </span>
                  <span
                    className="badge-delphi badge-zinc"
                    style={{ textTransform: 'uppercase', fontSize: '10px' }}
                  >
                    {p.gender}
                  </span>
                </div>

                <h4
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#fff',
                    lineHeight: 1.3,
                    marginBottom: '2px',
                  }}
                >
                  {p.name}
                </h4>
                {p.nameEn && p.nameEn !== p.name && (
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      marginBottom: '6px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {p.nameEn}
                  </p>
                )}

                {/* Color Swatch Dots & Sizes */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                  {p.colorDots && p.colorDots.length > 0 ? (
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      {p.colorDots.map((c, i) => (
                        <span
                          key={i}
                          style={{
                            width: '9px',
                            height: '9px',
                            borderRadius: '50%',
                            backgroundColor: c,
                            border: '1px solid rgba(255,255,255,0.25)',
                            display: 'inline-block',
                          }}
                          title={c}
                        />
                      ))}
                    </div>
                  ) : (
                    <span />
                  )}
                  {p.sizes && p.sizes.length > 0 && (
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {p.sizes.slice(0, 3).join(', ')}{p.sizes.length > 3 ? '...' : ''}
                    </span>
                  )}
                </div>

                {/* Price and Stock Controls */}
                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '16px',
                        fontWeight: 700,
                        color: 'var(--accent-emerald)',
                      }}
                    >
                      ${p.price.toFixed(2)}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {(p.price * settings.exchangeRate).toLocaleString()} ៛
                    </div>
                  </div>

                  {/* Edit / Delete Buttons */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => {
                        setEditingProduct(p);
                        setIsModalOpen(true);
                      }}
                      className="btn-icon"
                      title="Edit Product"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                      className="btn-icon"
                      style={{ color: 'var(--accent-rose)' }}
                      title="Delete Product"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Gender</th>
                <th>Price ($)</th>
                <th>Price (KHR)</th>
                <th>Stock</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: 'var(--radius-sm)',
                          objectFit: 'cover',
                          background: '#111',
                        }}
                        onError={(e) => {
                          e.target.src = '/zando-products/insane_main.jpg';
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: '#fff' }}>{p.name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.brand}</span>
                          {p.colorDots && p.colorDots.length > 0 && (
                            <div style={{ display: 'inline-flex', gap: '3px', alignItems: 'center' }}>
                              {p.colorDots.map((c, idx) => (
                                <span
                                  key={idx}
                                  style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: c,
                                    border: '1px solid rgba(255,255,255,0.25)',
                                    display: 'inline-block',
                                  }}
                                  title={c}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="font-mono" style={{ fontSize: '12px' }}>
                    {p.sku}
                  </td>
                  <td>{p.category}</td>
                  <td>
                    <span className="badge-delphi badge-zinc" style={{ textTransform: 'uppercase' }}>
                      {p.gender}
                    </span>
                  </td>
                  <td className="font-mono" style={{ fontWeight: 600, color: '#fff' }}>
                    ${p.price.toFixed(2)}
                  </td>
                  <td className="font-mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {(p.price * settings.exchangeRate).toLocaleString()} ៛
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        onClick={() => handleStockChange(p.id, -1)}
                        className="btn-icon"
                        style={{ width: '22px', height: '22px', fontSize: '12px' }}
                      >
                        -
                      </button>
                      <span className="font-mono" style={{ fontWeight: 600, minWidth: '24px', textAlign: 'center' }}>
                        {p.stock}
                      </span>
                      <button
                        onClick={() => handleStockChange(p.id, 1)}
                        className="btn-icon"
                        style={{ width: '22px', height: '22px', fontSize: '12px' }}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>{getStockBadge(p.stock, p.lowStockThreshold)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        onClick={() => {
                          setEditingProduct(p);
                          setIsModalOpen(true);
                        }}
                        className="btn-icon"
                        title="Edit Product"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="btn-icon"
                        style={{ color: 'var(--accent-rose)' }}
                        title="Delete Product"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit/Add Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        product={editingProduct}
        categories={categories}
      />
    </div>
  );
}
