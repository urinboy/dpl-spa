import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AdminSidebar = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        {
            path: '/admin/dashboard',
            icon: 'fas fa-tachometer-alt',
            label: t('admin_dashboard'),
            key: 'dashboard'
        },
        {
            path: '/admin/languages',
            icon: 'fas fa-language',
            label: t('admin_languages'),
            key: 'languages'
        },
        {
            path: '/admin/translations',
            icon: 'fas fa-globe',
            label: t('admin_translations'),
            key: 'translations'
        },
        {
            path: '/admin/users',
            icon: 'fas fa-users',
            label: t('admin_users'),
            key: 'users'
        },
        {
            path: '/admin/categories',
            icon: 'fas fa-tags',
            label: t('admin_categories'),
            key: 'categories'
        },
        {
            path: '/admin/products',
            icon: 'fas fa-box',
            label: t('admin_products'),
            key: 'products'
        },
        {
            path: '/admin/orders',
            icon: 'fas fa-shopping-cart',
            label: t('admin_orders'),
            key: 'orders'
        },
        {
            path: '/',
            icon: 'fas fa-arrow-left',
            label: t('back_to_site'),
            key: 'translations'
        }
    ];

    // const handleBackToSite = () => {
    //     navigate('/');
    //     onClose();
    // };

    return (
        <>
            {isOpen && <div className="admin-sidebar-overlay" onClick={onClose}></div>}
            <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="admin-sidebar-header">
                    <h2 className="admin-logo">
                        <i className="fas fa-crown"></i>
                        Admin Panel
                    </h2>
                    <button className="admin-sidebar-close" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <nav className="admin-sidebar-nav">
                    {/* <button className="admin-nav-item admin-back-to-site" onClick={handleBackToSite}>
                        <i className="fas fa-arrow-left"></i>
                        <span>{t('back_to_site')}</span>
                    </button> */}
                    
                    {/* <div className="admin-nav-divider"></div> */}
                    
                    {menuItems.map(item => (
                        <Link
                            key={item.key}
                            to={item.path}
                            className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={onClose}
                        >
                            <i className={item.icon}></i>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default AdminSidebar;
