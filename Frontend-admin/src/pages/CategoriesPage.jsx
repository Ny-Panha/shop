import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Layers,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Search,
  Pencil,
  LayoutGrid,
  List,
  Tag,
  X,
  FolderPlus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Filter,
  Shirt,
  ShoppingBag,
  Flame,
  Footprints,
  Scissors,
  Package,
  Watch,
  Crown,
  Folder,
} from 'lucide-react';
import { adminStore } from '../data/adminStore';

const AVAILABLE_ICONS = [
  { id: 'Shirt', label: 'Tops & Shirts', Icon: Shirt },
  { id: 'Scissors', label: 'Jeans & Bottoms', Icon: Scissors },
  { id: 'Footprints', label: 'Footwear & Shoes', Icon: Footprints },
  { id: 'ShoppingBag', label: 'Bags & Accessories', Icon: ShoppingBag },
  { id: 'Sparkles', label: 'New Arrivals', Icon: Sparkles },
  { id: 'Flame', label: 'Sale & Deals', Icon: Flame },
  { id: 'Layers', label: 'Jackets & Coats', Icon: Layers },
  { id: 'Package', label: 'Packs & Travel', Icon: Package },
  { id: 'Watch', label: 'Watches & Jewelry', Icon: Watch },
  { id: 'Tag', label: 'Tag & Kids', Icon: Tag },
  { id: 'Crown', label: 'Premium & Brand', Icon: Crown },
  { id: 'Folder', label: 'General Catalog', Icon: Folder },
];

export function CategoryIcon({ icon, size = 18, color = 'var(--accent-emerald)' }) {
  const iconKey = (icon || '').toLowerCase();

  if (iconKey.includes('shirt') || iconKey.includes('tee') || iconKey.includes('polo') || iconKey.includes('cloth') || iconKey.includes('top') || iconKey.includes('👕') || iconKey.includes('👔') || iconKey.includes('👚') || iconKey.includes('🎽')) {
    return <Shirt size={size} style={{ color }} />;
  }
  if (iconKey.includes('bag') || iconKey.includes('shop') || iconKey.includes('purse') || iconKey.includes('👜') || iconKey.includes('🛍') || iconKey.includes('👛')) {
    return <ShoppingBag size={size} style={{ color }} />;
  }
  if (iconKey.includes('sparkle') || iconKey.includes('new') || iconKey.includes('dress') || iconKey.includes('skirt') || iconKey.includes('🌟') || iconKey.includes('⭐') || iconKey.includes('👗')) {
    return <Sparkles size={size} style={{ color: '#f59e0b' }} />;
  }
  if (iconKey.includes('flame') || iconKey.includes('sale') || iconKey.includes('hot') || iconKey.includes('deal') || iconKey.includes('🔥')) {
    return <Flame size={size} style={{ color: '#ef4444' }} />;
  }
  if (iconKey.includes('shoe') || iconKey.includes('foot') || iconKey.includes('run') || iconKey.includes('sneaker') || iconKey.includes('heel') || iconKey.includes('👟') || iconKey.includes('👠')) {
    return <Footprints size={size} style={{ color }} />;
  }
  if (iconKey.includes('scissor') || iconKey.includes('jean') || iconKey.includes('pant') || iconKey.includes('short') || iconKey.includes('denim') || iconKey.includes('👖') || iconKey.includes('🩳')) {
    return <Scissors size={size} style={{ color }} />;
  }
  if (iconKey.includes('layer') || iconKey.includes('jacket') || iconKey.includes('outer') || iconKey.includes('coat') || iconKey.includes('🧥')) {
    return <Layers size={size} style={{ color }} />;
  }
  if (iconKey.includes('pack') || iconKey.includes('box') || iconKey.includes('backpack') || iconKey.includes('🎒')) {
    return <Package size={size} style={{ color }} />;
  }
  if (iconKey.includes('watch') || iconKey.includes('jewel') || iconKey.includes('time') || iconKey.includes('⌚')) {
    return <Watch size={size} style={{ color }} />;
  }
  if (iconKey.includes('kid') || iconKey.includes('youth') || iconKey.includes('child') || iconKey.includes('🧒')) {
    return <Tag size={size} style={{ color }} />;
  }
  if (iconKey.includes('tag') || iconKey.includes('brand') || iconKey.includes('🏷')) {
    return <Tag size={size} style={{ color }} />;
  }
  if (iconKey.includes('crown')) {
    return <Crown size={size} style={{ color }} />;
  }
  return <Folder size={size} style={{ color }} />;
}

