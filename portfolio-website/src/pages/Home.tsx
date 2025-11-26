import React, { useState, useEffect } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import Button from '../components/Button'
import './Home.css'

const Home: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [typingText, setTypingText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [featuresRef, isFeaturesVisible] = useScrollAnimation(0.2)

  const fullText = "Halo, Saya"
  const subtitle = "Seorang 3D Artist & Developer yang passionate dalam menciptakan pengalaman visual yang menakjubkan"

  useEffect(() => {
    setIsVisible(true)
    
    // Typing animation
    let index = 0
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setTypingText(fullText.slice(0, index + 1))
        index++
      } else {
        clearInterval(typingInterval)
        setShowCursor(false)
      }
    }, 100)

    return () => clearInterval(typingInterval)
  }, [])

  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className={`hero-title ${isVisible ? 'animate-in' : ''}`}>
              <span className="typing-text">
                {typingText}
                {showCursor && <span className="cursor">|</span>}
              </span>
              <span className="highlight"> Musa</span>
            </h1>
            <p className={`hero-subtitle ${isVisible ? 'animate-in' : ''}`}>
              {subtitle}
            </p>
            <div className={`hero-buttons ${isVisible ? 'animate-in' : ''}`}>
              <Button variant="primary" size="large">
                Lihat Portfolio
              </Button>
              <Button variant="secondary" size="large">
                3D Gallery
              </Button>
            </div>
          </div>
          <div className={`hero-image ${isVisible ? 'animate-in' : ''}`}>
            <div className="profile-card">
              <div className="profile-avatar">
                <div className="avatar-placeholder">M</div>
              </div>
              <h3>Musa</h3>
              <p>3D Artist & Developer</p>
            </div>
          </div>
        </div>
      </div>

      <div className="features-section" ref={featuresRef}>
        <div className="container">
          <h2 className={`section-title ${isFeaturesVisible ? 'animate-in' : ''}`}>Keahlian Saya</h2>
          <div className={`features-grid ${isFeaturesVisible ? 'animate-in' : ''}`}>
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>3D Modeling</h3>
              <p>Membuat model 3D yang detail dan realistis menggunakan berbagai software</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💻</div>
              <h3>Web Development</h3>
              <p>Mengembangkan aplikasi web interaktif dengan teknologi modern</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎮</div>
              <h3>Interactive 3D</h3>
              <p>Menciptakan pengalaman 3D interaktif di browser</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
