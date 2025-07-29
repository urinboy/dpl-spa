import React from 'react';
import { useTranslation } from 'react-i18next';

const ConfirmDeleteModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    itemName 
}) => {
    const { t } = useTranslation();

    if (!isOpen) return null;

    return (
        <div className="admin-modal-overlay">
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                <div className="admin-modal-header">
                    <h2>
                        <i className="fas fa-exclamation-triangle" style={{ color: '#dc3545', marginRight: '8px' }}></i>
                        {title || t('confirm_delete')}
                    </h2>
                    <button className="admin-modal-close" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                
                <div className="admin-modal-body" style={{ padding: '20px' }}>
                    <p className="confirm-message" style={{ marginBottom: '15px', fontSize: '16px' }}>
                        {message}
                    </p>
                    {itemName && (
                        <div className="confirm-item" style={{ 
                            padding: '10px', 
                            backgroundColor: '#f8f9fa', 
                            border: '1px solid #dee2e6', 
                            borderRadius: '5px',
                            marginBottom: '15px'
                        }}>
                            <strong style={{ color: '#dc3545' }}>"{itemName}"</strong>
                        </div>
                    )}
                    <div style={{ 
                        padding: '10px', 
                        backgroundColor: '#fff3cd', 
                        border: '1px solid #ffeaa7', 
                        borderRadius: '5px',
                        color: '#856404'
                    }}>
                        <i className="fas fa-info-circle" style={{ marginRight: '8px' }}></i>
                        {t('delete_warning_message')}
                    </div>
                </div>
                
                <div className="admin-form-actions">
                    <button 
                        type="button" 
                        className="admin-btn admin-btn-secondary" 
                        onClick={onClose}
                    >
                        <i className="fas fa-times"></i>
                        {t('cancel')}
                    </button>
                    <button 
                        type="button" 
                        className="admin-btn admin-btn-danger" 
                        onClick={onConfirm}
                    >
                        <i className="fas fa-trash"></i>
                        {t('delete')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
