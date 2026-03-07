import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { register } from '../api/client'
import './Auth.css'

function Register({ setUser }) {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'
  const role = location.state?.role || 'buyer'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('Email and password are required')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const data = await register({
        email: email.trim(),
        password,
        name: name.trim() || undefined,
        role,
      })
      if (data.user) setUser?.(data.user)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || err.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create account</h1>
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
            Password (min 6 characters)
            <input
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              minLength={6}
            />
          </label>
          <label className="auth-label">
            Display name (optional)
            <input
              type="text"
              className="auth-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              placeholder={role === 'seller' ? 'e.g. Artisan Seller' : 'e.g. Jane'}
            />
          </label>
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login" state={location.state}>Log in</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
