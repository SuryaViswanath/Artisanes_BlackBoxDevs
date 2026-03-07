import React, { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import ProductDetail from '../components/ProductDetail'
import './Marketplace.css'

function Marketplace() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/products')
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

  const handleProductClick = (product) => {
    setSelectedProduct(product)
  }

  const handleCloseDetail = () => {
    setSelectedProduct(null)
  }

  const filteredProducts = products.filter(product => {
    if (!searchQuery) return true
    
    const query = searchQuery.toLowerCase()
    const title = product.listing?.title?.toLowerCase() || ''
    const description = product.listing?.description?.toLowerCase() || ''
    const tags = product.listing?.tags?.join(' ').toLowerCase() || ''
    
    return title.includes(query) || description.includes(query) || tags.includes(query)
  })

  if (selectedProduct) {
    return <ProductDetail product={selectedProduct} onClose={handleCloseDetail} />
  }

  return (
    <div className="marketplace-container">
      <div className="marketplace-header">
        <h2>Discover Authentic Handcrafted Products</h2>
        <p>Support local artisans and find unique, handmade treasures</p>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for products, materials, or styles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading amazing products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <h3>No products found</h3>
          <p>Try adjusting your search or check back later for new items</p>
        </div>
      ) : (
        <>
          <div className="results-count">
            <p>Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}</p>
          </div>
          
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.productId}
                product={product}
                onClick={() => handleProductClick(product)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Marketplace
