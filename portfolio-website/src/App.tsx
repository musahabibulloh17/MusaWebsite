import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import LoadingScreen from './components/LoadingScreen'
import ParticleBackground from './components/ParticleBackground'
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import Gallery3D from './pages/Gallery3D'
import About from './pages/About'
import Contact from './pages/Contact'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handlePageChange = (page: string) => {
    if (page !== currentPage) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentPage(page)
        setIsTransitioning(false)
      }, 300)
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />
      case 'portfolio':
        return <Portfolio />
      case 'gallery3d':
        return <Gallery3D />
      case 'about':
        return <About />
      case 'contact':
        return <Contact />
      default:
        return <Home />
    }
  }

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />
  }

  return (
    <ThemeProvider>
      <div className="App">
        <ParticleBackground />
        <Navbar currentPage={currentPage} setCurrentPage={handlePageChange} />
        <main className={`main-content ${isTransitioning ? 'page-transition' : ''}`}>
          {renderPage()}
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App