import React, { createContext, useState, useContext, useEffect } from 'react';
import i18n from '../i18n';
import { reloadTranslations } from '../i18n';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // API dan tillarni olish
    const fetchLanguages = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch('/api/v1/languages');
            const result = await response.json();
            
            if (result.success && result.data) {
                // Faqat faol tillarni filter qilamiz va sort_order bo'yicha tartiblaymiz
                const activeLanguages = result.data
                    .filter(lang => lang.is_active)
                    .sort((a, b) => a.sort_order - b.sort_order);
                
                setLanguages(activeLanguages);
                
                // Agar default til mavjud bo'lsa va hozirgi til o'rnatilmagan bo'lsa
                const defaultLang = activeLanguages.find(lang => lang.is_default);
                if (defaultLang && !i18n.resolvedLanguage) {
                    i18n.changeLanguage(defaultLang.code);
                }
            } else {
                throw new Error('API dan noto\'g\'ri javob keldi');
            }
        } catch (error) {
            console.error('Tillarni olishda xatolik:', error);
            setError(error.message);
            
            // Fallback: default tillar
            const fallbackLanguages = [
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
                },
                {
                    id: 3,
                    name: "English",
                    code: "en",
                    flag: "🇺🇸",
                    is_active: true,
                    is_default: false,
                    sort_order: 3
                }
            ];
            setLanguages(fallbackLanguages);
        } finally {
            setLoading(false);
        }
    };

    // Tilni o'zgartirish
    const changeLanguage = async (languageCode) => {
        try {
            // API dan yangi tilning tarjimalarini yuklash
            await reloadTranslations(languageCode);
            
            // i18next tilini o'zgartirish
            i18n.changeLanguage(languageCode);
            
            // LocalStorage ga saqlash
            localStorage.setItem('selectedLanguage', languageCode);
        } catch (error) {
            console.error('Tilni o\'zgartirishda xatolik:', error);
            // Xatolik bo'lsa ham tillni o'zgartirish
            i18n.changeLanguage(languageCode);
            localStorage.setItem('selectedLanguage', languageCode);
        }
    };

    // Joriy tilni olish
    const getCurrentLanguage = () => {
        return languages.find(lang => lang.code === i18n.resolvedLanguage) || languages[0];
    };

    // Component yuklanganda tillarni olish
    useEffect(() => {
        fetchLanguages();
    }, []);

    // Saqlangan tilni tiklash
    useEffect(() => {
        const savedLanguage = localStorage.getItem('selectedLanguage');
        if (savedLanguage && languages.length > 0) {
            const langExists = languages.find(lang => lang.code === savedLanguage);
            if (langExists) {
                i18n.changeLanguage(savedLanguage);
            }
        }
    }, [languages, i18n]);

    const value = {
        languages,
        loading,
        error,
        currentLanguage: getCurrentLanguage(),
        changeLanguage,
        fetchLanguages
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage hook faqat LanguageProvider ichida ishlatilishi kerak');
    }
    return context;
};
