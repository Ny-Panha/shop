import React, { useState, useRef, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { 
  X, ChevronRight, Filter as FilterIcon, ChevronDown, Check 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// ─── Gender-Aware Category Config ─────────────────────────────────────────────
// Add new category: add 1 line here + tag products with the new category key
const CATEGORY_CONFIG = [
  { id: 'ALL',      men: 'ទាំងអស់',             women: 'ទំនិញទាំងអស់' },
  { id: 'T-Shirts', men: 'T-Shirt & Polo',      women: 'Tops & Blouses' },
  { id: 'CLOTHES',  men: 'សម្លៀកបំពាក់',         women: 'Dresses & Skirts' },
  { id: 'Jeans',    men: 'ខោ Jeans & Pants',    women: 'ខោ Jeans' },
  { id: 'SHOES',    men: 'ស្បែកជើង',             women: 'ស្បែកជើង' },
  { id: 'BAGS',     men: 'កាបូប & Accessories',  women: 'កាបូប & Accessories' },
  { id: 'NEW_IN',   men: 'ថ្មីៗ',                women: 'ថ្មីៗ' },
  { id: 'SALE',     men: 'Sale',                women: 'Sale' },
];

export function ProductGrid({
  products = [],
  loading = false,
  sortBy = 'featured',
  setSortBy,
  searchQuery = '',
  setSearchQuery,
  selectedBrand = 'ALL',
  setSelectedBrand,
  selectedCategory = 'ALL',
  setSelectedCategory,
  selectedGender = 'men',
  setSelectedGender,
  inStockOnly = false,
  setInStockOnly,
  onResetFilters,
  onQuickView
}) {
  const { lang } = useLanguage();

  // Filter Drawer State
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Reset category when gender changes
  useEffect(() => {
    if (setSelectedCategory) setSelectedCategory('ALL');
  }, [selectedGender]);


  // Additional Filter Drawer states (matching Fiter.png)
  const [selectedSize, setSelectedSize] = useState('ALL');
  const [selectedColor, setSelectedColor] = useState('ALL');
  const [priceMin, setPriceMin] = useState(8);
  const [priceMax, setPriceMax] = useState(55);
  const [tempSortBy, setTempSortBy] = useState(sortBy);

  const pillsContainerRef = useRef(null);

  const scrollPillsRight = () => {
    if (pillsContainerRef.current) {
      pillsContainerRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  // Color options (from Fiter.png)
  const colorOptions = [
    { id: 'Black', name: 'Black', hex: '#111827' },
    { id: 'Gray', name: 'Gray', hex: '#9ca3af' },
    { id: 'White', name: 'White', hex: '#ffffff', border: true },
    { id: 'Blue', name: 'Blue', hex: '#2563eb' },
    { id: 'Purple', name: 'Purple', hex: '#7e22ce' },
    { id: 'Brown', name: 'Brown', hex: '#78350f' },
    { id: 'Printed', name: 'Printed', hex: '#f4f4f5', border: true },
    { id: 'Red', name: 'Red', hex: '#dc2626' }
  ];

  // Size options (from Fiter.png)
  const sizeOptions = ['28', '29', '30', '31', '32', '34', '36', 'XS', 'S', 'M', 'L', 'XL'];

  // Sort options (from Fiter.png)
  const sortButtons = [
    { id: 'featured', label: 'Recommend' },
    { id: 'newest', label: 'ទំនិញថ្មី' },
    { id: 'discount_desc', label: 'ការបញ្ចុះតម្លៃខ្ពស់ទៅទាប' },
    { id: 'discount_asc', label: 'ការបញ្ចុះតម្លៃទាបទៅខ្ពស់' },
    { id: 'price_desc', label: 'តម្លៃខ្ពស់ទៅទាប' },
    { id: 'price_asc', label: 'តម្លៃទាបទៅខ្ពស់' }
  ];

  // Filtering
  const filteredProducts = products.filter((product) => {
    // 1. Gender Filter: Women shows ONLY Women, Men shows ONLY Men
    if (selectedGender && selectedGender !== 'ALL') {
      const pGender = product.gender || 'men';
      if (selectedGender === 'women' && pGender !== 'women') return false;
      if (selectedGender === 'men' && pGender !== 'men') return false;
      if (selectedGender === 'kids' && pGender !== 'kids') return false;
    }

    // 2. Brand
    if (selectedBrand && selectedBrand !== 'ALL') {
      const pBrand = (product.brand || '').toUpperCase();
      if (!pBrand.includes(selectedBrand.toUpperCase())) return false;
    }

    // 3. Category Filter
    if (selectedCategory && selectedCategory !== 'ALL') {
      if (selectedCategory === 'NEW_IN') {
        const isNew = (product.badge && product.badge.toLowerCase().includes('new')) ||
          Boolean(product.isNewArrival);
        if (!isNew) return false;
      } else if (selectedCategory === 'SALE') {
        const isSale = (product.discountPercent && product.discountPercent > 0) ||
          (product.badge && product.badge.includes('%'));
        if (!isSale) return false;
      } else if (selectedCategory === 'SHOES') {
        const cat = (product.category || '').toUpperCase();
        const sub = (product.subCategory || '').toLowerCase();
        if (!cat.includes('SHOE') && !sub.includes('shoe') && !sub.includes('sneaker') && !sub.includes('heel')) return false;
      } else if (selectedCategory === 'BAGS') {
        const cat = (product.category || '').toUpperCase();
        const sub = (product.subCategory || '').toLowerCase();
        if (!cat.includes('BAG') && !sub.includes('bag') && !sub.includes('purse')) return false;
      } else if (selectedCategory === 'CLOTHES') {
        const cat = (product.category || '').toUpperCase();
        const sub = (product.subCategory || '').toLowerCase();
        if (cat !== 'CLOTHES' && !cat.includes('DRESS') && !cat.includes('TOP') && !sub.includes('dress') && !sub.includes('skirt') && !sub.includes('jacket')) return false;
      } else if (selectedCategory === 'Jeans') {
        const cat = (product.category || '').toUpperCase();
        const sub = (product.subCategory || '').toLowerCase();
        if (!cat.includes('JEAN') && !sub.includes('jean') && !sub.includes('pant')) return false;
      } else if (selectedCategory === 'T-Shirts') {
        const cat = (product.category || '').toUpperCase();
        const sub = (product.subCategory || '').toLowerCase();
        if (!cat.includes('T-SHIRT') && !cat.includes('TOP') && !sub.includes('t-shirt') && !sub.includes('polo') && !sub.includes('tee')) return false;
      }
    }

    // 4. Price
    const pPrice = Number(product.price || 0);
    if (pPrice < priceMin || pPrice > priceMax) return false;

    // 5. Search Query
    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchName = (product.name || '').toLowerCase().includes(q);
      const matchNameEn = (product.nameEn || '').toLowerCase().includes(q);
      const matchBrand = (product.brand || '').toLowerCase().includes(q);
      if (!matchName && !matchNameEn && !matchBrand) return false;
    }

    return true;
  });


  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_asc') return Number(a.price) - Number(b.price);
    if (sortBy === 'price_desc') return Number(b.price) - Number(a.price);
    if (sortBy === 'discount_desc') return (Number(b.discountPercent) || 0) - (Number(a.discountPercent) || 0);
    if (sortBy === 'discount_asc') return (Number(a.discountPercent) || 0) - (Number(b.discountPercent) || 0);
    if (sortBy === 'newest') return b.id - a.id;
    return 0; // default recommend
  });

  const handleApplyFilter = () => {
    if (setSortBy) setSortBy(tempSortBy);
    setIsFilterDrawerOpen(false);
  };

  const handleClearFilter = () => {
    setPriceMin(8);
    setPriceMax(39);
    setSelectedSize('ALL');
    setSelectedColor('ALL');
    setTempSortBy('featured');
    if (setSortBy) setSortBy('featured');
    if (onResetFilters) onResetFilters();
  };

  return (
    <div style={{ width: '100%', maxWidth: '1440px', margin: '0 auto', padding: '16px 24px 60px 24px', backgroundColor: '#ffffff', color: '#111827' }}>
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & SUBCATEGORY PILLS BAR (Exact match to pel-click-category.png) */}
      {/* ========================================================================= */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        marginBottom: '24px',
        paddingBottom: '8px'
      }}>
        {/* Left: Category Title + Count — uses CATEGORY_CONFIG for gender-aware label */}
        <div style={{ minWidth: '160px', flexShrink: 0 }}>
          <h1 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            margin: 0,
            color: '#111827'
          }}>
            {(() => {
              const cfg = CATEGORY_CONFIG.find(c => c.id === selectedCategory);
              const label = cfg ? cfg[selectedGender] || cfg.men : selectedCategory;
              return selectedGender === 'women'
                ? `${label}`
                : `${label}`;
            })()}
          </h1>
          <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '2px' }}>
            {sortedProducts.length} Items
          </div>
        </div>

        {/* Center: Gender-Aware Category Tabs (CATEGORY_CONFIG) */}
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0, position: 'relative' }}>
          <div
            ref={pillsContainerRef}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              paddingRight: '36px'
            }}
          >
            {CATEGORY_CONFIG.map((cat) => {
              const label = cat[selectedGender] || cat.men;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    if (setSelectedCategory) setSelectedCategory(cat.id);
                  }}
                  style={{
                    whiteSpace: 'nowrap',
                    padding: '7px 14px',
                    borderRadius: '2px',
                    fontSize: '0.78rem',
                    fontWeight: isActive ? 700 : 500,
                    backgroundColor: isActive ? '#111827' : '#ffffff',
                    color: isActive ? '#ffffff' : '#374151',
                    border: isActive ? '1px solid #111827' : '1px solid #e5e7eb',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    flexShrink: 0
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Right Chevron for Pills */}
          <button
            onClick={scrollPillsRight}
            aria-label="Scroll right"
            style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: '28px',
              height: '28px',
              borderRadius: '2px',
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '-4px 0 8px rgba(255,255,255,0.9)'
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>


        {/* Right: Black Filter Button (Matching pel-click-category.png) */}
        <button
          onClick={() => setIsFilterDrawerOpen(true)}
          style={{
            backgroundColor: '#111827',
            color: '#ffffff',
            border: 'none',
            borderRadius: '2px',
            padding: '8px 22px',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0
          }}
        >
          <span>Filter</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. PRODUCT GRID (EXACTLY 5 COLUMNS - Matching pel-click-category.png)     */}
      {/* ========================================================================= */}
      {sortedProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#6b7280' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No products found in this category.</p>
          <button
            onClick={handleClearFilter}
            style={{
              marginTop: '12px',
              backgroundColor: '#111827',
              color: '#ffffff',
              padding: '8px 20px',
              border: 'none',
              borderRadius: '2px',
              cursor: 'pointer'
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '16px'
          }}
        >
          {sortedProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. FILTER SLIDE-OVER DRAWER (EXACT MATCH TO Fiter.png)                    */}
      {/* ========================================================================= */}
      {isFilterDrawerOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            display: 'flex',
            justifyContent: 'flex-end'
          }}
          onClick={() => setIsFilterDrawerOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              width: '100%',
              maxWidth: '380px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.2)',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 20px',
              borderBottom: '1px solid #f1f5f9'
            }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#111827' }}>
                Filter
              </h2>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#6b7280' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Body Content */}
            <div style={{ padding: '20px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* SECTION 1: តម្រៀបតាម (Sort by) */}
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: '0 0 12px 0', color: '#111827' }}>
                  តម្រៀបតាម
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {sortButtons.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setTempSortBy(s.id)}
                      style={{
                        padding: '8px 10px',
                        fontSize: '0.74rem',
                        fontWeight: tempSortBy === s.id ? 700 : 500,
                        backgroundColor: tempSortBy === s.id ? '#f3f4f6' : '#ffffff',
                        border: tempSortBy === s.id ? '1.5px solid #111827' : '1px solid #e5e7eb',
                        borderRadius: '2px',
                        color: '#111827',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 2: ចន្លោះតម្លៃ (Price Range) */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: 0, color: '#111827' }}>
                    ចន្លោះតម្លៃ
                  </h4>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#111827' }}>
                    {priceMin}$ - {priceMax}$
                  </span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="100"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#111827' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px' }}>
                  <span>8$</span>
                  <span>100$</span>
                </div>
              </div>

              {/* SECTION 3: Category */}
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: '0 0 12px 0', color: '#111827' }}>
                  Category
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {subcategoryPills.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setActiveSubPill(c.id)}
                      style={{
                        padding: '6px 12px',
                        fontSize: '0.72rem',
                        fontWeight: activeSubPill === c.id ? 700 : 500,
                        backgroundColor: activeSubPill === c.id ? '#f3f4f6' : '#ffffff',
                        border: activeSubPill === c.id ? '1.5px solid #111827' : '1px solid #e5e7eb',
                        borderRadius: '2px',
                        color: '#111827',
                        cursor: 'pointer'
                      }}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 4: ពណ៌ (Color) */}
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: '0 0 12px 0', color: '#111827' }}>
                  ពណ៌
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                  {colorOptions.map(c => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedColor(selectedColor === c.id ? 'ALL' : c.id)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: c.hex,
                        border: selectedColor === c.id ? '2px solid #111827' : (c.border ? '1px solid #d1d5db' : 'none'),
                        boxShadow: selectedColor === c.id ? '0 0 0 2px #ffffff, 0 0 0 4px #111827' : 'none',
                        transition: 'all 0.15s ease'
                      }} />
                      <span style={{ fontSize: '0.72rem', color: '#4b5563', fontWeight: selectedColor === c.id ? 700 : 400 }}>
                        {c.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 5: ទំហំ (Size) */}
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: '0 0 12px 0', color: '#111827' }}>
                  ទំហំ
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {sizeOptions.map(sz => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(selectedSize === sz ? 'ALL' : sz)}
                      style={{
                        height: '36px',
                        border: selectedSize === sz ? '1.5px solid #111827' : '1px solid #e5e7eb',
                        borderRadius: '2px',
                        backgroundColor: selectedSize === sz ? '#f3f4f6' : '#ffffff',
                        fontSize: '0.78rem',
                        fontWeight: selectedSize === sz ? 700 : 500,
                        color: '#111827',
                        cursor: 'pointer'
                      }}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Actions: Clear & Apply (Exact match to Fiter.png) */}
            <div style={{
              display: 'flex',
              gap: '12px',
              padding: '16px 20px',
              borderTop: '1px solid #f1f5f9',
              backgroundColor: '#ffffff'
            }}>
              <button
                onClick={handleClearFilter}
                style={{
                  flex: 1,
                  height: '42px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: '2px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  color: '#374151',
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>
              <button
                onClick={handleApplyFilter}
                style={{
                  flex: 1,
                  height: '42px',
                  backgroundColor: '#111827',
                  border: 'none',
                  borderRadius: '2px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  color: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                Apply
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
