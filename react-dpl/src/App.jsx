import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';

function App() {
    return (
        <div className="app-container" id="app">
            {/* Header Component */}
            <header className="header">
                <div className="header-content">
                    <h1 className="logo"><i className="fas fa-shopping-cart"></i> Dom Product 🛍️</h1>
                    <div className="search-container">
                        <i className="fas fa-search search-icon"></i>
                        <input type="text" className="search-input" placeholder="Mahsulotlarni qidiring..." id="searchInput" />
                    </div>
                    <div className="header-actions">
                        <button className="icon-btn" /* onClick={showProfile} */>
                            <i className="fas fa-user"></i>
                        </button>
                        <button className="icon-btn" /* onClick={showCart} */>
                            <i className="fas fa-shopping-cart"></i>
                            <span className="badge" id="cartBadge">0</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>
            </main>

            {/* Bottom Navigation */}
            <nav className="bottom-nav">
                <NavLink to="/" className="nav-item">
                    <i className="fas fa-home nav-icon"></i>
                </NavLink>
                <NavLink to="/products" className="nav-item">
                    <i className="fas fa-cubes nav-icon"></i>
                </NavLink>
                <NavLink to="/cart" className="nav-item">
                    <i className="fas fa-shopping-cart nav-icon"></i>
                </NavLink>
                <NavLink to="/orders" className="nav-item">
                    <i className="fas fa-clipboard-list nav-icon"></i>
                </NavLink>
                <NavLink to="/profile" className="nav-item">
                    <i className="fas fa-user nav-icon"></i>
                </NavLink>
            </nav>

            {/* Modals */}
            <LoginModal />
            <RegisterModal />
        </div>
    );
}

export default App;