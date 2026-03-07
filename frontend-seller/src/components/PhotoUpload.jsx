import React, { useState, useRef } from 'react'
import './PhotoUpload.css'

function PhotoUpload({ onPhotosUploaded }) {
  const [photos, setPhotos] = useState([])
  const [previews, setPreviews] = useState([])
  const fileInputRef = useRef(null)

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    
    if (photos.length + files.length > 3) {
      alert('You can upload maximum 3 photos')
      return
    }

    const newPhotos = []
    const newPreviews = []

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        newPhotos.push({ file, id: Date.now() + Math.random() })
        
        const reader = new FileReader()
        reader.onload = (e) => {
          newPreviews.push(e.target.result)
          if (newPreviews.length === files.length) {
            setPhotos([...photos, ...newPhotos])
            setPreviews([...previews, ...newPreviews])
          }
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const handleRemovePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index))
    setPreviews(previews.filter((_, i) => i !== index))
  }

  const handleContinue = () => {
    if (photos.length === 0) {
      alert('Please upload at least 1 photo')
      return
    }
    onPhotosUploaded(photos)
  }

  return (
    <div className="photo-upload">
      <h2>Upload Product Photos</h2>
      <p className="subtitle">
        Add 2-3 clear photos of your product
        <span
          className="field-tooltip"
          aria-label="Photos should be well lit, in focus, and show the product clearly."
          title="Use bright, even lighting and avoid cluttered backgrounds."
        >
          ?
        </span>
      </p>

      <div className="photo-grid">
        {previews.map((preview, index) => (
          <div key={index} className="photo-preview">
            <img src={preview} alt={`Product ${index + 1}`} />
            <button 
              className="remove-btn"
              onClick={() => handleRemovePhoto(index)}
            >
              ×
            </button>
          </div>
        ))}

        {photos.length < 3 && (
          <div 
            className="photo-upload-box"
            onClick={() => fileInputRef.current?.click()}
          >
            <p>Click to upload</p>
            <span className="upload-hint">JPEG or PNG</span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      <div className="photo-tips">
        <h3>Tips for great photos:</h3>
        <ul>
          <li>Use natural lighting</li>
          <li>Show product from different angles</li>
          <li>Include close-ups of details</li>
          <li>Use a clean, simple background</li>
        </ul>
      </div>

      <button 
        className="continue-btn"
        onClick={handleContinue}
        disabled={photos.length === 0}
      >
        Continue to Voice Note
      </button>
    </div>
  )
}

export default PhotoUpload
