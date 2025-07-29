import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

const OrdersManagement = () => {
    const { t } = useTranslation();
    
    // Sample orders data
    const [orders, setOrders] = useState([
        {
            id: 1,
            orderNumber: 'ORD-001',
            customerName: 'Ahad Karimov',
            total: 120000,
            status: 'pending',
            date: '2025-01-27',
            items: 3
        },
        {
            id: 2,
            orderNumber: 'ORD-002',
            customerName: 'Maryam Uzbekova',
            total: 85000,
            status: 'completed',
            date: '2025-01-26',
            items: 2
        },
        {
            id: 3,
            orderNumber: 'ORD-003',
            customerName: 'Bobur Toshev',
            total: 95000,
            status: 'processing',
            date: '2025-01-25',
            items: 1
        }
    ]);

    const [selectedStatus, setSelectedStatus] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingOrder, setDeletingOrder] = useState(null);

    const statusOptions = [
        { value: 'pending', label: t('pending'), color: 'warning' },
        { value: 'processing', label: t('processing'), color: 'info' },
        { value: 'completed', label: t('completed'), color: 'success' },
        { value: 'cancelled', label: t('cancelled'), color: 'danger' }
    ];

    const filteredOrders = orders.filter(order =>
        !selectedStatus || order.status === selectedStatus
    );

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(orders.map(order =>
            order.id === orderId
                ? { ...order, status: newStatus }
                : order
        ));
    };

    const deleteOrder = (orderId) => {
        const order = orders.find(o => o.id === orderId);
        setDeletingOrder(order);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (deletingOrder) {
            setOrders(orders.filter(order => order.id !== deletingOrder.id));
        }
        setShowDeleteModal(false);
        setDeletingOrder(null);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setDeletingOrder(null);
    };

    const getStatusBadge = (status) => {
        const statusOption = statusOptions.find(opt => opt.value === status);
        return statusOption || { label: status, color: 'secondary' };
    };

    return (
        <div className="admin-orders">
            <div className="admin-page-header">
                <h1>{t('orders_management')}</h1>
            </div>

            {/* Filters */}
            <div className="admin-filters">
                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="admin-select"
                >
                    <option value="">{t('all_statuses')}</option>
                    {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Orders Table */}
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>{t('order_number')}</th>
                            <th>{t('customer')}</th>
                            <th>{t('items')}</th>
                            <th>{t('total')}</th>
                            <th>{t('date')}</th>
                            <th>{t('status')}</th>
                            <th>{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map(order => {
                            const statusBadge = getStatusBadge(order.status);
                            return (
                                <tr key={order.id}>
                                    <td>
                                        <strong>{order.orderNumber}</strong>
                                    </td>
                                    <td>{order.customerName}</td>
                                    <td>{order.items} {t('items')}</td>
                                    <td>{order.total.toLocaleString('uz-UZ')} UZS</td>
                                    <td>{new Date(order.date).toLocaleDateString('uz-UZ')}</td>
                                    <td>
                                        <span className={`admin-status-badge ${statusBadge.color}`}>
                                            {statusBadge.label}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="admin-actions">
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                className="admin-select admin-select-sm"
                                            >
                                                {statusOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                className="admin-btn admin-btn-sm admin-btn-danger"
                                                onClick={() => deleteOrder(order.id)}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Confirm Delete Modal */}
            <ConfirmDeleteModal
                isOpen={showDeleteModal}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
                title={t('confirm_delete_order')}
                message={t('delete_order_message')}
                itemName={deletingOrder?.orderNumber}
            />
        </div>
    );
};

export default OrdersManagement;
