
import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { useLanguage } from './contexts/LanguageContext'; // Import useLanguage
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import WishlistPage from './pages/WishlistPage';
// import LoginModalContent from './components/LoginModal';
import { useLoading } from './components/Loading';
import { useCart } from './contexts/CartContext';
import { CheckoutProvider } from './contexts/CheckoutContext';
import ProductDetailPage from './pages/ProductDetailPage';
import SearchResultsPage from './pages/SearchResultsPage';
import SearchOverlay from './components/SearchOverlay';
import SplashScreen from './components/SplashScreen';
import LanguageSelectorModal from './components/LanguageSelectorModal'; // Import LanguageSelectorModal
import OnboardingOverlay from './components/OnboardingOverlay'; // Import OnboardingOverlay
import OnboardingDebug from './components/OnboardingDebug'; // Import OnboardingDebug
import LanguageSwitcher from './components/LanguageSwitcher'; // Import LanguageSwitcher
import LocationDisplay from './components/LocationDisplay'; // Import LocationDisplay
// import LocationSuccessNotification from './components/LocationSuccessNotification'; // Import LocationSuccessNotification - DISABLED
import ApiTestPage from './admin/pages/ApiTestPage'
import AdminApp from './admin/AdminApp'; // Import AdminApp
import CategoriesPage from './pages/CategoriesPage'; // Import CategoriesPage

