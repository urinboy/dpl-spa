import React from 'react';

const OrdersPage = () => {
    const dummyOrders = [
        { id: 1, date: '2023-01-15', total: '4,700,000 UZS', status: 'Yetkazib berildi', items: ['Smartfon X1', 'Aqlli soat'] },
        { id: 2, date: '2023-02-20', total: '8,000,000 UZS', status: 'Kutilmoqda', items: ['Noutbuk Pro'] },
        { id: 3, date: '2023-03-10', total: '750,000 UZS', status: 'Bekor qilindi', items: ['Simsiz quloqchin'] },
        { id: 4, date: '2023-04-01', total: '6,000,000 UZS', status: 'Yetkazib berildi', items: ['Televizor 4K', 'O\'yin konsoli'] },
    ];

    return (
        <div className="page" id="ordersPage">
            <h2 style={{ marginBottom: '1rem' }}>Buyurtmalarim</h2>
            {dummyOrders.length === 0 ? (
                <div className="orders-empty cart-empty">
                    <i className="fas fa-clipboard-list cart-empty-icon"></i>
                    <div className="cart-empty-title">Sizda hali buyurtmalar yo'q</div>
                    <p className="cart-empty-message">Mahsulotlarni xarid qilib, birinchi buyurtmangizni bering.</p>
                    <button className="btn btn-primary">Mahsulotlarga o'tish</button>
                </div>
            ) : (
                <div id="ordersList">
                    {dummyOrders.map(order => (
                        <div className="cart-summary" key={order.id} style={{ marginBottom: '1rem' }}>
                            <div className="cart-summary-row">
                                <span>Buyurtma ID:</span>
                                <span>#{order.id}</span>
                            </div>
                            <div className="cart-summary-row">
                                <span>Sana:</span>
                                <span>{order.date}</span>
                            </div>
                            <div className="cart-summary-row">
                                <span>Holat:</span>
                                <span>{order.status}</span>
                            </div>
                            <div className="cart-summary-row">
                                <span>Jami:</span>
                                <span>{order.total}</span>
                            </div>
                            <div className="cart-summary-row" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                <span>Mahsulotlar:</span>
                                <ul style={{ listStyle: 'none', paddingLeft: '0', marginTop: '0.5rem' }}>
                                    {order.items.map((item, index) => (
                                        <li key={index} style={{ marginBottom: '0.2rem' }}>- {item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;