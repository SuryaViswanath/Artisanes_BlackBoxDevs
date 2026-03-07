import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { login } from '../api/client'
import './Auth.css'

function Login({ setUser }) {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('Email and password are required')
      return
    }
    setLoading(true)
    try {
      const data = await login({ email: email.trim(), password })
      if (data.user) setUser?.(data.user)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || err.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Log in</h1>
        <p className="auth-subtitle">Artisan Marketplace</p>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}
          <label className="auth-label">
            Email
            <input
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label className="auth-label">
            Password
            <input
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Log in'}
          </button>
        </form>
        <p className="auth-footer">
          Don&apos;t have an account? <Link to="/register" state={location.state}>Create account</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
