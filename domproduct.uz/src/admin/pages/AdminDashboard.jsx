import React from 'react';
import { useTranslation } from 'react-i18next';
import { allProducts } from '../../data/products';
import { categories } from '../../data/categories';
import { users } from '../../data/users';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const { t } = useTranslation();

    const stats = {
        totalProducts: allProducts.length,
        totalCategories: categories.length,
        totalUsers: users.length,
        totalOrders: 15 // Static data for now
    };

    const statsCards = [
        {
            title: t('total_products'),
            value: stats.totalProducts,
            icon: 'fas fa-box',
            color: 'primary'
        },
        {
            title: t('total_categories'),
            value: stats.totalCategories,
            icon: 'fas fa-tags',
            color: 'success'
        },
        {
            title: t('total_users'),
            value: stats.totalUsers,
            icon: 'fas fa-users',
            color: 'info'
        },
        {
            title: t('total_orders'),
            value: stats.totalOrders,
            icon: 'fas fa-shopping-cart',
            color: 'warning'
        }
    ];

    const recentProducts = allProducts.slice(0, 5);

    return (
        <div className="admin-dashboard">
            <div className="admin-page-header">
                <div>
                    <h1>{t('admin_dashboard')}</h1>
                    <p>{t('admin_dashboard_subtitle')}</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="admin-stats-grid">
                {statsCards.map((stat, index) => (
                    <div key={index} className={`admin-stat-card ${stat.color}`}>
                        <div className="admin-stat-icon">
                            <i className={stat.icon}></i>
                        </div>
                        <div className="admin-stat-info">
                            <h3>{stat.value}</h3>
                            <p>{stat.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Products */}
            <div className="admin-section">
                <div className="admin-section-header">
                    <h2>{t('recent_products')}</h2>
                    <Link to="/admin/products" className="admin-link">{t('view_all')}</Link>
                </div>
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>{t('image')}</th>
                                <th>{t('name')}</th>
                                <th>{t('category')}</th>
                                <th>{t('price')}</th>
                                <th>{t('status')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentProducts.map(product => (
                                <tr key={product.id}>
                                    <td>
                                        <img 
                                            src={product.image} 
                                            alt={product.name}
                                            className="admin-product-image"
                                        />
                                    </td>
                                    <td>{t(product.name)}</td>
                                    <td>{product.category}</td>
                                    <td>{product.price.toLocaleString('uz-UZ')} UZS</td>
                                    <td>
                                        <span className="admin-status-badge active">
                                            {t('active')}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
