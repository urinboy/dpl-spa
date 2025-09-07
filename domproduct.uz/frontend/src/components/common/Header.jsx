import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo">
            🏪 DOM Product
          </Link>
        </div>

        <nav className="header-nav">
          <Link to="/" className="nav-link">Бош саҳифа</Link>
          <Link to="/products" className="nav-link">Маҳсулотлар</Link>
          <Link to="/about" className="nav-link">Биз ҳақимизда</Link>
        </nav>

        <div className="header-right">
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-name">Салом, {user?.name}!</span>
              <Link to="/dashboard" className="dashboard-btn">
                Дашборд
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                Чиқиш
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn">Кириш</Link>
              <Link to="/register" className="register-btn">Рўйхатдан ўтиш</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
