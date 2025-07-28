import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ onMenuClick }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleBackToSite = () => {
        navigate('/');
    };

    return (
        <header className="admin-header">
            <div className="admin-header-left">
                <button className="admin-menu-btn" onClick={onMenuClick}>
                    <i className="fas fa-bars"></i>
                </button>
                <h1 className="admin-page-title">{t('admin_panel')}</h1>
            </div>
            <div className="admin-header-right">
                <button className="admin-view-site-btn" onClick={handleBackToSite}>
                    <i className="fas fa-arrow-left"></i>
                    {t('back_to_site')}
                </button>
                <div className="admin-user-info">
                    <i className="fas fa-user-circle"></i>
                    <span>Admin</span>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
