import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import PropTypes from 'prop-types';
import './UserLayout.css';

const UserLayout = () => {
  return (
    <div className="user-layout">
      <Header />

      <main className="user-main">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

UserLayout.propTypes = {};

export default UserLayout;
