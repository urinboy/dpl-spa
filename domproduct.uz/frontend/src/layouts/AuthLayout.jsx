import { Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import './AuthLayout.css';

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>🏪 DOM Product</h1>
            <p>Хуш келибсиз</p>
          </div>

          <div className="auth-content">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

AuthLayout.propTypes = {};

export default AuthLayout;
