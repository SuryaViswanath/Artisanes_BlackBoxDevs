import React, { useState } from 'react'
import PhotoUpload from '../components/PhotoUpload'
import VoiceRecorder from '../components/VoiceRecorder'
import AIChat from '../components/AIChat'
import ListingPreview from '../components/ListingPreview'
import { getToken } from '../api/client'
import './UploadProduct.css'

function UploadProduct() {
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
      photos.forEach((photo, index) => {
        formData.append('photos', photo.file)
      })

      const token = getToken()
      const headers = {}
      if (token) headers['Authorization'] = `Bearer ${token}`
      const response = await fetch('/api/upload/generate-listing', {
        method: 'POST',
        headers,
        body: formData,
      })

      const data = await response.json()
      if (response.status === 401) {
        window.location.href = '/login'
        return
      }
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Upload failed')
      }
      setListing(data.listing)
      setStep(3) // Go to AI chat
    } catch (error) {
      console.error('Error generating listing:', error)
      alert(error.message || 'Failed to generate listing. Please try again.')
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

  const visualSteps = [
    'Landing',
    'Account type',
    'Business information',
    'Identity verification',
    'Store setup',
    'Payment & banking',
    'Review & submit'
  ]

  return (
    <div className="onboarding-page">
      <div className="onboarding-layout">
        <aside className="onboarding-sidebar" aria-label="Onboarding progress">
          <h2 className="sidebar-title">Seller onboarding</h2>
          <ul className="sidebar-steps">
            {visualSteps.map((label, index) => {
              const visualIndex = index + 1
              const completed = step > visualIndex && visualIndex <= 4
              const current = step === visualIndex && visualIndex <= 4

              return (
                <li
                  key={label}
                  className={[
                    'sidebar-step',
                    completed ? 'sidebar-step--completed' : '',
                    current ? 'sidebar-step--current' : ''
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <span className="sidebar-step-icon">
                    {completed ? '✔' : visualIndex <= 4 ? visualIndex : '•'}
                  </span>
                  <div className="sidebar-step-text">
                    <span className="sidebar-step-label">{label}</span>
                    {visualIndex === step && visualIndex <= 4 && (
                      <span className="sidebar-step-status">In progress</span>
                    )}
                    {completed && <span className="sidebar-step-status">Completed</span>}
                  </div>
                </li>
              )
            })}
          </ul>
        </aside>

        <section className="onboarding-content">
          <div className="progress-header">
            <div className="progress-header-text">
              <span className="progress-step-count">
                Step {step} of 4
              </span>
              <span className="progress-step-caption">
                Guided listing creation, Amazon-style
              </span>
            </div>
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

          <div className="upload-container">
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
        </section>
      </div>
    </div>
  )
}

export default UploadProduct
