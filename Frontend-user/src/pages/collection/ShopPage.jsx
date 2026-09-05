import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductGrid } from '../../components/ProductGrid';

export default function ShopPage({ products, loading }) {
  const { gender, category: categorySlug } = useParams();
  const navigate = useNavigate();

  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedGender, setSelectedGender] = useState(gender || 'men');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Sync gender from URL param
  useEffect(() => {
    setSelectedGender(gender || 'men');
  }, [gender]);

  // Sync category from URL slug
  useEffect(() => {
    const slug = (categorySlug || '').toLowerCase();
    if (!slug || slug === 'collection') {
      setSelectedCategory('ALL');
      setSelectedBrand('ALL');
    } else if (slug === 'shoes' || slug === 'sneakers') {
      setSelectedCategory('SHOES');
    } else if (slug === 'bags' || slug === 'accessories') {
      setSelectedCategory('BAGS');
    } else if (slug === 'clothes' || slug === 'clothing' || slug === 'dresses' || slug === 'skirts') {
      setSelectedCategory('CLOTHES');
    } else if (slug === 't-shirts' || slug === 'shirts' || slug === 'polo') {
      setSelectedCategory('T-Shirts');
    } else if (slug === 'jeans' || slug === 'pants' || slug === 'shorts') {
      setSelectedCategory('Jeans');
    } else if (slug === 'sale' || slug === 'flash-sale') {
      setSelectedCategory('SALE');
    } else if (slug === 'new-in') {
      setSelectedCategory('NEW_IN');
    } else if (slug === 'routine') {
      setSelectedBrand('ROUTINE');
    } else if (slug === 'ten11' || slug === 'ten-eleven') {
      setSelectedBrand('TEN-ELEVEN');
    } else if (slug === 'gatoni') {
      setSelectedBrand('GATONI');
    } else if (slug === '361') {
      setSelectedBrand('361');
    } else if (slug === 'baysic') {
      setSelectedBrand('BAYSIC');
    }
  }, [categorySlug]);

  const handleResetFilters = () => {
    setSelectedBrand('ALL');
    setSelectedCategory('ALL');
    setSearchQuery('');
    setSortBy('featured');
    setInStockOnly(false);
  };

  const handleOpenProduct = (p) => {
    const coolSlug =
      p.cleanSlug || (p.zandoSlug || p.slug || '').replace(/-\d{4,}$/, '').replace(/-\d+$/, '');
    navigate(`/product/${coolSlug}`);
  };

  return (
    <div
      id="shop-catalog"
      style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '16px 20px 90px 20px',
        backgroundColor: '#ffffff',
        width: '100%',
      }}
    >
      <ProductGrid
        products={products}
        loading={loading}
        sortBy={sortBy}
        setSortBy={setSortBy}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedGender={selectedGender}
        setSelectedGender={(g) => {
          setSelectedGender(g);
          navigate(`/${g}/collection`);
        }}
        inStockOnly={inStockOnly}
        setInStockOnly={setInStockOnly}
        onResetFilters={handleResetFilters}
        onQuickView={handleOpenProduct}
      />
    </div>
  );
}
