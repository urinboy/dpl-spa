import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import ApiService from './services/api'

// Лейаутлар
import AdminLayout from './layouts/AdminLayout'
import UserLayout from './layouts/UserLayout'
import AuthLayout from './layouts/AuthLayout'

// Саҳифалар
import LoginPage from './pages/auth/LoginPage'

// Админ компонентлари
import AdminDashboard from './components/admin/AdminDashboard'
import AdminUsers from './components/admin/AdminUsers'
import AdminPanel from './components/admin/AdminPanel'

// Эски компонентлар (вақтинчалик)
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Dashboard from './components/user/Dashboard'

import './App.css'

// Компонентлар
function Home() {
  const [count, setCount] = useState(0)
  const { isAuthenticated, user } = useAuth()

  return (
    <div>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>DOM Product - Асосий саҳифа</h1>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Laravel API + React Vite интеграцияси
        </p>

        {isAuthenticated ? (
          <div style={{ marginTop: '20px' }}>
            <p>Саломлашамиз, {user?.name}!</p>
            <Link to="/dashboard">
              <button style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Дашборд га ўтиш
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ marginTop: '20px' }}>
            <Link to="/login" style={{ marginRight: '10px' }}>
              <button style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Кириш
              </button>
            </Link>
            <Link to="/register">
              <button style={{
                padding: '10px 20px',
                backgroundColor: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Рўйхатдан ўтиш
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await ApiService.get('/users')
      setUsers(response.data || [])
    } catch (error) {
      setError('Фойдаланувчиларни олишда хато: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h2>👥 Фойдаланувчилар рўйхати</h2>

      {error && (
        <div style={{
          color: 'red',
          backgroundColor: '#ffe6e6',
          padding: '10px',
          border: '1px solid red',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <p>Юкланмоқда...</p>
      ) : (
        <div>
          <p>Жами фойдаланувчилар: {users.length}</p>

          <ul style={{ listStyle: 'none', padding: 0 }}>
            {users.map((user) => (
              <li key={user.id} style={{
                backgroundColor: '#f5f5f5',
                margin: '10px 0',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid #ddd'
              }}>
                <strong>{user.name}</strong> - {user.email}
                <br />
                <small style={{ color: '#666' }}>
                  ID: {user.id} | Рол: {user.role || 'фойдаланувчи'}
                </small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function About() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>📋 Биз ҳақимизда</h2>
      <p>DOM Product - заҳирагі онлайн савдо платформаси</p>
    </div>
  )
}

function Navigation() {
  const { isAuthenticated, user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <nav style={{
      padding: '10px 20px',
      backgroundColor: '#343a40',
      marginBottom: '20px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white'
      }}>
        <div>
          <Link to="/" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>
            Бош саҳифа
          </Link>
          <Link to="/users" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>
            Фойдаланувчилар
          </Link>
          <Link to="/about" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>
            Биз ҳақимизда
          </Link>
        </div>

        <div>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>Салом, {user?.name}!</span>
              {user?.role === 'admin' && (
                <Link to="/admin" style={{
                  color: '#ffc107',
                  textDecoration: 'none',
                  marginRight: '10px'
                }}>
                  Админ панели
                </Link>
              )}
              <Link to="/dashboard" style={{
                color: 'white',
                textDecoration: 'none',
                marginRight: '10px'
              }}>
                Дашборд
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Чиқиш
              </button>
            </div>
          ) : (
            <div>
              <Link to="/login" style={{ color: 'white', marginRight: '10px' }}>Кириш</Link>
              <Link to="/register">Рўйхатдан ўтиш</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

function AppContent() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>Юкланмоқда...</p>
      </div>
    )
  }

  return (
    <div className="app">
      <Navigation />

      {/* Маршрутлар */}
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Auth маршрутлари */}
        <Route path="/login" element={
          <AuthLayout>
            <LoginPage />
          </AuthLayout>
        } />
        <Route path="/register" element={
          <AuthLayout>
            <Register />
          </AuthLayout>
        } />

        {/* Фойдаланувчи маршрутлари */}
        <Route path="/dashboard" element={
          <UserLayout>
            <Dashboard />
          </UserLayout>
        } />
        <Route path="/users" element={
          <UserLayout>
            <Users />
          </UserLayout>
        } />
        <Route path="/about" element={
          <UserLayout>
            <About />
          </UserLayout>
        } />

        {/* Админ маршрутлари */}
        <Route path="/admin" element={
          <AdminLayout>
            <AdminPanel />
          </AdminLayout>
        } />
        <Route path="/admin/users" element={
          <AdminLayout>
            <AdminUsers />
          </AdminLayout>
        } />
      </Routes>

      <p className="read-the-docs" style={{ marginTop: '40px' }}>
        Laravel API backend билан React frontend интеграцияси
      </p>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
