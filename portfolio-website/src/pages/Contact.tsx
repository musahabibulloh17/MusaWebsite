import React, { useState, useEffect } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import './Contact.css'

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  // Removed unused isVisible state
  const [headerRef, isHeaderVisible] = useScrollAnimation(0.2)
  const [contentRef, isContentVisible] = useScrollAnimation(0.1)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    alert('Terima kasih! Pesan Anda telah dikirim.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="contact">
      <div className="contact-header" ref={headerRef}>
        <div className="container">
          <h1 className={`page-title ${isHeaderVisible ? 'animate-in' : ''}`}>Hubungi Saya</h1>
          <p className={`page-subtitle ${isHeaderVisible ? 'animate-in' : ''}`}>
            Mari berkolaborasi dan wujudkan ide kreatif Anda bersama
          </p>
        </div>
      </div>

      <div className="contact-content" ref={contentRef}>
        <div className="container">
          <div className="contact-grid">
            <div className={`contact-info ${isContentVisible ? 'animate-in' : ''}`}>
              <div className="info-section">
                <h2>Mari Berbicara</h2>
                <p>
                  Saya selalu senang mendengar ide-ide baru dan proyek menarik. 
                  Jangan ragu untuk menghubungi saya jika Anda memiliki pertanyaan 
                  atau ingin berkolaborasi.
                </p>
              </div>

              <div className="contact-methods">
                <div className="contact-method">
                  <div className="method-icon">📧</div>
                  <div className="method-info">
                    <h3>Email</h3>
                    <p>musa@example.com</p>
                  </div>
                </div>
                <div className="contact-method">
                  <div className="method-icon">📱</div>
                  <div className="method-info">
                    <h3>Phone</h3>
                    <p>+62 812 3456 7890</p>
                  </div>
                </div>
                <div className="contact-method">
                  <div className="method-icon">📍</div>
                  <div className="method-info">
                    <h3>Location</h3>
                    <p>Jakarta, Indonesia</p>
                  </div>
                </div>
              </div>

              <div className="social-section">
                <h3>Follow Me</h3>
                <div className="social-links">
                  <a href="#" className="social-link">GitHub</a>
                  <a href="#" className="social-link">LinkedIn</a>
                  <a href="#" className="social-link">Instagram</a>
                  <a href="#" className="social-link">Twitter</a>
                </div>
              </div>
            </div>

            <div className={`contact-form-section ${isContentVisible ? 'animate-in' : ''}`}>
              <form className="contact-form" onSubmit={handleSubmit}>
                <h2>Kirim Pesan</h2>
                <div className="form-group">
                  <label htmlFor="name">Nama Lengkap</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Masukkan nama lengkap Anda"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Masukkan email Anda"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Masukkan subject pesan"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Pesan</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tulis pesan Anda di sini..."
                  />
                </div>
                <button type="submit" className="submit-btn">
                  Kirim Pesan
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
