import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/admin/dashboard/Dashboard';
import Inventory from '../pages/admin/inventory/Inventory';
import ProductList from '../pages/admin/product/ProductList';
import CategoryList from '../pages/admin/category/CategoryList';
import OrderList from '../pages/admin/orders/OrderList';
import CustomerList from '../pages/admin/customer/CustomerList';
import ShopSettings from '../pages/admin/settings/ShopSettings';

export const adminRoutes = (
  <>
    <Route index element={<Navigate to="/dashboard" replace />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="inventory" element={<Inventory />} />
    <Route path="products" element={<ProductList />} />
    <Route path="categories" element={<CategoryList />} />
    <Route path="orders" element={<OrderList />} />
    <Route path="customers" element={<CustomerList />} />
    <Route path="settings" element={<ShopSettings />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </>
);
