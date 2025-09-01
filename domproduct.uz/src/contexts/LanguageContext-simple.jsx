import React, { createContext, useState, useContext, useEffect } from 'react';
import i18n from '../i18n';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Static tillar ro'yxati (API o'rniga)
    const [languages] = useState([
        {
            id: 1,
            name: "O'zbek",
            code: "uz",
            flag: "🇺🇿",
            is_active: true,
            is_default: true,
            sort_order: 1
        },
        {
            id: 2,
            name: "Русский",
            code: "ru",
            flag: "🇷🇺",
            is_active: true,
            is_default: false,
            sort_order: 2
        }
    ]);

    const [currentLanguage, setCurrentLanguage] = useState(
        localStorage.getItem('selectedLanguage') || 'uz'
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Tilni o'zgartirish
    const changeLanguage = async (languageCode) => {
        try {
            setLoading(true);
            setError(null);

            // i18n tilni o'zgartirish
            await i18n.changeLanguage(languageCode);
            
            // Local storage ga saqlash
            localStorage.setItem('selectedLanguage', languageCode);
            setCurrentLanguage(languageCode);
            
            // Document title ni yangilash
            document.documentElement.lang = languageCode;

        } catch (error) {
            console.error('Tilni o\'zgartirishda xatolik:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Component yuklanganda tilni sozlash
    useEffect(() => {
        const initLanguage = async () => {
            try {
                const savedLanguage = localStorage.getItem('selectedLanguage') || 'uz';
                await i18n.changeLanguage(savedLanguage);
                setCurrentLanguage(savedLanguage);
                document.documentElement.lang = savedLanguage;
            } catch (error) {
                console.error('Boshlang\'ich tilni sozlashda xatolik:', error);
            }
        };

        initLanguage();
    }, []);

    // Joriy tilning ma'lumotlarini olish
    const getCurrentLanguageData = () => {
        return languages.find(lang => lang.code === currentLanguage) || languages[0];
    };

    // Til nomi olish
    const getLanguageName = (code) => {
        const lang = languages.find(l => l.code === code);
        return lang ? lang.name : code;
    };

    const contextValue = {
        languages,
        currentLanguage,
        loading,
        error,
        changeLanguage,
        getCurrentLanguageData,
        getLanguageName
    };

    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
