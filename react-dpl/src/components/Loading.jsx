
import React, { useState, createContext, useContext, useCallback } from 'react';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    const showLoading = useCallback(() => {
        setLoading(true);
    }, []);

    const hideLoading = useCallback(() => {
        setLoading(false);
    }, []);

    const value = { showLoading, hideLoading };

    return (
        <LoadingContext.Provider value={value}>
            {children}
            {loading && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                </div>
            )}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => useContext(LoadingContext);
