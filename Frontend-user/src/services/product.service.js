import { findProductByZandoRoute } from '../data/zandoProducts';
import { getProducts as fetchApiProducts } from '../api/client';
import { syncBridge } from './syncBridge';

export const productService = {
  getAll: () => syncBridge.getProducts(),
  getFallback: () => syncBridge.getProducts(),
  fetchFromApi: () => fetchApiProducts(),
  findBySlug: (slug) => {
    const list = syncBridge.getProducts();
    return (
      list.find(
        (p) =>
          p.cleanSlug === slug ||
          (p.zandoSlug || '').replace(/-\d{4,}$/, '').replace(/-\d+$/, '') === slug ||
          p.slug === slug ||
          String(p.id) === String(slug)
      ) || findProductByZandoRoute(`/product/${slug}`)
    );
  },
  filterByGenderAndCategory: (gender, category) => {
    const list = syncBridge.getProducts();
    return list.filter((p) => {
      const matchGender = !gender || p.gender === gender;
      const matchCat = !category || category === 'ALL' || p.category === category;
      return matchGender && matchCat;
    });
  },
};