function App() {
    const { t } = useTranslation(); // Initialize translation hook
    const { currentLanguage } = useLanguage(); // Get current language
    const navigate = useNavigate();
    const location = useLocation();
    const { showLoading, hideLoading } = useLoading();
    const { cartItems } = useCart();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isAppLoading, setIsAppLoading] = useState(true);
    const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
    const [userLocation, setUserLocation] = useState(null);

    // Load location from localStorage
    useEffect(() => {
        const loadUserLocation = () => {
            try {
                const savedLocation = localStorage.getItem('dpl_user_location');
                if (savedLocation) {
                    const locationData = JSON.parse(savedLocation);
                    setUserLocation(locationData);
                }
            } catch (error) {
                console.error('Error loading user location:', error);
            }
        };

        loadUserLocation();

        // Listen for location changes from onboarding
        const handleStorageChange = (e) => {
            if (e.key === 'dpl_user_location') {
                loadUserLocation();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Also check for changes every 2 seconds (for same-tab changes)
        const intervalId = setInterval(loadUserLocation, 2000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setIsAppLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isAppLoading) {
            showLoading();
        }
    }, [location.pathname, showLoading, isAppLoading]);

    useEffect(() => {
        if (!isAppLoading) {
            hideLoading();
        }
    }, [location.pathname, hideLoading, isAppLoading]);

    const handleSearch = (query) => {
        setIsSearchOpen(false);
        navigate(`/search?q=${encodeURIComponent(query)}`);
    };

    const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    if (isAppLoading) {
        return <SplashScreen />;
    }

    const isDetailPage = location.pathname.startsWith('/products/') && location.pathname.split('/').length === 3;

    return (
        <div className="app-container" id="app">            
            {/* Onboarding Overlay - Splash dan keyin */}
            <OnboardingOverlay />
            
            <Routes>
                <Route path="/admin/*" element={<AdminApp />} />
                <Route path="/*" element={
                    <>
                        {isSearchOpen && <SearchOverlay onClose={() => setIsSearchOpen(false)} onSearch={handleSearch} />}

                        {!isDetailPage && (
                            <header className="header">
                                <div className="header-content">
                                    <div className="header-left">
                                        <div className="header-logo">
                                            <img src="/logos/white.png" alt="Logo" className="logo-desktop" />
                                            <img src="/pwa-192x192.png" alt="Logo" className="logo-mobile" />
                                        </div>
                                        <div className="location-display">
                                            <div className="location-icon">
                                                <i className="fas fa-map-marker-alt"></i>
                                                <div className="location-dot"></div>
                                            </div>
                                            <div className="location-text">
                                                <span className="location-city">
                                                    {userLocation?.address?.city || 'Tashkent'}
                                                </span>
                                                <span className="location-district">
                                                    {userLocation?.address?.district || 'Shahar markazi'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="search-container desktop-search">
                                        <i className="fas fa-search search-icon"></i>
                                        <input 
                                            type="text" 
                                            className="search-input" 
                                            placeholder="Mahsulotlarni qidirish..." 
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearch(e.target.value)} 
                                        />
                                    </div>
                                    
                                    {/* Header Navigation Menu - Desktop/Tablet only */}
                                    <nav className="header-nav-menu">
                                        <NavLink 
                                            to="/" 
                                            className={({ isActive }) => `header-nav-item ${isActive ? 'active' : ''}`}
                                        >
                                            <i className="fas fa-home header-nav-icon"></i>
                                            <span className="header-nav-text">{t('home')}</span>
                                        </NavLink>
                                        <NavLink 
                                            to="/products" 
                                            className={({ isActive }) => `header-nav-item ${isActive ? 'active' : ''}`}
                                        >
                                            <i className="fas fa-cubes header-nav-icon"></i>
                                            <span className="header-nav-text">{t('products')}</span>
                                        </NavLink>
                                        <NavLink 
                                            to="/wishlist" 
                                            className={({ isActive }) => `header-nav-item ${isActive ? 'active' : ''}`}
                                        >
                                            <i className="fas fa-heart header-nav-icon"></i>
                                            <span className="header-nav-text">{t('wishlist')}</span>
                                        </NavLink>
                                        <NavLink 
                                            to="/cart" 
                                            className={({ isActive }) => `header-nav-item cart-nav-item ${isActive ? 'active' : ''}`}
                                        >
                                            <i className="fas fa-shopping-cart header-nav-icon"></i>
                                            {cartItems.length > 0 && <span className="badge">{cartItems.length}</span>}
                                            <span className="header-nav-text">{t('cart')}</span>
                                        </NavLink>
                                        <NavLink 
                                            to="/profile" 
                                            className={({ isActive }) => `header-nav-item ${isActive ? 'active' : ''}`}
                                        >
                                            <i className="fas fa-user header-nav-icon"></i>
                                            <span className="header-nav-text">{t('profile')}</span>
                                        </NavLink>
                                    </nav>
                                    
                                    <div className="header-actions">
                                        <button className="icon-btn mobile-search-btn" onClick={() => setIsSearchOpen(true)}>
                                            <i className="fas fa-search"></i>
                                        </button>
                                        <div className="language-switcher">
                                            <button className="icon-btn language-btn" onClick={() => setIsLanguageModalOpen(true)}>
                                                <span className="language-flag">
                                                    {currentLanguage?.flag || <i className="fas fa-globe"></i>}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </header>
                        )}

                        <main className={`main-content ${isDetailPage ? 'detail-page-content' : ''}`}>
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/products" element={<ProductsPage />} />
                                <Route path="/products/:id" element={<ProductDetailPage />} />
                                <Route path="/cart" element={<CartPage />} />
                                <Route path="/checkout" element={
                                    <CheckoutProvider>
                                        <CheckoutPage />
                                    </CheckoutProvider>
                                } />
                                <Route path="/orders" element={<OrdersPage />} />
                                <Route path="/wishlist" element={<WishlistPage />} />
                                <Route path="/profile" element={<ProfilePage />} />
                                <Route path="/search" element={<SearchResultsPage />} />
                                <Route path="/categories" element={<CategoriesPage />} />
                                <Route path="/api-test" element={<ApiTestPage />} />
                            </Routes>
                        </main>

                        {!isDetailPage && (
                            <nav className="bottom-nav">
                                <NavLink to="/" className="nav-item">
                                    <i className="fas fa-home nav-icon"></i>
                                    <span className="nav-text">{t('home')}</span>
                                </NavLink>
                                <NavLink to="/products" className="nav-item">
                                    <i className="fas fa-cubes nav-icon"></i>
                                    <span className="nav-text">{t('products')}</span>
                                </NavLink>
                                <NavLink to="/wishlist" className="nav-item">
                                    <i className="fas fa-heart nav-icon"></i>
                                    <span className="nav-text">{t('wishlist')}</span>
                                </NavLink>
                                <NavLink to="/cart" className="nav-item cart-nav-item">
                                    <i className="fas fa-shopping-cart nav-icon"></i>
                                    {totalCartItems > 0 && <span className="badge" id="cartBadge">{totalCartItems}</span>}
                                    <span className="nav-text">{t('cart')}</span>
                                </NavLink>
                                <NavLink to="/profile" className="nav-item">
                                    <i className="fas fa-user nav-icon"></i>
                                    <span className="nav-text">{t('profile')}</span>
                                </NavLink>
                            </nav>
                        )}

                        {/* Location Success Notification - DISABLED */}
                        {/* <LocationSuccessNotification /> */}
                        
                        {/* Onboarding Debug (only in development) */}
                        <OnboardingDebug />
                        
                        {/* Language Selector Modal */}
                        <LanguageSelectorModal 
                            isOpen={isLanguageModalOpen} 
                            onClose={() => setIsLanguageModalOpen(false)} 
                        />
                    </>
                } />
            </Routes>
        </div>
    );
}

export default App;
