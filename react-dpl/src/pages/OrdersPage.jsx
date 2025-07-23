import React from 'react';

const OrdersPage = () => {
    const dummyOrders = [
        { id: 1, date: '2023-01-15', total: '4,700,000 UZS', status: 'Yetkazib berildi', items: ['Smartfon X1', 'Aqlli soat'] },
        { id: 2, date: '2023-02-20', total: '8,000,000 UZS', status: 'Kutilmoqda', items: ['Noutbuk Pro'] },
        { id: 3, date: '2023-03-10', total: '750,000 UZS', status: 'Bekor qilindi', items: ['Simsiz quloqchin'] },
        { id: 4, date: '2023-04-01', total: '6,000,000 UZS', status: 'Yetkazib berildi', items: ['Televizor 4K', 'O\'yin konsoli'] },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Yetkazib berildi': return 'var(--success-color)';
            case 'Kutilmoqda': return 'var(--warning-color)';
            case 'Bekor qilindi': return 'var(--danger-color)';
            default: return 'var(--gray-600)';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Yetkazib berildi': return 'fa-check-circle';
            case 'Kutilmoqda': return 'fa-clock';
            case 'Bekor qilindi': return 'fa-times-circle';
            default: return 'fa-info-circle';
        }
    };

    return (
        <div id="ordersPage">
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
                        <div className="order-card" key={order.id} style={{ borderLeftColor: getStatusColor(order.status) }}>
                            <div className="order-card-header">
                                <span className="order-id">Buyurtma #{order.id}</span>
                                <span className="order-date">{order.date}</span>
                            </div>
                            <div className="order-card-body">
                                <div className="order-detail-item">
                                    <span className="order-detail-label">Holati</span>
                                    <span className="order-detail-value" style={{ color: getStatusColor(order.status) }}>
                                        <i className={`fas ${getStatusIcon(order.status)}`}></i> {order.status}
                                    </span>
                                </div>
                                <div className="order-detail-item">
                                    <span className="order-detail-label">Umumiy summa</span>
                                    <span className="order-detail-value total-price">{order.total}</span>
                                </div>
                            </div>
                            <div className="order-card-footer">
                                <h4 className="order-items-title">Mahsulotlar:</h4>
                                <ul className="order-items-list">
                                    {order.items.map((item, index) => (
                                        <li key={index}>{item}</li>
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