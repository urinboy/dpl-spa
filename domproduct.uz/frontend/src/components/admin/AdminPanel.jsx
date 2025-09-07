import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';

const AdminPanel = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Админ эмасса дашборд га йўналтириш
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/dashboard');
    }
  }, [user, navigate, isAdmin]);

  return <AdminDashboard />;
};

export default AdminPanel;
