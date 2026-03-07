import React, { useState, useRef, useEffect } from 'react'
import './VoiceRecorder.css'

function VoiceRecorder({ onVoiceRecorded, onBack }) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      mediaRecorderRef.current = new MediaRecorder(stream)
      chunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioBlob(blob)
        setAudioUrl(url)
        
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Could not access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1)
        }, 1000)
      } else {
        mediaRecorderRef.current.pause()
        if (timerRef.current) clearInterval(timerRef.current)
      }
      setIsPaused(!isPaused)
    }
  }

  const resetRecording = () => {
    setAudioBlob(null)
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    setAudioUrl(null)
    setRecordingTime(0)
    setIsPaused(false)
  }

  const handleContinue = () => {
    if (audioBlob) {
      onVoiceRecorded(audioBlob)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="voice-recorder">
      <h2>Record Your Story</h2>
      <p className="subtitle">
        Tell us about your product in 20-60 seconds
        <span
          className="field-tooltip"
          aria-label="Use a clear, natural speaking voice and mention key product details."
          title="Describe materials, craftsmanship, and what makes this product unique."
        >
          ?
        </span>
      </p>

      <div className="recorder-card">
        {!audioBlob ? (
          <>
            <div className={`recording-indicator ${isRecording ? 'active' : ''}`}>
              <div className="mic-icon" aria-hidden="true" />
              {isRecording && <div className="pulse"></div>}
            </div>

            <div className="recording-time">
              {formatTime(recordingTime)}
              {recordingTime >= 60 && <span className="time-warning"> (Max 60s)</span>}
            </div>

            <div className="recording-controls">
              {!isRecording ? (
                <button className="record-btn" onClick={startRecording}>
                  Start Recording
                </button>
              ) : (
                <>
                  <button className="pause-btn" onClick={pauseRecording}>
                    {isPaused ? 'Resume' : 'Pause'}
                  </button>
                  <button className="stop-btn" onClick={stopRecording}>
                    Stop
                  </button>
                </>
              )}
            </div>

            <div className="recording-tips">
              <h3>What to include:</h3>
              <ul>
                <li>What materials did you use?</li>
                <li>What technique or craft did you apply?</li>
                <li>How long did it take to make?</li>
                <li>What's the story behind this product?</li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <div className="playback-section">
              <div className="audio-success-indicator" aria-hidden="true" />
              <p className="success-message">Recording complete!</p>
              
              <audio controls src={audioUrl} className="audio-player">
                Your browser does not support audio playback.
              </audio>

              <button className="reset-btn" onClick={resetRecording}>
                Record Again
              </button>
            </div>
          </>
        )}
      </div>

      <div className="navigation-buttons">
        <button className="back-btn" onClick={onBack}>
          Back to Photos
        </button>
        <button 
          className="continue-btn"
          onClick={handleContinue}
          disabled={!audioBlob}
        >
          Generate Listing
        </button>
      </div>
    </div>
  )
}

export default VoiceRecorder
