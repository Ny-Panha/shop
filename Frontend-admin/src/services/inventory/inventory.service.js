import { adminStore } from '../../data/adminStore';

const STOCK_HISTORY_KEY = 'zando_stock_history_v1';

const DEFAULT_MOVEMENTS = [
  {
    id: 'MOV-1001',
    productId: 100,
    productName: 'ខោខូវប៊យជើងវែង INSANE®',
    sku: 'INS-ROYAL-100',
    delta: 15,
    previousStock: 10,
    newStock: 25,
    reason: 'STOCK_IN (Factory Shipment)',
    date: '2026-03-04 10:20',
    user: 'Admin Manager',
  },
  {
    id: 'MOV-1002',
    productId: 101,
    productName: 'អាវយឺត JETBURN WASH ROCKET',
    sku: 'ZAN-JETBURN-01',
    delta: -1,
    previousStock: 5,
    newStock: 4,
    reason: 'POS_SALE (Invoice ORD-8821)',
    date: '2026-03-04 15:30',
    user: 'Cashier Terminal 1',
  },
  {
    id: 'MOV-1003',
    productId: 203,
    productName: 'កាបូបស្ពាយស្បែក Mini Leather Bag',
    sku: 'WOM-BAG-99',
    delta: -2,
    previousStock: 2,
    newStock: 0,
    reason: 'POS_SALE (Sold Out)',
    date: '2026-03-04 16:45',
    user: 'Cashier Terminal 1',
  },
];

export const inventoryService = {
  getHistory: () => {
    try {
      const stored = localStorage.getItem(STOCK_HISTORY_KEY);
      if (!stored) {
        localStorage.setItem(STOCK_HISTORY_KEY, JSON.stringify(DEFAULT_MOVEMENTS));
        return DEFAULT_MOVEMENTS;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_MOVEMENTS;
    }
  },

  recordMovement: (movement) => {
    const history = inventoryService.getHistory();
    const newRecord = {
      id: `MOV-${Date.now()}`,
      date: new Date().toLocaleString(),
      user: 'Admin Manager',
      ...movement,
    };
    const updated = [newRecord, ...history];
    localStorage.setItem(STOCK_HISTORY_KEY, JSON.stringify(updated.slice(0, 100)));
    return newRecord;
  },

  getInventoryValuation: () => {
    const products = adminStore.getProducts();
    const settings = adminStore.getSettings();
    const totalUnits = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
    const totalAssetValueUsd = products.reduce(
      (sum, p) => sum + (Number(p.costPrice) || Number(p.price) * 0.6) * (Number(p.stock) || 0),
      0
    );
    const totalRetailValueUsd = products.reduce(
      (sum, p) => sum + Number(p.price) * (Number(p.stock) || 0),
      0
    );
    const lowStockItems = products.filter(
      (p) => p.stock > 0 && p.stock <= (p.lowStockThreshold || settings.lowStockAlertLevel || 5)
    );
    const outOfStockItems = products.filter((p) => p.stock === 0);

    return {
      totalUnits,
      totalAssetValueUsd,
      totalAssetValueKhr: totalAssetValueUsd * settings.exchangeRate,
      totalRetailValueUsd,
      lowStockItems,
      outOfStockItems,
    };
  },
};
