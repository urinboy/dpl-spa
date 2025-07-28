import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from '../../components/LanguageSwitcher';

const AdminHeader = ({ onMenuClick }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);

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

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        // Add dark mode functionality later
        document.documentElement.classList.toggle('dark-mode');
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
                    className="admin-header-icon-btn" 
                    onClick={toggleDarkMode}
                    title={isDarkMode ? t('light_mode') : t('dark_mode')}
                >
                    <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
                </button>
                
                <div className="admin-language-wrapper">
                    <LanguageSwitcher />
                </div>
                
                
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
