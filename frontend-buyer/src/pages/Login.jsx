import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api/client'

function Login({ setUser }) {
  const navigate = useNavigate()
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
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || err.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-card rounded-lg shadow-lg border border-gray-200">
      <h1 className="text-xl font-bold text-gray-900 mb-1">Log in</h1>
      <p className="text-sm text-gray-500 mb-6">Artisan Marketplace</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded">{error}</div>
        )}
        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Email</span>
          <input
            type="email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Password</span>
          <input
            type="password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold rounded disabled:opacity-70"
        >
          {loading ? 'Signing in...' : 'Log in'}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-amber-600 hover:underline">
          Create account
        </Link>
      </p>
    </div>
  )
}

export default Login
