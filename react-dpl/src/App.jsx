
import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import WishlistPage from './pages/WishlistPage';
import LoginModalContent from './components/LoginModal';
import { useModal } from './contexts/ModalContext';
import { useLoading } from './components/Loading';
import { useCart } from './contexts/CartContext';
import { useAuth } from './contexts/AuthContext';
import ProductDetailPage from './pages/ProductDetailPage';
import SearchResultsPage from './pages/SearchResultsPage';
import SearchOverlay from './components/SearchOverlay';
import SplashScreen from './components/SplashScreen'; // SplashScreen komponentini import qilish

function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const { openModal } = useModal();
    const { showLoading, hideLoading } = useLoading();
    const { cartItems } = useCart();
    const { isLoggedIn } = useAuth();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isAppLoading, setIsAppLoading] = useState(true); // Boshlang'ich yuklanish holati

    useEffect(() => {
        // Faqat birinchi yuklanishda SplashScreen ko'rsatish
        const timer = setTimeout(() => setIsAppLoading(false), 2000); // 2 soniyadan so'ng yopish
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isAppLoading) {
            showLoading();
            const timer = setTimeout(() => hideLoading(), 300);
            return () => clearTimeout(timer);
        }
    }, [location.pathname, showLoading, hideLoading, isAppLoading]);

    const handleProfileClick = () => {
        if (isLoggedIn) {
            navigate('/profile');
        } else {
            openModal(<LoginModalContent />);
        }
    };

    const handleCartClick = () => {
        navigate('/cart');
    };

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
            {isSearchOpen && <SearchOverlay onClose={() => setIsSearchOpen(false)} onSearch={handleSearch} />}

            {!isDetailPage && (
                <header className="header">
                    <div className="header-content">
                        <h1 className="logo"><i className="fas fa-shopping-cart"></i> Dom Product 🛍️</h1>
                        <div className="search-container desktop-search">
                            <i className="fas fa-search search-icon"></i>
                            <input type="text" className="search-input" placeholder="Mahsulotlarni qidiring..." onKeyDown={(e) => e.key === 'Enter' && handleSearch(e.target.value)} />
                        </div>
                        <div className="header-actions">
                            <button className="icon-btn mobile-search-btn" onClick={() => setIsSearchOpen(true)}>
                                <i className="fas fa-search"></i>
                            </button>
                            <button className="icon-btn" onClick={handleProfileClick}>
                                <i className="fas fa-user"></i>
                            </button>
                            <button className="icon-btn" onClick={handleCartClick}>
                                <i className="fas fa-shopping-cart"></i>
                                {totalCartItems > 0 && <span className="badge" id="cartBadge">{totalCartItems}</span>}
                            </button>
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
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/search" element={<SearchResultsPage />} />
                </Routes>
            </main>

            {!isDetailPage && (
                <nav className="bottom-nav">
                    <NavLink to="/" className="nav-item">
                        <i className="fas fa-home nav-icon"></i>
                    </NavLink>
                    <NavLink to="/products" className="nav-item">
                        <i className="fas fa-cubes nav-icon"></i>
                    </NavLink>
                    <NavLink to="/wishlist" className="nav-item">
                        <i className="fas fa-heart nav-icon"></i>
                    </NavLink>
                    <NavLink to="/cart" className="nav-item">
                        <i className="fas fa-shopping-cart nav-icon"></i>
                    </NavLink>
                    <NavLink to="/profile" className="nav-item">
                        <i className="fas fa-user nav-icon"></i>
                    </NavLink>
                </nav>
            )}
        </div>
    );
}

export default App;
