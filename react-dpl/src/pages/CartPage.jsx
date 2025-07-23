import React from 'react';

const CartPage = () => {
    const cartItems = [
        { id: 1, name: 'Smartfon X1', price: 3500000, quantity: 1, image: 'https://images.unsplash.com/photo-1585060544211-eb16e3870e32?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        { id: 2, name: 'Aqlli soat', price: 1200000, quantity: 2, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        { id: 3, name: 'Simsiz quloqchin', price: 750000, quantity: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06f2e0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    ];

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 25000 : 0; // Agar savat bo'sh bo'lsa, yetkazib berish narxi 0
    const total = subtotal + shipping;

    return (
        <div className="page" id="cartPage">
            <h2 style={{ marginBottom: '1rem' }}>Savatcha</h2>
            {cartItems.length === 0 ? (
                <div className="cart-empty">
                    <i className="fas fa-shopping-cart cart-empty-icon"></i>
                    <div className="cart-empty-title">Savatchangiz bo'sh</div>
                    <p className="cart-empty-message">Mahsulotlarni qo'shish uchun mahsulotlar sahifasiga o'ting.</p>
                    <button className="btn btn-primary">Mahsulotlarga o'tish</button>
                </div>
            ) : (
                <>
                    <div id="cartItems">
                        {cartItems.map(item => (
                            <div className="cart-item" key={item.id}>
                                <div className="cart-item-image">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="cart-item-info">
                                    <div className="cart-item-title">{item.name}</div>
                                    <div className="cart-item-price">{item.price.toLocaleString('uz-UZ')} UZS</div>
                                    <div className="quantity-controls">
                                        <button className="quantity-btn">-</button>
                                        <span className="quantity-display">{item.quantity}</span>
                                        <button className="quantity-btn">+</button>
                                    </div>
                                </div>
                                <button className="btn btn-danger">O'chirish</button>
                            </div>
                        ))}
                    </div>
                    <div id="cartSummary" className="cart-summary">
                        <div className="cart-summary-row">
                            <span>Jami:</span>
                            <span>{subtotal.toLocaleString('uz-UZ')} UZS</span>
                        </div>
                        <div className="cart-summary-row">
                            <span>Yetkazib berish:</span>
                            <span>{shipping.toLocaleString('uz-UZ')} UZS</span>
                        </div>
                        <div className="cart-summary-row">
                            <span>Umumiy:</span>
                            <span className="cart-total">{total.toLocaleString('uz-UZ')} UZS</span>
                        </div>
                        <button className="btn btn-primary btn-block" style={{ marginTop: '1rem' }}>Buyurtma berish</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;