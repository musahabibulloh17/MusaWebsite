import React, { useEffect, useRef } from 'react'
import './ParticleBackground.css'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
}

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticles = () => {
      const particles: Particle[] = []
      // Turunkan densitas partikel untuk performa Chrome
      const targetDensity = 60000 // lebih jarang dibanding sebelumnya
      const maxParticles = 60
      const minParticles = 20
      let particleCount = Math.floor((canvas.width * canvas.height) / targetDensity)
      particleCount = Math.max(minParticles, Math.min(maxParticles, particleCount))
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2
        })
      }
      
      particlesRef.current = particles
    }

    // Throttle FPS dan hentikan saat tab tidak terlihat
    const targetFPS = 30
    const frameDuration = 1000 / targetFPS
    let lastTime = 0
    let isHidden = false
    const onVisibility = () => { isHidden = document.hidden }
    document.addEventListener('visibilitychange', onVisibility)

    const animate = () => {
      const now = performance.now()
      if (isHidden || (now - lastTime) < frameDuration) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }
      lastTime = now

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const len = particlesRef.current.length
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy
        
        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0
        
        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(102, 126, 234, ${particle.opacity})`
        ctx.fill()
        
        // Batasi jumlah koneksi per partikel untuk menghindari O(n^2) berat
        const maxConnections = 12
        for (let j = index + 1; j < len && j < index + 1 + maxConnections; j++) {
          const otherParticle = particlesRef.current[j]
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.strokeStyle = `rgba(102, 126, 234, ${0.08 * (1 - distance / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      })
      
      animationRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    createParticles()
    animate()

    window.addEventListener('resize', () => {
      resizeCanvas()
      createParticles()
    })

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="particle-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  )
}

export default ParticleBackground
