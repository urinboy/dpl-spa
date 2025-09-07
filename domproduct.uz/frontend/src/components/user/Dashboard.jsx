import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ApiService from '../../services/api';

const Dashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const fetchStats = async () => {
    if (!isAdmin()) return;

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

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1>Дашборд</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Чиқиш
        </button>
      </div>

      {/* Фойдаланувчи маълумотлари */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3>Фойдаланувчи маълумотлари</h3>
        <p><strong>Исм:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Рол:</strong>
          <span style={{
            color: user?.role === 'admin' ? '#dc3545' : '#28a745',
            fontWeight: 'bold',
            marginLeft: '5px'
          }}>
            {user?.role === 'admin' ? 'Админ' : 'Фойдаланувчи'}
          </span>
        </p>
      </div>

      {/* Админ статистикаси */}
      {isAdmin() && (
        <div style={{
          backgroundColor: '#e7f3ff',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3>Админ статистикаси</h3>
          {loading ? (
            <p>Юкланмоқда...</p>
          ) : stats ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div style={{
                backgroundColor: 'white',
                padding: '15px',
                borderRadius: '4px',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#007bff' }}>Жами фойдаланувчилар</h4>
                <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{stats.total_users}</p>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: '15px',
                borderRadius: '4px',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#dc3545' }}>Админлар</h4>
                <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{stats.admin_count}</p>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: '15px',
                borderRadius: '4px',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#28a745' }}>Фойдаланувчилар</h4>
                <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{stats.user_count}</p>
              </div>
            </div>
          ) : (
            <p>Статистика мавжуд эмас</p>
          )}
        </div>
      )}

      {/* Навигация менюси */}
      <div>
        <h3>Менюлар</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/users')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Фойдаланувчилар рўйхати
          </button>

          {isAdmin() && (
            <button
              onClick={() => navigate('/admin/users')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Админ панели
            </button>
          )}

          <button
            onClick={() => navigate('/about')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Биз ҳақимизда
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
