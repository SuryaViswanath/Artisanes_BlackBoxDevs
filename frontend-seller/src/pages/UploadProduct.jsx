import React, { useState } from 'react'
import PhotoUpload from '../components/PhotoUpload'
import VoiceRecorder from '../components/VoiceRecorder'
import AIChat from '../components/AIChat'
import ListingPreview from '../components/ListingPreview'
import './UploadProduct.css'

function UploadProduct({ seller, onBack }) {
  const [step, setStep] = useState(1)
  const [photos, setPhotos] = useState([])
  const [voiceNote, setVoiceNote] = useState(null)
  const [listing, setListing] = useState(null)
  const [chatData, setChatData] = useState(null)
  const [loading, setLoading] = useState(false)

  const handlePhotosUploaded = (uploadedPhotos) => {
    setPhotos(uploadedPhotos)
    setStep(2)
  }

  const handleVoiceRecorded = async (audioBlob) => {
    setVoiceNote(audioBlob)
    setLoading(true)
    
    try {
      // Upload voice and generate listing
      const formData = new FormData()
      formData.append('voice', audioBlob, 'voice-note.webm')
      formData.append('sellerId', seller.sellerId) // Add seller ID
      photos.forEach((photo, index) => {
        formData.append('photos', photo.file)
      })

      const response = await fetch('/api/upload/generate-listing', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      setListing(data.listing)
      setStep(3) // Go to AI chat
    } catch (error) {
      console.error('Error generating listing:', error)
      alert('Failed to generate listing. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChatComplete = (messages) => {
    setChatData(messages)
    setStep(4) // Go to preview
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="upload-container">
      <div className="upload-header">
        <button className="back-to-dashboard" onClick={onBack}>
          ← Back to Dashboard
        </button>
        <h2>Create New Product</h2>
      </div>

      <div className="progress-bar">
        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
          <span className="step-number">1</span>
          <span className="step-label">Photos</span>
        </div>
        <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
          <span className="step-number">2</span>
          <span className="step-label">Voice</span>
        </div>
        <div className={`progress-line ${step >= 3 ? 'active' : ''}`}></div>
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
          <span className="step-number">3</span>
          <span className="step-label">Details</span>
        </div>
        <div className={`progress-line ${step >= 4 ? 'active' : ''}`}></div>
        <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>
          <span className="step-number">4</span>
          <span className="step-label">Preview</span>
        </div>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Generating your listing with AI...</p>
        </div>
      )}

      {step === 1 && (
        <PhotoUpload onPhotosUploaded={handlePhotosUploaded} />
      )}

      {step === 2 && (
        <VoiceRecorder 
          onVoiceRecorded={handleVoiceRecorded}
          onBack={handleBack}
        />
      )}

      {step === 3 && listing && (
        <AIChat
          productContext={listing}
          onComplete={handleChatComplete}
        />
      )}

      {step === 4 && listing && (
        <ListingPreview 
          listing={listing}
          photos={photos}
          chatData={chatData}
          onBack={handleBack}
        />
      )}
    </div>
  )
}

export default UploadProduct
