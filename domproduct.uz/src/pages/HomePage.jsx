import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { allProducts } from '../data/products';
import { categories } from '../data/categories'; // Import categories
import ImageSlider from '../components/ImageSlider';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import Meta from '../components/Meta';

const HomePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { toggleWishlist, isItemInWishlist } = useWishlist();

    // Show a limited number of categories on the home page
    const featuredCategories = categories.slice(0, 5);
    
    // Featured products
    const featuredProducts = allProducts.slice(0, 4);

    const handleCategoryClick = (categorySlug) => {
        navigate(`/products?category=${categorySlug}`);
    };

    return (
        <div id="homePage">
            <Meta />
            <ImageSlider />
            
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
                <h2>{t('new_products')}</h2>
                <Link to="/products" className="see-all-link">{t('see_all')}</Link>
            </div>
            <div className="product-grid" id="featuredProducts">
                {featuredProducts.map(product => (
                    <div className="product-card" key={product.id}>
                        <Link to={`/products/${product.id}`} className="product-image-link">
                            <div className="product-image">
                                <img 
                                    src={product.image || '/placeholder-image.png'} 
                                    alt={product.name}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = '<i class="fas fa-image" style="font-size: 3rem; color: var(--gray-300);"></i>';
                                    }}
                                />
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
            
            {/* Footer Bottom Section */}
            <div className="footer-bottom">
                <div className="container">
                    <div className="footer_bottom_main">
                        <div className="main-payme">
                            <span>{t('payment_methods')}</span>
                            <div className="top-payme">
                                <a href="#" title="Payme">
                                    <img src="/logos/payme.png" alt="payme" />
                                </a>
                                <a href="#" title="Click">
                                    <img src="/logos/click.png" alt="click" />
                                </a>
                                <a href="#" title="Paynet">
                                    <img src="/logos/paynet.png" alt="paynet" />
                                </a>
                            </div>
                        </div>
                        <div className="creator_by">
                            <span>{t('developed_by')}</span>
                            <a target="_blank" href="https://simplex.uz?ref_src=domproduct.uz" rel="noopener noreferrer" className="dev-link">
                                <img width="104" height="30" src="https://urinboydev.uz/static/media/logo.9f15ba03dac502a26263.png" alt="simplex logo" />
                                <span>UrinboyDev.uz</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
