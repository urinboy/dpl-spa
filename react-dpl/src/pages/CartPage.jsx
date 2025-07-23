import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useModal } from '../contexts/ModalContext';
import ConfirmModal from '../components/ConfirmModal';

const CartPage = () => {
    const { cartItems, incrementQuantity, decrementQuantity, removeFromCart } = useCart();
    const { openModal, closeModal } = useModal();

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 25000 : 0;
    const total = subtotal + shipping;

    const handleDelete = (productId) => {
        openModal(
            <ConfirmModal 
                message="Rostdan ham mahsulotni savatdan o'chirmoqchimisiz?"
                onConfirm={() => {
                    removeFromCart(productId);
                    closeModal();
                }}
                onCancel={closeModal}
            />
        );
    };

    return (
        <div id="cartPage">
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
                                        <button className="quantity-btn" onClick={() => decrementQuantity(item.id)}>-</button>
                                        <span className="quantity-display">{item.quantity}</span>
                                        <button className="quantity-btn" onClick={() => incrementQuantity(item.id)}>+</button>
                                    </div>
                                </div>
                                <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>O'chirish</button>
                            </div>
                        ))}
                    </div>
                    <div id="cartSummary" className="cart-summary">
                        <h3 className="summary-title">Buyurtma xulosasi</h3>
                        <div className="summary-row">
                            <span className="summary-label">Mahsulotlar narxi:</span>
                            <span className="summary-value">{subtotal.toLocaleString('uz-UZ')} UZS</span>
                        </div>
                        <div className="summary-row">
                            <span className="summary-label">Yetkazib berish:</span>
                            <span className="summary-value">{shipping.toLocaleString('uz-UZ')} UZS</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-row summary-total-row">
                            <span className="summary-label">Umumiy narx:</span>
                            <span className="summary-total-value">{total.toLocaleString('uz-UZ')} UZS</span>
                        </div>
                        <button className="btn btn-primary btn-block" style={{ marginTop: '1.5rem' }}>
                            <i className="fas fa-check-circle" style={{ marginRight: '0.5rem' }}></i>
                            Rasmiylashtirish
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;