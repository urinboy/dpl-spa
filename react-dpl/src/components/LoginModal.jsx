
import React from 'react';
import { useToast } from './Toast';
import { useModal } from '../contexts/ModalContext';
import { useAuth } from '../contexts/AuthContext';
import RegisterModalContent from './RegisterModal'; // Import RegisterModal

const LoginModalContent = () => {
    const { showToast } = useToast();
    const { openModal, closeModal } = useModal();
    const { login } = useAuth();

    const handleLogin = (e) => {
        e.preventDefault();
        login();
        showToast('Muvaffaqiyatli kirdingiz!', 'success');
        closeModal();
    };

    const showRegister = (e) => {
        e.preventDefault();
        openModal(<RegisterModalContent />);
    };

    return (
        <>
            <h3 style={{ marginBottom: '1rem' }}>Kirish</h3>
            <form id="loginForm" onSubmit={handleLogin}>
                <div className="form-group">
                    <label className="form-label">Email yoki Telefon</label>
                    <input type="text" className="form-input" id="loginInput" required defaultValue="test@user.com" />
                </div>
                <div className="form-group">
                    <label className="form-label">Parol</label>
                    <input type="password" className="form-input" id="passwordInput" required defaultValue="12345" />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Kirish</button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                Akkount yo'qmi? <a href="#" onClick={showRegister}>Ro'yxatdan o'ting</a>
            </p>
        </>
    );
};

export default LoginModalContent;
