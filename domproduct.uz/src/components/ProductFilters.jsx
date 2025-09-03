import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useProductFilter } from '../contexts/ProductFilterContext';

const ProductFilters = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const {
        filters,
        filterOptions,
        updateFilter,
        toggleBrand,
        setPriceRange,
        resetFilters,
        getFilterStats
    } = useProductFilter();

    const [tempPriceRange, setTempPriceRange] = useState({
        min: filters.priceRange.min,
        max: filters.priceRange.max === Infinity ? 1000000 : filters.priceRange.max
    });

    const filterRef = useRef(null);
    const stats = getFilterStats();

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handlePriceApply = () => {
        setPriceRange(tempPriceRange.min, tempPriceRange.max);
    };

    const handleResetFilters = () => {
        resetFilters();
        setTempPriceRange({ min: 0, max: 1000000 });
    };

    if (!isOpen) return null;

    return (
        <div className="filter-overlay">
            <div ref={filterRef} className="filter-panel">
                <div className="filter-header">
                    <h3>{t('filters')}</h3>
                    <button className="filter-close" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="filter-content">
                    {/* Kategoriyalar */}
                    <div className="filter-section">
                        <h4>{t('categories')}</h4>
                        <div className="filter-options">
                            {filterOptions.categories.map(category => (
                                <label key={category.id} className="filter-option">
                                    <input
                                        type="radio"
                                        name="category"
                                        value={category.id}
                                        checked={filters.category === category.id}
                                        onChange={(e) => updateFilter('category', e.target.value)}
                                    />
                                    <span className="filter-label">
                                        <span className="category-icon">{category.icon}</span>
                                        {t(category.name)}
                                        <span className="filter-count">({stats.categories.find(c => c.id === category.id)?.count || 0})</span>
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Brandlar */}
                    <div className="filter-section">
                        <h4>{t('brands')}</h4>
                        <div className="filter-options">
                            {filterOptions.brands.map(brand => (
                                <label key={brand.id} className="filter-option">
                                    <input
                                        type="checkbox"
                                        checked={filters.brand.includes(brand.id)}
                                        onChange={() => toggleBrand(brand.id)}
                                    />
                                    <span className="filter-label">
                                        {brand.name}
                                        <span className="filter-count">({stats.brands.find(b => b.id === brand.id)?.count || 0})</span>
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Narx oralig'i */}
                    <div className="filter-section">
                        <h4>{t('price_range')}</h4>
                        <div className="price-range-section">
                            <div className="price-inputs">
                                <div className="price-input-group">
                                    <label>{t('min_price')}</label>
                                    <input
                                        type="number"
                                        value={tempPriceRange.min}
                                        onChange={(e) => setTempPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                                        placeholder="0"
                                    />
                                </div>
                                <div className="price-input-group">
                                    <label>{t('max_price')}</label>
                                    <input
                                        type="number"
                                        value={tempPriceRange.max}
                                        onChange={(e) => setTempPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                                        placeholder="1000000"
                                    />
                                </div>
                            </div>
                            <button className="btn btn-sm btn-primary" onClick={handlePriceApply}>
                                {t('apply')}
                            </button>
                        </div>

                        {/* Tezkor narx tanlovlari */}
                        <div className="quick-price-options">
                            {filterOptions.priceRanges.slice(1).map(range => (
                                <button
                                    key={range.id}
                                    className={`quick-price-btn ${
                                        filters.priceRange.min === range.min && 
                                        filters.priceRange.max === range.max ? 'active' : ''
                                    }`}
                                    onClick={() => setPriceRange(range.min, range.max)}
                                >
                                    {t(range.name)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Reyting */}
                    <div className="filter-section">
                        <h4>{t('rating')}</h4>
                        <div className="rating-options">
                            {filterOptions.ratings.map(rating => (
                                <label key={rating.id} className="filter-option rating-option">
                                    <input
                                        type="radio"
                                        name="rating"
                                        value={rating.value}
                                        checked={filters.rating === rating.value}
                                        onChange={(e) => updateFilter('rating', Number(e.target.value))}
                                    />
                                    <span className="filter-label">
                                        <div className="stars">
                                            {[...Array(5)].map((_, i) => (
                                                <span
                                                    key={i}
                                                    className={`star ${i < rating.value ? 'filled' : ''}`}
                                                >
                                                    ⭐
                                                </span>
                                            ))}
                                        </div>
                                        {rating.value > 0 && <span>{t('and_up')}</span>}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Qo'shimcha filterlar */}
                    <div className="filter-section">
                        <h4>{t('additional_filters')}</h4>
                        <div className="filter-options">
                            <label className="filter-option">
                                <input
                                    type="checkbox"
                                    checked={filters.inStock}
                                    onChange={(e) => updateFilter('inStock', e.target.checked)}
                                />
                                <span className="filter-label">{t('in_stock_only')}</span>
                            </label>
                            <label className="filter-option">
                                <input
                                    type="checkbox"
                                    checked={filters.onSale}
                                    onChange={(e) => updateFilter('onSale', e.target.checked)}
                                />
                                <span className="filter-label">{t('on_sale_only')}</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="filter-footer">
                    <button className="btn btn-secondary" onClick={handleResetFilters}>
                        {t('reset_filters')}
                    </button>
                    <button className="btn btn-primary" onClick={onClose}>
                        {t('apply_filters')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductFilters;
