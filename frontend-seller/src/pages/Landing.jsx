import React from 'react'
import { Link } from 'react-router-dom'
import './UploadProduct.css'

function Landing() {
  return (
    <div className="landing-page">
      <div className="onboarding-hero">
        <h1 className="onboarding-title">Sell on Artisan Marketplace</h1>
        <p className="onboarding-subtitle">
          Create your first product listing in a few guided steps. Log in or create an account to get started.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/login" className="primary-cta" style={{ textDecoration: 'none', textAlign: 'center' }}>
            Log in
          </Link>
          <Link
            to="/register"
            className="primary-cta"
            style={{
              textDecoration: 'none',
              textAlign: 'center',
              background: 'linear-gradient(to bottom, #e8e8e8, #d0d0d0)',
              borderColor: '#a2a6ac',
            }}
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Landing
