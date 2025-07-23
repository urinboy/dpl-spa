import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { allProducts } from '../data/products';
import ImageSlider from '../components/ImageSlider';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import Meta from '../components/Meta'; // Meta komponentini import qilish

const HomePage = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { toggleWishlist, isItemInWishlist } = useWishlist();

    const groceryCategories = [
        { id: 1, name: 'Sabzavotlar', icon: 'fa-carrot' },
        { id: 2, name: 'Mevalar', icon: 'fa-apple-alt' },
        { id: 3, name: 'Mavsumiy', icon: 'fa-star' },
        { id: 4, name: 'Ko\'katlar', icon: 'fa-leaf' },
        { id: 5, name: 'Poliz ekinlari', icon: 'fa-seedling' },
    ];

    const featuredProducts = allProducts.slice(0, 4);

    const handleCategoryClick = (categoryName) => {
        navigate(`/products?category=${encodeURIComponent(categoryName)}`);
    };

    return (
        <div id="homePage">
            <Meta /> {/* Standart meta-teglarni o'rnatish */}
            <ImageSlider />
            <h2 style={{ marginBottom: '1rem' }}>Kategoriyalar</h2>
            <div className="category-grid" id="categoriesGrid">
                {groceryCategories.map(category => (
                    <div 
                        className="category-card" 
                        key={category.id}
                        onClick={() => handleCategoryClick(category.name)}
                        style={{ cursor: 'pointer' }}
                    >
                        <i className={`fas ${category.icon} category-icon`}></i> 
                        <span>{category.name}</span>
                    </div>
                ))}
            </div>
            <h2 style={{ marginBottom: '1rem' }}>Yangi mahsulotlar</h2>
            <div className="product-grid" id="featuredProducts">
                {featuredProducts.map(product => (
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
        </div>
    );
};

export default HomePage;
