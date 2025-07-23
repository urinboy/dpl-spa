import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { allProducts } from '../data/products';
import { useToast } from '../components/Toast';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import Meta from '../components/Meta';

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { addToCart } = useCart();
    const { toggleWishlist, isItemInWishlist } = useWishlist(); // toggleWishlist va isItemInWishlist ishlatiladi

    const product = allProducts.find(p => p.id === parseInt(id));
    const isLiked = product && isItemInWishlist(product.id); // isItemInWishlist ishlatiladi

    const handleGoBack = () => {
        if (window.history.length > 2) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        showToast('Havola nusxalandi', 'info');
    };

    const handleLike = () => {
        if (!product) return;
        toggleWishlist(product); // toggleWishlist chaqiriladi
    };

    if (!product) {
        return (
            <div className="product-detail-container">
                <Meta title="Mahsulot topilmadi" />
                <div className="error">Mahsulot topilmadi</div>
            </div>
        );
    }

    return (
        <div className="product-detail-page">
            <Meta 
                title={`${product.name} - Dom Product`}
                description={product.description}
            />
            <header className="detail-header">
                <button onClick={handleGoBack} className="header-btn">
                    <i className="fas fa-arrow-left"></i>
                </button>
                <div className="header-actions">
                    <button onClick={handleShare} className="header-btn">
                        <i className="fas fa-share-alt"></i>
                    </button>
                    <button onClick={handleLike} className={`header-btn ${isLiked ? 'liked' : ''}`}>
                        <i className={isLiked ? "fas fa-heart" : "far fa-heart"}></i>
                    </button>
                </div>
            </header>

            <main className="detail-content">
                <div className="product-image-gallery">
                    <img src={product.image} alt={product.name} className="main-product-image" />
                </div>
                <div className="product-info-section">
                    <h1 className="product-detail-title">{product.name}</h1>
                    <div className="product-detail-price">
                        <span className="current-price">{product.price.toLocaleString('uz-UZ')} UZS</span>
                        {product.originalPrice && (
                            <span className="original-price">{product.originalPrice.toLocaleString('uz-UZ')} UZS</span>
                        )}
                    </div>
                    <div className="product-description">
                        <h3 className="description-title">Mahsulot haqida</h3>
                        <p>{product.description}</p>
                    </div>
                </div>
            </main>

            <footer className="detail-footer">
                <button className="btn btn-primary btn-block add-to-cart-btn" onClick={() => addToCart(product)}>
                    <i className="fas fa-shopping-cart"></i> Savatga qo'shish
                </button>
            </footer>
        </div>
    );
};

export default ProductDetailPage;