/**
 * Zando Cross-Origin Sync Bridge Client (Storefront <-> POS Admin)
 * Synchronizes orders, customer accounts, and real-time inventory between 5173 and 5174
 */
import { ZANDO_PRODUCTS } from '../data/zandoProducts';

const ADMIN_ORIGIN = 'http://localhost:5174';
const STORAGE_KEY_PRODUCTS = 'zando_admin_products_v1';
const STORAGE_KEY_BRANDS = 'zando_admin_brands_v1';
const STORAGE_KEY_DATA_MODE = 'zando_admin_data_mode_v1';
const STORAGE_KEY_ORDERS = 'zando_admin_orders_v1';
const STORAGE_KEY_CUSTOMERS = 'zando_admin_customers_v1';

let isBridgeReady = false;
let bridgeIframe = null;
const listeners = new Set();
const broadcast = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('zando_store_sync') : null;

// Ensure bridge iframe exists
function ensureIframe() {
  if (typeof document === 'undefined') return null;
  if (bridgeIframe && document.body.contains(bridgeIframe)) return bridgeIframe;

  let existing = document.getElementById('zando-sync-bridge-frame');
  if (!existing) {
    existing = document.createElement('iframe');
    existing.id = 'zando-sync-bridge-frame';
    existing.src = `${ADMIN_ORIGIN}/sync-bridge.html`;
    existing.style.display = 'none';
    existing.style.width = '0';
    existing.style.height = '0';
    existing.style.border = 'none';
    existing.setAttribute('aria-hidden', 'true');
    document.body.appendChild(existing);
  }
  bridgeIframe = existing;
  return existing;
}

// Window message listener
if (typeof window !== 'undefined') {
  window.addEventListener('message', (event) => {
    // Only accept messages from Admin origin or self
    if (event.origin !== ADMIN_ORIGIN && event.origin !== window.location.origin) return;

    const data = event.data;
    if (!data || typeof data !== 'object') return;

    if (data.type === 'ZANDO_BRIDGE_MOUNTED' || data.type === 'ZANDO_PONG') {
      isBridgeReady = true;
      if (data.snapshot) {
        handleSnapshot(data.snapshot);
      }
    } else if (data.type === 'ZANDO_REMOTE_SYNC_UPDATE' || data.type === 'ZANDO_SNAPSHOT_RESPONSE') {
      if (data.snapshot) {
        handleSnapshot(data.snapshot);
      }
    }
  });

  if (broadcast) {
    broadcast.onmessage = (msg) => {
      const data = msg.data;
      if (data && data.key && data.data) {
        try {
          localStorage.setItem(data.key, JSON.stringify(data.data));
          notifyListeners(data.key, data.data);
        } catch (_) {}
      }
    };
  }
}

function handleSnapshot(snapshot) {
  if (!snapshot) return;
  try {
    if (snapshot.products && Array.isArray(snapshot.products)) {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(snapshot.products));
      notifyListeners(STORAGE_KEY_PRODUCTS, snapshot.products);
    }
    if (snapshot.orders && Array.isArray(snapshot.orders)) {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(snapshot.orders));
      notifyListeners(STORAGE_KEY_ORDERS, snapshot.orders);
    }
    if (snapshot.customers && Array.isArray(snapshot.customers)) {
      localStorage.setItem(STORAGE_KEY_CUSTOMERS, JSON.stringify(snapshot.customers));
      notifyListeners(STORAGE_KEY_CUSTOMERS, snapshot.customers);
    }
  } catch (_) {}
}

function notifyListeners(key, data) {
  listeners.forEach((fn) => {
    try {
      fn({ key, data });
    } catch (e) {
      console.error('Sync listener error:', e);
    }
  });
}

function postToBridge(payload) {
  const iframe = ensureIframe();
  if (iframe && iframe.contentWindow) {
    try {
      iframe.contentWindow.postMessage(payload, ADMIN_ORIGIN);
    } catch (_) {}
  }
}

export const syncBridge = {
  init: () => {
    if (typeof window === 'undefined') return;
    ensureIframe();
    // Ping bridge
    setTimeout(() => {
      postToBridge({ type: 'ZANDO_PING' });
    }, 500);
  },

  subscribe: (callback) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },

  recordOrder: (order, customer) => {
    // 1. Write to Storefront origin localStorage
    try {
      const existingOrders = JSON.parse(localStorage.getItem(STORAGE_KEY_ORDERS) || '[]');
      const updated = [order, ...existingOrders.filter((o) => o.id !== order.id)];
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(updated));

      // Also deduct local stock
      if (Array.isArray(order.items)) {
        const products = syncBridge.getProducts();
        const updatedProds = products.map((p) => {
          const item = order.items.find((i) => i.id === p.id || i.name === p.name || i.name === p.nameEn);
          if (item) {
            return { ...p, stock: Math.max(0, (p.stock || 0) - (item.qty || item.quantity || 1)) };
          }
          return p;
        });
        localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(updatedProds));
        notifyListeners(STORAGE_KEY_PRODUCTS, updatedProds);
      }
    } catch (_) {}

    // 2. Transmit to Admin (origin 5174)
    postToBridge({
      type: 'ZANDO_RECORD_ORDER',
      order,
      customer,
    });

    if (broadcast) {
      try {
        broadcast.postMessage({ type: 'NEW_ORDER', order, customer });
      } catch (_) {}
    }
  },

  updateCustomerProfile: (customer) => {
    postToBridge({
      type: 'ZANDO_UPDATE_CUSTOMER',
      customer,
    });
  },

  getProducts: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
      const mode = localStorage.getItem(STORAGE_KEY_DATA_MODE);
      if (mode === 'real') return [];
    } catch (_) {}
    return ZANDO_PRODUCTS;
  },

  getBrands: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BRANDS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return [];
  },

  getOrders: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ORDERS);
      return stored ? JSON.parse(stored) : [];
    } catch (_) {}
    return [];
  },
};
