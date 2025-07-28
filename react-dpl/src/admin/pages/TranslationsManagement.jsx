import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { resources } from '../../data/translations';
import { languages } from '../../data/languages';

const TranslationsManagement = () => {
    const { t } = useTranslation();
    const [translationsData, setTranslationsData] = useState(() => {
        // Convert resources to flat structure for editing
        const flatTranslations = {};
        Object.keys(resources).forEach(langCode => {
            flatTranslations[langCode] = resources[langCode].translation;
        });
        return flatTranslations;
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingKey, setEditingKey] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('uz');
    const [formData, setFormData] = useState({
        key: '',
        translations: {}
    });

    // Get all translation keys
    const allKeys = useMemo(() => {
        const keys = new Set();
        Object.values(translationsData).forEach(langData => {
            Object.keys(langData).forEach(key => keys.add(key));
        });
        return Array.from(keys).sort();
    }, [translationsData]);

    // Filter keys based on search
    const filteredKeys = allKeys.filter(key =>
        key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (translationsData[selectedLanguage] && 
         translationsData[selectedLanguage][key] && 
         translationsData[selectedLanguage][key].toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const openModal = (key = null) => {
        setEditingKey(key);
        if (key) {
            // Edit existing translation
            const keyTranslations = {};
            languages.forEach(lang => {
                keyTranslations[lang.code] = translationsData[lang.code]?.[key] || '';
            });
            setFormData({
                key: key,
                translations: keyTranslations
            });
        } else {
            // Add new translation
            const emptyTranslations = {};
            languages.forEach(lang => {
                emptyTranslations[lang.code] = '';
            });
            setFormData({
                key: '',
                translations: emptyTranslations
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingKey(null);
        setFormData({
            key: '',
            translations: {}
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!editingKey && allKeys.includes(formData.key)) {
            alert('Bu kalit allaqachon mavjud!');
            return;
        }

        const newTranslationsData = { ...translationsData };
        
        // If editing and key changed, remove old key
        if (editingKey && editingKey !== formData.key) {
            languages.forEach(lang => {
                if (newTranslationsData[lang.code]) {
                    delete newTranslationsData[lang.code][editingKey];
                }
            });
        }

        // Add/update translations for all languages
        Object.entries(formData.translations).forEach(([langCode, translation]) => {
            if (!newTranslationsData[langCode]) {
                newTranslationsData[langCode] = {};
            }
            if (translation.trim()) {
                newTranslationsData[langCode][formData.key] = translation;
            }
        });

        setTranslationsData(newTranslationsData);
        closeModal();
    };

    const handleDelete = (key) => {
        if (window.confirm(t('confirm_delete_translation'))) {
            const newTranslationsData = { ...translationsData };
            languages.forEach(lang => {
                if (newTranslationsData[lang.code]) {
                    delete newTranslationsData[lang.code][key];
                }
            });
            setTranslationsData(newTranslationsData);
        }
    };

    const exportTranslations = () => {
        const dataStr = JSON.stringify(translationsData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'translations.json';
        link.click();
    };

    return (
        <div className="admin-translations">
            <div className="admin-page-header">
                <div>
                    <h1>{t('translations_management')}</h1>
                    <p>{t('translations_management_subtitle')}</p>
                </div>
                <div className="admin-header-actions">
                    <button 
                        className="admin-btn admin-btn-secondary"
                        onClick={exportTranslations}
                    >
                        <i className="fas fa-download"></i>
                        {t('export_translations')}
                    </button>
                    <button 
                        className="admin-btn admin-btn-primary"
                        onClick={() => openModal()}
                    >
                        <i className="fas fa-plus"></i>
                        {t('add_translation')}
                    </button>
                </div>
            </div>

            <div className="admin-filters">
                <div className="admin-search">
                    <i className="fas fa-search"></i>
                    <input
                        type="text"
                        placeholder={t('search_translations')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="admin-language-filter">
                    <label>{t('view_language')}:</label>
                    <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                    >
                        {languages.map(lang => (
                            <option key={lang.code} value={lang.code}>
                                {lang.flag} {lang.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="admin-stats">
                    <span className="admin-stat-item">
                        <i className="fas fa-key"></i>
                        {t('total_keys')}: <strong>{allKeys.length}</strong>
                    </span>
                    <span className="admin-stat-item">
                        <i className="fas fa-language"></i>
                        {t('languages')}: <strong>{languages.length}</strong>
                    </span>
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th style={{width: '200px'}}>{t('translation_key')}</th>
                            <th>{t('translation_value')} ({selectedLanguage.toUpperCase()})</th>
                            <th style={{width: '120px'}}>{t('coverage')}</th>
                            <th style={{width: '100px'}}>{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredKeys.map(key => {
                            const currentTranslation = translationsData[selectedLanguage]?.[key] || '';
                            const coverage = languages.filter(lang => 
                                translationsData[lang.code]?.[key]
                            ).length;
                            const coveragePercent = Math.round((coverage / languages.length) * 100);
                            
                            return (
                                <tr key={key}>
                                    <td>
                                        <code className="admin-translation-key">{key}</code>
                                    </td>
                                    <td className="admin-translation-value">
                                        {currentTranslation || (
                                            <span className="admin-missing-translation">
                                                {t('no_translation')}
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="admin-coverage">
                                            <div 
                                                className="admin-coverage-bar"
                                                style={{width: `${coveragePercent}%`}}
                                            ></div>
                                            <span className="admin-coverage-text">
                                                {coverage}/{languages.length}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="admin-actions">
                                            <button
                                                className="admin-btn admin-btn-sm admin-btn-secondary"
                                                onClick={() => openModal(key)}
                                                title={t('edit_translation')}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                className="admin-btn admin-btn-sm admin-btn-danger"
                                                onClick={() => handleDelete(key)}
                                                title={t('delete_translation')}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {filteredKeys.length === 0 && (
                    <div className="admin-empty-state">
                        <i className="fas fa-globe"></i>
                        <p>{t('no_translations_found')}</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="admin-modal-overlay" onClick={closeModal}>
                    <div className="admin-modal admin-modal-large" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>{editingKey ? t('edit_translation') : t('add_translation')}</h2>
                            <button className="admin-modal-close" onClick={closeModal}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="admin-form-group">
                                <label>{t('translation_key')}</label>
                                <input
                                    type="text"
                                    value={formData.key}
                                    onChange={(e) => setFormData({...formData, key: e.target.value})}
                                    placeholder="translation_key"
                                    required
                                    disabled={editingKey}
                                />
                                <small>{t('translation_key_help')}</small>
                            </div>

                            <div className="admin-translations-grid">
                                {languages.map(lang => (
                                    <div key={lang.code} className="admin-form-group">
                                        <label>
                                            {lang.flag} {lang.name} ({lang.code})
                                        </label>
                                        <textarea
                                            value={formData.translations[lang.code] || ''}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                translations: {
                                                    ...formData.translations,
                                                    [lang.code]: e.target.value
                                                }
                                            })}
                                            placeholder={`${t('translation_for')} ${lang.name}`}
                                            rows="3"
                                        />
                                    </div>
                                ))}
                            </div>
                            
                            <div className="admin-form-actions">
                                <button type="button" className="admin-btn admin-btn-secondary" onClick={closeModal}>
                                    {t('cancel')}
                                </button>
                                <button type="submit" className="admin-btn admin-btn-primary">
                                    {editingKey ? t('update') : t('add')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TranslationsManagement;
