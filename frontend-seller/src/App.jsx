import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { getSession, logout as logoutApi } from './api/client'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import UploadProduct from './pages/UploadProduct'
import './App.css'

function Header({ user, setUser }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    getSession()
      .then((data) => {
        if (data.loggedIn && data.user) setUser(data.user)
        else setUser(null)
      })
      .catch(() => setUser(null))
  }, [location.pathname, setUser])

  const handleLogout = async () => {
    if (loggingOut) return
    setLoggingOut(true)
    try {
      await logoutApi()
      setUser(null)
      navigate('/', { replace: true })
    } catch (err) {
      console.error('Logout failed:', err)
      setUser(null)
      navigate('/', { replace: true })
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <Link to="/" className="app-logo" aria-label="Artisan Marketplace home">
          <div className="app-logo-mark">a</div>
          <div className="app-logo-text">
            <span className="app-logo-text-primary">Artisan Marketplace</span>
            <span className="app-logo-text-secondary">Seller Registration</span>
          </div>
        </Link>
        <div className="app-header-right">
          {user && (
            <span className="app-header-seller" title={user.email}>
              Hi, {user.name}
            </span>
          )}
          <span className="app-header-cta-title">Sell on Artisan Marketplace</span>
          <span className="app-header-cta-subtitle">
            Reach more customers with a professional Amazon-style storefront
          </span>
          <button
            type="button"
            className="app-header-logout"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
    </header>
  )
}

function ProtectedRoute({ user, children }) {
  if (user == null) {
    return <Navigate to="/" replace />
  }
  return children
}

function GuestRoute({ user, children }) {
  if (user != null) {
    return <Navigate to="/create" replace />
  }
  return children
}

function App() {
  const [user, setUser] = useState(null)

  return (
    <Router>
      <div className="app">
        <Header user={user} setUser={setUser} />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              path="/login"
              element={
                <GuestRoute user={user}>
                  <Login setUser={setUser} />
                </GuestRoute>
              }
            />
            <Route
              path="/register"
              element={
                <GuestRoute user={user}>
                  <Register setUser={setUser} />
                </GuestRoute>
              }
            />
            <Route
              path="/create"
              element={
                <ProtectedRoute user={user}>
                  <UploadProduct />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
