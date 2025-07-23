
import React from 'react';

const ConfirmModal = ({ title, message, onConfirm, onCancel, confirmText, cancelText, confirmButtonClass }) => {
    return (
        <div className="confirm-modal-container modal-content"> {/* modal-content klassi qo'shildi */}
            <div className="confirm-modal-header">
                <h3 className="confirm-modal-title">{title}</h3>
            </div>
            <div className="confirm-modal-body">
                <p className="confirm-modal-message">{message}</p>
            </div>
            <div className="confirm-modal-footer">
                <button onClick={onCancel} className="btn btn-secondary">
                    {cancelText || 'Bekor qilish'}
                </button>
                <button onClick={onConfirm} className={`btn ${confirmButtonClass || 'btn-danger'}`}>
                    {confirmText || 'Tasdiqlash'}
                </button>
            </div>
        </div>
    );
};

export default ConfirmModal;
