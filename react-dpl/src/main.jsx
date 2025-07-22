import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Global CSS stillarini import qilish
import './assets/css/variables.css';
import './assets/css/base.css';
import './assets/css/components.css';
import './assets/css/pages.css';
import './assets/css/responsive.css';

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ToastProvider } from './components/Toast';
import { LoadingProvider } from './components/Loading';

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <ToastProvider>
            <LoadingProvider>
                <AuthProvider>
                    <CartProvider>
                        <App />
                    </CartProvider>
                </AuthProvider>
            </LoadingProvider>
        </ToastProvider>
    </BrowserRouter>
);
