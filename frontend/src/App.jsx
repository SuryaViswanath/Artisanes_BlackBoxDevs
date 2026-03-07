import React, { useState, useEffect } from 'react'
import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { getSession, logout as logoutApi } from './api/client'
import Loading from './components/Loading'

const Marketplace = lazy(() => import('./pages/Marketplace'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const SellerLanding = lazy(() => import('./pages/SellerLanding'))
const UploadProduct = lazy(() => import('./pages/UploadProduct'))

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
    } catch {
      setUser(null)
      navigate('/', { replace: true })
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <header className="bg-header-navy text-white h-[60px] px-[18px] py-2 flex items-center justify-between gap-2 shadow-header">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-white text-xl font-bold no-underline hover:text-white">
          Artisan Marketplace
        </Link>
        <span className="text-white/70 text-[13px] hidden sm:inline">
          Discover authentic handcrafted products
        </span>
        <Link
          to="/seller"
          className="text-sm text-amber-400 hover:text-amber-300 font-medium"
        >
          Sell
        </Link>
      </div>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm text-white/90">Hi, {user.name || user.email}</span>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-sm text-white/90 hover:text-white px-2 py-1 rounded border border-white/40"
            >
              {loggingOut ? 'Logging out...' : 'Log out'}
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-white hover:underline">
              Log in
            </Link>
            <Link to="/register" className="text-sm text-amber-400 hover:underline font-medium">
              Create account
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

function ProtectedRoute({ user, children, redirectTo = '/' }) {
  if (user == null) return <Navigate to={redirectTo} replace />
  return children
}

function GuestRoute({ user, children }) {
  if (user != null) return <Navigate to="/" replace />
  return children
}

function App() {
  const [user, setUser] = useState(null)

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header user={user} setUser={setUser} />
        <nav className="bg-nav-secondary text-white h-[39px] px-2.5 flex items-center text-[13px] font-bold gap-4">
          <Link to="/" className="text-white hover:underline">All</Link>
          <span>Handmade</span>
        </nav>
        <main className="flex-1 max-w-[1500px] w-full mx-auto px-[18px] py-4">
          <Suspense fallback={<Loading message="Loading..." />}>
            <Routes>
              <Route path="/" element={<Marketplace />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
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
              <Route path="/seller" element={<SellerLanding />} />
              <Route
                path="/seller/create"
                element={
                  <ProtectedRoute user={user} redirectTo="/seller">
                    <UploadProduct />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  )
}

export default App
