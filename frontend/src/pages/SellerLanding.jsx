import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './SellerLanding.css'

function SellerLanding({ user }) {
  const navigate = useNavigate()
  const sellerAuthState = { from: '/seller/create', role: 'seller' }

  // If user is already logged in, show a different message with a continue button
  if (user) {
    return (
      <div className="landing-page">
        <div className="onboarding-hero">
          <h1 className="onboarding-title">Welcome back, {user.name || user.email}!</h1>
          <p className="onboarding-subtitle">
            You're all set to create your product listing.
          </p>
          <div className="landing-actions">
            <button
              onClick={() => navigate('/seller/create')}
              className="primary-cta"
            >
              Create Product Listing
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="landing-page">
      <div className="onboarding-hero">
        <h1 className="onboarding-title">Sell on Artisan Marketplace</h1>
        <p className="onboarding-subtitle">
          Create your first product listing in a few guided steps. Log in or create an account to get started.
        </p>
        <div className="landing-actions">
          <Link to="/login" state={sellerAuthState} className="primary-cta">
            Log in
          </Link>
          <Link to="/register" state={sellerAuthState} className="primary-cta secondary">
            Create account
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SellerLanding
