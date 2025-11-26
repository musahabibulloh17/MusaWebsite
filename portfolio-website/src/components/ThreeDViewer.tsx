import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import './ThreeDViewer.css'

interface ThreeDViewerProps {
  onClose: () => void
}

const ThreeDViewer: React.FC<ThreeDViewerProps> = ({ onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<any>(null)
  const rendererRef = useRef<any>(null)
  const cameraRef = useRef<any>(null)
  const controlsRef = useRef<any>(null)
  const modelRef = useRef<any>(null)

  useEffect(() => {
    const initThreeD = () => {
      if (!containerRef.current) return

      // Create scene
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x222222)
      sceneRef.current = scene

      // Create camera with optimized settings for quality
      const camera = new THREE.PerspectiveCamera(
        75, // Field of view
        window.innerWidth / window.innerHeight,
        0.01, // Closer near plane for better detail
        1000 // Far plane
      )
      camera.position.set(0, 1, 2)
      cameraRef.current = camera

      // Create renderer with high quality settings
      const renderer = new THREE.WebGLRenderer({
        antialias: true, // Enable anti-aliasing for smooth edges
        alpha: false,
        powerPreference: "high-performance",
        precision: "highp", // High precision for better quality
        logarithmicDepthBuffer: false,
        preserveDrawingBuffer: false,
        failIfMajorPerformanceCaveat: false
      })
      renderer.setSize(window.innerWidth, window.innerHeight)
      // Use full device pixel ratio for crisp rendering on high-DPI displays
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5))
      // Enable high-quality shadow maps
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap // Soft shadows for better quality
      // Use outputColorSpace for newer Three.js versions, fallback to outputEncoding
      if ('outputColorSpace' in renderer) {
        (renderer as any).outputColorSpace = 'srgb'
      } else {
        (renderer as any).outputEncoding = (THREE as any).sRGBEncoding
      }
      // Physically correct lighting
      if ('useLegacyLights' in renderer) {
        (renderer as any).useLegacyLights = false
      } else {
        (renderer as any).physicallyCorrectLights = true
      }
      renderer.toneMapping = THREE.ACESFilmicToneMapping // Better tone mapping
      renderer.toneMappingExposure = 1.2
      renderer.sortObjects = true // Enable sorting for proper rendering
      rendererRef.current = renderer

      // Add renderer to container
      containerRef.current.appendChild(renderer.domElement)

      // Add high-quality lighting with shadows
      const ambientLight = new THREE.AmbientLight(0x404040, 0.5)
      scene.add(ambientLight)

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
      directionalLight.position.set(5, 10, 5)
      directionalLight.castShadow = true
      // High-quality shadow settings
      directionalLight.shadow.mapSize.width = 2048
      directionalLight.shadow.mapSize.height = 2048
      directionalLight.shadow.camera.near = 0.5
      directionalLight.shadow.camera.far = 50
      directionalLight.shadow.camera.left = -10
      directionalLight.shadow.camera.right = 10
      directionalLight.shadow.camera.top = 10
      directionalLight.shadow.camera.bottom = -10
      directionalLight.shadow.bias = -0.0001
      directionalLight.shadow.normalBias = 0.02
      scene.add(directionalLight)

      // Add additional fill light for better illumination
      const fillLight = new THREE.DirectionalLight(0xffffff, 0.3)
      fillLight.position.set(-5, 5, -5)
      scene.add(fillLight)

      // Load 3D model with optimizations
      const loader = new GLTFLoader()
      
      // Show loading status
      const statusElement = document.querySelector('.viewer-info .performance-info')
      if (statusElement) {
        (statusElement as HTMLElement).innerHTML = '<p>📥 Memuat model 3D...</p>'
      }
      
      loader.load(
        '/art-gallery.glb',
        (gltf) => {
          const model = gltf.scene
          
          // Optimize model for balanced performance
          model.scale.set(0.4, 0.4, 0.4) // Balanced scale for good performance
          model.position.set(0, 0, 0)
          
          // High-quality rendering optimizations
          model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true // Enable shadow casting
            child.receiveShadow = true // Enable shadow receiving
            child.frustumCulled = true // Enable frustum culling
            
            // Enhance materials for better quality
            const material = child.material
            if (material) {
              // Helper function to improve texture quality
              const improveTextureQuality = (texture: THREE.Texture | null) => {
                if (texture) {
                  texture.minFilter = THREE.LinearMipmapLinearFilter
                  texture.magFilter = THREE.LinearFilter
                  texture.anisotropy = 16 // High anisotropy for crisp textures
                  texture.generateMipmaps = true
                }
              }

              if (Array.isArray(material)) {
                material.forEach((mat: THREE.Material) => {
                  if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
                    mat.transparent = false
                    mat.alphaTest = 0.1
                    // Improve all texture maps for maximum quality
                    improveTextureQuality(mat.map)
                    improveTextureQuality(mat.normalMap)
                    improveTextureQuality(mat.roughnessMap)
                    improveTextureQuality(mat.metalnessMap)
                    improveTextureQuality(mat.aoMap)
                    improveTextureQuality(mat.emissiveMap)
                    improveTextureQuality(mat.bumpMap)
                    improveTextureQuality(mat.displacementMap)
                  }
                })
              } else {
                if (material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshPhysicalMaterial) {
                  material.transparent = false
                  material.alphaTest = 0.1
                  // Improve all texture maps for maximum quality
                  improveTextureQuality(material.map)
                  improveTextureQuality(material.normalMap)
                  improveTextureQuality(material.roughnessMap)
                  improveTextureQuality(material.metalnessMap)
                  improveTextureQuality(material.aoMap)
                  improveTextureQuality(material.emissiveMap)
                  improveTextureQuality(material.bumpMap)
                  improveTextureQuality(material.displacementMap)
                }
              }
            }
            
            // Compute geometry bounds for optimization
            const geometry = child.geometry
            if (geometry) {
              geometry.computeBoundingBox()
              geometry.computeBoundingSphere()
            }
          }
        })
        
          scene.add(model)
          modelRef.current = model
          
          // Update status on success
          if (statusElement) {
            (statusElement as HTMLElement).innerHTML = '<p>✅ Model berhasil dimuat!</p>'
          }
        },
        // Progress callback with Infinity fix
        (progress) => {
          let percent = 0
          if (progress.total && progress.total > 0) {
            percent = Math.round((progress.loaded / progress.total) * 100)
            percent = Math.min(100, Math.max(0, percent))
          } else {
            // Indeterminate progress if total is unknown
            percent = progress.loaded > 0 ? Math.min(99, Math.round(progress.loaded / 1000000)) : 0
          }
          
          if (statusElement) {
            (statusElement as HTMLElement).innerHTML = `<p>📥 Memuat model 3D... ${percent}%</p>`
          }
          console.log('📊 Loading progress:', progress.loaded, '/', progress.total, '=', percent + '%')
        },
        (error) => {
          console.error('Error loading 3D model:', error)
          const errorMessage = error instanceof Error ? error.message : 'Gagal memuat model'
          if (statusElement) {
            (statusElement as HTMLElement).innerHTML = `<p>❌ Error: ${errorMessage}</p>`
          }
        }
      )

      // Setup PointerLockControls for FPS-style navigation
      const controls = new PointerLockControls(camera, renderer.domElement)
      scene.add(controls.object)
      controlsRef.current = controls

      // WASD movement variables (like original project)
      let moveForward = false
      let moveBackward = false
      let moveLeft = false
      let moveRight = false
      let prevTime = performance.now()
      let velocity = new THREE.Vector3()
      let direction = new THREE.Vector3()
      let isPointerLocked = false

      // Event listeners for WASD (like original project)
      const onKeyDown = (event: KeyboardEvent) => {
        switch (event.code) {
          case 'KeyW':
            moveForward = true
            break
          case 'KeyS':
            moveBackward = true
            break
          case 'KeyA':
            moveLeft = true
            break
          case 'KeyD':
            moveRight = true
            break
        }
      }

      const onKeyUp = (event: KeyboardEvent) => {
        switch (event.code) {
          case 'KeyW':
            moveForward = false
            break
          case 'KeyS':
            moveBackward = false
            break
          case 'KeyA':
            moveLeft = false
            break
          case 'KeyD':
            moveRight = false
            break
        }
      }

      // Animation loop with WASD movement (like original project)
      // Optimized FPS for smooth high-quality rendering
      const targetFPS = 60 // Higher FPS for smoother experience
      const frameInterval = 1000 / targetFPS
      let lastRender = 0
      let isTabHidden = false
      const onVisibility = () => { isTabHidden = document.hidden }
      document.addEventListener('visibilitychange', onVisibility)

      const animate = () => {
        requestAnimationFrame(animate)
        const now = performance.now()
        if (isTabHidden || (now - lastRender) < frameInterval) {
          return
        }
        lastRender = now
        
        const time = performance.now()
        
        // WASD movement (like original project)
        if (isPointerLocked) {
          const delta = (time - prevTime) / 1000
          
          velocity.x -= velocity.x * 10.0 * delta
          velocity.z -= velocity.z * 10.0 * delta
          
          direction.z = Number(moveForward) - Number(moveBackward)
          direction.x = Number(moveRight) - Number(moveLeft)
          direction.normalize()
          
          if (moveForward || moveBackward) velocity.z -= direction.z * 20.0 * delta
          if (moveLeft || moveRight) velocity.x -= direction.x * 20.0 * delta
          
          controls.moveRight(-velocity.x * delta)
          controls.moveForward(-velocity.z * delta)
        }
        
        prevTime = time
        renderer.render(scene, camera)
      }

      // Pointer lock event listeners (like original project)
      controls.addEventListener('lock', () => {
        isPointerLocked = true
        console.log('✅ Pointer locked - WASD active')
        const statusDot = document.querySelector('.status-dot') as HTMLElement
        const statusText = document.querySelector('.status-text') as HTMLElement
        const statusIndicator = document.querySelector('.pointer-lock-status') as HTMLElement
        
        if (statusDot) statusDot.classList.add('active')
        if (statusText) statusText.textContent = 'WASD Navigation Active!'
        if (statusIndicator) statusIndicator.classList.add('show')
      })
      
      controls.addEventListener('unlock', () => {
        isPointerLocked = false
        console.log('❌ Pointer unlocked')
        const statusDot = document.querySelector('.status-dot') as HTMLElement
        const statusText = document.querySelector('.status-text') as HTMLElement
        const statusIndicator = document.querySelector('.pointer-lock-status') as HTMLElement
        
        if (statusDot) statusDot.classList.remove('active')
        if (statusText) statusText.textContent = 'Click to activate WASD'
        if (statusIndicator) statusIndicator.classList.remove('show')
      })

      const onPointerLockError = () => {
        console.error('Pointer lock failed')
      }

      // Canvas click handler for pointer lock (like original project)
      const onCanvasClick = () => {
        if (!isPointerLocked) {
          console.log('🖱️ Click detected - locking pointer...')
          controls.lock()
        }
      }
      
      // Add event listeners
      document.addEventListener('keydown', onKeyDown)
      document.addEventListener('keyup', onKeyUp)
      document.addEventListener('pointerlockerror', onPointerLockError)
      renderer.domElement.addEventListener('click', onCanvasClick)

      // ESC key to close viewer
      const onEscKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          const instructions = document.querySelector('.wasd-instructions') as HTMLElement
          if (instructions) instructions.classList.remove('show')
          onClose()
        }
      }
      document.addEventListener('keydown', onEscKey)

      // Start animation
      animate()

      // Handle resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }

      window.addEventListener('resize', handleResize)

      // Cleanup function
      return () => {
        document.removeEventListener('keydown', onKeyDown)
        document.removeEventListener('keyup', onKeyUp)
        document.removeEventListener('pointerlockerror', onPointerLockError)
        document.removeEventListener('keydown', onEscKey)
        window.removeEventListener('resize', handleResize)
        renderer.domElement.removeEventListener('click', onCanvasClick)
        if (containerRef.current && renderer.domElement) {
          containerRef.current.removeChild(renderer.domElement)
        }
        renderer.dispose()
      }
    }

    initThreeD()
  }, [])

  return (
    <div className="three-d-viewer">
      <div className="viewer-overlay">
        <div className="viewer-info">
          <button className="close-btn" onClick={onClose}>✕</button>
          <h2>🎨 3D Art Gallery</h2>
          <p>Selamat datang di galeri seni virtual!</p>
          <div className="performance-info">
            <p>✨ Mode kualitas tinggi diaktifkan</p>
            <p>🎯 60 FPS untuk pengalaman yang smooth</p>
            <p>🚀 Kualitas visual maksimal dengan anti-aliasing & shadows</p>
          </div>
          <div className="controls-info">
            <p>🎮 WASD to move</p>
            <p>🖱️ Mouse to look around</p>
            <p>👆 Click to activate</p>
            <p>⌨️ ESC untuk keluar dari navigasi</p>
          </div>
          <button className="start-button" onClick={() => {
            const overlay = document.querySelector('.viewer-overlay') as HTMLElement
            const instructions = document.querySelector('.wasd-instructions') as HTMLElement
            if (overlay) overlay.classList.add('hidden')
            if (instructions) instructions.classList.add('show')
            
            // Request pointer lock
            if (controlsRef.current) {
              controlsRef.current.lock()
            }
          }}>
            🚀 Mulai Eksplorasi FPS
          </button>
        </div>
      </div>
      <div ref={containerRef} className="viewer-container"></div>
      
      {/* WASD Instructions Overlay */}
      <div className="wasd-instructions">
        <div className="instruction-grid">
          <div className="instruction-item">
            <span className="key">W</span>
            <span className="action">Move Forward</span>
          </div>
          <div className="instruction-item">
            <span className="key">S</span>
            <span className="action">Move Backward</span>
          </div>
          <div className="instruction-item">
            <span className="key">A</span>
            <span className="action">Move Left</span>
          </div>
          <div className="instruction-item">
            <span className="key">D</span>
            <span className="action">Move Right</span>
          </div>
          <div className="instruction-item">
            <span className="key">Mouse</span>
            <span className="action">Look Around</span>
          </div>
          <div className="instruction-item">
            <span className="key">ESC</span>
            <span className="action">Exit</span>
          </div>
        </div>
      </div>

      {/* Pointer Lock Status Indicator */}
      <div className="pointer-lock-status">
        <div className="status-indicator">
          <div className="status-dot"></div>
          <span className="status-text">Click to activate WASD</span>
        </div>
      </div>
    </div>
  )
}

export default ThreeDViewer
