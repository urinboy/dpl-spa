import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import LanguageSwitcher from '../../components/LanguageSwitcher';

const AdminHeader = ({ onMenuClick }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');

    const handleBackToSite = () => {
        navigate('/');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            console.log('Admin search:', searchQuery);
            // Add search functionality later
        }
    };

    return (
        <header className="admin-header">
            <div className="admin-header-left">
                <button className="admin-menu-btn" onClick={onMenuClick}>
                    <i className="fas fa-bars"></i>
                </button>
                
                <form className="admin-search-form" onSubmit={handleSearch}>
                    <div className="admin-search-input-wrapper">
                        <i className="fas fa-search admin-search-icon"></i>
                        <input
                            type="text"
                            className="admin-search-input"
                            placeholder={t('search_in_admin')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </form>
            </div>
            
            <div className="admin-header-right">
                <button 
                    className="admin-header-icon-btn admin-theme-toggle"
                    onClick={toggleTheme}
                    title={isDarkMode ? t('light_mode') : t('dark_mode')}
                >
                    <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
                </button>
                
                <div className="admin-language-wrapper">
                    <LanguageSwitcher />
                </div>
                
                <button 
                    className="admin-header-icon-btn admin-back-btn"
                    onClick={handleBackToSite}
                    title={t('back_to_site')}
                >
                    <i className="fas fa-external-link-alt"></i>
                </button>
                
                <div className="admin-user-menu">
                    <button className="admin-user-btn">
                        <i className="fas fa-user"></i>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
