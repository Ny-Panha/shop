import { adminStore } from '../../data/adminStore';

export const categoryService = {
  getAll: () => adminStore.getCategories(),
  getByGender: (gender) => adminStore.getCategories().filter((c) => c.gender === gender),
  create: (data) => adminStore.addCategory(data),
  delete: (id) => adminStore.deleteCategory(id),
};
