import React, { useState, useEffect, useRef } from 'react'
import './ProfileSetup.css'

function ProfileSetup({ seller, onComplete }) {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    startProfileConversation()
  }, [])

  const startProfileConversation = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/profile/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sellerId: seller.sellerId,
          sellerName: seller.name,
          businessName: seller.businessName
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setConversationId(data.conversationId)
        setMessages([{
          role: 'assistant',
          content: data.message,
          timestamp: new Date().toISOString()
        }])
      }
    } catch (error) {
      console.error('Error starting profile conversation:', error)
      setMessages([{
        role: 'assistant',
        content: `Hello ${seller.name}! I'm excited to learn about your craft and story. Let's start with the basics - what kind of products do you create, and what inspired you to become an artisan?`,
        timestamp: new Date().toISOString()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    
    if (!inputMessage.trim() || isLoading) return

    const userMessage = inputMessage.trim()
    setInputMessage('')
    
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    }])

    setIsLoading(true)

    try {
      const response = await fetch('/api/profile/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          sellerId: seller.sellerId,
          message: userMessage
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message,
          timestamp: new Date().toISOString()
        }])

        // Check if profile is complete
        if (data.profileComplete) {
          setTimeout(() => {
            onComplete(data.profile)
          }, 2000)
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting. Let's continue - tell me more about your craft!",
        timestamp: new Date().toISOString()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    onComplete(null)
  }

  return (
    <div className="profile-setup-container">
      <div className="profile-setup-card">
        <div className="profile-header">
          <div className="profile-title">
            <span className="profile-icon">✨</span>
            <div>
              <h2>Tell Us Your Story</h2>
              <p>Help buyers connect with your craft and passion</p>
            </div>
          </div>
          <button className="skip-btn" onClick={handleSkip}>
            Skip for now →
          </button>
        </div>

        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <div className="message-avatar">
                {msg.role === 'assistant' ? '🤖' : '👤'}
              </div>
              <div className="message-content">
                <p>{msg.content}</p>
                <span className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message assistant">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-form" onSubmit={sendMessage}>
          <input
            type="text"
            className="chat-input"
            placeholder="Share your story..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="send-btn"
            disabled={!inputMessage.trim() || isLoading}
          >
            Send
          </button>
        </form>

        <div className="profile-footer">
          <p>💡 This helps create authentic product listings that tell your unique story</p>
        </div>
      </div>
    </div>
  )
}

export default ProfileSetup
