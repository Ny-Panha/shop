import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import AdminLoginPage from './pages/auth/AdminLoginPage';
import AuthGuard from './components/auth/AuthGuard';
import { adminRoutes } from './routes/admin.routes';

export default function App() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<AdminLoginPage />} />
      <Route path="/forgot-password" element={<AdminLoginPage />} />

      {/* Protected Admin Console Routes */}
      <Route
        path="/"
        element={
          <AuthGuard>
            <AdminLayout />
          </AuthGuard>
        }
      >
        {adminRoutes}
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
