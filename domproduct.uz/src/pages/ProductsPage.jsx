import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { allProducts } from '../data/products';
import { categories } from '../data/categories'; // Import categories for translation
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useProductFilter } from '../contexts/ProductFilterContext';
import Meta from '../components/Meta';
import ProductFilters from '../components/ProductFilters';
import '../assets/css/filters.css';

const ProductsPage = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const selectedCategorySlug = searchParams.get('category');
    const { addToCart } = useCart();
    const { toggleWishlist, isItemInWishlist } = useWishlist();
    
    // Yangi filter context dan foydalanish
    const { 
        filteredProducts, 
        filters, 
        updateFilter, 
        setSearchQuery,
        isLoading 
    } = useProductFilter();

    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // grid yoki list

    // URL parametrlaridan kategoriyani o'rnatish
    React.useEffect(() => {
        if (selectedCategorySlug && selectedCategorySlug !== filters.category) {
            updateFilter('category', selectedCategorySlug);
        }
    }, [selectedCategorySlug, filters.category, updateFilter]);

    // Qidiruv va saralash
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSortChange = (sortValue) => {
        updateFilter('sortBy', sortValue);
    };

    const getCategoryName = (slug) => {
        const category = categories.find(cat => cat.slug === slug);
        return category ? t(`category_${category.slug}`) : t('all_products');
    };

    return (
        <div id="productsPage">
            <Meta title={getCategoryName(selectedCategorySlug)} />
            <h2 style={{ marginBottom: '1rem' }}>
                {getCategoryName(selectedCategorySlug)}
            </h2>

            {/* Yangi toolbar */}
            <div className="products-toolbar">
                <div className="toolbar-left">
                    <button 
                        className="btn btn-secondary btn-filters"
                        onClick={() => setIsFiltersOpen(true)}
                    >
                        <i className="fas fa-filter"></i>
                        {t('filters')}
                        {(filters.brand.length > 0 || filters.category !== 'all' || filters.rating > 0) && (
                            <span className="filter-badge">{
                                (filters.category !== 'all' ? 1 : 0) + 
                                filters.brand.length + 
                                (filters.rating > 0 ? 1 : 0)
                            }</span>
                        )}
                    </button>
                    
                    <div className="search-container">
                        <i className="fas fa-search search-icon"></i>
                        <input
                            type="text"
                            placeholder={t('search_products_placeholder')}
                            className="search-input"
                            value={filters.searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>

                <div className="toolbar-right">
                    <div className="sort-container">
                        <select
                            className="sort-select"
                            value={filters.sortBy}
                            onChange={(e) => handleSortChange(e.target.value)}
                        >
                            <option value="default">{t('sort_default')}</option>
                            <option value="price_asc">{t('sort_price_low_high')}</option>
                            <option value="price_desc">{t('sort_price_high_low')}</option>
                            <option value="name_asc">{t('sort_name_a_z')}</option>
                            <option value="name_desc">{t('sort_name_z_a')}</option>
                            <option value="rating">{t('sort_rating')}</option>
                            <option value="newest">{t('sort_newest')}</option>
                        </select>
                    </div>
                    
                    <div className="view-toggle">
                        <button 
                            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <i className="fas fa-th"></i>
                        </button>
                        <button 
                            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            <i className="fas fa-list"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mahsulotlar soni */}
            <div className="products-count">
                <span>{filteredProducts.length} {t('products_found')}</span>
                {isLoading && <span className="loading-text">{t('loading')}</span>}
            </div>

            {filteredProducts.length > 0 ? (
                <div className={`products-container ${viewMode}`}>
                    {filteredProducts.map(product => (
                        <div className={`product-card ${viewMode}-view`} key={product.id}>
                            <Link to={`/products/${product.id}`} className="product-image-link">
                                <div className="product-image">
                                    <img src={product.image} alt={product.name} />
                                    {product.originalPrice && product.originalPrice > product.price && (
                                        <div className="discount-badge">
                                            -{Math.round((product.originalPrice - product.price) / product.originalPrice * 100)}%
                                        </div>
                                    )}
                                </div>
                            </Link>
                            <div className="product-info">
                                <div className="product-title">{t(product.name)}</div>
                                {product.rating && (
                                    <div className="product-rating">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={`star ${i < product.rating ? 'filled' : ''}`}>
                                                ⭐
                                            </span>
                                        ))}
                                        <span className="rating-count">({product.reviewCount || 0})</span>
                                    </div>
                                )}
                                <div className="product-price">
                                    <span className="current-price">{product.price.toLocaleString('uz-UZ')} UZS</span>
                                    {product.originalPrice && product.originalPrice > product.price && (
                                        <span className="original-price">{product.originalPrice.toLocaleString('uz-UZ')} UZS</span>
                                    )}
                                </div>
                                <div className="product-card-actions">
                                    <button className="btn btn-primary btn-add-cart" onClick={() => addToCart(product)}>
                                        <i className="fas fa-shopping-cart"></i>
                                        {t('add_to_cart')}
                                    </button>
                                    <button 
                                        className={`btn-wishlist ${isItemInWishlist(product.id) ? 'active' : ''}`}
                                        onClick={() => toggleWishlist(product)}
                                    >
                                        <i className={`${isItemInWishlist(product.id) ? 'fas' : 'far'} fa-heart`}></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon">
                        <i className="fas fa-search"></i>
                    </div>
                    <h3>{t('no_products_found_title')}</h3>
                    <p>{t('no_products_found_message')}</p>
                    <button 
                        className="btn btn-primary"
                        onClick={() => {
                            setSearchQuery('');
                            updateFilter('category', 'all');
                        }}
                    >
                        {t('clear_filters')}
                    </button>
                </div>
            )}

            {/* Filter Modal */}
            <ProductFilters 
                isOpen={isFiltersOpen} 
                onClose={() => setIsFiltersOpen(false)} 
            />
        </div>
    );
};

export default ProductsPage;