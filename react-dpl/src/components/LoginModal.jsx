import React from 'react';

const LoginModal = () => {
    return (
        <div className="modal" id="loginModal">
            <div className="modal-content">
                <button className="modal-close" /* onClick={() => closeModal('loginModal')} */>&times;</button>
                <h3 style={{ marginBottom: '1rem' }}>Kirish</h3>
                <form id="loginForm">
                    <div className="form-group">
                        <label className="form-label">Email yoki Telefon</label>
                        <input type="text" className="form-input" id="loginInput" required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Parol</label>
                        <input type="password" className="form-input" id="passwordInput" required />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">Kirish</button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                    Akkount yo'qmi? <a href="#" /* onClick={showRegister} */>Ro'yxatdan o'ting</a>
                </p>
            </div>
        </div>
    );
};

export default LoginModal;
