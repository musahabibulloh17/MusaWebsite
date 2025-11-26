import React, { useState, useEffect, useRef } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import Button from '../components/Button'
import './Gallery3D.css'

const Gallery3D: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [headerRef, isHeaderVisible] = useScrollAnimation(0.2)
  const [contentRef, isContentVisible] = useScrollAnimation(0.1)
  const viewerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
    setIsFullScreen(false)
  }, [])

  useEffect(() => {
    return () => {
      setIsFullScreen(false)
    }
  }, [])

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  return (
    <div className={`gallery3d ${isFullScreen ? 'fullscreen' : ''}`}>
      <div className="gallery-header" ref={headerRef}>
        <div className="container">
          <h1 className={`page-title ${isHeaderVisible ? 'animate-in' : ''}`}>3D Gallery</h1>
          <p className={`page-subtitle ${isHeaderVisible ? 'animate-in' : ''}`}>
            Jelajahi galeri seni 3D interaktif dengan navigasi yang smooth
          </p>
          <div className="gallery-controls">
            <Button 
              variant="secondary" 
              size="medium" 
              onClick={toggleFullScreen}
              icon={isFullScreen ? "⤓" : "⤢"}
            >
              {isFullScreen ? "Exit Full Screen" : "Full Screen"}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="gallery-content" ref={contentRef}>
        <div className="gallery-container">
          <div className={`gallery-viewer ${isContentVisible ? 'animate-in' : ''}`}>
            <div className="embedded-viewer" ref={viewerRef}>
              <iframe 
                src="/wasd-viewer.html"
                className="embedded-iframe"
                title="3D Gallery Viewer"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Gallery3D
