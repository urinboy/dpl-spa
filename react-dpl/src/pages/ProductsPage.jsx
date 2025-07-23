import React from 'react';

const ProductsPage = () => {
    const allProducts = [
        { id: 1, name: 'Smartfon X1', price: '3,500,000 UZS', originalPrice: '4,000,000 UZS', image: 'https://images.unsplash.com/photo-1585060544211-eb16e3870e32?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        { id: 2, name: 'Noutbuk Pro', price: '8,000,000 UZS', originalPrice: '9,500,000 UZS', image: 'https://images.unsplash.com/photo-1517336714730-49689c8160ce?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        { id: 3, name: 'Aqlli soat', price: '1,200,000 UZS', originalPrice: null, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        { id: 4, name: 'Simsiz quloqchin', price: '750,000 UZS', originalPrice: '900,000 UZS', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06f2e0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        { id: 5, name: 'O\'yin konsoli', price: '5,000,000 UZS', originalPrice: null, image: 'https://images.unsplash.com/photo-1606144042611-1afb1f504501?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        { id: 6, name: 'Televizor 4K', price: '6,000,000 UZS', originalPrice: '7,000,000 UZS', image: 'https://images.unsplash.com/photo-1593784991095-a205069470ea?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        { id: 7, name: 'Smartfon A2', price: '2,800,000 UZS', originalPrice: '3,200,000 UZS', image: 'https://images.unsplash.com/photo-1567581909165-fddf03539375?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        { id: 8, name: 'Planshet Mini', price: '2,000,000 UZS', originalPrice: null, image: 'https://images.unsplash.com/photo-1561154464-82e9adf327d4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    ];

    return (
        <div className="page" id="productsPage">
            <h2 style={{ marginBottom: '1rem' }}>Mahsulotlar</h2>
            <div className="product-grid" id="productsGrid">
                {allProducts.map(product => (
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

export default ProductsPage;