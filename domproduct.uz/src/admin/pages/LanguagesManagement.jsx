import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

const LanguagesManagement = () => {
    const { t } = useTranslation();
    const { languages, loading, fetchLanguages } = useLanguage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLanguage, setEditingLanguage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingLanguage, setDeletingLanguage] = useState(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        flag: '',
        is_active: true,
        is_default: false,
        sort_order: 1
    });

    const filteredLanguages = languages.filter(lang =>
        lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lang.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Tilni saqlash (yaratish yoki yangilash)
    const saveLanguage = async () => {
        try {
            setSaving(true);
            const url = editingLanguage 
                ? `https://api.domproduct.uz/v1/languages/${editingLanguage.id}`
                : 'https://api.domproduct.uz/v1/languages';
            
            const method = editingLanguage ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    // Admin autentifikatsiya uchun token qo'shish kerak
                    // 'Authorization': `Bearer ${getAdminToken()}`
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            
            if (result.success) {
                // Tillar ro'yxatini yangilash
                await fetchLanguages();
                closeModal();
                alert(editingLanguage ? t('language_updated') : t('language_created'));
            } else {
                alert(result.message || t('error_occurred'));
            }
        } catch (error) {
            console.error('Tilni saqlashda xatolik:', error);
            alert(t('error_occurred'));
        } finally {
            setSaving(false);
        }
    };

    // Tilni o'chirish
    const deleteLanguage = async (language) => {
        try {
            const response = await fetch(`https://api.domproduct.uz/v1/languages/${language.id}`, {
                method: 'DELETE',
                headers: {
                    // Admin autentifikatsiya uchun token qo'shish kerak
                    // 'Authorization': `Bearer ${getAdminToken()}`
                }
            });

            const result = await response.json();
            
            if (result.success) {
                // Tillar ro'yxatini yangilash
                await fetchLanguages();
                setShowDeleteModal(false);
                setDeletingLanguage(null);
                alert(t('language_deleted'));
            } else {
                alert(result.message || t('error_occurred'));
            }
        } catch (error) {
            console.error('Tilni o\'chirishda xatolik:', error);
            alert(t('error_occurred'));
        }
    };

    const openModal = (language = null) => {
        setEditingLanguage(language);
        setFormData(language || {
            code: '',
            name: '',
            flag: '',
            is_active: true,
            is_default: false,
            sort_order: languages.length + 1
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingLanguage(null);
        setFormData({
            code: '',
            name: '',
            flag: '',
            is_active: true,
            is_default: false,
            sort_order: 1
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        saveLanguage();
    };

    const handleDelete = (language) => {
        setDeletingLanguage(language);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        deleteLanguage(deletingLanguage);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setDeletingLanguage(null);
    };

    const toggleStatus = async (language) => {
        try {
            const response = await fetch(`https://api.domproduct.uz/v1/languages/${language.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // Admin autentifikatsiya uchun token qo'shish kerak
                },
                body: JSON.stringify({
                    ...language,
                    is_active: !language.is_active
                })
            });

            const result = await response.json();
            
            if (result.success) {
                await fetchLanguages();
            } else {
                alert(result.message || t('error_occurred'));
            }
        } catch (error) {
            console.error('Til holatini o\'zgartirishda xatolik:', error);
            alert(t('error_occurred'));
        }
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <i className="fas fa-spinner fa-spin"></i>
                <p>{t('loading')}</p>
            </div>
        );
    }

    return (
        <div className="admin-languages">
            <div className="admin-page-header">
                <div>
                    <h1>{t('languages_management')}</h1>
                    <p>{t('languages_management_subtitle')}</p>
                </div>
                <button 
                    className="admin-btn admin-btn-primary"
                    onClick={() => openModal()}
                >
                    <i className="fas fa-plus"></i>
                    {t('add_language')}
                </button>
            </div>

            <div className="admin-filters">
                <div className="admin-search">
                    <i className="fas fa-search"></i>
                    <input
                        type="text"
                        placeholder={t('search_languages')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>{t('flag')}</th>
                            <th>{t('code')}</th>
                            <th>{t('name')}</th>
                            <th>{t('is_default')}</th>
                            <th>{t('sort_order')}</th>
                            <th>{t('status')}</th>
                            <th>{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLanguages.map(language => (
                            <tr key={language.id}>
                                <td className="admin-flag-cell">
                                    <span className="admin-flag">{language.flag}</span>
                                </td>
                                <td>
                                    <code className="admin-code">{language.code}</code>
                                </td>
                                <td>{language.name}</td>
                                <td>
                                    <span className={`admin-badge ${language.is_default ? 'admin-badge-success' : 'admin-badge-secondary'}`}>
                                        {language.is_default ? t('default') : t('not_default')}
                                    </span>
                                </td>
                                <td>{language.sort_order}</td>
                                <td>
                                    <button
                                        className={`admin-status-toggle ${language.is_active ? 'active' : 'inactive'}`}
                                        onClick={() => toggleStatus(language)}
                                    >
                                        <span className="admin-status-indicator"></span>
                                        {language.is_active ? t('active') : t('inactive')}
                                    </button>
                                </td>
                                <td>
                                    <div className="admin-actions">
                                        <button
                                            className="admin-btn admin-btn-sm admin-btn-secondary"
                                            onClick={() => openModal(language)}
                                            title={t('edit_language')}
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            className="admin-btn admin-btn-sm admin-btn-danger"
                                            onClick={() => handleDelete(language)}
                                            title={t('delete_language')}
                                            disabled={language.is_default}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredLanguages.length === 0 && (
                    <div className="admin-empty-state">
                        <i className="fas fa-language"></i>
                        <p>{t('no_languages_found')}</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="admin-modal-overlay" onClick={closeModal}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>{editingLanguage ? t('edit_language') : t('add_language')}</h2>
                            <button className="admin-modal-close" onClick={closeModal}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="admin-form-group">
                                <label>{t('language_code')}</label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                                    placeholder="uz, ru, en"
                                    required
                                    disabled={editingLanguage}
                                />
                                <small>{t('language_code_help')}</small>
                            </div>

                            <div className="admin-form-group">
                                <label>{t('language_name')}</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder="English, Русский, O'zbek"
                                    required
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>{t('flag_emoji')}</label>
                                <input
                                    type="text"
                                    value={formData.flag}
                                    onChange={(e) => setFormData({...formData, flag: e.target.value})}
                                    placeholder="🇺🇿 🇷🇺 🇺🇸"
                                    required
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>{t('sort_order')}</label>
                                <input
                                    type="number"
                                    value={formData.sort_order}
                                    onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value)})}
                                    min="1"
                                    required
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                                    />
                                    {t('language_active')}
                                </label>
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_default}
                                        onChange={(e) => setFormData({...formData, is_default: e.target.checked})}
                                    />
                                    {t('default_language')}
                                </label>
                            </div>
                            
                            <div className="admin-form-actions">
                                <button type="button" className="admin-btn admin-btn-secondary" onClick={closeModal}>
                                    <i className="fas fa-times"></i>
                                    {t('cancel')}
                                </button>
                                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                                    {saving ? (
                                        <i className="fas fa-spinner fa-spin"></i>
                                    ) : (
                                        <i className={`fas ${editingLanguage ? 'fa-save' : 'fa-plus'}`}></i>
                                    )}
                                    {saving ? t('saving') : (editingLanguage ? t('update') : t('add'))}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirm Delete Modal */}
            <ConfirmDeleteModal
                isOpen={showDeleteModal}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
                title={t('confirm_delete_language')}
                message={t('delete_language_message')}
                itemName={deletingLanguage?.name}
            />
        </div>
    );
};

export default LanguagesManagement;
