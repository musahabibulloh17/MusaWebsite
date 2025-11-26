import React, { createContext, useContext, useState, useEffect } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('portfolio-theme')
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme
    }
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    return 'light'
  })

  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem('portfolio-theme', theme)
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme)
    
    // Update meta theme-color with iOS/macOS colors
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#000000' : '#ffffff')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'theme-color'
      meta.content = theme === 'dark' ? '#000000' : '#ffffff'
      document.head.appendChild(meta)
    }
    
    // Update body class for additional styling
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme'
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
