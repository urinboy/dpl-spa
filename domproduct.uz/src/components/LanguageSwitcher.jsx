
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';

function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const { languages, loading, currentLanguage, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Loading holatini ko'rsatish
  if (loading) {
    return (
      <div className="language-switcher">
        <button className="icon-btn language-btn" disabled>
          <span className="language-flag">⏳</span>
        </button>
      </div>
    );
  }

  // Agar tillar yo'q bo'lsa
  if (!languages || languages.length === 0) {
    return (
      <div className="language-switcher">
        <button className="icon-btn language-btn" disabled>
          <span className="language-flag">❌</span>
        </button>
      </div>
    );
  }

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <button className="icon-btn language-btn" onClick={() => setIsOpen(!isOpen)}>
        <span className="language-flag">{currentLanguage?.flag || '🌐'}</span>
      </button>
      {isOpen && (
        <div className="language-dropdown">
          <p className="dropdown-header">{t('language')}</p>
          {languages.map((lang) => (
            <button
              key={lang.id}
              className={`dropdown-item ${i18n.resolvedLanguage === lang.code ? 'active' : ''}`}
              type="button"
              onClick={() => handleLanguageChange(lang.code)}
            >
              <span className="language-flag">{lang.flag}</span>
              <span className="language-name">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
