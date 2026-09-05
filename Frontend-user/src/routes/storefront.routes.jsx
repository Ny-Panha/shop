import React from 'react';
import { Route } from 'react-router-dom';
import HomePageWrapper from '../pages/home/HomePageWrapper';
import ShopPage from '../pages/collection/ShopPage';
import ProductDetailPage from '../pages/product/ProductDetailPage';
import OrderTrackingPage from '../pages/tracking/OrderTrackingPage';

export function getStorefrontRoutes({ products, loading, onNavigateToShop }) {
  return (
    <>
      <Route path="/" element={<HomePageWrapper products={products} loading={loading} />} />
      <Route path="/women" element={<HomePageWrapper products={products} loading={loading} />} />
      <Route path="/men" element={<HomePageWrapper products={products} loading={loading} />} />
      <Route path="/kids" element={<HomePageWrapper products={products} loading={loading} />} />
      
      <Route path="/:gender/collection" element={<ShopPage products={products} loading={loading} />} />
      <Route path="/:gender/:category" element={<ShopPage products={products} loading={loading} />} />
      
      <Route path="/product/:slug" element={<ProductDetailPage onNavigateToShop={onNavigateToShop} />} />
      <Route path="/track" element={<OrderTrackingPage onOpenShop={() => onNavigateToShop({ gender: 'men' })} />} />
      
      <Route path="*" element={<HomePageWrapper products={products} loading={loading} />} />
    </>
  );
}
