import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { filterOptions } from '../data/filters';
import { allProducts } from '../data/products';

const ProductFilterContext = createContext();

export const ProductFilterProvider = ({ children }) => {
    const [filters, setFilters] = useState({
        category: 'all',
        brand: [],
        priceRange: { min: 0, max: Infinity },
        rating: 0,
        inStock: false,
        onSale: false,
        sortBy: 'default',
        searchQuery: ''
    });

    const [filteredProducts, setFilteredProducts] = useState(allProducts);
    const [isLoading, setIsLoading] = useState(false);

    // Mahsulotlarni filtrlash funksiyasi
    const applyFilters = useCallback(() => {
        setIsLoading(true);
        
        setTimeout(() => {
            let filtered = [...allProducts];

            // Kategoriya bo'yicha filtrlash
            if (filters.category !== 'all') {
                filtered = filtered.filter(product => 
                    product.category === filters.category
                );
            }

            // Brand bo'yicha filtrlash
            if (filters.brand.length > 0) {
                filtered = filtered.filter(product => 
                    filters.brand.includes(product.brand)
                );
            }

            // Narx oralig'i bo'yicha filtrlash
            filtered = filtered.filter(product => 
                product.price >= filters.priceRange.min && 
                product.price <= filters.priceRange.max
            );

            // Reyting bo'yicha filtrlash
            if (filters.rating > 0) {
                filtered = filtered.filter(product => 
                    (product.rating || 0) >= filters.rating
                );
            }

            // Mavjudlik bo'yicha filtrlash
            if (filters.inStock) {
                filtered = filtered.filter(product => product.inStock !== false);
            }

            // Chegirma bo'yicha filtrlash
            if (filters.onSale) {
                filtered = filtered.filter(product => 
                    product.originalPrice && product.originalPrice > product.price
                );
            }

            // Qidiruv so'zi bo'yicha filtrlash
            if (filters.searchQuery.trim()) {
                const query = filters.searchQuery.toLowerCase();
                filtered = filtered.filter(product =>
                    product.name.toLowerCase().includes(query) ||
                    (product.description && product.description.toLowerCase().includes(query)) ||
                    (product.brand && product.brand.toLowerCase().includes(query))
                );
            }

            // Saralash
            switch (filters.sortBy) {
                case 'price_asc':
                    filtered.sort((a, b) => a.price - b.price);
                    break;
                case 'price_desc':
                    filtered.sort((a, b) => b.price - a.price);
                    break;
                case 'name_asc':
                    filtered.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'name_desc':
                    filtered.sort((a, b) => b.name.localeCompare(a.name));
                    break;
                case 'rating':
                    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                    break;
                case 'newest':
                    filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                    break;
                default:
                    // Default saralash - hech qanday o'zgarish yo'q
                    break;
            }

            setFilteredProducts(filtered);
            setIsLoading(false);
        }, 300); // Debounce effect uchun
    }, [filters]);

    // Filtrlar o'zgarganda mahsulotlarni qayta filtrlash
    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    // Filterni yangilash funksiyalari
    const updateFilter = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const updateFilters = (newFilters) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters
        }));
    };

    const resetFilters = () => {
        setFilters({
            category: 'all',
            brand: [],
            priceRange: { min: 0, max: Infinity },
            rating: 0,
            inStock: false,
            onSale: false,
            sortBy: 'default',
            searchQuery: ''
        });
    };

    // Brand filterni toggle qilish
    const toggleBrand = (brandId) => {
        setFilters(prev => ({
            ...prev,
            brand: prev.brand.includes(brandId)
                ? prev.brand.filter(id => id !== brandId)
                : [...prev.brand, brandId]
        }));
    };

    // Narx oralig'ini o'rnatish
    const setPriceRange = (min, max) => {
        setFilters(prev => ({
            ...prev,
            priceRange: { min, max }
        }));
    };

    // Qidiruv so'zini o'rnatish
    const setSearchQuery = (query) => {
        setFilters(prev => ({
            ...prev,
            searchQuery: query
        }));
    };

    // Kategoriya bo'yicha mahsulotlarni olish
    const getProductsByCategory = (categoryId) => {
        if (categoryId === 'all') return allProducts;
        return allProducts.filter(product => product.category === categoryId);
    };

    // Statistika olish
    const getFilterStats = () => {
        return {
            totalProducts: allProducts.length,
            filteredProducts: filteredProducts.length,
            categories: filterOptions.categories.map(cat => ({
                ...cat,
                count: cat.id === 'all' 
                    ? allProducts.length 
                    : allProducts.filter(p => p.category === cat.id).length
            })),
            brands: filterOptions.brands.map(brand => ({
                ...brand,
                count: allProducts.filter(p => p.brand === brand.id).length
            }))
        };
    };

    const contextValue = {
        filters,
        filteredProducts,
        isLoading,
        filterOptions,
        updateFilter,
        updateFilters,
        resetFilters,
        toggleBrand,
        setPriceRange,
        setSearchQuery,
        getProductsByCategory,
        getFilterStats
    };

    return (
        <ProductFilterContext.Provider value={contextValue}>
            {children}
        </ProductFilterContext.Provider>
    );
};

export const useProductFilter = () => {
    const context = useContext(ProductFilterContext);
    if (!context) {
        throw new Error('useProductFilter must be used within a ProductFilterProvider');
    }
    return context;
};
