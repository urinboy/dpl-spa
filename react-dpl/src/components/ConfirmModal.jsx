
import React from 'react';
import { useTranslation } from 'react-i18next';

const ConfirmModal = ({ title, message, onConfirm, onCancel, confirmText, cancelText, confirmButtonClass }) => {
    const { t } = useTranslation();

    return (
        <div className="confirm-modal-container modal-content">
            <div className="confirm-modal-header">
                <h3 className="confirm-modal-title">{title}</h3>
            </div>
            <div className="confirm-modal-body">
                <p className="confirm-modal-message">{message}</p>
            </div>
            <div className="confirm-modal-footer">
                <button onClick={onCancel} className="btn btn-secondary">
                    {cancelText || t('cancel')}
                </button>
                <button onClick={onConfirm} className={`btn ${confirmButtonClass || 'btn-danger'}`}>
                    {confirmText || t('confirm')}
                </button>
            </div>
        </div>
    );
};

export default ConfirmModal;
