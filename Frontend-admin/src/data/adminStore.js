// Zando POS & Admin Data Layer - LocalStorage + Cross-App Bridge Ready Adapter
import { ZANDO_SEED_PRODUCTS } from './zandoSeed.js';

const STORAGE_KEYS = {
  PRODUCTS: 'zando_admin_products_v1',
  CATEGORIES: 'zando_admin_categories_v1',
  BRANDS: 'zando_admin_brands_v1',
  DATA_MODE: 'zando_admin_data_mode_v1',
  ORDERS: 'zando_admin_orders_v1',
  CUSTOMERS: 'zando_admin_customers_v1',
  SETTINGS: 'zando_admin_settings_v1',
};

export const DEFAULT_BRANDS = [
  { id: 'TEN11', name: 'TEN11', nameKm: 'ថេន អិលឡេវឹន', desc: 'Streetwear & Youth Fashion', active: true },
  { id: 'TEN-ELEVEN', name: 'TEN-ELEVEN', nameKm: 'ថេន អិលឡេវឹន', desc: 'Premium Casual Collection', active: true },
  { id: 'ROUTINE', name: 'ROUTINE', nameKm: 'រូធីន', desc: 'Smart Casual & Minimalist', active: true },
  { id: 'GATONI', name: 'GATONI', nameKm: 'កាតូនី', desc: 'Through The Mist Fashion', active: true },
  { id: '361', name: '361°', nameKm: '៣៦១ ដឺក្រេ', desc: 'One Degree Beyond Athletics', active: true },
  { id: 'BAYSIC', name: 'BAYSIC', nameKm: 'បេស៊ីក', desc: 'Everyday Essentials', active: true },
  { id: 'DEVOTUS', name: 'DEVOTUS', nameKm: 'ដេវ៉ូទើស', desc: 'Urban Graphic Apparel', active: true },
  { id: 'NIKE', name: 'NIKE', nameKm: 'ណៃឃី', desc: 'Sportswear & Performance', active: true },
  { id: 'MIZUNO', name: 'MIZUNO', nameKm: 'មីហ្ស៊ូណូ', desc: 'Japanese Sportswear & Running', active: true },
  { id: 'ADIDAS', name: 'ADIDAS', nameKm: 'អាឌីដាស', desc: 'Originals & Athletic Footwear', active: true },
  { id: 'ZANDO', name: 'ZANDO', nameKm: 'ហ្សង់ដូ', desc: 'Signature Store Collection', active: true },
  { id: 'GWYN', name: 'GWYN', nameKm: 'ហ្គ្វីន', desc: 'Modern Workwear & Suiting', active: true },
  { id: 'PUSH PUSH', name: 'PUSH PUSH', nameKm: 'ភូស ភូស', desc: 'Creative Street Design', active: true },
  { id: 'LASOL', name: 'LASOL', nameKm: 'ឡាសូល', desc: 'Summer & Resort Line', active: true },
];

// Broadcast Channel for live cross-tab communication
const broadcast = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('zando_store_sync') : null;

function notifyChange(type, key, data) {
  if (broadcast) {
    try {
      broadcast.postMessage({ type: 'STORAGE_CHANGE', key, data });
    } catch (_) {}
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('zando_store_sync', { detail: { key, data } }));
  }
}

