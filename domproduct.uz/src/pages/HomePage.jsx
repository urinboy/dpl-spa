import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { allProducts } from '../data/products';
import { categories } from '../data/categories'; // Import categories
import ImageSlider from '../components/ImageSlider';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import useHomepageLocation from '../hooks/useHomepageLocation'; // Import location hook
import Meta from '../components/Meta';

const HomePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { toggleWishlist, isItemInWishlist } = useWishlist();
    
    // Location hook dan foydalanish
    const {
        location,
        hasLocation,
        isLocationDetected,
        detectionMethod,
        regionalProducts,
        deliveryInfo,
        isLoadingRegionalData,
        refreshLocation
    } = useHomepageLocation();

    // Show a limited number of categories on the home page
    const featuredCategories = categories.slice(0, 5);
    
    // Regional products bor bo'lsa, ularni ko'rsatish, yo'q bo'lsa default
    const featuredProducts = regionalProducts.length > 0 
        ? regionalProducts.slice(0, 4)
        : allProducts.slice(0, 4);

    const handleCategoryClick = (categorySlug) => {
        navigate(`/products?category=${categorySlug}`);
    };

    return (
        <div id="homePage">
            <Meta />
            <ImageSlider />
            
            {/* Location Info Section */}
            {hasLocation && (
                <div style={{
                    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                    padding: '15px 20px',
                    margin: '20px 0',
                    borderRadius: '12px',
                    border: '1px solid #bae6fd'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '24px' }}>
                                {isLocationDetected ? '📍' : '📌'}
                            </span>
                            <div>
                                <div style={{ fontWeight: '600', color: '#0c4a6e', fontSize: '16px' }}>
                                    {location.city}, {location.region}
                                </div>
                                <div style={{ fontSize: '12px', color: '#0369a1', opacity: 0.8 }}>
                                    {detectionMethod === 'gps' && '📡 GPS orqali aniqlangan'}
                                    {detectionMethod === 'ip' && '🌐 IP orqali aniqlangan'}
                                    {detectionMethod === 'manual' && '👆 Qo\'lda tanlangan'}
                                    {deliveryInfo?.available && ' • 🚚 Yetkazish mavjud'}
                                </div>
                            </div>
                        </div>
                        
                        <button
                            onClick={() => refreshLocation('auto')}
                            style={{
                                background: '#0284c7',
                                color: 'white',
                                border: 'none',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                cursor: 'pointer'
                            }}
                        >
                            🔄 Yangilash
                        </button>
                    </div>
                    
                    {regionalProducts.length > 0 && (
                        <div style={{ 
                            marginTop: '10px', 
                            fontSize: '12px', 
                            color: '#0369a1' 
                        }}>
                            📦 {regionalProducts.length} ta hududiy mahsulot topildi
                        </div>
                    )}
                    
                    {isLoadingRegionalData && (
                        <div style={{ 
                            marginTop: '10px', 
                            fontSize: '12px', 
                            color: '#0369a1' 
                        }}>
                            🔄 Hududiy ma'lumotlar yuklanmoqda...
                        </div>
                    )}
                </div>
            )}
            
            <div className="section-header">
                <h2>{t('categories')}</h2>
                <Link to="/categories" className="see-all-link">{t('see_all')}</Link>
            </div>
            <div className="category-grid" id="categoriesGrid">
                {featuredCategories.map(category => (
                    <div 
                        className="category-card" 
                        key={category.id}
                        onClick={() => handleCategoryClick(category.slug)}
                        style={{ cursor: 'pointer' }}
                    >
                        <i className={`${category.icon} category-icon`}></i> 
                        <span>{t(`category_${category.slug}`)}</span>
                    </div>
                ))}
            </div>
            <div className="section-header">
                <h2>
                    {regionalProducts.length > 0 && hasLocation 
                        ? `📍 ${location.city} hududidagi yangi mahsulotlar`
                        : t('new_products')
                    }
                </h2>
                <Link to="/products" className="see-all-link">{t('see_all')}</Link>
            </div>
            <div className="product-grid" id="featuredProducts">
                {featuredProducts.map(product => (
                    <div className="product-card" key={product.id}>
                        <Link to={`/products/${product.id}`} className="product-image-link">
                            <div className="product-image">
                                <img src={product.image} alt={product.name} />
                            </div>
                        </Link>
                        <div className="product-info">
                            <div className="product-title">{t(product.name)}</div>
                            <div className="product-price">
                                <span className="current-price">{product.price.toLocaleString('uz-UZ')} UZS</span>
                            </div>
                            <div className="product-card-actions">
                                <Link to={`/products/${product.id}`} className="btn btn-primary btn-sm">{t('details')}</Link>
                                <button className="btn-icon" onClick={() => addToCart(product)}>
                                    <i className="fas fa-shopping-cart"></i>
                                </button>
                                <button 
                                    className={`btn-icon ${isItemInWishlist(product.id) ? 'active' : ''}`}
                                    onClick={() => toggleWishlist(product)}
                                >
                                    <i className={`${isItemInWishlist(product.id) ? 'fas' : 'far'} fa-heart`}></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
