import React from 'react'
import './ProductCard.css'

function ProductCard({ product, onClick }) {
  const { listing, photoUrls, createdAt } = product
  
  const getDaysAgo = (dateString) => {
    const days = Math.floor((Date.now() - new Date(dateString)) / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    return `${days} days ago`
  }

  return (
    <div className="product-card" onClick={onClick}>
      <div className="product-image">
        <img 
          src={photoUrls[0]} 
          alt={listing.title}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x400?text=Handcrafted+Product'
          }}
        />
        <div className="product-badge">✨ Handmade</div>
      </div>
      
      <div className="product-info">
        <h3 className="product-title">{listing.title}</h3>
        
        <p className="product-description">
          {listing.description.substring(0, 100)}...
        </p>
        
        <div className="product-tags">
          {listing.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
        
        <div className="product-footer">
          <span className="product-date">{getDaysAgo(createdAt)}</span>
          <button className="view-btn">View Details →</button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
