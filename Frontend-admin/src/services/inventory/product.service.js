import { adminStore } from '../../data/adminStore';

export const productService = {
  getAll: () => adminStore.getProducts(),
  getById: (id) => adminStore.getProducts().find((p) => p.id === id),
  create: (data) => adminStore.addProduct(data),
  update: (id, data) => adminStore.updateProduct(id, data),
  delete: (id) => adminStore.deleteProduct(id),
  adjustStock: (id, delta, reason = 'MANUAL_ADJUST') => {
    const products = adminStore.getProducts();
    const product = products.find((p) => p.id === id);
    if (!product) return null;
    const newStock = Math.max(0, product.stock + delta);
    adminStore.updateProduct(id, { stock: newStock });

    // Record stock movement
    const history = JSON.parse(localStorage.getItem('zando_stock_history_v1') || '[]');
    const record = {
      id: `MOV-${Date.now()}`,
      productId: id,
      productName: product.name,
      sku: product.sku,
      delta,
      previousStock: product.stock,
      newStock,
      reason,
      date: new Date().toLocaleString(),
      user: 'Nha (Admin)',
    };
    localStorage.setItem('zando_stock_history_v1', JSON.stringify([record, ...history.slice(0, 99)]));
    return newStock;
  },
};