// Initial Categories aligned with Storefront CATEGORY_CONFIG & full ZANDO Catalog
export const DEFAULT_CATEGORIES = [
  // General Collections (All)
  { id: 'ALL', nameEn: 'All Products', nameKm: 'ទំនិញទាំងអស់', gender: 'all', count: 0, icon: 'ShoppingBag', active: true },
  { id: 'NEW_IN', nameEn: 'New Arrivals', nameKm: 'ទំនិញថ្មីៗ (New In)', gender: 'all', count: 0, icon: 'Sparkles', active: true },
  { id: 'SALE', nameEn: 'Special Deals & Sale', nameKm: 'បញ្ចុះតម្លៃពិសេស (Sale)', gender: 'all', count: 0, icon: 'Flame', active: true },

  // Men's Fashion Collections
  { id: 'T-Shirts', nameEn: 'T-Shirt & Polo', nameKm: 'អាវយឺតដៃខ្លី & Tees', gender: 'men', count: 0, icon: 'Shirt', active: true },
  { id: 'POLO', nameEn: 'Polo Shirts', nameKm: 'អាវប៉ូឡូ (Polo Shirts)', gender: 'men', count: 0, icon: 'Shirt', active: true },
  { id: 'SHIRTS', nameEn: 'Casual & Dress Shirts', nameKm: 'អាវសាច់ក្រណាត់ (Shirts)', gender: 'men', count: 0, icon: 'Shirt', active: true },
  { id: 'TANKS', nameEn: 'Tanks & Sleeveless', nameKm: 'អាវវាលក្លៀក (Tank Tops)', gender: 'men', count: 0, icon: 'Shirt', active: true },
  { id: 'JACKETS', nameEn: 'Jackets & Outerwear', nameKm: 'អាវក្រៅ & អាវរងា (Jackets)', gender: 'all', count: 0, icon: 'Layers', active: true },
  { id: 'CLOTHES', nameEn: 'Clothing & Suits', nameKm: 'សម្លៀកបំពាក់បុរស', gender: 'men', count: 0, icon: 'Shirt', active: true },
  { id: 'Jeans', nameEn: 'Jeans & Denim', nameKm: 'ខោខូវប៊យ Jeans បុរស', gender: 'men', count: 0, icon: 'Scissors', active: true },
  { id: 'PANTS', nameEn: 'Trousers & Chinos', nameKm: 'ខោជើងវែង & ក្រណាត់', gender: 'men', count: 0, icon: 'Scissors', active: true },
  { id: 'SHORTS', nameEn: 'Casual & Denim Shorts', nameKm: 'ខោខ្លីបុរស (Shorts)', gender: 'men', count: 0, icon: 'Scissors', active: true },
  { id: 'SHOES', nameEn: 'Footwear & Sneakers', nameKm: 'ស្បែកជើងប៉ាតា & Sneakers', gender: 'men', count: 0, icon: 'Footprints', active: true },
  { id: 'RUNNING', nameEn: 'Running & Athletic Shoes', nameKm: 'ស្បែកជើងរត់ & កីឡា', gender: 'all', count: 0, icon: 'Footprints', active: true },
  { id: 'BAGS', nameEn: 'Bags & Accessories', nameKm: 'កាបូប & Accessories បុរស', gender: 'men', count: 0, icon: 'ShoppingBag', active: true },
  { id: 'BACKPACKS', nameEn: 'Backpacks & Travel Bags', nameKm: 'កាតាបស្ពាយខ្នង (Backpacks)', gender: 'all', count: 0, icon: 'Package', active: true },
  { id: 'WATCHES', nameEn: 'Watches & Jewelry', nameKm: 'នាឡិកា & គ្រឿងតុបតែង', gender: 'all', count: 0, icon: 'Watch', active: true },

  // Women's Fashion Collections
  { id: 'TOPS_WOMEN', nameEn: 'Tops & Blouses', nameKm: 'អាវយឺត & Blouses នារី', gender: 'women', count: 0, icon: 'Shirt', active: true },
  { id: 'DRESSES', nameEn: 'Dresses & Skirts', nameKm: 'រ៉ូប & Dresses នារី', gender: 'women', count: 0, icon: 'Sparkles', active: true },
  { id: 'SKIRTS', nameEn: 'Midi & Karo Skirts', nameKm: 'សំពត់ & Skirts នារី', gender: 'women', count: 0, icon: 'Sparkles', active: true },
  { id: 'JEANS_WOMEN', nameEn: 'Women Jeans & Bottoms', nameKm: 'ខោ Jeans នារី & Bottoms', gender: 'women', count: 0, icon: 'Scissors', active: true },
  { id: 'SHOES_WOMEN', nameEn: 'Shoes & High Heels', nameKm: 'ស្បែកជើងនារី & កែង', gender: 'women', count: 0, icon: 'Footprints', active: true },
  { id: 'BAGS_WOMEN', nameEn: 'Handbags & Purses', nameKm: 'កាបូបដៃនារី & Purses', gender: 'women', count: 0, icon: 'ShoppingBag', active: true },

  // Kids Collections
  { id: 'KIDS', nameEn: 'Kids & Youth Fashion', nameKm: 'សម្លៀកបំពាក់កុមារ (Kids)', gender: 'kids', count: 0, icon: 'Tag', active: true },
];

