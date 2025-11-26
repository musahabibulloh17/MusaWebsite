import React, { useState, useEffect } from 'react'
import './LoadingScreen.css'

interface LoadingScreenProps {
  onComplete: () => void
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsComplete(true)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + 2
      })
    }, 30)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className={`loading-screen ${isComplete ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <div className="loading-logo">
          <div className="logo-circle">
            <span>M</span>
          </div>
        </div>
        <div className="loading-text">
          <h2>Musa Portfolio</h2>
          <p>Loading amazing 3D experiences...</p>
        </div>
        <div className="loading-bar">
          <div className="loading-progress" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="loading-percentage">{progress}%</div>
      </div>
    </div>
  )
}

export default LoadingScreen
