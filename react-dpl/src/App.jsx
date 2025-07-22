import React from 'react';

import { Routes, Route, Link, NavLink } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';

function App() {

    return (
        <div className="app-container" id="app">
            <header className="header">
                <div className="header-content">
                    <h1 className="logo"><i className="fas fa-shopping-cart"></i> Dom Product 🛍️</h1>
                    <div className="search-container">
                        <i className="fas fa-search search-icon"></i>
                        <input type="text" className="search-input" placeholder="Mahsulotlarni qidiring..." id="searchInput" />
                    </div>
                    <div className="header-actions">
                        <button className="icon-btn">
                            <i className="fas fa-user"></i>
                        </button>
                        <button className="icon-btn">
                            <i className="fas fa-shopping-cart"></i>
                            <span className="badge" id="cartBadge">0</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="main-content">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>
            </main>

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

            {/* Modals will be handled by a different mechanism in React */}
        </div>
    );
}

export default App;
