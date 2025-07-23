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

import { ToastProvider } from './components/Toast';
import { LoadingProvider } from './components/Loading';

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <ToastProvider>
            <LoadingProvider>
                <App />
            </LoadingProvider>
        </ToastProvider>
    </BrowserRouter>
);
