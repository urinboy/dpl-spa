import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { allProducts } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

const ProductsPage = () => {
    const [searchParams] = useSearchParams();
    const selectedCategory = searchParams.get('category');
    const { addToCart } = useCart();
    const { toggleWishlist, isItemInWishlist } = useWishlist();

    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    const displayedProducts = useMemo(() => {
        let products = selectedCategory
            ? allProducts.filter(p => p.category === selectedCategory)
            : allProducts;

        if (searchTerm) {
            products = products.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (sortOrder) {
            products = [...products].sort((a, b) => {
                switch (sortOrder) {
                    case 'price-asc': return a.price - b.price;
                    case 'price-desc': return b.price - a.price;
                    case 'name-asc': return a.name.localeCompare(b.name);
                    default: return 0;
                }
            });
        }

        return products;
    }, [selectedCategory, searchTerm, sortOrder]);

    return (
        <div id="productsPage">
            <h2 style={{ marginBottom: '1rem' }}>
                {selectedCategory ? `${selectedCategory}` : 'Barcha Mahsulotlar'}
            </h2>

            <div className="filters-container">
                <div className="search-form-group">
                    <i className="fas fa-search"></i>
                    <input
                        type="text"
                        placeholder="Sabzavot, meva va ko'katlarni qidiring..."
                        className="filter-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="search-form-group">
                    <i className="fas fa-sort-amount-down"></i>
                    <select
                        className="filter-select"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="">Saralash</option>
                        <option value="price-asc">Narx: Arzonidan</option>
                        <option value="price-desc">Narx: Qimmatidan</option>
                        <option value="name-asc">Nomi bo'yicha (A-Z)</option>
                    </select>
                </div>
            </div>

            {displayedProducts.length > 0 ? (
                <div className="product-grid" id="productsGrid">
                    {displayedProducts.map(product => (
                        <div className="product-card" key={product.id}>
                            <Link to={`/products/${product.id}`} className="product-image-link">
                                <div className="product-image">
                                    <img src={product.image} alt={product.name} />
                                </div>
                            </Link>
                            <div className="product-info">
                                <div className="product-title">{product.name}</div>
                                <div className="product-price">
                                    <span className="current-price">{product.price.toLocaleString('uz-UZ')} UZS</span>
                                </div>
                                <div className="product-card-actions">
                                    <Link to={`/products/${product.id}`} className="btn btn-secondary btn-sm">Batafsil</Link>
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
            ) : (
                <div className="cart-empty" style={{ padding: '2rem' }}>
                    <i className="fas fa-box-open cart-empty-icon"></i>
                    <div className="cart-empty-title">Mahsulotlar topilmadi</div>
                    <p className="cart-empty-message">
                        Sizning qidiruvingizga mos mahsulotlar mavjud emas.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;