export default function CategoriesPage() {
  const outletCtx = useOutletContext();
  const refreshCounts = outletCtx?.refreshCounts;

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Filters & Search ("filter research pg")
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState('all'); // 'all' | 'men' | 'women' | 'kids'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'inactive'

  // Sorting State for table headers
  const [sortField, setSortField] = useState('nameEn'); // 'nameEn' | 'id' | 'department' | 'count' | 'status'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'

  // Modal State (Add / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [activeTab, setActiveTab] = useState('categories'); // 'categories' | 'brands'
  const [brands, setBrands] = useState([]);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [brandForm, setBrandForm] = useState({
    id: '',
    name: '',
    nameKm: '',
    desc: '',
    active: true,
  });
  const [categoryForm, setCategoryForm] = useState({
    id: '',
    nameEn: '',
    nameKm: '',
    gender: 'men',
    icon: 'Shirt',
    active: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [toastMessage, setToastMessage] = useState('');

  // Load and calculate category product counts
  const loadCategories = () => {
    const cats = adminStore.getCategories();
    const prods = adminStore.getProducts();
    const brs = adminStore.getBrands();
    setProducts(prods);
    setBrands(brs);

    const withCounts = cats.map((c) => {
      let count = 0;
      const catKey = (c.id || '').toUpperCase();

      if (catKey === 'ALL') {
        count = prods.length;
      } else if (catKey === 'NEW_IN') {
        count = prods.filter((p) => p.badge?.toLowerCase().includes('new') || p.isNewArrival).length;
      } else if (catKey === 'SALE') {
        count = prods.filter((p) => (p.compareAtPrice && p.compareAtPrice > p.price) || p.badge?.toLowerCase().includes('sale')).length;
      } else {
        count = prods.filter((p) => {
          const matchGender = c.gender === 'all' || p.gender === c.gender;
          const pCat = (p.category || '').toUpperCase();
          const pSub = (p.subCategory || '').toUpperCase();
          const pName = (p.nameEn || p.name || '').toUpperCase();

          const matchCat =
            pCat === catKey ||
            pSub === catKey ||
            pSub.includes(catKey) ||
            catKey.includes(pSub) ||
            (catKey === 'T-SHIRTS' && (pSub.includes('T-SHIRT') || pName.includes('T-SHIRT') || pName.includes('TEE'))) ||
            (catKey === 'POLO' && (pSub.includes('POLO') || pName.includes('POLO'))) ||
            (catKey === 'SHIRTS' && (pSub.includes('SHIRT') || pName.includes('SHIRT'))) ||
            (catKey === 'TANKS' && (pSub.includes('TANK') || pName.includes('TANK'))) ||
            (catKey === 'JACKETS' && (pSub.includes('JACKET') || pName.includes('JACKET') || pName.includes('HOODIE'))) ||
            (catKey === 'CLOTHES' && (pCat === 'CLOTHES' || pSub.includes('CLOTH'))) ||
            (catKey === 'JEANS' && (pSub.includes('JEAN') || pName.includes('JEAN') || pName.includes('PANT'))) ||
            (catKey === 'PANTS' && (pSub.includes('PANT') || pName.includes('PANT') || pSub.includes('JEAN'))) ||
            (catKey === 'SHORTS' && (pSub.includes('SHORT') || pName.includes('SHORT'))) ||
            (catKey === 'SHOES' && (pCat === 'SHOES' || pSub.includes('SHOE') || pName.includes('SHOE') || pName.includes('SNEAKER'))) ||
            (catKey === 'RUNNING' && (pCat === 'SHOES' || pName.includes('RUN') || pName.includes('SNEAKER'))) ||
            (catKey === 'BAGS' && (pCat === 'BAGS' || pSub.includes('BAG') || pName.includes('BAG'))) ||
            (catKey === 'BACKPACKS' && (pSub.includes('PACK') || pName.includes('PACK') || pName.includes('BAG'))) ||
            (catKey === 'WATCHES' && (pCat === 'WATCHES' || pName.includes('WATCH'))) ||
            (catKey === 'DRESSES' && (pSub.includes('DRESS') || pName.includes('DRESS'))) ||
            (catKey === 'SKIRTS' && (pSub.includes('SKIRT') || pName.includes('SKIRT'))) ||
            (catKey === 'TOPS_WOMEN' && (p.gender === 'women' && (pCat === 'CLOTHES' || pName.includes('TOP') || pName.includes('BLOUSE')))) ||
            (catKey === 'JEANS_WOMEN' && (p.gender === 'women' && (pSub.includes('JEAN') || pName.includes('JEAN') || pName.includes('PANT')))) ||
            (catKey === 'SHOES_WOMEN' && (p.gender === 'women' && (pCat === 'SHOES' || pName.includes('SHOE') || pName.includes('HEEL')))) ||
            (catKey === 'BAGS_WOMEN' && (p.gender === 'women' && (pCat === 'BAGS' || pName.includes('BAG')))) ||
            (catKey === 'KIDS' && (p.gender === 'kids' || pName.includes('KID')));

          return matchGender && matchCat;
        }).length;
      }

      return {
        ...c,
        count,
        icon: c.icon || getFallbackIconName(c.id, c.gender),
        active: c.active !== undefined ? c.active : true,
      };
    });

    setCategories(withCounts);
  };

  const getFallbackIconName = (id, gender) => {
    const key = (id || '').toUpperCase();
    if (key.includes('SHOE')) return 'Footprints';
    if (key.includes('JEAN') || key.includes('PANT') || key.includes('SHORT')) return 'Scissors';
    if (key.includes('BAG')) return 'ShoppingBag';
    if (key.includes('DRESS') || key.includes('NEW')) return 'Sparkles';
    if (key.includes('SALE')) return 'Flame';
    if (key.includes('JACKET')) return 'Layers';
    if (key.includes('WATCH')) return 'Watch';
    if (key.includes('PACK')) return 'Package';
    return gender === 'women' ? 'Sparkles' : 'Shirt';
  };

  useEffect(() => {
    loadCategories();

    // Real-time synchronization across ports/tabs
    const handleSync = () => loadCategories();
    window.addEventListener('zando_store_sync', handleSync);
    return () => window.removeEventListener('zando_store_sync', handleSync);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingCategory(null);
    setCategoryForm({
      id: '',
      nameEn: '',
      nameKm: '',
      gender: selectedGender === 'all' ? 'men' : selectedGender,
      icon: 'Shirt',
      active: true,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setCategoryForm({
      id: cat.id,
      nameEn: cat.nameEn || '',
      nameKm: cat.nameKm || '',
      gender: cat.gender || 'men',
      icon: cat.icon || 'Shirt',
      active: cat.active !== undefined ? cat.active : true,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Auto-generate key from English title
  const handleGenerateKey = () => {
    if (!categoryForm.nameEn) return;
    const generated = categoryForm.nameEn
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '_')
      .replace(/(^_|_$)/g, '');
    setCategoryForm((prev) => ({ ...prev, id: generated }));
  };

  // Save Category (Create or Edit)
  const handleSaveCategory = (e) => {
    e.preventDefault();
    const errors = {};
    if (!categoryForm.nameEn.trim()) errors.nameEn = 'English name is required';

    const categoryId = categoryForm.id.trim()
      ? categoryForm.id.trim().toUpperCase().replace(/\s+/g, '_')
      : categoryForm.nameEn.trim().toUpperCase().replace(/[^A-Z0-9]+/g, '_');

    if (!categoryId) errors.id = 'Category key is required';

    // Check duplicate ID on new category
    if (!editingCategory && categories.some((c) => c.id.toUpperCase() === categoryId)) {
      errors.id = `Key "${categoryId}" already exists. Please choose a unique key.`;
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload = {
      id: categoryId,
      nameEn: categoryForm.nameEn.trim(),
      nameKm: categoryForm.nameKm.trim() || categoryForm.nameEn.trim(),
      gender: categoryForm.gender,
      icon: categoryForm.icon || 'Shirt',
      active: categoryForm.active,
    };

    if (editingCategory) {
      adminStore.updateCategory(editingCategory.id, payload);
      showToast(`✓ Updated category "${payload.nameEn}" successfully!`);
    } else {
      adminStore.addCategory(payload);
      showToast(`✓ Created new category "${payload.nameEn}" successfully!`);
    }

    setIsModalOpen(false);
    setEditingCategory(null);
    loadCategories();
    refreshCounts?.();
  };

  // Reset to default 24 official ZANDO categories
  const handleResetCategories = () => {
    if (window.confirm('តើអ្នកពិតជាចង់កំណត់ឡើងវិញនូវប្រភេទទាំង ២៤ មែនទេ? (Reset all categories to official 24 catalog items)')) {
      const resetCats = adminStore.resetCategoriesToDefault();
      setCategories(resetCats);
      setToastMessage('បានធ្វើសមកាលកម្មប្រភេទផ្លូវការទាំង ២៤ ដោយជោគជ័យ');
      setTimeout(() => setToastMessage(''), 3000);
      if (refreshCounts) refreshCounts();
    }
  };

  // Brand Management Handlers
  const handleOpenCreateBrand = () => {
    setEditingBrand(null);
    setBrandForm({
      id: '',
      name: '',
      nameKm: '',
      desc: '',
      active: true,
    });
    setIsBrandModalOpen(true);
  };

  const handleOpenEditBrand = (brand) => {
    setEditingBrand(brand);
    setBrandForm({
      id: brand.id,
      name: brand.name || brand.id,
      nameKm: brand.nameKm || '',
      desc: brand.desc || '',
      active: brand.active !== undefined ? brand.active : true,
    });
    setIsBrandModalOpen(true);
  };

  const handleSaveBrand = (e) => {
    e.preventDefault();
    if (!brandForm.name || !brandForm.name.trim()) {
      alert('សូមបញ្ចូលឈ្មោះម៉ាកសញ្ញា / Brand name is required');
      return;
    }
    if (editingBrand) {
      adminStore.updateBrand(editingBrand.id, brandForm);
      setToastMessage(`បានកែប្រែម៉ាក "${brandForm.name}" ដោយជោគជ័យ`);
    } else {
      adminStore.addBrand(brandForm);
      setToastMessage(`បានបង្កើតម៉ាកថ្មី "${brandForm.name}" ដោយជោគជ័យ`);
    }
    setIsBrandModalOpen(false);
    setTimeout(() => setToastMessage(''), 3000);
    loadCategories();
  };

  const handleDeleteBrand = (id, name) => {
    if (window.confirm(`តើអ្នកពិតជាចង់លុបម៉ាក "${name}" មែនទេ? / Delete brand "${name}"?`)) {
      adminStore.deleteBrand(id);
      setToastMessage(`បានលុបម៉ាក "${name}" រួចរាល់`);
      setTimeout(() => setToastMessage(''), 3000);
      loadCategories();
    }
  };

  const getBrandProductCount = (brand) => {
    const bName = (brand.name || brand.id || '').toUpperCase();
    return products.filter((p) => (p.brand || '').toUpperCase() === bName).length;
  };

  // Toggle category active status
  const handleToggleActive = (cat) => {
    const updatedStatus = !cat.active;
    adminStore.updateCategory(cat.id, { active: updatedStatus });
    showToast(`Category "${cat.nameEn}" is now ${updatedStatus ? 'Active' : 'Inactive'}`);
    loadCategories();
    refreshCounts?.();
  };

  // Delete category
  const handleDeleteCategory = (id, name) => {
    if (id === 'ALL') {
      alert('The root "ALL" category collection cannot be deleted.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      adminStore.deleteCategory(id);
      showToast(`Category "${name}" deleted.`);
      loadCategories();
      refreshCounts?.();
    }
  };

  // Sort handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Custom departments created beyond standard all/men/women/kids
  const customDepartments = Array.from(
    new Set(
      categories
        .map((c) => (c.gender || '').toLowerCase().trim())
        .filter((g) => g && !['all', 'men', 'women', 'kids'].includes(g))
    )
  );

  const getDepartmentBadgeClass = (gender) => {
    const g = (gender || '').toLowerCase();
    if (g === 'men') return 'badge-zinc';
    if (g === 'women') return 'badge-indigo';
    if (g === 'kids') return 'badge-amber';
    if (g === 'accessories') return 'badge-purple';
    if (g === 'sports') return 'badge-cyan';
    return 'badge-emerald';
  };

  // Filter & Search Logic
  const filteredCategories = categories.filter((c) => {
    // Search query matches key, English name, or Khmer name
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      (c.id && c.id.toLowerCase().includes(q)) ||
      (c.nameEn && c.nameEn.toLowerCase().includes(q)) ||
      (c.nameKm && c.nameKm.toLowerCase().includes(q));

    // Gender / Department filter
    let matchesGender = true;
    if (selectedGender !== 'all') {
      matchesGender =
        (c.gender || '').toLowerCase() === selectedGender.toLowerCase() ||
        c.gender === 'all';
    }

    // Status filter
    let matchesStatus = true;
    if (statusFilter === 'active') matchesStatus = c.active === true;
    if (statusFilter === 'inactive') matchesStatus = c.active === false;

    return matchesQuery && matchesGender && matchesStatus;
  });

  // Sorted Categories for view
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (a.id === 'ALL') return -1;
    if (b.id === 'ALL') return 1;

    let result = 0;
    if (sortField === 'nameEn') {
      const nameA = (a.nameKm || a.nameEn || '').toLowerCase();
      const nameB = (b.nameKm || b.nameEn || '').toLowerCase();
      result = nameA.localeCompare(nameB);
    } else if (sortField === 'id') {
      result = (a.id || '').localeCompare(b.id || '');
    } else if (sortField === 'department') {
      result = (a.gender || '').localeCompare(b.gender || '');
    } else if (sortField === 'count') {
      result = (a.count || 0) - (b.count || 0);
    } else if (sortField === 'status') {
      result = (a.active === b.active ? 0 : a.active ? -1 : 1);
    }
    return sortOrder === 'asc' ? result : -result;
  });

  return (
    <div className="page-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '24px',
            zIndex: 9999,
            background: 'var(--accent-emerald)',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-dropdown)',
            fontWeight: 600,
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Tab Switcher: Categories vs Brands */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-md)',
            background: activeTab === 'categories' ? 'var(--accent-emerald)' : 'transparent',
            color: activeTab === 'categories' ? '#fff' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '13.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Layers size={16} />
          <span>Categories (ប្រភេទទំនិញ {categories.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('brands')}
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-md)',
            background: activeTab === 'brands' ? 'var(--accent-emerald)' : 'transparent',
            color: activeTab === 'brands' ? '#fff' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '13.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Crown size={16} />
          <span>Brands (ម៉ាកយីហោ {brands.length})</span>
        </button>
      </div>

      {activeTab === 'categories' ? (
        <>
          {/* Page Title Row */}
          <div className="page-title-row">
            <div className="page-title-info">
              <h2>Categories & Department Collections</h2>
              <p>Organize, research, and manage product catalog collections synced with Storefront</p>
            </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={handleResetCategories}
            className="btn-secondary"
            title="Reset/Sync to all 24 official ZANDO collections"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RotateCcw size={15} />
            <span>Sync 24 Collections</span>
          </button>

          <button onClick={handleOpenCreate} className="btn-primary">
            <Plus size={16} />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Top Bento Stats Overview */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div className="bento-card">
          <div className="bento-header">
            <span className="bento-title">Total Categories</span>
            <Layers size={16} className="bento-icon" style={{ color: 'var(--accent-emerald)' }} />
          </div>
          <div className="bento-value font-mono">{categories.length}</div>
          <div className="bento-desc">Active store catalog departments</div>
        </div>

        <div className="bento-card">
          <div className="bento-header">
            <span className="bento-title">Men Collections</span>
            <Shirt size={16} className="bento-icon" style={{ color: 'var(--accent-sky)' }} />
          </div>
          <div className="bento-value font-mono">
            {categories.filter((c) => c.gender === 'men' || c.gender === 'all').length}
          </div>
          <div className="bento-desc">Men's fashion apparel & shoes</div>
        </div>

        <div className="bento-card">
          <div className="bento-header">
            <span className="bento-title">Women Collections</span>
            <Sparkles size={16} className="bento-icon" style={{ color: '#a855f7' }} />
          </div>
          <div className="bento-value font-mono">
            {categories.filter((c) => c.gender === 'women' || c.gender === 'all').length}
          </div>
          <div className="bento-desc">Dresses, tops, skirts & footwear</div>
        </div>

        <div className="bento-card">
          <div className="bento-header">
            <span className="bento-title">Products Mapped</span>
            <Tag size={16} className="bento-icon" style={{ color: 'var(--accent-sky)' }} />
          </div>
          <div className="bento-value font-mono">{products.length}</div>
          <div className="bento-desc">Total products categorized</div>
        </div>
      </div>

      {/* Research & Filter Toolbar ("filter research pg") */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {/* Top Row: Search Box & View Toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          {/* Research & Search Bar */}
          <div style={{ position: 'relative', flex: 1, minWidth: '260px', maxWidth: '420px' }}>
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
              placeholder="Search category name, key, slug (ស្វែងរក)..."
              className="form-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '38px' }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Department Filter Pills */}
          <div className="pill-filter-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {[
              { id: 'all', label: `All (${categories.length})` },
              { id: 'men', label: `Men (${categories.filter((c) => (c.gender || '').toLowerCase() === 'men' || c.gender === 'all').length})` },
              { id: 'women', label: `Women (${categories.filter((c) => (c.gender || '').toLowerCase() === 'women' || c.gender === 'all').length})` },
              { id: 'kids', label: `Kids (${categories.filter((c) => (c.gender || '').toLowerCase() === 'kids' || c.gender === 'all').length})` },
              ...customDepartments.map((dept) => ({
                id: dept,
                label: `${dept.charAt(0).toUpperCase() + dept.slice(1)} (${categories.filter((c) => (c.gender || '').toLowerCase() === dept || c.gender === 'all').length})`,
              })),
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedGender(tab.id)}
                className={`pill-btn ${selectedGender === tab.id ? 'active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* View Mode Toggle: Grid vs Table */}
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
            <button
              onClick={() => setViewMode('grid')}
              className={`btn-icon ${viewMode === 'grid' ? 'active' : ''}`}
              style={{
                background: viewMode === 'grid' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                color: viewMode === 'grid' ? '#fff' : 'var(--text-muted)',
              }}
              title="Card Grid View"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>

        {/* Bottom Filter Row: Status & Results Count */}
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
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Status Filter:</span>
            {[
              { id: 'all', label: 'All Status' },
              { id: 'active', label: 'Active Only' },
              { id: 'inactive', label: 'Inactive' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                style={{
                  background: statusFilter === st.id ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                  border: '1px solid',
                  borderColor: statusFilter === st.id ? 'var(--border-medium)' : 'transparent',
                  borderRadius: 'var(--radius-sm)',
                  padding: '3px 10px',
                  fontSize: '12px',
                  color: statusFilter === st.id ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                {st.label}
              </button>
            ))}
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Showing <strong style={{ color: '#fff' }}>{sortedCategories.length}</strong> of{' '}
            {categories.length} categories
          </div>
        </div>
      </div>

      {/* Main Categories Display: Table or Grid */}
      {viewMode === 'table' ? (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th
                  onClick={() => handleSort('nameEn')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                  title="Sort by Category Name"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: sortField === 'nameEn' ? 'var(--accent-emerald)' : undefined }}>
                      Category Icon & Name
                    </span>
                    {sortField === 'nameEn' ? (
                      sortOrder === 'asc' ? <ArrowUp size={13} style={{ color: 'var(--accent-emerald)' }} /> : <ArrowDown size={13} style={{ color: 'var(--accent-emerald)' }} />
                    ) : (
                      <ArrowUpDown size={12} style={{ opacity: 0.35 }} />
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('id')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                  title="Sort by Key / Slug"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: sortField === 'id' ? 'var(--accent-emerald)' : undefined }}>
                      Category Key / Slug
                    </span>
                    {sortField === 'id' ? (
                      sortOrder === 'asc' ? <ArrowUp size={13} style={{ color: 'var(--accent-emerald)' }} /> : <ArrowDown size={13} style={{ color: 'var(--accent-emerald)' }} />
                    ) : (
                      <ArrowUpDown size={12} style={{ opacity: 0.35 }} />
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('department')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                  title="Sort by Department"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: sortField === 'department' ? 'var(--accent-emerald)' : undefined }}>
                      Department
                    </span>
                    {sortField === 'department' ? (
                      sortOrder === 'asc' ? <ArrowUp size={13} style={{ color: 'var(--accent-emerald)' }} /> : <ArrowDown size={13} style={{ color: 'var(--accent-emerald)' }} />
                    ) : (
                      <ArrowUpDown size={12} style={{ opacity: 0.35 }} />
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('count')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                  title="Sort by Products Count"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: sortField === 'count' ? 'var(--accent-emerald)' : undefined }}>
                      Products Count
                    </span>
                    {sortField === 'count' ? (
                      sortOrder === 'asc' ? <ArrowUp size={13} style={{ color: 'var(--accent-emerald)' }} /> : <ArrowDown size={13} style={{ color: 'var(--accent-emerald)' }} />
                    ) : (
                      <ArrowUpDown size={12} style={{ opacity: 0.35 }} />
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                  title="Sort by Status"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: sortField === 'status' ? 'var(--accent-emerald)' : undefined }}>
                      Status
                    </span>
                    {sortField === 'status' ? (
                      sortOrder === 'asc' ? <ArrowUp size={13} style={{ color: 'var(--accent-emerald)' }} /> : <ArrowDown size={13} style={{ color: 'var(--accent-emerald)' }} />
                    ) : (
                      <ArrowUpDown size={12} style={{ opacity: 0.35 }} />
                    )}
                  </div>
                </th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedCategories.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No categories found matching "{searchQuery}". Try adding a new category.
                  </td>
                </tr>
              ) : (
                sortedCategories.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: 'var(--radius-md)',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--border-subtle)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                            flexShrink: 0,
                          }}
                        >
                          <CategoryIcon icon={c.icon || c.id} size={18} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#fff', fontSize: '13.5px' }}>
                            {c.nameKm || c.nameEn}
                          </div>
                          {c.nameEn && c.nameEn !== c.nameKm && (
                            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{c.nameEn}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className="font-mono"
                        style={{
                          fontSize: '11.5px',
                          color: 'var(--accent-emerald)',
                          background: 'rgba(16, 185, 129, 0.08)',
                          padding: '3px 7px',
                          borderRadius: '4px',
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                        }}
                      >
                        {c.id}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge-delphi ${getDepartmentBadgeClass(c.gender)}`}
                        style={{ textTransform: 'uppercase', fontSize: '10px' }}
                      >
                        {c.gender}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: c.count > 0 ? '#fff' : 'var(--text-muted)',
                        }}
                      >
                        {c.count} items
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(c)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                        }}
                        title="Click to toggle Active / Inactive"
                      >
                        {c.active ? (
                          <span className="badge-delphi badge-emerald">
                            <CheckCircle2 size={11} /> Active
                          </span>
                        ) : (
                          <span className="badge-delphi badge-zinc" style={{ opacity: 0.7 }}>
                            Inactive
                          </span>
                        )}
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="btn-icon"
                          title="Edit Category"
                        >
                          <Pencil size={13} />
                        </button>
                        {c.id !== 'ALL' && (
                          <button
                            onClick={() => handleDeleteCategory(c.id, c.nameEn)}
                            className="btn-icon"
                            style={{ color: 'var(--accent-rose)' }}
                            title="Delete Category"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Card Grid View */
        sortedCategories.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '48px',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
            }}
          >
            No categories found matching "{searchQuery}". Try adding a new category.
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '16px',
            }}
          >
            {sortedCategories.map((c) => (
            <div
              key={c.id}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px',
                    }}
                  >
                    <CategoryIcon icon={c.icon || c.id} size={20} />
                  </div>
                  <span
                    className={`badge-delphi ${getDepartmentBadgeClass(c.gender)}`}
                    style={{ textTransform: 'uppercase', fontSize: '10px' }}
                  >
                    {c.gender}
                  </span>
                </div>

                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>
                  {c.nameKm || c.nameEn}
                </h4>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  {c.nameEn}
                </div>
                <div
                  className="font-mono"
                  style={{
                    fontSize: '11px',
                    color: 'var(--accent-emerald)',
                    background: 'rgba(16, 185, 129, 0.06)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    display: 'inline-block',
                    marginBottom: '12px',
                  }}
                >
                  {c.id}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                  }}
                >
                  {c.count} items
                </span>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="btn-icon"
                    title="Edit Category"
                  >
                    <Pencil size={13} />
                  </button>
                  {c.id !== 'ALL' && (
                    <button
                      onClick={() => handleDeleteCategory(c.id, c.nameEn)}
                      className="btn-icon"
                      style={{ color: 'var(--accent-rose)' }}
                      title="Delete Category"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    )}
        </>
      ) : (
        /* Brands View Tab */
        <div>
          {/* Page Title Row for Brands */}
          <div className="page-title-row">
            <div className="page-title-info">
              <h2>Brands & Fashion Labels (គ្រប់គ្រងម៉ាកយីហោ)</h2>
              <p>Manage official store brands, youth streetwear labels, and custom manufacturer brands</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button onClick={handleOpenCreateBrand} className="btn-primary">
                <Plus size={16} />
                <span>Add Brand (បង្កើតម៉ាកថ្មី)</span>
              </button>
            </div>
          </div>

          {/* Top Bento Stats Overview for Brands */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <div className="bento-card">
              <div className="bento-header">
                <span className="bento-title">Total Brands</span>
                <Crown size={16} className="bento-icon" style={{ color: 'var(--accent-emerald)' }} />
              </div>
              <div className="bento-value font-mono">{brands.length}</div>
              <div className="bento-desc">Registered apparel & footwear brands</div>
            </div>

            <div className="bento-card">
              <div className="bento-header">
                <span className="bento-title">Active Brands</span>
                <CheckCircle2 size={16} className="bento-icon" style={{ color: 'var(--accent-emerald)' }} />
              </div>
              <div className="bento-value font-mono">
                {brands.filter((b) => b.active !== false).length}
              </div>
              <div className="bento-desc">Currently active in catalog & POS</div>
            </div>

            <div className="bento-card">
              <div className="bento-header">
                <span className="bento-title">Products Tagged</span>
                <Shirt size={16} className="bento-icon" style={{ color: 'var(--accent-sky)' }} />
              </div>
              <div className="bento-value font-mono">
                {products.filter((p) => p.brand).length}
              </div>
              <div className="bento-desc">Items assigned to registered brands</div>
            </div>
          </div>

          {/* Search bar for Brands */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
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
                placeholder="ស្វែងរកម៉ាកសញ្ញា (Search brand name, tagline...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '38px', height: '38px' }}
              />
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Showing {brands.filter((b) => !searchQuery || b.name.toLowerCase().includes(searchQuery.toLowerCase()) || (b.nameKm && b.nameKm.toLowerCase().includes(searchQuery.toLowerCase()))).length} of {brands.length} brands
            </div>
          </div>

          {/* Brands Table */}
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Brand Name</th>
                  <th>Khmer Label</th>
                  <th>Description / Style</th>
                  <th style={{ textAlign: 'center' }}>Products Count</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {brands
                  .filter((b) => {
                    const q = searchQuery.toLowerCase();
                    return !q || (b.name && b.name.toLowerCase().includes(q)) || (b.nameKm && b.nameKm.toLowerCase().includes(q)) || (b.desc && b.desc.toLowerCase().includes(q));
                  })
                  .map((b) => {
                    const count = getBrandProductCount(b);
                    return (
                      <tr key={b.id || b.name}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                              style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: 'var(--radius-sm)',
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid var(--border-subtle)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '12px',
                                color: 'var(--accent-emerald)',
                              }}
                            >
                              <Crown size={16} />
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: '#fff' }}>{b.name}</div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {b.id}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-main)', fontWeight: 500 }}>
                          {b.nameKm || '-'}
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '12.5px' }}>
                          {b.desc || 'Brand Collection'}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span className="badge-delphi badge-zinc font-mono" style={{ fontSize: '12px', fontWeight: 600 }}>
                            {count} products
                          </span>
                        </td>
                        <td>
                          <span className={`badge-delphi ${b.active !== false ? 'badge-emerald' : 'badge-zinc'}`}>
                            {b.active !== false ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              onClick={() => handleOpenEditBrand(b)}
                              className="btn-icon"
                              title="Edit Brand"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteBrand(b.id, b.name)}
                              className="btn-icon"
                              style={{ color: 'var(--accent-rose)' }}
                              title="Delete Brand"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-dialog"
            style={{ maxWidth: '520px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} style={{ color: 'var(--accent-emerald)' }} />
                <h3 className="modal-title">
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveCategory} className="modal-body">
              {/* Category Key / Slug */}
              <div className="form-group">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '6px',
                  }}
                >
                  <label className="form-label" style={{ margin: 0 }}>
                    Category Key / ID (Slug)
                  </label>
                  {!editingCategory && (
                    <button
                      type="button"
                      onClick={handleGenerateKey}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent-emerald)',
                        fontSize: '11px',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Auto Generate
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  className="form-input font-mono"
                  placeholder="e.g. SPORT_WEAR or JACKETS"
                  value={categoryForm.id}
                  disabled={!!editingCategory} // lock ID on edit
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, id: e.target.value.toUpperCase().replace(/\s+/g, '_') })
                  }
                />
                {formErrors.id && (
                  <div style={{ color: 'var(--accent-rose)', fontSize: '11.5px', marginTop: '4px' }}>
                    {formErrors.id}
                  </div>
                )}
              </div>

              {/* Row: Khmer Name & English Name */}
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">ឈ្មោះជាភាសាខ្មែរ (Khmer Label)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="ឧ. សម្លៀកបំពាក់កីឡា..."
                    value={categoryForm.nameKm}
                    onChange={(e) => setCategoryForm({ ...categoryForm, nameKm: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">English Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Sportswear & Gym"
                    value={categoryForm.nameEn}
                    onChange={(e) => {
                      setCategoryForm({ ...categoryForm, nameEn: e.target.value });
                      if (!categoryForm.id && !editingCategory) {
                        setCategoryForm((prev) => ({
                          ...prev,
                          nameEn: e.target.value,
                          id: e.target.value.toUpperCase().replace(/[^A-Z0-9]+/g, '_'),
                        }));
                      }
                    }}
                    required
                  />
                  {formErrors.nameEn && (
                    <div style={{ color: 'var(--accent-rose)', fontSize: '11.5px', marginTop: '4px' }}>
                      {formErrors.nameEn}
                    </div>
                  )}
                </div>
              </div>

              {/* Department / Gender: Select or Write (Combobox) */}
              <div className="form-group">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '6px',
                  }}
                >
                  <label className="form-label" style={{ margin: 0 }}>
                    Department (ផ្នែកទំនិញ / Brand) *
                  </label>
                  <span style={{ fontSize: '11px', color: 'var(--accent-emerald)', fontWeight: 500 }}>
                    Select ឬ វាយបញ្ចូលផ្ទាល់ (Write Custom)
                  </span>
                </div>

                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    list="department-datalist-options"
                    className="form-input"
                    placeholder="ជ្រើសរើស ឬ វាយបញ្ចូល (e.g. Men, Women, Kids, Accessories, Sports, Brand...)"
                    value={categoryForm.gender}
                    onChange={(e) => setCategoryForm({ ...categoryForm, gender: e.target.value })}
                    style={{
                      fontFamily: 'inherit',
                      fontSize: '13px',
                    }}
                  />
                  <datalist id="department-datalist-options">
                    <option value="men">Men (បុរស)</option>
                    <option value="women">Women (នារី)</option>
                    <option value="kids">Kids (កុមារ)</option>
                    <option value="all">All / Unisex (ទូទៅ/រួម)</option>
                    <option value="accessories">Accessories & Jewelry (គ្រឿងតុបតែង)</option>
                    <option value="sports">Sports & Athletics (កីឡា)</option>
                    <option value="shoes">Shoes & Footwear (ស្បែកជើង)</option>
                    <option value="bags">Bags & Backpacks (កាបូប)</option>
                    <option value="beauty">Beauty & Fragrance (គ្រឿងសម្អាង)</option>
                    <option value="TEN-ELEVEN">TEN-ELEVEN</option>
                    <option value="GWYN">GWYN</option>
                    <option value="GATONI">GATONI</option>
                    <option value="361°">361°</option>
                    {customDepartments.map((dept) => (
                      <option key={dept} value={dept} />
                    ))}
                  </datalist>
                </div>

                {/* Quick Selection Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                  {[
                    { id: 'men', label: 'Men (បុរស)' },
                    { id: 'women', label: 'Women (នារី)' },
                    { id: 'kids', label: 'Kids (កុមារ)' },
                    { id: 'all', label: 'Unisex (រួម)' },
                    { id: 'accessories', label: 'Accessories' },
                    { id: 'sports', label: 'Sports' },
                    { id: 'shoes', label: 'Shoes' },
                    { id: 'bags', label: 'Bags' },
                    { id: 'brand', label: 'Brand' },
                  ].map((preset) => {
                    const isSelected = (categoryForm.gender || '').toLowerCase() === preset.id.toLowerCase();
                    return (
                      <button
                        type="button"
                        key={preset.id}
                        onClick={() => setCategoryForm({ ...categoryForm, gender: preset.id })}
                        style={{
                          background: isSelected ? 'var(--accent-emerald)' : 'rgba(255, 255, 255, 0.05)',
                          color: isSelected ? '#fff' : 'var(--text-secondary)',
                          border: '1px solid',
                          borderColor: isSelected ? 'var(--accent-emerald)' : 'var(--border-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '4px 10px',
                          fontSize: '11px',
                          fontWeight: isSelected ? 600 : 400,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category Vector Icon Picker */}
              <div className="form-group">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '6px',
                  }}
                >
                  <label className="form-label" style={{ margin: 0 }}>
                    Category Vector Icon (រូបតំណាង Icon)
                  </label>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    ជ្រើសរើស Icon
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(115px, 1fr))',
                    gap: '8px',
                    marginBottom: '8px',
                  }}
                >
                  {AVAILABLE_ICONS.map(({ id, label, Icon }) => {
                    const isSelected = (categoryForm.icon || '').toLowerCase() === id.toLowerCase();
                    return (
                      <button
                        type="button"
                        key={id}
                        onClick={() => setCategoryForm({ ...categoryForm, icon: id })}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 10px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid',
                          borderColor: isSelected ? 'var(--accent-emerald)' : 'var(--border-subtle)',
                          background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-input)',
                          color: isSelected ? 'var(--accent-emerald)' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          fontSize: '11.5px',
                          fontWeight: isSelected ? 600 : 400,
                        }}
                      >
                        <Icon size={16} style={{ flexShrink: 0 }} />
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status Toggle */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  background: 'var(--bg-input)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>Active Status</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Display this category across Storefront and POS
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={categoryForm.active}
                  onChange={(e) => setCategoryForm({ ...categoryForm, active: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent-emerald)', cursor: 'pointer' }}
                />
              </div>

              {/* Modal Footer Buttons */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Brand Modal (Create / Edit) */}
      {isBrandModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsBrandModalOpen(false)}>
          <div className="modal-dialog" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Crown size={18} style={{ color: 'var(--accent-emerald)' }} />
                <h3 className="modal-title">{editingBrand ? 'Edit Brand (កែប្រែម៉ាក)' : 'Add New Brand (បង្កើតម៉ាកថ្មី)'}</h3>
              </div>
              <button onClick={() => setIsBrandModalOpen(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveBrand} className="modal-body">
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Brand Name (ឈ្មោះម៉ាក) *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. TEN11, NIKE, BBU Style..."
                  value={brandForm.name}
                  onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Khmer Label (ឈ្មោះជាភាសាខ្មែរ)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="ឧ. ថេន អិលឡេវឹន, ណៃឃី..."
                  value={brandForm.nameKm}
                  onChange={(e) => setBrandForm({ ...brandForm, nameKm: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Description / Style Tagline</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Streetwear & Casual Fashion..."
                  value={brandForm.desc}
                  onChange={(e) => setBrandForm({ ...brandForm, desc: e.target.value })}
                />
              </div>

              {/* Status Toggle */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  background: 'var(--bg-input)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>Active Status</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Display this brand in product creation and filters
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={brandForm.active}
                  onChange={(e) => setBrandForm({ ...brandForm, active: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent-emerald)', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setIsBrandModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingBrand ? 'Update Brand' : 'Create Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
