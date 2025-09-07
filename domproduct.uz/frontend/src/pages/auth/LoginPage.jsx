import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (error) {
      setError(error.message || 'Кириш хатоси');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>👋 Тизимга кириш</h2>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">📧 Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Emailingizni киритинг"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">🔒 Парол</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Паролингизни киритинг"
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? '⏳ Кутинг...' : '🚀 Кириш'}
        </button>

        <div className="auth-links">
          <p>
            Ҳисобингиз йўқми?
            <Link to="/register" className="auth-link">
              Рўйхатдан ўтинг
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
