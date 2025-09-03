import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSelectorStorage = {
  KEY: 'dpl_language_selected',
  
  isCompleted: () => {
    return localStorage.getItem(LanguageSelectorStorage.KEY) === 'true';
  },
  
  setCompleted: () => {
    localStorage.setItem(LanguageSelectorStorage.KEY, 'true');
  },
  
  reset: () => {
    localStorage.removeItem(LanguageSelectorStorage.KEY);
  }
};

const LanguageSelectorModal = () => {
  const { t, i18n } = useTranslation();
  const { changeLanguage, languages, loading } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedLang, setSelectedLang] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Komponent yuklanganda tilni tanlash kerakligini tekshirish
  useEffect(() => {
    const shouldShowLanguageSelector = !LanguageSelectorStorage.isCompleted();
    
    if (shouldShowLanguageSelector && languages.length > 0) {
      // Splash screen tugashi uchun biroz kutish
      setTimeout(() => {
        setIsVisible(true);
        // Default til sifatida joriy tilni belgilash
        const currentLang = i18n.language || 'uz';
        const currentLanguage = languages.find(lang => lang.code === currentLang);
        if (currentLanguage) {
          setSelectedLang(currentLanguage);
        }
      }, 3000); // 3 soniyadan keyin ko'rsatish (splash screen tugaganidan keyin)
    }
  }, [languages, i18n.language]);

  // Tilni tanlash va davom ettirish
  const handleLanguageConfirm = async () => {
    if (!selectedLang || isAnimating) return;
    
    setIsAnimating(true);
    
    try {
      // Tilni o'zgartirish
      await changeLanguage(selectedLang.code);
      
      // Tanlash holatini saqlash
      LanguageSelectorStorage.setCompleted();
      
      // Modal'ni yashirish
      setTimeout(() => {
        setIsVisible(false);
        setIsAnimating(false);
      }, 300);
    } catch (error) {
      console.error('Tilni o\'zgartirishda xatolik:', error);
      setIsAnimating(false);
    }
  };

  if (!isVisible || loading) return null;

  return (
    <div className="language-selector-overlay">
      <div className="language-selector-container">
        
        {/* Header */}
        <div className="language-selector-header">
          <div className="language-selector-icon">
            <i className="fas fa-globe"></i>
          </div>
          <h2 className="language-selector-title">
            {t('select_language')}
          </h2>
          <p className="language-selector-subtitle">
            {t('choose_your_preferred_language')}
          </p>
        </div>

        {/* Language Options */}
        <div className="language-selector-options">
          {languages.filter(lang => lang.is_active).map(lang => (
            <button
              key={lang.code}
              className={`language-selector-option ${
                selectedLang?.code === lang.code ? 'selected' : ''
              }`}
              onClick={() => setSelectedLang(lang)}
            >
              <span className="language-selector-flag">{lang.flag}</span>
              <div className="language-selector-info">
                <span className="language-selector-name">{lang.name}</span>
                <span className="language-selector-native">{lang.native_name || lang.name}</span>
              </div>
              {selectedLang?.code === lang.code && (
                <i className="fas fa-check language-selector-check"></i>
              )}
            </button>
          ))}
        </div>

        {/* Continue Button */}
        <div className="language-selector-actions">
          <button
            className={`language-selector-btn ${
              selectedLang ? 'enabled' : 'disabled'
            }`}
            onClick={handleLanguageConfirm}
            disabled={!selectedLang || isAnimating}
          >
            {isAnimating ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                {t('applying')}
              </>
            ) : (
              <>
                {t('continue')}
                <i className="fas fa-arrow-right"></i>
              </>
            )}
          </button>
        </div>

        {/* Language info */}
        <div className="language-selector-info-text">
          {t('language_can_be_changed_later')}
        </div>
      </div>
    </div>
  );
};

// Export qilish uchun storage'ni ham export qilish
export { LanguageSelectorStorage };
export default LanguageSelectorModal;
