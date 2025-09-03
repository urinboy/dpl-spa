import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelectorModal from './LanguageSelectorModal';

function NewLanguageSwitcher() {
  const { i18n } = useTranslation();
  const { languages, currentLanguage } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="language-switcher">
        <button className="icon-btn language-btn" onClick={handleOpenModal}>
          <span className="language-flag">{currentLanguage?.flag || '🌐'}</span>
        </button>
      </div>
      
      <LanguageSelectorModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </>
  );
}

export default NewLanguageSwitcher;
