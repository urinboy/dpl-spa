import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/api';
import '../../assets/styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/dashboard');
      return;
    }
    fetchStats();
  }, [user, navigate, isAdmin]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await ApiService.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Статистика олишда хато:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const menuItems = [
    { id: 'dashboard', name: 'Дашборд', icon: '📊', path: '/admin' },
    { id: 'users', name: 'Фойдаланувчилар', icon: '👥', path: '/admin/users' },
    { id: 'languages', name: 'Тиллар', icon: '🌐', path: '/admin/languages' },
    { id: 'products', name: 'Маҳсулотлар', icon: '📦', path: '/admin/products' },
    { id: 'orders', name: 'Буюртмалар', icon: '🛒', path: '/admin/orders' },
    { id: 'categories', name: 'Категориялар', icon: '📂', path: '/admin/categories' },
    { id: 'settings', name: 'Созламалар', icon: '⚙️', path: '/admin/settings' },
  ];

  const handleMenuClick = (item) => {
    setActiveMenu(item.id);
    navigate(item.path);
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
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => handleMenuClick(item)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-text">{item.name}</span>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="admin-profile">
            <div className="profile-info">
              <div className="profile-avatar">
                👤
              </div>
              <div className="profile-details">
                <p className="profile-name">{user?.name}</p>
                <p className="profile-role">Админ</p>
              </div>
            </div>
            <button
              className="logout-btn"
              onClick={handleLogout}
              title="Чиқиш"
            >
              🚪
            </button>
          </div>
        </div>
      </div>

      {/* Асосий контент */}
      <div className="admin-main">
        {/* Хеадер */}
        <div className="admin-header">
          <div className="header-left">
            <h1>Дашборд</h1>
            <p>DOM Product админ панели</p>
          </div>
          <div className="header-right">
            <div className="header-actions">
              <button className="notification-btn">
                🔔
                <span className="notification-badge">3</span>
              </button>
              <div className="user-menu">
                <span>Саломлашамиз, {user?.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Статистика карталари */}
        <div className="dashboard-content">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Юкланмоқда...</p>
            </div>
          ) : (
            <>
              {/* Статистика карталари */}
              <div className="stats-grid">
                <div className="stat-card blue">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <h3>{stats?.total_users || 0}</h3>
                    <p>Жами фойдаланувчилар</p>
                  </div>
                  <div className="stat-trend up">+12%</div>
                </div>

                <div className="stat-card green">
                  <div className="stat-icon">📦</div>
                  <div className="stat-info">
                    <h3>156</h3>
                    <p>Жами маҳсулотлар</p>
                  </div>
                  <div className="stat-trend up">+8%</div>
                </div>

                <div className="stat-card orange">
                  <div className="stat-icon">🛒</div>
                  <div className="stat-info">
                    <h3>89</h3>
                    <p>Янги буюртмалар</p>
                  </div>
                  <div className="stat-trend up">+15%</div>
                </div>

                <div className="stat-card red">
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <h3>₽125,450</h3>
                    <p>Жами савдо</p>
                  </div>
                  <div className="stat-trend up">+23%</div>
                </div>
              </div>

              {/* Сўнгги фаолият */}
              <div className="activity-section">
                <div className="section-header">
                  <h2>Сўнгги фаолият</h2>
                  <button className="view-all-btn">Барчасини кўриш</button>
                </div>

                <div className="activity-grid">
                  <div className="activity-card">
                    <h3>Сўнгги буюртмалар</h3>
                    <div className="activity-list">
                      <div className="activity-item">
                        <div className="activity-icon">🛒</div>
                        <div className="activity-details">
                          <p><strong>Ахмад Алиев</strong> янги буюртма бердер</p>
                          <span className="activity-time">5 дақиқа олдин</span>
                        </div>
                      </div>
                      <div className="activity-item">
                        <div className="activity-icon">📦</div>
                        <div className="activity-details">
                          <p><strong>iPhone 15</strong> маҳсулоти қўшилди</p>
                          <span className="activity-time">10 дақиқа олдин</span>
                        </div>
                      </div>
                      <div className="activity-item">
                        <div className="activity-icon">👤</div>
                        <div className="activity-details">
                          <p><strong>Фатима Ахмедова</strong> рўйхатдан ўтди</p>
                          <span className="activity-time">15 дақиқа олдин</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="activity-card">
                    <h3>Тезкор ҳаракатлар</h3>
                    <div className="quick-actions">
                      <button
                        className="action-btn blue"
                        onClick={() => navigate('/admin/products/create')}
                      >
                        <span>📦</span>
                        Маҳсулот қўшиш
                      </button>
                      <button
                        className="action-btn green"
                        onClick={() => navigate('/admin/users')}
                      >
                        <span>👥</span>
                        Фойдаланувчилар
                      </button>
                      <button
                        className="action-btn orange"
                        onClick={() => navigate('/admin/orders')}
                      >
                        <span>🛒</span>
                        Буюртмалар
                      </button>
                      <button
                        className="action-btn purple"
                        onClick={() => navigate('/admin/settings')}
                      >
                        <span>⚙️</span>
                        Созламалар
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
