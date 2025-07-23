
import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';

const WishlistPage = () => {
    const { wishlistItems, toggleWishlist } = useWishlist();
    const { addToCart } = useCart();

    return (
        <div id="wishlistPage">
            <h2 style={{ marginBottom: '1rem' }}>Sevimlilar</h2>
            {wishlistItems.length === 0 ? (
                <div className="cart-empty">
                    <i className="fas fa-heart-broken cart-empty-icon"></i>
                    <div className="cart-empty-title">Sevimlilar ro'yxati bo'sh</div>
                    <p className="cart-empty-message">Mahsulotlarga ❤️ belgisini bosib, ularni shu yerga qo'shing.</p>
                    <Link to="/products" className="btn btn-primary">Mahsulotlarga o'tish</Link>
                </div>
            ) : (
                <div className="product-grid">
                    {wishlistItems.map(product => (
                        <div key={product.id} className="product-card">
                             <div className="product-image">
                                <img src={product.image} alt={product.name} />
                                <button className="wishlist-btn-remove" onClick={() => toggleWishlist(product)}>
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            <div className="product-info">
                                <div className="product-title">{product.name}</div>
                                <div className="product-price">
                                    <span className="current-price">{product.price.toLocaleString('uz-UZ')} UZS</span>
                                </div>
                                <button className="btn btn-primary btn-sm btn-block" onClick={() => addToCart(product)}>
                                    Savatga qo'shish
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistPage;
