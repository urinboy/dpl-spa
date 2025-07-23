

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useModal } from '../contexts/ModalContext';
import { useToast } from '../components/Toast';
import LoginModalContent from '../components/LoginModal';
import ConfirmModal from '../components/ConfirmModal';

const ProfilePage = () => {
    const { isLoggedIn, user, logout } = useAuth();
    const { openModal, closeModal } = useModal();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleLogout = () => {
        openModal(
            <ConfirmModal 
                title="Tizimdan chiqish"
                message="Rostdan ham profilingizdan chiqmoqchimisiz?"
                confirmText="Chiqish"
                cancelText="Bekor qilish"
                confirmButtonClass="btn-primary" /* btn-danger dan btn-primary ga o'zgartirildi */
                onConfirm={() => {
                    logout();
                    showToast('Tizimdan muvaffaqiyatli chiqdingiz', 'info');
                    closeModal();
                }}
                onCancel={closeModal}
            />
        );
    };

    const handleComingSoon = () => {
        showToast('Bu bo\'lim tez orada qo\'shiladi', 'warning');
    };

    return (
        <div id="profilePage">
            <h2 style={{ marginBottom: '1rem' }}>Profil</h2>
            {!isLoggedIn ? (
                <div className="profile-guest-card">
                    <i className="fas fa-user-circle cart-empty-icon"></i>
                    <div className="cart-empty-title">Profilga kirish</div>
                    <p className="cart-empty-message">Buyurtmalaringizni va sevimlilar ro\'yxatini ko\'rish uchun tizimga kiring.</p>
                    <div className="profile-actions">
                        <button className="btn btn-primary" onClick={() => openModal(<LoginModalContent />)}>Kirish</button>
                    </div>
                </div>
            ) : (
                <div className="profile-container">
                    <div className="profile-user-card">
                        <div className="profile-avatar">{user.name.charAt(0)}</div>
                        <h3 className="profile-name">{user.name}</h3>
                    </div>
                    <div className="profile-menu">
                        <button className="profile-menu-item" onClick={handleComingSoon}>
                            <i className="fas fa-cog profile-menu-icon"></i>
                            <span>Sozlamalar</span>
                            <i className="fas fa-chevron-right"></i>
                        </button>
                        <button className="profile-menu-item" onClick={() => navigate('/orders')}>
                            <i className="fas fa-clipboard-list profile-menu-icon"></i>
                            <span>Buyurtmalarim</span>
                            <i className="fas fa-chevron-right"></i>
                        </button>
                        <button className="profile-menu-item" onClick={() => navigate('/wishlist')}>
                            <i className="fas fa-heart profile-menu-icon"></i>
                            <span>Sevimlilar</span>
                            <i className="fas fa-chevron-right"></i>
                        </button>
                        <button className="profile-menu-item danger" onClick={handleLogout}>
                            <i className="fas fa-sign-out-alt profile-menu-icon"></i>
                            <span>Chiqish</span>
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
