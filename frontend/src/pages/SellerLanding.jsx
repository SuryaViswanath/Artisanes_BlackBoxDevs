import React from 'react'
import { Link } from 'react-router-dom'
import './SellerLanding.css'

function SellerLanding() {
  const sellerAuthState = { from: '/seller/create', role: 'seller' }

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