// Initial Seed Products from full Zando Catalog (Real Data Mode - Empty)
const DEFAULT_PRODUCTS = [];

// Initial Seed Customers
const DEFAULT_CUSTOMERS = [
  {
    id: 'CUST-8801',
    name: 'Sophea Rath',
    nameKm: 'សុភា រ័ត្ន',
    phone: '012 889 900',
    email: 'sophea.rath@gmail.com',
    address: 'Street 102, Sangkat Svay Por',
    city: 'Battambang',
    tier: 'VIP Gold',
    points: 240,
    totalOrders: 4,
    totalSpent: 189.50,
    joinedDate: '2026-01-15',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'Active'
  },
  {
    id: 'CUST-8802',
    name: 'Sokha Chan',
    nameKm: 'សុខា ចាន់',
    phone: '012 998 877',
    email: 'sokha.chan@gmail.com',
    address: 'Monivong Blvd, Sangkat Boeung Keng Kang 1',
    city: 'Phnom Penh',
    tier: 'Silver Member',
    points: 110,
    totalOrders: 2,
    totalSpent: 56.90,
    joinedDate: '2026-02-01',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'Active'
  },
  {
    id: 'CUST-8803',
    name: 'Borey Kem',
    nameKm: 'បុរី កែម',
    phone: '098 776 554',
    email: 'borey.kem@gmail.com',
    address: 'Pub Street, Krong Siem Reap',
    city: 'Siem Reap',
    tier: 'Gold Member',
    points: 180,
    totalOrders: 3,
    totalSpent: 115.00,
    joinedDate: '2026-02-10',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'Active'
  },
  {
    id: 'CUST-8804',
    name: 'Dany Meas',
    nameKm: 'ដានី មាស',
    phone: '070 334 112',
    email: 'dany.meas@yahoo.com',
    address: 'Street 3, Sangkat Chamkar Samraong',
    city: 'Battambang',
    tier: 'Standard Member',
    points: 45,
    totalOrders: 1,
    totalSpent: 32.50,
    joinedDate: '2026-02-20',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    status: 'Active'
  },
  {
    id: 'CUST-8805',
    name: 'Visal Seng',
    nameKm: 'វិសាល សេង',
    phone: '017 445 667',
    email: 'visal.seng@gmail.com',
    address: 'Russian Blvd, Tuol Kork',
    city: 'Phnom Penh',
    tier: 'Standard Member',
    points: 60,
    totalOrders: 1,
    totalSpent: 49.00,
    joinedDate: '2026-02-28',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    status: 'Active'
  }
];

