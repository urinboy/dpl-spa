import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getMainCategories, getSubCategories, getCategoryTranslation, getCategoryBySlug } from '../data/categories';
import { getProductsByCategory } from '../data/products';
import { useCart } from '../contexts/CartContext';
import Meta from '../components/Meta';

function CategoryDetailPage() {
  const { categorySlug } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();
  const [category, setCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [parentCategory, setParentCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get quantity of product in cart
  const getProductQuantity = (productId) => {
    if (!cart || !Array.isArray(cart)) return 0;
    const cartItem = cart.find(item => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  // Handle quantity increase
  const handleIncreaseQuantity = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (addToCart) {
      addToCart(product);
    }
  };

  // Handle quantity decrease
  const handleDecreaseQuantity = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    const currentQuantity = getProductQuantity(productId);
    if (currentQuantity > 1 && updateQuantity) {
      updateQuantity(productId, currentQuantity - 1);
    } else if (currentQuantity === 1 && removeFromCart) {
      removeFromCart(productId);
    }
  };

  useEffect(() => {
    const loadCategoryData = () => {
      try {
        // Category ni slug orqali topish
        const foundCategory = getCategoryBySlug(categorySlug);
        
        if (!foundCategory) {
          navigate('/categories');
          return;
        }

        setCategory(foundCategory);

        // Agar bu subcategory bo'lsa, parent kategoriyani topish
        const allMainCategories = getMainCategories();
        let parentCat = null;
        
        allMainCategories.forEach(mainCat => {
          const subCats = getSubCategories(mainCat.id);
          if (subCats.find(sub => sub.id === foundCategory.id)) {
            parentCat = mainCat;
          }
        });

        setParentCategory(parentCat);

        // Subcategories ni olish (agar main category bo'lsa)
        if (!parentCat) {
          const subCats = getSubCategories(foundCategory.id);
          setSubCategories(subCats);
        }

        // Products ni olish
        const categoryProducts = getProductsByCategory(foundCategory.slug);
        setProducts(categoryProducts);

        setLoading(false);
      } catch (error) {
        console.error('Error loading category data:', error);
        setLoading(false);
      }
    };

    loadCategoryData();
  }, [categorySlug, navigate]);

  if (loading) {
    return (
      <div className="category-detail-loading">
        <div className="loading-spinner"></div>
        <p>{t('loading')}</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="category-not-found">
        <h2>{t('category_not_found')}</h2>
        <Link to="/categories" className="back-to-categories-btn">
          {t('back_to_categories')}
        </Link>
      </div>
    );
  }

  const categoryTranslation = getCategoryTranslation(category, t('current_lang'));

  return (
    <div className="category-detail-page">
      <Meta title={categoryTranslation.name} description={categoryTranslation.description} />
      
      {/* Breadcrumb */}
      <div className="category-breadcrumb">
        <div className="breadcrumb-container">
          <Link to="/" className="breadcrumb-item">
            <i className="fas fa-home"></i>
            {t('home')}
          </Link>
          <i className="fas fa-chevron-right breadcrumb-separator"></i>
          <Link to="/categories" className="breadcrumb-item">
            {t('categories')}
          </Link>
          {parentCategory && (
            <>
              <i className="fas fa-chevron-right breadcrumb-separator"></i>
              <Link to={`/category/${parentCategory.slug}`} className="breadcrumb-item">
                {getCategoryTranslation(parentCategory, t('current_lang')).name}
              </Link>
            </>
          )}
          <i className="fas fa-chevron-right breadcrumb-separator"></i>
          <span className="breadcrumb-current">{categoryTranslation.name}</span>
        </div>
      </div>

      {/* Category Header */}
      <div className="category-detail-header">
        <div className="category-hero">
          <div className="category-hero-content">
            <div className="category-hero-icon">
              {category.image ? (
                <img 
                  src={category.image} 
                  alt={categoryTranslation.name}
                  className="category-hero-image"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `<span class="category-hero-emoji">${category.icon}</span>`;
                  }}
                />
              ) : (
                <span className="category-hero-emoji">{category.icon}</span>
              )}
            </div>
            <div className="category-hero-text">
              <h1 className="category-hero-title">{categoryTranslation.name}</h1>
              <p className="category-hero-description">{categoryTranslation.description}</p>
              <div className="category-hero-stats">
                {subCategories.length > 0 && (
                  <span className="stat-badge">
                    <i className="fas fa-folder"></i>
                    {subCategories.length} {t('subcategories')}
                  </span>
                )}
                <span className="stat-badge">
                  <i className="fas fa-box"></i>
                  {products.length} {t('products')}
                </span>
              </div>
            </div>
          </div>
          {parentCategory && (
            <Link to={`/category/${parentCategory.slug}`} className="back-to-parent-btn">
              <i className="fas fa-arrow-left"></i>
              {t('back_to')} {getCategoryTranslation(parentCategory, t('current_lang')).name}
            </Link>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="category-detail-content">
        {/* Subcategories Section */}
        {subCategories.length > 0 && (
          <div className="subcategories-section">
            <div className="section-header">
              <h2 className="section-title">
                <i className="fas fa-list"></i>
                {t('subcategories')}
              </h2>
              <p className="section-subtitle">{t('browse_subcategories_description')}</p>
            </div>
            <div className="subcategories-grid-detailed">
              {subCategories.map(subCategory => {
                const subCategoryTranslation = getCategoryTranslation(subCategory, t('current_lang'));
                const subProducts = getProductsByCategory(subCategory.slug);
                
                return (
                  <Link 
                    key={subCategory.id}
                    to={`/category/${subCategory.slug}`} 
                    className="subcategory-card-detailed"
                  >
                    <div className="subcategory-card-header">
                      <div className="subcategory-icon-detailed">
                        <span className="subcategory-emoji-large">{subCategory.icon}</span>
                      </div>
                      <div className="subcategory-info-detailed">
                        <h3 className="subcategory-title">{subCategoryTranslation.name}</h3>
                        <p className="subcategory-description">{subCategoryTranslation.description}</p>
                        <span className="subcategory-products-count">
                          {subProducts.length} {t('products')}
                        </span>
                      </div>
                    </div>
                    <div className="subcategory-arrow-detailed">
                      <i className="fas fa-arrow-right"></i>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Products Section */}
        {products.length > 0 && (
          <div className="products-section">
            <div className="section-header">
              <h2 className="section-title">
                <i className="fas fa-box"></i>
                {t('products')}
              </h2>
              <p className="section-subtitle">
                {/* {products.length} {t('products_in_category')} "{categoryTranslation.name}" */}
              </p>
            </div>
            <div className="products-grid-detailed">
              {products.slice(0, 12).map(product => {
                const quantity = getProductQuantity(product.id);
                return (
                  <div key={product.id} className="product-card-detailed">
                    <Link 
                      to={`/product/${product.id}`} 
                      className="product-card-link"
                    >
                      <div className="product-image-container">
                        <img 
                          src={product.images?.[0] || '/placeholder-product.jpg'} 
                          alt={product.name}
                          className="product-image"
                          loading="lazy"
                        />
                        {product.discount && (
                          <span className="product-discount-badge">
                            -{product.discount}%
                          </span>
                        )}
                      </div>
                      <div className="product-info">
                        <h3 className="product-name">{product.name}</h3>
                        <div className="product-pricing">
                          {product.discount ? (
                            <>
                              <span className="product-old-price">{product.price.toLocaleString()} {t('sum')}</span>
                              <span className="product-new-price">
                                {(product.price * (1 - product.discount / 100)).toLocaleString()} {t('sum')}
                              </span>
                            </>
                          ) : (
                            <span className="product-price">{product.price.toLocaleString()} {t('sum')}</span>
                          )}
                        </div>
                        {product.rating && (
                          <div className="product-rating-and-controls">
                            <div className="product-rating">
                              <div className="stars">
                                {[...Array(5)].map((_, i) => (
                                  <i 
                                    key={i} 
                                    className={`fas fa-star ${i < Math.floor(product.rating) ? 'filled' : ''}`}
                                  />
                                ))}
                              </div>
                              <span className="rating-text">({product.rating})</span>
                            </div>
                            
                            {/* Quantity Controls */}
                            <div className="product-quantity-controls-inline">
                              {quantity > 0 ? (
                                <div className="quantity-selector">
                                  <button 
                                    className="quantity-btn decrease"
                                    onClick={(e) => handleDecreaseQuantity(e, product.id)}
                                  >
                                    <i className="fas fa-minus"></i>
                                  </button>
                                  <span className="quantity-display">{quantity}</span>
                                  <button 
                                    className="quantity-btn increase"
                                    onClick={(e) => handleIncreaseQuantity(e, product)}
                                  >
                                    <i className="fas fa-plus"></i>
                                  </button>
                                </div>
                              ) : (
                                <button 
                                  className="add-to-cart-btn"
                                  onClick={(e) => handleIncreaseQuantity(e, product)}
                                >
                                  <i className="fas fa-plus"></i>
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
            {products.length > 12 && (
              <div className="view-all-products">
                <Link to={`/products?category=${category.slug}`} className="view-all-products-btn">
                  {t('view_all_products')} ({products.length})
                  <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {products.length === 0 && subCategories.length === 0 && (
          <div className="category-empty-state">
            <div className="empty-state-icon">
              <i className="fas fa-box-open"></i>
            </div>
            <h3 className="empty-state-title">{t('no_products_yet')}</h3>
            <p className="empty-state-description">{t('products_coming_soon')}</p>
            <Link to="/categories" className="back-to-categories-btn">
              {t('browse_other_categories')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryDetailPage;
