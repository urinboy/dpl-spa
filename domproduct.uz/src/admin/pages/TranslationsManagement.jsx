import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

const TranslationsManagement = () => {
    const { t } = useTranslation();
    const { languages, loading: languagesLoading } = useLanguage();
    const [translationsData, setTranslationsData] = useState({});
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingKey, setEditingKey] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('uz');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingKey, setDeletingKey] = useState(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        key: '',
        translations: {}
    });

    // API dan barcha tillarning tarjimalarini yuklash
    const loadTranslations = async () => {
        try {
            setLoading(true);
            const translationsPromises = languages
                .filter(lang => lang.is_active)
                .map(async (lang) => {
                    try {
                        const response = await fetch(`/api/v1/translations/${lang.code}`);
                        const result = await response.json();
                        
                        if (result.success && result.translations) {
                            return {
                                langCode: lang.code,
                                translations: result.translations
                            };
                        }
                        return { langCode: lang.code, translations: {} };
                    } catch (error) {
                        console.error(`${lang.code} tilini yuklashda xatolik:`, error);
                        return { langCode: lang.code, translations: {} };
                    }
                });

            const results = await Promise.all(translationsPromises);
            const newTranslationsData = {};
            
            results.forEach(({ langCode, translations }) => {
                newTranslationsData[langCode] = translations;
            });

            setTranslationsData(newTranslationsData);
        } catch (error) {
            console.error('Tarjimalarni yuklashda xatolik:', error);
        } finally {
            setLoading(false);
        }
    };

    // Barcha tarjima kalitlarini olish
    const allKeys = useMemo(() => {
        const keys = new Set();
        Object.values(translationsData).forEach(langData => {
            Object.keys(langData).forEach(key => keys.add(key));
        });
        return Array.from(keys).sort();
    }, [translationsData]);

    // Qidirish bo'yicha filterlash
    const filteredKeys = allKeys.filter(key =>
        key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (translationsData[selectedLanguage] && 
         translationsData[selectedLanguage][key] && 
         translationsData[selectedLanguage][key].toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Tarjimani saqlash (yaratish yoki yangilash)
    const saveTranslation = async () => {
        try {
            setSaving(true);
            
            // Har bir til uchun tarjimani saqlash
            const savePromises = Object.entries(formData.translations).map(async ([langCode, value]) => {
                if (value.trim()) { // Faqat bo'sh bo'lmagan qiymatlarni saqlash
                    try {
                        const response = await fetch(`https://api.domproduct.uz/v1/translations/${langCode}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                // Admin token qo'shish kerak
                                // 'Authorization': `Bearer ${getAdminToken()}`
                            },
                            body: JSON.stringify({
                                key: formData.key,
                                value: value
                            })
                        });

                        const result = await response.json();
                        
                        if (!result.success) {
                            throw new Error(result.message || `${langCode} uchun saqlashda xatolik`);
                        }
                        
                        return { langCode, success: true };
                    } catch (error) {
                        console.error(`${langCode} uchun saqlashda xatolik:`, error);
                        return { langCode, success: false, error: error.message };
                    }
                }
                return { langCode, success: true }; // Bo'sh qiymatlar uchun
            });

            const results = await Promise.all(savePromises);
            const failedSaves = results.filter(r => !r.success);

            if (failedSaves.length === 0) {
                await loadTranslations(); // Tarjimalarni qayta yuklash
                closeModal();
                alert(editingKey ? t('translation_updated') : t('translation_created'));
            } else {
                alert(t('some_translations_failed') + ': ' + failedSaves.map(f => f.langCode).join(', '));
            }
        } catch (error) {
            console.error('Tarjimani saqlashda xatolik:', error);
            alert(t('error_occurred'));
        } finally {
            setSaving(false);
        }
    };

    // Tarjimani o'chirish
    const deleteTranslation = async (key) => {
        try {
            const deletePromises = languages
                .filter(lang => lang.is_active)
                .map(async (lang) => {
                    try {
                        const response = await fetch(`https://api.domproduct.uz/v1/translations/${lang.code}/${encodeURIComponent(key)}`, {
                            method: 'DELETE',
                            headers: {
                                // Admin token qo'shish kerak
                                // 'Authorization': `Bearer ${getAdminToken()}`
                            }
                        });

                        const result = await response.json();
                        return { langCode: lang.code, success: result.success };
                    } catch (error) {
                        console.error(`${lang.code} dan o'chirishda xatolik:`, error);
                        return { langCode: lang.code, success: false };
                    }
                });

            await Promise.all(deletePromises);
            await loadTranslations(); // Tarjimalarni qayta yuklash
            setShowDeleteModal(false);
            setDeletingKey(null);
            alert(t('translation_deleted'));
        } catch (error) {
            console.error('Tarjimani o\'chirishda xatolik:', error);
            alert(t('error_occurred'));
        }
    };

    const openModal = (key = null) => {
        setEditingKey(key);
        if (key) {
            // Mavjud tarjimani tahrirlash
            const keyTranslations = {};
            languages.forEach(lang => {
                if (lang.is_active) {
                    keyTranslations[lang.code] = translationsData[lang.code]?.[key] || '';
                }
            });
            setFormData({
                key: key,
                translations: keyTranslations
            });
        } else {
            // Yangi tarjima qo'shish
            const emptyTranslations = {};
            languages.forEach(lang => {
                if (lang.is_active) {
                    emptyTranslations[lang.code] = '';
                }
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
        saveTranslation();
    };

    const handleDelete = (key) => {
        setDeletingKey(key);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        deleteTranslation(deletingKey);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setDeletingKey(null);
    };

    // Komponentlar yuklanganda tarjimalarni yuklash
    useEffect(() => {
        if (languages.length > 0) {
            loadTranslations();
        }
    }, [languages]);

    // Tanlangan tilni o'zgartirish
    useEffect(() => {
        if (languages.length > 0 && !languages.find(lang => lang.code === selectedLanguage)) {
            const defaultLang = languages.find(lang => lang.is_default) || languages[0];
            setSelectedLanguage(defaultLang.code);
        }
    }, [languages, selectedLanguage]);

    if (languagesLoading || loading) {
        return (
            <div className="admin-loading">
                <i className="fas fa-spinner fa-spin"></i>
                <p>{t('loading')}</p>
            </div>
        );
    }

    // Coverage statistikasi
    const calculateCoverage = (langCode) => {
        const langTranslations = translationsData[langCode] || {};
        const translatedKeys = Object.keys(langTranslations).filter(key => 
            langTranslations[key] && langTranslations[key].trim()
        );
        return {
            total: allKeys.length,
            translated: translatedKeys.length,
            percentage: allKeys.length > 0 ? Math.round((translatedKeys.length / allKeys.length) * 100) : 0
        };
    };

    return (
        <div className="admin-translations">
            <div className="admin-page-header">
                <div>
                    <h1>{t('translations_management')}</h1>
                    <p>{t('translations_management_subtitle')}</p>
                </div>
                <button 
                    className="admin-btn admin-btn-primary"
                    onClick={() => openModal()}
                >
                    <i className="fas fa-plus"></i>
                    {t('add_translation')}
                </button>
            </div>

            {/* Coverage statistikasi */}
            <div className="admin-coverage-stats">
                {languages.filter(lang => lang.is_active).map(lang => {
                    const coverage = calculateCoverage(lang.code);
                    return (
                        <div key={lang.code} className="admin-coverage-card">
                            <div className="admin-coverage-header">
                                <span className="admin-flag">{lang.flag}</span>
                                <span className="admin-lang-name">{lang.name}</span>
                            </div>
                            <div className="admin-coverage-progress">
                                <div 
                                    className="admin-coverage-bar"
                                    style={{ width: `${coverage.percentage}%` }}
                                ></div>
                            </div>
                            <div className="admin-coverage-text">
                                {coverage.translated}/{coverage.total} ({coverage.percentage}%)
                            </div>
                        </div>
                    );
                })}
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
                
                <div className="admin-language-select">
                    <label>{t('view_language')}:</label>
                    <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                    >
                        {languages.filter(lang => lang.is_active).map(lang => (
                            <option key={lang.code} value={lang.code}>
                                {lang.flag} {lang.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>{t('translation_key')}</th>
                            <th>{t('translation_value')}</th>
                            <th>{t('coverage')}</th>
                            <th>{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredKeys.map(key => {
                            const translatedLanguages = languages.filter(lang => 
                                lang.is_active && 
                                translationsData[lang.code]?.[key] && 
                                translationsData[lang.code][key].trim()
                            );
                            const totalActiveLanguages = languages.filter(lang => lang.is_active).length;
                            const coveragePercentage = totalActiveLanguages > 0 
                                ? Math.round((translatedLanguages.length / totalActiveLanguages) * 100) 
                                : 0;

                            return (
                                <tr key={key}>
                                    <td>
                                        <code className="admin-translation-key">{key}</code>
                                    </td>
                                    <td>
                                        <div className="admin-translation-value">
                                            {translationsData[selectedLanguage]?.[key] || (
                                                <span className="admin-no-translation">{t('no_translation')}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="admin-coverage-indicator">
                                            <span className={`admin-coverage-badge ${coveragePercentage === 100 ? 'complete' : coveragePercentage > 0 ? 'partial' : 'empty'}`}>
                                                {translatedLanguages.length}/{totalActiveLanguages}
                                            </span>
                                            <span className="admin-coverage-percent">({coveragePercentage}%)</span>
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
                        <i className="fas fa-language"></i>
                        <p>{t('no_translations_found')}</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="admin-modal-overlay" onClick={closeModal}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
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
                                    placeholder="welcome_message, menu.home, auth.login"
                                    required
                                    disabled={editingKey}
                                />
                                <small>{t('translation_key_help')}</small>
                            </div>

                            {languages.filter(lang => lang.is_active).map(lang => (
                                <div key={lang.code} className="admin-form-group">
                                    <label>
                                        <span className="admin-flag">{lang.flag}</span>
                                        {t('translation_for')} {lang.name}
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
                                        placeholder={`${lang.name} tilida tarjima...`}
                                        rows="3"
                                    />
                                </div>
                            ))}
                            
                            <div className="admin-form-actions">
                                <button type="button" className="admin-btn admin-btn-secondary" onClick={closeModal}>
                                    <i className="fas fa-times"></i>
                                    {t('cancel')}
                                </button>
                                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                                    {saving ? (
                                        <i className="fas fa-spinner fa-spin"></i>
                                    ) : (
                                        <i className={`fas ${editingKey ? 'fa-save' : 'fa-plus'}`}></i>
                                    )}
                                    {saving ? t('saving') : (editingKey ? t('update') : t('add'))}
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
                title={t('confirm_delete_translation')}
                message={t('delete_translation_message')}
                itemName={deletingKey}
            />
        </div>
    );
};

export default TranslationsManagement;