// Initial POS Orders
const DEFAULT_ORDERS = [
  {
    id: 'ORD-8821',
    customerId: 'CUST-8801',
    customer: 'Sophea Rath',
    phone: '012 889 900',
    itemsCount: 2,
    totalUsd: 56.90,
    totalKhr: 233290,
    paymentMethod: 'Bakong KHQR',
    status: 'Paid',
    source: 'Storefront',
    date: '2026-03-04 15:30',
    items: [
      { name: 'ខោខូវប៊យជើងវែង INSANE®', qty: 1, price: 38.95 },
      { name: 'អាវយឺត JETBURN WASH ROCKET', qty: 1, price: 17.95 }
    ]
  },
  {
    id: 'ORD-8820',
    customerId: 'CUST-8803',
    customer: 'Borey Kem',
    phone: '098 776 554',
    itemsCount: 1,
    totalUsd: 65.00,
    totalKhr: 266500,
    paymentMethod: 'Cash',
    status: 'Completed',
    source: 'Walk-in POS',
    date: '2026-03-04 14:15',
    items: [
      { name: 'ស្បែកជើងកីឡា 361° One Degree', qty: 1, price: 65.00 }
    ]
  },
  {
    id: 'ORD-8819',
    customerId: 'CUST-8804',
    customer: 'Dany Meas',
    phone: '070 334 112',
    itemsCount: 1,
    totalUsd: 32.50,
    totalKhr: 133250,
    paymentMethod: 'Bakong KHQR',
    status: 'Paid',
    source: 'Storefront',
    date: '2026-03-04 11:05',
    items: [
      { name: 'រ៉ូបផ្កាវែង Floral Summer Dress', qty: 1, price: 32.50 }
    ]
  },
  {
    id: 'ORD-8818',
    customerId: 'CUST-8805',
    customer: 'Visal Seng',
    phone: '017 445 667',
    itemsCount: 1,
    totalUsd: 49.00,
    totalKhr: 200900,
    paymentMethod: 'Bakong KHQR',
    status: 'Pending',
    source: 'Storefront',
    date: '2026-03-04 09:40',
    items: [
      { name: 'អាវក្រៅ Through The Mist', qty: 1, price: 49.00 }
    ]
  }
];

const DEFAULT_SETTINGS = {
  shopName: 'ZANDO FASHION STORE',
  branch: 'Battambang Main Store',
  phone: '012 345 678',
  exchangeRate: 4100, // $1 = 4,100 KHR
  bakongAccountId: 'zandostore@aclb',
  currency: 'USD',
  taxRate: 0,
  lowStockAlertLevel: 5
};

