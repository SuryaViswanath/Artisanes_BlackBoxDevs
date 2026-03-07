import React, { useState, useEffect, useRef } from 'react'
import './AIChat.css'

function AIChat({ productContext, onComplete }) {
  const [conversationId, setConversationId] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStarting, setIsStarting] = useState(true)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    startConversation()
  }, [])

  const startConversation = async () => {
    setIsStarting(true)
    try {
      const response = await fetch('/api/conversation/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productContext })
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
      console.error('Error starting conversation:', error)
      setMessages([{
        role: 'assistant',
        content: "Hello! I'm here to help gather additional product details. Let's start with care instructions - how should customers care for this product?",
        timestamp: new Date().toISOString()
      }])
    } finally {
      setIsStarting(false)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    
    if (!inputMessage.trim() || isLoading) return

    const userMessage = inputMessage.trim()
    setInputMessage('')
    
    // Add user message immediately
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    }])

    setIsLoading(true)

    try {
      const response = await fetch('/api/conversation/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
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
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting. Let's continue - what else can you tell me about your product?",
        timestamp: new Date().toISOString()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    if (onComplete) {
      onComplete(messages)
    }
  }

  return (
    <div className="ai-chat">
      <div className="chat-header">
        <div className="chat-title">
          <span className="chat-icon">💬</span>
          <div>
            <h3>AI Product Assistant</h3>
            <p>Gathering additional details for FAQs and customer support</p>
          </div>
        </div>
        <button className="skip-btn" onClick={handleSkip}>
          Skip for now →
        </button>
      </div>

      <div className="chat-messages">
        {isStarting && (
          <div className="message-loading">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

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
          placeholder="Type your answer..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={isLoading || isStarting}
        />
        <button 
          type="submit" 
          className="send-btn"
          disabled={!inputMessage.trim() || isLoading || isStarting}
        >
          Send
        </button>
      </form>

      {messages.length >= 4 && (
        <div className="chat-actions">
          <button className="continue-btn" onClick={handleSkip}>
            ✓ Done - Continue to Preview
          </button>
        </div>
      )}

      <div className="chat-footer">
        <p>💡 Tip: This information helps create better FAQs and customer support</p>
      </div>
    </div>
  )
}

export default AIChat
