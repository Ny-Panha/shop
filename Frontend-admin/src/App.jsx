import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import { adminRoutes } from './routes/admin.routes';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        {adminRoutes}
      </Route>
    </Routes>
  );
}
