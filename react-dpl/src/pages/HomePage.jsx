import React from 'react';

const HomePage = () => {
    const dummyCategories = [
        { id: 1, name: 'Elektronika', icon: 'fa-laptop' },
        { id: 2, name: 'Kiyimlar', icon: 'fa-tshirt' },
        { id: 3, name: 'Uy jihozlari', icon: 'fa-couch' },
        { id: 4, name: 'Kitoblar', icon: 'fa-book' },
        { id: 5, name: 'Sport', icon: 'fa-dumbbell' },
    ];

    const dummyProducts = [
        { id: 1, name: 'Smartfon X1', price: '3,500,000 UZS', originalPrice: '4,000,000 UZS', image: 'https://via.placeholder.com/150/FF5733/FFFFFF?text=Smartfon' },
        { id: 2, name: 'Noutbuk Pro', price: '8,000,000 UZS', originalPrice: '9,500,000 UZS', image: 'https://via.placeholder.com/150/33FF57/FFFFFF?text=Noutbuk' },
        { id: 3, name: 'Aqlli soat', price: '1,200,000 UZS', originalPrice: null, image: 'https://via.placeholder.com/150/3357FF/FFFFFF?text=Soat' },
        { id: 4, name: 'Simsiz quloqchin', price: '750,000 UZS', originalPrice: '900,000 UZS', image: 'https://via.placeholder.com/150/Ff33A1/FFFFFF?text=Quloqchin' },
    ];

    return (
        <div className="page active" id="homePage">
            <h2 style={{ marginBottom: '1rem' }}>Kategoriyalar</h2>
            <div className="category-grid" id="categoriesGrid">
                {dummyCategories.map(category => (
                    <div className="category-card" key={category.id}>
                        <i className={`fas ${category.icon} category-icon`}></i> 
                        <span>{category.name}</span>
                    </div>
                ))}
            </div>
            <h2 style={{ marginBottom: '1rem' }}>Tavsiya etilgan mahsulotlar</h2>
            <div className="product-grid" id="featuredProducts">
                {dummyProducts.map(product => (
                    <div className="product-card" key={product.id}>
                        <div className="product-image">
                            <img src={product.image} alt={product.name} />
                        </div>
                        <div className="product-info">
                            <div className="product-title">{product.name}</div>
                            <div className="product-price">
                                <span className="current-price">{product.price}</span>
                                {product.originalPrice && <span className="original-price">{product.originalPrice}</span>}
                            </div>
                            <button className="btn btn-primary btn-sm">Savatga qo'shish</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
