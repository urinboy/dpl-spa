import React, { useState } from 'react';

const ProfilePage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Demo uchun state
    const [user] = useState({
        name: 'Ali Valiyev',
        email: 'ali.valiyev@example.com',
        phone: '+998 90 123 45 67',
    });

    const handleLogout = () => {
        alert('Chiqish amalga oshirildi!');
        setIsLoggedIn(false);
    };

    const handleChangePassword = () => {
        alert('Parolni o\'zgartirish funksiyasi hali ishlamaydi.');
    };

    const handleLogin = () => {
        alert('Kirish funksiyasi hali ishlamaydi.');
        setIsLoggedIn(true); // Demo uchun
    };

    const handleRegister = () => {
        alert('Ro\'yxatdan o\'tish funksiyasi hali ishlamaydi.');
    };

    return (
        <div className="page" id="profilePage">
            <h2 style={{ marginBottom: '1rem' }}>Profil</h2>
            {!isLoggedIn ? (
                <div className="profile-guest cart-empty">
                    <i className="fas fa-user-circle cart-empty-icon"></i>
                    <div className="cart-empty-title">Profilga kirish</div>
                    <p className="cart-empty-message">Profil ma'lumotlaringizni ko'rish uchun tizimga kiring yoki ro'yxatdan o'ting.</p>
                    <button className="btn btn-primary" onClick={handleLogin}>Kirish</button>
                    <button className="btn btn-primary" style={{ marginLeft: '1rem' }} onClick={handleRegister}>Ro'yxatdan o'tish</button>
                </div>
            ) : (
                <div id="profileContent" className="cart-summary">
                    <div className="cart-summary-row">
                        <span>Ism:</span>
                        <span>{user.name}</span>
                    </div>
                    <div className="cart-summary-row">
                        <span>Email:</span>
                        <span>{user.email}</span>
                    </div>
                    <div className="cart-summary-row">
                        <span>Telefon:</span>
                        <span>{user.phone}</span>
                    </div>
                    <button className="btn btn-primary btn-block" style={{ marginTop: '1rem' }} onClick={handleChangePassword}>Parolni o'zgartirish</button>
                    <button className="btn btn-danger btn-block" style={{ marginTop: '0.5rem' }} onClick={handleLogout}>Chiqish</button>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;