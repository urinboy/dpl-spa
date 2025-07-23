
import React from 'react';
import { useModal } from '../contexts/ModalContext';
import LoginModalContent from './LoginModal'; // Import LoginModal

const RegisterModalContent = () => {
    const { openModal } = useModal();

    const showLogin = (e) => {
        e.preventDefault();
        openModal(<LoginModalContent />);
    };

    return (
        <>
            <h3 style={{ marginBottom: '1rem' }}>Ro'yxatdan o'tish</h3>
            <form id="registerForm">
                <div className="form-group">
                    <label className="form-label">Ism</label>
                    <input type="text" className="form-input" id="nameInput" required />
                </div>
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" id="emailInput" required />
                </div>
                <div className="form-group">
                    <label className="form-label">Telefon</label>
                    <input type="tel" className="form-input" id="phoneInput" required />
                </div>
                <div className="form-group">
                    <label className="form-label">Parol</label>
                    <input type="password" className="form-input" id="newPasswordInput" required />
                </div>
                <div className="form-group">
                    <label className="form-label">Parolni tasdiqlang</label>
                    <input type="password" className="form-input" id="confirmPasswordInput" required />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Ro'yxatdan o'tish</button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                Akkountingiz bormi? <a href="#" onClick={showLogin}>Kirish</a>
            </p>
        </>
    );
};

export default RegisterModalContent;
