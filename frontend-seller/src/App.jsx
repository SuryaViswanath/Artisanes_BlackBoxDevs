import React, { useState, useEffect } from 'react'
import UploadProduct from './pages/UploadProduct'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import ProfileSetup from './pages/ProfileSetup'
import './App.css'

function App() {
  const [seller, setSeller] = useState(null)
  const [view, setView] = useState('dashboard') // 'dashboard', 'upload', or 'profile'

  useEffect(() => {
    // Check if seller is logged in
    const storedSeller = localStorage.getItem('seller')
    if (storedSeller) {
      const sellerData = JSON.parse(storedSeller)
      setSeller(sellerData)
      
      // Show profile setup if profile not complete
      if (!sellerData.profileComplete) {
        setView('profile')
      }
    }
  }, [])

  const handleLogin = (sellerData) => {
    setSeller(sellerData)
    
    // Show profile setup for new sellers
    if (!sellerData.profileComplete) {
      setView('profile')
    } else {
      setView('dashboard')
    }
  }

  const handleProfileComplete = (profile) => {
    // Update seller with profile data
    const updatedSeller = { ...seller, ...profile, profileComplete: true }
    setSeller(updatedSeller)
    localStorage.setItem('seller', JSON.stringify(updatedSeller))
    setView('dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('seller')
    setSeller(null)
    setView('dashboard')
  }

  const handleNewProduct = () => {
    setView('upload')
  }

  const handleBackToDashboard = () => {
    setView('dashboard')
  }

  if (!seller) {
    return <Auth onLogin={handleLogin} />
  }

  if (view === 'profile') {
    return <ProfileSetup seller={seller} onComplete={handleProfileComplete} />
  }

  if (view === 'upload') {
    return <UploadProduct seller={seller} onBack={handleBackToDashboard} />
  }

  return (
    <Dashboard 
      seller={seller} 
      onLogout={handleLogout}
      onNewProduct={handleNewProduct}
    />
  )
}

export default App
