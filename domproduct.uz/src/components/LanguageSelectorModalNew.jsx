import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';

function LanguageSelectorModal({ isOpen, onClose }) {
  const { i18n } = useTranslation();
  const { languages, loading, changeLanguage } = useLanguage();

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="onboarding-overlay" onClick={onClose}>
      <div className="onboarding-container" onClick={(e) => e.stopPropagation()}>
        <div className="onboarding-content">
          
          {/* Header */}
          <div className="onboarding-header">
            <h1 className="onboarding-title">Tilni tanlang</h1>
            <p className="onboarding-subtitle">O'zingizga qulay tilni tanlang</p>
          </div>

          {/* Language Selection */}
          <div className="language-selection">
            <div className="language-options">
              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Tillar yuklanmoqda...</p>
                </div>
              ) : languages && languages.length > 0 ? (
                languages.map((language) => (
                  <button
                    key={language.id}
                    className={`language-option ${i18n.resolvedLanguage === language.code ? 'active' : ''}`}
                    onClick={() => handleLanguageChange(language.code)}
                  >
                    <span className="language-flag">{language.flag}</span>
                    <span className="language-name">{language.name}</span>
                    {i18n.resolvedLanguage === language.code && (
                      <i className="fas fa-check language-check"></i>
                    )}
                  </button>
                ))
              ) : (
                <div className="error-state">
                  <p>Tillar topilmadi</p>
                </div>
              )}
            </div>
          </div>

          {/* Close Button */}
          <div className="onboarding-actions">
            <button 
              className="onboarding-btn secondary"
              onClick={onClose}
            >
              Yopish
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default LanguageSelectorModal;
