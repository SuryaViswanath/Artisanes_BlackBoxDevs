import React, { useState, useEffect } from 'react'
import './Dashboard.css'

function Dashboard({ seller, onLogout, onNewProduct }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [seller.sellerId])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/sellers/${seller.sellerId}/products`)
      const data = await response.json()
      
      if (data.success) {
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="seller-info">
          <h1>👋 Welcome, {seller.name}!</h1>
          <p>{seller.businessName}</p>
        </div>
        <div className="header-actions">
          <button className="new-product-btn" onClick={onNewProduct}>
            + New Product
          </button>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{products.length}</h3>
            <p>Total Products</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{products.filter(p => p.status === 'published').length}</h3>
            <p>Published</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{products.filter(p => p.status === 'draft').length}</h3>
            <p>Drafts</p>
          </div>
        </div>
      </div>

      <div className="products-section">
        <h2>Your Products</h2>
        
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📦</span>
            <h3>No products yet</h3>
            <p>Start by creating your first product listing</p>
            <button className="create-first-btn" onClick={onNewProduct}>
              Create First Product
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.productId} className="product-card">
                <div className="product-image">
                  {product.photoUrls && product.photoUrls[0] ? (
                    <img src={product.photoUrls[0]} alt={product.listing?.title} />
                  ) : (
                    <div className="no-image">📷</div>
                  )}
                  <span className={`status-badge ${product.status}`}>
                    {product.status}
                  </span>
                </div>
                <div className="product-info">
                  <h3>{product.listing?.title || 'Untitled Product'}</h3>
                  <p className="product-date">
                    Created {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                  <div className="product-tags">
                    {product.listing?.tags?.slice(0, 3).map((tag, i) => (
                      <span key={i} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
