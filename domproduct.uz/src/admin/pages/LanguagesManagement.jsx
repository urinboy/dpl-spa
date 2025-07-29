import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { languages } from '../../data/languages';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

const LanguagesManagement = () => {
    const { t } = useTranslation();
    const [languagesList, setLanguagesList] = useState(languages);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLanguage, setEditingLanguage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingLanguage, setDeletingLanguage] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        nativeName: '',
        flag: '',
        direction: 'ltr',
        isActive: true
    });

    const filteredLanguages = languagesList.filter(lang =>
        lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lang.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openModal = (language = null) => {
        setEditingLanguage(language);
        setFormData(language || {
            code: '',
            name: '',
            nativeName: '',
            flag: '',
            direction: 'ltr',
            isActive: true
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingLanguage(null);
        setFormData({
            code: '',
            name: '',
            nativeName: '',
            flag: '',
            direction: 'ltr',
            isActive: true
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingLanguage) {
            // Update existing language
            setLanguagesList(languagesList.map(lang =>
                lang.code === editingLanguage.code ? { ...formData } : lang
            ));
        } else {
            // Add new language
            if (languagesList.find(lang => lang.code === formData.code)) {
                alert('Bu til kodi allaqachon mavjud!');
                return;
            }
            setLanguagesList([...languagesList, formData]);
        }
        
        closeModal();
    };

    const handleDelete = (language) => {
        setDeletingLanguage(language);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        setLanguagesList(languagesList.filter(lang => lang.code !== deletingLanguage.code));
        setShowDeleteModal(false);
        setDeletingLanguage(null);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setDeletingLanguage(null);
    };

    const toggleStatus = (langCode) => {
        setLanguagesList(languagesList.map(lang =>
            lang.code === langCode ? { 
                ...lang, 
                isActive: !(lang.isActive !== undefined ? lang.isActive : true) 
            } : lang
        ));
    };

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
                            <th>{t('native_name')}</th>
                            <th>{t('direction')}</th>
                            <th>{t('status')}</th>
                            <th>{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLanguages.map(language => (
                            <tr key={language.code}>
                                <td className="admin-flag-cell">
                                    <span className="admin-flag">{language.flag}</span>
                                </td>
                                <td>
                                    <code className="admin-code">{language.code}</code>
                                </td>
                                <td>{language.name}</td>
                                <td>{language.nativeName}</td>
                                <td>
                                    <span className={`admin-direction ${language.direction || 'ltr'}`}>
                                        {(language.direction || 'ltr').toUpperCase()}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className={`admin-status-toggle ${(language.isActive !== undefined ? language.isActive : true) ? 'active' : 'inactive'}`}
                                        onClick={() => toggleStatus(language.code)}
                                    >
                                        <span className="admin-status-indicator"></span>
                                        {(language.isActive !== undefined ? language.isActive : true) ? t('active') : t('inactive')}
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
                                <label>{t('native_name')}</label>
                                <input
                                    type="text"
                                    value={formData.nativeName}
                                    onChange={(e) => setFormData({...formData, nativeName: e.target.value})}
                                    placeholder="O'zbekcha, Русский, English"
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
                                <label>{t('text_direction')}</label>
                                <select
                                    value={formData.direction}
                                    onChange={(e) => setFormData({...formData, direction: e.target.value})}
                                    required
                                >
                                    <option value="ltr">{t('left_to_right')}</option>
                                    <option value="rtl">{t('right_to_left')}</option>
                                </select>
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                                    />
                                    {t('language_active')}
                                </label>
                            </div>
                            
                            <div className="admin-form-actions">
                                <button type="button" className="admin-btn admin-btn-secondary" onClick={closeModal}>
                                    <i className="fas fa-times"></i>
                                    {t('cancel')}
                                </button>
                                <button type="submit" className="admin-btn admin-btn-primary">
                                    <i className={`fas ${editingLanguage ? 'fa-save' : 'fa-plus'}`}></i>
                                    {editingLanguage ? t('update') : t('add')}
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
