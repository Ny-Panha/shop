import { adminStore } from '../../data/adminStore';

export const orderService = {
  getAll: () => adminStore.getOrders(),
  getById: (id) => adminStore.getOrders().find((o) => o.id === id),
  updateStatus: (id, status) => adminStore.updateOrderStatus(id, status),
};
