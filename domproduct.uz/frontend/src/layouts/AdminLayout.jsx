import { Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import './AdminLayout.css';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      {/* Админ лейаутининг асосий контейнери */}
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

AdminLayout.propTypes = {};

export default AdminLayout;
