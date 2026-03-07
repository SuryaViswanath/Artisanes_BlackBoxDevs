import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Marketplace from './pages/Marketplace'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>Artisan Marketplace</h1>
          <p>Discover authentic handcrafted products</p>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Marketplace />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