// Storage helper functions
export const adminStore = {
  getProducts: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (stored !== null) {
        return JSON.parse(stored);
      }
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.DATA_MODE, 'real');
      return [];
    } catch {
      return [];
    }
  },

  clearMockProducts: () => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.DATA_MODE, 'real');
    notifyChange('CLEAR_PRODUCTS', STORAGE_KEYS.PRODUCTS, []);
    return [];
  },

  restoreDemoCatalog: () => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.DATA_MODE, 'real');
    notifyChange('RESTORE_DEMO', STORAGE_KEYS.PRODUCTS, []);
    return [];
  },

  isRealDataMode: () => {
    return true;
  },

  setRealDataMode: () => {
    try {
      localStorage.setItem(STORAGE_KEYS.DATA_MODE, 'real');
      notifyChange('DATA_MODE_CHANGE', STORAGE_KEYS.DATA_MODE, 'real');
    } catch (_) {}
  },

  // ── Brand Management Methods ───────────────────────────────────────────────
  getBrands: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BRANDS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(DEFAULT_BRANDS));
        return DEFAULT_BRANDS;
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : DEFAULT_BRANDS;
    } catch {
      return DEFAULT_BRANDS;
    }
  },

  saveBrands: (brands) => {
    localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(brands));
    notifyChange('SAVE_BRANDS', STORAGE_KEYS.BRANDS, brands);
  },

  addBrand: (brand) => {
    const brands = adminStore.getBrands();
    const cleanId = (brand.id || brand.name || `BRAND_${Date.now()}`)
      .toString()
      .trim()
      .toUpperCase();
    const existing = brands.find(
      (b) => b.id.toUpperCase() === cleanId || b.name.toLowerCase() === (brand.name || '').toLowerCase()
    );
    if (existing) {
      return existing;
    }
    const newBrand = {
      ...brand,
      id: cleanId,
      name: brand.name || cleanId,
      nameKm: brand.nameKm || brand.name || cleanId,
      desc: brand.desc || 'Brand Collection',
      active: brand.active !== undefined ? brand.active : true,
    };
    const updated = [...brands, newBrand];
    adminStore.saveBrands(updated);
    return newBrand;
  },

  updateBrand: (id, data) => {
    const brands = adminStore.getBrands();
    const updated = brands.map((b) => (b.id === id ? { ...b, ...data } : b));
    adminStore.saveBrands(updated);
    return updated.find((b) => b.id === id);
  },

  deleteBrand: (id) => {
    const brands = adminStore.getBrands();
    const updated = brands.filter((b) => b.id !== id);
    adminStore.saveBrands(updated);
    return true;
  },

  saveProducts: (products) => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    notifyChange('SAVE_PRODUCTS', STORAGE_KEYS.PRODUCTS, products);
  },

  addProduct: (product) => {
    const products = adminStore.getProducts();
    const newId = Date.now();
    const cleanSlug = product.cleanSlug || (
      (product.nameEn || product.name || 'product')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '-' + newId.toString().slice(-4)
    );

    const newProduct = {
      ...product,
      id: newId,
      sku: product.sku || `ZAN-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().split('T')[0],
      active: product.active !== undefined ? product.active : true,
      stock: Number(product.stock) || 0,
      price: Number(product.price) || 0,
      costPrice: Number(product.costPrice) || 0,
      cleanSlug: cleanSlug,
      slug: cleanSlug,
      subCategory: product.subCategory || product.category || 'General',
    };
    const updated = [newProduct, ...products];
    adminStore.saveProducts(updated);
    return newProduct;
  },

  updateProduct: (id, data) => {
    const products = adminStore.getProducts();
    const updated = products.map((p) => {
      if (p.id === id) {
        const cleanSlug = data.cleanSlug || p.cleanSlug || p.slug;
        return { ...p, ...data, cleanSlug, slug: cleanSlug };
      }
      return p;
    });
    adminStore.saveProducts(updated);
    return updated.find((p) => p.id === id);
  },

  deleteProduct: (id) => {
    const products = adminStore.getProducts();
    const updated = products.filter((p) => p.id !== id);
    adminStore.saveProducts(updated);
    return true;
  },

  getCategories: () => {
    try {
      const prods = adminStore.getProducts();
      let list = DEFAULT_CATEGORIES;
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          list = parsed;
        }
      }

      // Auto-merge new defaults if needed
      const existingIds = new Set(list.map((c) => (c.id || '').toUpperCase()));
      for (const defCat of DEFAULT_CATEGORIES) {
        if (!existingIds.has(defCat.id.toUpperCase())) {
          list.push(defCat);
        }
      }

      // Dynamically calculate accurate counts based on current real products
      return list.map((cat) => {
        let cnt = 0;
        if (cat.id === 'ALL') {
          cnt = prods.length;
        } else if (cat.id === 'NEW_IN') {
          cnt = prods.filter(p => (p.badge && p.badge.toUpperCase().includes('NEW')) || p.isNewArrival).length;
        } else if (cat.id === 'SALE') {
          cnt = prods.filter(p => (p.discountPercent && p.discountPercent > 0) || (p.badge && p.badge.includes('%'))).length;
        } else {
          cnt = prods.filter(p => (p.category || '').toUpperCase() === cat.id.toUpperCase() || (p.subCategory || '').toUpperCase() === cat.id.toUpperCase()).length;
        }
        return { ...cat, count: cnt };
      });
    } catch {
      return DEFAULT_CATEGORIES;
    }
  },

  resetCategoriesToDefault: () => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    notifyChange('RESET_CATEGORIES', STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    return DEFAULT_CATEGORIES;
  },

  saveCategories: (categories) => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    notifyChange('SAVE_CATEGORIES', STORAGE_KEYS.CATEGORIES, categories);
  },

  addCategory: (category) => {
    const categories = adminStore.getCategories();
    const newCat = {
      ...category,
      id: category.id || `CAT_${Date.now()}`,
      count: 0,
      active: category.active !== undefined ? category.active : true,
    };
    const updated = [...categories, newCat];
    adminStore.saveCategories(updated);
    return newCat;
  },

  updateCategory: (id, data) => {
    const categories = adminStore.getCategories();
    const updated = categories.map((c) => (c.id === id ? { ...c, ...data } : c));
    adminStore.saveCategories(updated);
    return updated.find((c) => c.id === id);
  },

  deleteCategory: (id) => {
    const categories = adminStore.getCategories();
    const updated = categories.filter((c) => c.id !== id);
    adminStore.saveCategories(updated);
    return true;
  },

  getOrders: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(DEFAULT_ORDERS));
        return DEFAULT_ORDERS;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_ORDERS;
    }
  },

  saveOrders: (orders) => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    notifyChange('SAVE_ORDERS', STORAGE_KEYS.ORDERS, orders);
  },

  updateOrderStatus: (orderId, newStatus) => {
    const orders = adminStore.getOrders();
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    adminStore.saveOrders(updated);
    return updated;
  },

  // ── Customer CRM Methods ────────────────────────────────────────────────────
  getCustomers: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(DEFAULT_CUSTOMERS));
        return DEFAULT_CUSTOMERS;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_CUSTOMERS;
    }
  },

  saveCustomers: (customers) => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    notifyChange('SAVE_CUSTOMERS', STORAGE_KEYS.CUSTOMERS, customers);
  },

  addCustomer: (customer) => {
    const customers = adminStore.getCustomers();
    const newCust = {
      id: customer.id || `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: customer.name || 'New Customer',
      phone: customer.phone || '012 000 000',
      email: customer.email || '',
      address: customer.address || 'Cambodia',
      city: customer.city || 'Phnom Penh',
      tier: customer.tier || 'Standard Member',
      points: Number(customer.points) || 0,
      totalOrders: Number(customer.totalOrders) || 0,
      totalSpent: Number(customer.totalSpent) || 0,
      joinedDate: customer.joinedDate || new Date().toISOString().split('T')[0],
      avatar: customer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      status: customer.status || 'Active',
    };
    const updated = [newCust, ...customers];
    adminStore.saveCustomers(updated);
    return newCust;
  },

  updateCustomer: (id, data) => {
    const customers = adminStore.getCustomers();
    const updated = customers.map((c) => (c.id === id ? { ...c, ...data } : c));
    adminStore.saveCustomers(updated);
    return updated.find((c) => c.id === id);
  },

  deleteCustomer: (id) => {
    const customers = adminStore.getCustomers();
    const updated = customers.filter((c) => c.id !== id);
    adminStore.saveCustomers(updated);
    return true;
  },

  getSettings: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
        return DEFAULT_SETTINGS;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings: (settings) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    notifyChange('SAVE_SETTINGS', STORAGE_KEYS.SETTINGS, settings);
  },

  getDashboardTelemetry: () => {
    const products = adminStore.getProducts();
    const orders = adminStore.getOrders();
    const customers = adminStore.getCustomers();
    const settings = adminStore.getSettings();

    const totalRevenueUsd = orders
      .filter((o) => o.status === 'Paid' || o.status === 'Completed')
      .reduce((sum, o) => sum + (Number(o.totalUsd) || 0), 0);

    const totalRevenueKhr = totalRevenueUsd * settings.exchangeRate;

    const lowStockCount = products.filter(
      (p) => p.stock > 0 && p.stock <= (p.lowStockThreshold || settings.lowStockAlertLevel)
    ).length;

    const outOfStockCount = products.filter((p) => p.stock === 0).length;

    const totalInventoryValue = products.reduce((sum, p) => sum + (p.price || 0) * (p.stock || 0), 0);

    const menCount = products.filter((p) => p.gender === 'men').length;
    const womenCount = products.filter((p) => p.gender === 'women').length;

    return {
      totalRevenueUsd,
      totalRevenueKhr,
      ordersCount: orders.length,
      productsCount: products.length,
      customersCount: customers.length,
      lowStockCount,
      outOfStockCount,
      totalInventoryValue,
      menCount,
      womenCount,
      recentOrders: orders.slice(0, 5),
    };
  },
};
