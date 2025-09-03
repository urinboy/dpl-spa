import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './i18n'; // Import i18n configuration

// Global CSS stillarini import qilish
import './assets/css/variables.css';
import './assets/css/base.css';
import './assets/css/components.css';
import './assets/css/pages.css';
import './assets/css/responsive.css';
import './assets/css/slider.css'; // Import slider styles
import './assets/css/products-enhanced.css'; // Import enhanced products styles

import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import { LoadingProvider } from './components/Loading';
import { ModalProvider } from './contexts/ModalContext';
import { AuthProvider } from './contexts/AuthContext'; // Import AuthProvider
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext'; // Import WishlistProvider
import { LanguageProvider } from './contexts/LanguageContext'; // Import LanguageProvider
import { ProductFilterProvider } from './contexts/ProductFilterContext'; // Import ProductFilterProvider  
import { LocationProvider } from './contexts/LocationContext'; // Import LocationProvider
import ScrollToTop from './components/ScrollToTop';

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <LanguageProvider>
            <LocationProvider>
                <AuthProvider>
                    <ToastProvider>
                        <CartProvider>
                            <WishlistProvider>
                                <ProductFilterProvider>
                                    <LoadingProvider>
                                        <ModalProvider>
                                            <ScrollToTop />
                                            <App />
                                        </ModalProvider>
                                    </LoadingProvider>
                                </ProductFilterProvider>
                            </WishlistProvider>
                        </CartProvider>
                    </ToastProvider>
                </AuthProvider>
            </LocationProvider>
        </LanguageProvider>
    </BrowserRouter>
);
