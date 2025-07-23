
import React from 'react';

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="confirm-modal">
            <h3 className="confirm-title">Tasdiqlash</h3>
            <p className="confirm-message">{message}</p>
            <div className="confirm-actions">
                <button onClick={onCancel} className="btn btn-secondary">Bekor qilish</button>
                <button onClick={onConfirm} className="btn btn-danger">O'chirish</button>
            </div>
        </div>
    );
};

export default ConfirmModal;
