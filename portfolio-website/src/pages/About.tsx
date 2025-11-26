import React, { useState, useEffect } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import './About.css'

const About: React.FC = () => {
  // Removed unused isVisible state
  const [headerRef, isHeaderVisible] = useScrollAnimation(0.2)
  const [contentRef, isContentVisible] = useScrollAnimation(0.1)
  const [statsRef, isStatsVisible] = useScrollAnimation(0.1)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="about">
      <div className="about-header" ref={headerRef}>
        <div className="container">
          <h1 className={`page-title ${isHeaderVisible ? 'animate-in' : ''}`}>Tentang Saya</h1>
          <p className={`page-subtitle ${isHeaderVisible ? 'animate-in' : ''}`}>
            Mari kenali lebih dekat tentang passion dan perjalanan saya
          </p>
        </div>
      </div>

      <div className="about-content" ref={contentRef}>
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <div className={`text-section ${isContentVisible ? 'animate-in' : ''}`}>
                <h2>Halo, Saya Musa</h2>
                <p>
                  Saya adalah seorang 3D Artist dan Web Developer yang passionate 
                  dalam menciptakan pengalaman visual yang menakjubkan. Dengan 
                  kombinasi keahlian dalam 3D modeling dan web development, saya 
                  berusaha menghadirkan karya yang tidak hanya indah secara visual 
                  tetapi juga fungsional dan interaktif.
                </p>
                <p>
                  Passion saya dimulai dari kecintaan terhadap seni digital dan 
                  teknologi. Saya percaya bahwa teknologi terbaik adalah yang 
                  dapat menghubungkan manusia dengan pengalaman yang bermakna, 
                  dan itulah yang saya coba wujudkan dalam setiap proyek.
                </p>
              </div>

              <div className={`text-section ${isContentVisible ? 'animate-in' : ''}`}>
                <h3>Keahlian & Tools</h3>
                <div className="skills-grid">
                  <div className="skill-category">
                    <h4>3D Modeling</h4>
                    <ul>
                      <li>Blender</li>
                      <li>Maya</li>
                      <li>3ds Max</li>
                      <li>ZBrush</li>
                    </ul>
                  </div>
                  <div className="skill-category">
                    <h4>Web Development</h4>
                    <ul>
                      <li>React</li>
                      <li>Three.js</li>
                      <li>TypeScript</li>
                      <li>Node.js</li>
                    </ul>
                  </div>
                  <div className="skill-category">
                    <h4>3D Web</h4>
                    <ul>
                      <li>WebGL</li>
                      <li>GLTF/GLB</li>
                      <li>Interactive 3D</li>
                      <li>Real-time Rendering</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="about-visual">
              <div className={`profile-section ${isContentVisible ? 'animate-in' : ''}`}>
                <div className="profile-image">
                  <div className="avatar-large">M</div>
                </div>
                <div className="profile-info">
                  <h3>Musa</h3>
                  <p>3D Artist & Developer</p>
                  <div className="social-links">
                    <a href="#" className="social-link">GitHub</a>
                    <a href="#" className="social-link">LinkedIn</a>
                    <a href="#" className="social-link">Instagram</a>
                  </div>
                </div>
              </div>

              <div className={`stats-section ${isStatsVisible ? 'animate-in' : ''}`} ref={statsRef}>
                <div className="stat-item">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Proyek Selesai</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">3+</div>
                  <div className="stat-label">Tahun Pengalaman</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">100%</div>
                  <div className="stat-label">Client Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
