import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HomePage } from '../../components/HomePage';

export default function HomePageWrapper({ products, loading }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse gender from URL path: /women → 'women', /men → 'men', / → 'men'
  const pathParts = location.pathname.split('/').filter(Boolean);
  const resolvedGender = ['women', 'men', 'kids'].includes(pathParts[0]) ? pathParts[0] : 'men';

  const handleOpenProduct = (p) => {
    const coolSlug =
      p.cleanSlug ||
      (p.zandoSlug || p.slug || '').replace(/-\d{4,}$/, '').replace(/-\d+$/, '') ||
      p.id;
    navigate(`/product/${coolSlug}`);
  };

  return (
    <HomePage
      products={products}
      selectedGender={resolvedGender}
      onNavigateToShop={({ brand, category, gender: g }) => {
        const targetGender = g || resolvedGender;
        const catSlug = category ? category.toLowerCase().replace(/_/g, '-') : 'collection';
        navigate(`/${targetGender}/${catSlug}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      onQuickView={handleOpenProduct}
    />
  );
}
