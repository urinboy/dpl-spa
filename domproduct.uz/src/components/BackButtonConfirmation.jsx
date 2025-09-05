import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const BackButtonConfirmation = ({ children }) => {
    const { t } = useTranslation();
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [lastBackPress, setLastBackPress] = useState(0);

    useEffect(() => {
        let timeoutId = null;

        const handleBackButton = (event) => {
            // Faqat mobile devicelarda ishlaydi
            if (!/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                return;
            }

            // Agar boshqa sahifada bo'lsa, oddiy back ishlatamiz
            if (window.location.pathname !== '/') {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            const currentTime = new Date().getTime();
            const timeDifference = currentTime - lastBackPress;

            // Agar 2 soniya ichida ikkinchi marta bosilsa
            if (timeDifference < 2000 && timeDifference > 0) {
                // Tizimdan chiqish
                if (window.history.length > 1) {
                    window.history.back();
                } else {
                    // Browser yopish (faqat mobile app ichida ishlaydi)
                    window.close();
                }
                return;
            }

            // Birinchi marta bosilganda warning ko'rsatamiz
            setLastBackPress(currentTime);
            setShowExitConfirm(true);

            // 2 soniyadan keyin warning ni yashiramiz
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            
            timeoutId = setTimeout(() => {
                setShowExitConfirm(false);
                setLastBackPress(0);
            }, 2000);
        };

        // History back event listener qo'shamiz
        window.addEventListener('popstate', handleBackButton);
        
        // Android back button uchun
        document.addEventListener('backbutton', handleBackButton, false);

        return () => {
            window.removeEventListener('popstate', handleBackButton);
            document.removeEventListener('backbutton', handleBackButton, false);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [lastBackPress]);

    return (
        <>
            {children}
            
            {/* Exit Confirmation Toast */}
            {showExitConfirm && (
                <div className="exit-confirmation-toast">
                    <div className="exit-toast-content">
                        <div className="exit-icon">
                            <i className="fas fa-sign-out-alt"></i>
                        </div>
                        <div className="exit-text">
                            <span className="exit-title">{t('confirm_exit', 'Chiqishni tasdiqlang')}</span>
                            <span className="exit-subtitle">{t('press_back_again', 'Yana bir marta orqaga bosing')}</span>
                        </div>
                    </div>
                    <div className="exit-progress-bar">
                        <div className="exit-progress-fill"></div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BackButtonConfirmation;
