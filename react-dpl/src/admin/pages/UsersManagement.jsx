import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { users } from '../../data/users';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

const UsersManagement = () => {
    const { t } = useTranslation();
    const [usersList, setUsersList] = useState(users);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingUser, setDeletingUser] = useState(null);

    const filteredUsers = usersList.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleUserStatus = (userId) => {
        setUsersList(usersList.map(user =>
            user.id === userId 
                ? { ...user, active: !user.active }
                : user
        ));
    };

    const deleteUser = (userId) => {
        const user = usersList.find(u => u.id === userId);
        setDeletingUser(user);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (deletingUser) {
            setUsersList(usersList.filter(user => user.id !== deletingUser.id));
        }
        setShowDeleteModal(false);
        setDeletingUser(null);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setDeletingUser(null);
    };

    return (
        <div className="admin-users">
            <div className="admin-page-header">
                <h1>{t('users_management')}</h1>
            </div>

            {/* Search */}
            <div className="admin-filters">
                <div className="admin-search">
                    <i className="fas fa-search"></i>
                    <input
                        type="text"
                        placeholder={t('search_users')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>{t('name')}</th>
                            <th>{t('email')}</th>
                            <th>{t('phone')}</th>
                            <th>{t('status')}</th>
                            <th>{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.phone || '-'}</td>
                                <td>
                                    <span className={`admin-status-badge ${user.active !== false ? 'active' : 'inactive'}`}>
                                        {user.active !== false ? t('active') : t('inactive')}
                                    </span>
                                </td>
                                <td>
                                    <div className="admin-actions">
                                        <button
                                            className={`admin-btn admin-btn-sm ${user.active !== false ? 'admin-btn-warning' : 'admin-btn-success'}`}
                                            onClick={() => toggleUserStatus(user.id)}
                                        >
                                            <i className={`fas ${user.active !== false ? 'fa-ban' : 'fa-check'}`}></i>
                                        </button>
                                        <button
                                            className="admin-btn admin-btn-sm admin-btn-danger"
                                            onClick={() => deleteUser(user.id)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Confirm Delete Modal */}
            <ConfirmDeleteModal
                isOpen={showDeleteModal}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
                title={t('confirm_delete_user')}
                message={t('delete_user_message')}
                itemName={deletingUser?.name}
            />
        </div>
    );
};

export default UsersManagement;
