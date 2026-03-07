import React, { useState } from 'react'
import './ProductDetail.css'

function ProductDetail({ product, onClose }) {
  const { listing, photoUrls, amazonUrl } = product
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleBuyOnAmazon = () => {
    // In production, this would be the real Amazon product URL
    const url = amazonUrl || 'https://amazon.com'
    window.open(url, '_blank')
  }

  return (
    <div className="product-detail-overlay" onClick={onClose}>
      <div className="product-detail" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="detail-content">
          <div className="detail-images">
            <div className="main-image">
              <img 
                src={photoUrls[currentImageIndex]} 
                alt={listing.title}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x600?text=Handcrafted+Product'
                }}
              />
            </div>
            
            {photoUrls.length > 1 && (
              <div className="image-thumbnails">
                {photoUrls.map((url, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img src={url} alt={`View ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="detail-info">
            <div className="handmade-badge">
              <span>✨</span> Handcrafted by Artisan
            </div>

            <h1 className="detail-title">{listing.title}</h1>
            
            <div className="detail-category">
              <strong>Category:</strong> {listing.category}
            </div>

            <div className="detail-section">
              <h3>Key Features</h3>
              <ul className="feature-list">
                {listing.bulletPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>

            <div className="detail-section">
              <h3>Product Description</h3>
              <p className="detail-description">{listing.description}</p>
            </div>

            {listing.storyCard && (
              <div className="detail-section story-section">
                <h3>✨ Artisan Story</h3>
                <p className="story-text">{listing.storyCard}</p>
              </div>
            )}

            <div className="detail-tags">
              {listing.tags.map((tag, index) => (
                <span key={index} className="detail-tag">{tag}</span>
              ))}
            </div>

            <div className="detail-actions">
              <button className="amazon-btn" onClick={handleBuyOnAmazon}>
                <span className="amazon-icon">🛒</span>
                Buy on Amazon
              </button>
              <p className="amazon-note">
                Secure checkout and fulfillment by Amazon
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
