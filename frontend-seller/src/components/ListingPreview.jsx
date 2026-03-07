import React, { useState } from 'react'
import './ListingPreview.css'

function ListingPreview({ listing, photos, onBack }) {
  const [isPublishing, setIsPublishing] = useState(false)
  const [published, setPublished] = useState(false)

  const handlePublish = async () => {
    setIsPublishing(true)
    
    // Simulate publishing to Amazon
    // In production, this would call Amazon SP-API
    setTimeout(() => {
      setIsPublishing(false)
      setPublished(true)
      alert('🎉 Listing published successfully! (Mock - Amazon SP-API integration coming soon)')
    }, 2000)
  }

  return (
    <div className="listing-preview">
      <h2>Your Amazon Listing Preview</h2>
      <p className="subtitle">Review your AI-generated listing</p>

      <div className="preview-card">
        <div className="preview-images">
          {photos.map((photo, index) => (
            <img 
              key={index} 
              src={URL.createObjectURL(photo.file)} 
              alt={`Product ${index + 1}`}
            />
          ))}
        </div>

        <div className="preview-content">
          <div className="amazon-badge">
            <span>🛒</span> Amazon Listing
          </div>

          <h3 className="product-title">{listing.title}</h3>
          
          {listing.category && (
            <div className="product-category">
              <strong>Category:</strong> {listing.category}
            </div>
          )}

          {listing.bulletPoints && listing.bulletPoints.length > 0 && (
            <div className="bullet-points">
              <h4>Key Features:</h4>
              <ul>
                {listing.bulletPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="product-description">
            <h4>Product Description:</h4>
            <p>{listing.description}</p>
          </div>

          {listing.tags && listing.tags.length > 0 && (
            <div className="product-tags">
              <h4>Search Tags:</h4>
              <div className="tags-list">
                {listing.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {listing.storyCard && (
            <div className="story-card">
              <h4>✨ Artisan Story:</h4>
              <p>{listing.storyCard}</p>
            </div>
          )}
        </div>
      </div>

      <div className="listing-stats">
        <div className="stat">
          <span className="stat-label">Title Length</span>
          <span className="stat-value">{listing.title?.length || 0} chars</span>
        </div>
        <div className="stat">
          <span className="stat-label">Bullet Points</span>
          <span className="stat-value">{listing.bulletPoints?.length || 0}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Tags</span>
          <span className="stat-value">{listing.tags?.length || 0}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Photos</span>
          <span className="stat-value">{photos.length}</span>
        </div>
      </div>

      <div className="preview-actions">
        <button className="back-btn" onClick={onBack} disabled={isPublishing}>
          ← Edit
        </button>
        <button 
          className={`publish-btn ${published ? 'published' : ''}`}
          onClick={handlePublish}
          disabled={isPublishing || published}
        >
          {isPublishing ? '⏳ Publishing...' : published ? '✓ Published' : '🚀 Publish to Amazon'}
        </button>
      </div>

      {published && (
        <div className="success-message">
          <p>✅ Your listing is now live on Amazon!</p>
          <p className="note">Note: This is a POC. Real Amazon SP-API integration coming soon.</p>
        </div>
      )}
    </div>
  )
}

export default ListingPreview
