import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import AdminDashboard from './pages/AdminDashboard';
import ProductsManagement from './pages/ProductsManagement';
import CategoriesManagement from './pages/CategoriesManagement';
import UsersManagement from './pages/UsersManagement';
import OrdersManagement from './pages/OrdersManagement';
import './admin.css';

const AdminApp = () => {
    const { t } = useTranslation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="admin-container">
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="admin-main">
                <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                <main className="admin-content">
                    <Routes>
                        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                        <Route path="/dashboard" element={<AdminDashboard />} />
                        <Route path="/products" element={<ProductsManagement />} />
                        <Route path="/categories" element={<CategoriesManagement />} />
                        <Route path="/users" element={<UsersManagement />} />
                        <Route path="/orders" element={<OrdersManagement />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default AdminApp;
