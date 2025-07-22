import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('Yuklanmoqda...');

    const showLoading = useCallback((msg = 'Yuklanmoqda...') => {
        setMessage(msg);
        setLoading(true);
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }, []);

    const hideLoading = useCallback(() => {
        setLoading(false);
        document.body.style.overflow = ''; // Restore scrolling
    }, []);

    const value = { showLoading, hideLoading };

    return (
        <LoadingContext.Provider value={value}>
            {children}
            {loading && (
                <div className="loading-overlay">
                    <div className="loading-content">
                        <div className="spinner"></div>
                        <div className="loading-message">{message}</div>
                    </div>
                </div>
            )}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => useContext(LoadingContext);
