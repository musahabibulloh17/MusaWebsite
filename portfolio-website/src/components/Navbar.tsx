import React, { useState } from 'react'
import './Navbar.css'
import { useTheme } from '../contexts/ThemeContext'

interface NavbarProps {
  currentPage: string
  setCurrentPage: (page: string) => void
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage }) => {
  const { theme, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'portfolio', label: 'Portfolio', icon: '💼' },
    { id: 'gallery3d', label: '3D Galeries', icon: '🎨' },
    { id: 'about', label: 'About', icon: '👤' },
    { id: 'contact', label: 'Contact', icon: '📧' }
  ]

  const handleNavClick = (page: string) => {
    setCurrentPage(page)
    setIsMenuOpen(false)
  }

  const toggleMenu = () => setIsMenuOpen(prev => !prev)

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>Musa Portfolio</h2>
        </div>
        
        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`} aria-expanded={isMenuOpen}>
          {navItems.map((item) => (
            <li key={item.id} className="navbar-item">
              <button
                className={`navbar-link ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <span className="navbar-icon">{item.icon}</span>
                <span className="navbar-text">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
        
        <div className="navbar-actions">
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          
          <button 
            className="navbar-toggle" 
            onClick={toggleMenu} 
            aria-label="Toggle navigation"
            aria-expanded={isMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

