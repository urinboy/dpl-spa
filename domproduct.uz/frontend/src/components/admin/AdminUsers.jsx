import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/api';
import '../../assets/styles/AdminUsers.css';

const AdminUsers = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const usersPerPage = 10;

  // Админ эмасса дашборд га йўналтириш
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/admin');
    }
  }, [user, navigate, isAdmin]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await ApiService.get('/admin/users');
      setUsers(response.data || []);
    } catch (error) {
      setError('Фойдаланувчиларни олишда хато: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUserRole = async (userId, newRole) => {
    try {
      await ApiService.put(`/admin/users/${userId}/role`, { role: newRole });
      fetchUsers();
      setShowModal(false);
    } catch (error) {
      setError('Ролни ўзгартиришда хато: ' + error.message);
    }
  };

  const deleteUser = async (userId, userName) => {
    if (!confirm(`${userName} фойдаланувчисини ўчиришни тасдиқлайсизми?`)) {
      return;
    }

    try {
      await ApiService.delete(`/admin/users/${userId}`);
      fetchUsers();
    } catch (error) {
      setError('Фойдаланувчини ўчиришда хато: ' + error.message);
    }
  };

  // Фильтрлаш ва қидириш
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Пагинация
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const getRoleColor = (role) => {
    return role === 'admin' ? 'admin-badge' : 'user-badge';
  };

  const getStatusColor = (createdAt) => {
    const daysSinceCreated = Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24));
    return daysSinceCreated <= 7 ? 'status-new' : 'status-active';
  };

  return (
    <div className="admin-layout">
      {/* Сайдбар */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <div className="admin-logo">
            <h2>🏪 DOM Admin</h2>
          </div>
        </div>

        <div className="sidebar-menu">
          <div className="menu-item" onClick={() => navigate('/admin')}>
            <span className="menu-icon">📊</span>
            <span className="menu-text">Дашборд</span>
          </div>
          <div className="menu-item active" onClick={() => navigate('/admin/users')}>
            <span className="menu-icon">👥</span>
            <span className="menu-text">Фойдаланувчилар</span>
          </div>
          <div className="menu-item" onClick={() => navigate('/admin/languages')}>
            <span className="menu-icon">🌐</span>
            <span className="menu-text">Тиллар</span>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="admin-profile">
            <div className="profile-info">
              <div className="profile-avatar">👤</div>
              <div className="profile-details">
                <p className="profile-name">{user?.name}</p>
                <p className="profile-role">Админ</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Асосий контент */}
      <div className="admin-main">
        <div className="admin-header">
          <div className="header-left">
            <h1>👥 Фойдаланувчиларни бошқариш</h1>
            <p>Тизим фойдаланувчиларини кўриш ва бошқариш</p>
          </div>
          <div className="header-right">
            <button className="add-user-btn" onClick={() => navigate('/admin/users/create')}>
              <span>➕</span>
              Янги фойдаланувчи
            </button>
          </div>
        </div>

        <div className="users-content">
          {/* Фильтр ва қидириш панели */}
          <div className="users-toolbar">
            <div className="search-section">
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Исм ёки email бўйича қидириш..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="filter-section">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="role-filter"
                >
                  <option value="all">Барча роллар</option>
                  <option value="admin">Админлар</option>
                  <option value="user">Фойдаланувчилар</option>
                </select>
              </div>
            </div>

            <div className="users-stats">
              <div className="stat-item">
                <span className="stat-number">{filteredUsers.length}</span>
                <span className="stat-label">Топилди</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{users.filter(u => u.role === 'admin').length}</span>
                <span className="stat-label">Админлар</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{users.filter(u => u.role === 'user').length}</span>
                <span className="stat-label">Фойдаланувчилар</span>
              </div>
            </div>
          </div>

          {/* Хатолик хабари */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {/* Фойдаланувчилар жадвали */}
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Фойдаланувчилар юкланмоқда...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="users-table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Фойдаланувчи</th>
                      <th>Рол</th>
                      <th>Статус</th>
                      <th>Қўшилган сана</th>
                      <th>Ҳаракатлар</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((tableUser) => (
                      <tr key={tableUser.id}>
                        <td>
                          <div className="user-info">
                            <div className="user-avatar">
                              {tableUser.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="user-details">
                              <div className="user-name">{tableUser.name}</div>
                              <div className="user-email">{tableUser.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`role-badge ${getRoleColor(tableUser.role)}`}>
                            {tableUser.role === 'admin' ? '👑 Админ' : '👤 Фойдаланувчи'}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${getStatusColor(tableUser.created_at)}`}>
                            {getStatusColor(tableUser.created_at) === 'status-new' ? '🆕 Янги' : '✅ Фаол'}
                          </span>
                        </td>
                        <td>
                          <div className="date-info">
                            {new Date(tableUser.created_at).toLocaleDateString('uz-UZ')}
                          </div>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="action-btn edit-btn"
                              onClick={() => openEditModal(tableUser)}
                              title="Ролни ўзгартириш"
                            >
                              ✏️
                            </button>
                            <button
                              className="action-btn delete-btn"
                              onClick={() => deleteUser(tableUser.id, tableUser.name)}
                              title="Ўчириш"
                              disabled={tableUser.id === user?.id}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {currentUsers.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-icon">👥</div>
                    <h3>Фойдаланувчилар топилмади</h3>
                    <p>Қидириш параметрларини ўзгартириб кўринг</p>
                  </div>
                )}
              </div>

              {/* Пагинация */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    ← Олдинги
                  </button>

                  <div className="pagination-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                      <button
                        key={number}
                        className={`pagination-number ${currentPage === number ? 'active' : ''}`}
                        onClick={() => handlePageChange(number)}
                      >
                        {number}
                      </button>
                    ))}
                  </div>

                  <button
                    className="pagination-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Кейинги →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Рол ўзгартириш модали */}
      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Фойдаланувчи ролини ўзгартириш</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="user-info-modal">
                <div className="user-avatar-large">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4>{selectedUser.name}</h4>
                  <p>{selectedUser.email}</p>
                </div>
              </div>

              <div className="role-selection">
                <p>Янги рол танланг:</p>
                <div className="role-options">
                  <label className="role-option">
                    <input
                      type="radio"
                      name="role"
                      value="user"
                      defaultChecked={selectedUser.role === 'user'}
                    />
                    <span className="role-option-content">
                      <span className="role-icon">👤</span>
                      <span className="role-title">Фойдаланувчи</span>
                      <span className="role-desc">Асосий имкониятлар</span>
                    </span>
                  </label>

                  <label className="role-option">
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      defaultChecked={selectedUser.role === 'admin'}
                    />
                    <span className="role-option-content">
                      <span className="role-icon">👑</span>
                      <span className="role-title">Админ</span>
                      <span className="role-desc">Тўлиқ рухсат</span>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Бекор қилиш
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  const newRole = document.querySelector('input[name="role"]:checked').value;
                  updateUserRole(selectedUser.id, newRole);
                }}
              >
                Сақлаш
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
