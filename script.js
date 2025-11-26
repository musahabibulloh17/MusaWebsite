// Global variables
let scene, camera, renderer, controls;
let gltfLoader;
let galleryModel;

// Movement variables for WASD
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let prevTime = performance.now();
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
let isPointerLocked = false;

// Simple WASD navigation

// Collision detection variables
let lastValidPosition = new THREE.Vector3();

// Fixed direction for straight movement
let initialDirection = new THREE.Vector3(); // Arah gerakan tetap


// Initialize the 3D scene
function init() {
    console.log('🚀 Initializing WASD GLB viewer...');
    
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222); // Dark background
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1, 2); // Closer initial camera position
    
    // Create renderer with ULTRA performance optimizations
    renderer = new THREE.WebGLRenderer({ 
        antialias: false, // Disable antialiasing for performance
        alpha: false,
        powerPreference: "high-performance",
        precision: "lowp", // Lower precision for better performance
        logarithmicDepthBuffer: false // Disable for performance
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(1); // Force pixel ratio to 1 for maximum performance
    renderer.shadowMap.enabled = false; // Disable shadows for performance
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.physicallyCorrectLights = false; // Disable for performance
    renderer.toneMapping = THREE.NoToneMapping; // Disable tone mapping
    document.body.appendChild(renderer.domElement);
    
    
    // Add lighting
    setupLighting();
    
    // Setup pointer lock controls for WASD navigation
    setupControls();
    
    // Initialize GLTF loader
    if (THREE.GLTFLoader) {
        gltfLoader = new THREE.GLTFLoader();
        console.log('✅ GLTFLoader initialized');
    } else {
        console.error('❌ THREE.GLTFLoader not available!');
        return;
    }
    
    // Load the gallery model
    loadGalleryModel();
    
    // Add event listeners
    setupEventListeners();
    
    // Start animation loop
    animate();
}

function setupLighting() {
    // ULTRA minimal lighting for maximum performance
    const ambientLight = new THREE.AmbientLight(0x404040, 1.0); // Higher intensity to compensate
    scene.add(ambientLight);
    
    // Single directional light - no shadows, minimal calculations
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = false; // Explicitly disable shadows
    scene.add(directionalLight);
}

function loadGalleryModel() {
    // Show loading progress
    const loadingElement = document.querySelector('.loader p');
    loadingElement.textContent = 'Memuat Model 3D...';
    
    console.log('🚀 Starting to load GLB model...');
    
    // Test if file is accessible
    fetch('asset/art galeries musa.glb', { method: 'HEAD' })
        .then(response => {
            console.log('📁 File accessibility test:', response.status, response.statusText);
            if (response.status === 200) {
                console.log('✅ GLB file is accessible');
            } else {
                console.error('❌ GLB file not accessible:', response.status);
            }
        })
        .catch(error => {
            console.error('❌ GLB file fetch error:', error);
        });
    
    gltfLoader.load(
        'asset/art galeries musa.glb',
        function(gltf) {
            console.log('✅ GLB model loaded successfully!', gltf);
            console.log('📦 Model children:', gltf.scene.children.length);
            galleryModel = gltf.scene;
            
            // Scale and position the model
            galleryModel.scale.setScalar(1);
            galleryModel.position.set(0, 0, 0);
            
            // ULTRA optimize model for maximum performance
            galleryModel.traverse(function(child) {
                if (child.isMesh) {
                    // Disable shadows for performance
                    child.castShadow = false;
                    child.receiveShadow = false;
                    
                    // Reduce geometry complexity
                    if (child.geometry) {
                        child.geometry.computeBoundingBox();
                        child.geometry.computeBoundingSphere();
                    }
                    
                    // Ultra-optimize materials
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(mat => ultraOptimizeMaterial(mat));
                        } else {
                            ultraOptimizeMaterial(child.material);
                        }
                    }
                    
                    // Reduce draw calls by merging geometries if possible
                    child.frustumCulled = true; // Enable frustum culling
                    child.matrixAutoUpdate = false; // Disable auto matrix updates
                    
                    console.log('Mesh ultra-optimized:', child.name);
                }
            });
            
            scene.add(galleryModel);
            console.log('✅ Model added to scene');
            
            // Position camera for WASD navigation
            positionCameraForWASD();
            
            // Hide loading screen IMMEDIATELY after model is loaded
            console.log('🎯 Hiding loading screen...');
            document.getElementById('loading-screen').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loading-screen').style.display = 'none';
                console.log('✅ Loading screen hidden - Click to activate WASD');
            }, 500);
        },
        function(progress) {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            loadingElement.textContent = `Memuat Model 3D... ${percent}%`;
            console.log('Loading progress:', percent + '%');
        },
        function(error) {
            console.error('Error loading GLB model:', error);
            loadingElement.textContent = 'Error memuat model GLB - ' + error.message;
            
            // Try alternative path
            console.log('Trying alternative path...');
            gltfLoader.load(
                'asset/art galeries musa.glb',
                function(gltf) {
                    console.log('GLB model loaded with alternative path!', gltf);
                    galleryModel = gltf.scene;
                    galleryModel.scale.setScalar(1);
                    galleryModel.position.set(0, 0, 0);
                    
                    galleryModel.traverse(function(child) {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    
                    scene.add(galleryModel);
                    positionCameraForWASD();
                    
                    setTimeout(() => {
                        document.getElementById('loading-screen').style.opacity = '0';
                        setTimeout(() => {
                            document.getElementById('loading-screen').style.display = 'none';
                        }, 500);
                    }, 1000);
                },
                function(progress) {
                    const percent = Math.round((progress.loaded / progress.total) * 100);
                    loadingElement.textContent = `Memuat Model 3D... ${percent}%`;
                },
                function(error2) {
                    console.error('Both paths failed:', error2);
                    loadingElement.textContent = 'File GLB tidak ditemukan. Menampilkan fallback...';
                    
                    // Add fallback cube
                    const geometry = new THREE.BoxGeometry(2, 2, 2);
                    const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
                    const cube = new THREE.Mesh(geometry, material);
                    cube.position.set(0, 1, 0);
                    scene.add(cube);
                    
                    setTimeout(() => {
                        document.getElementById('loading-screen').style.opacity = '0';
                        setTimeout(() => {
                            document.getElementById('loading-screen').style.display = 'none';
                        }, 500);
                    }, 1000);
                }
            );
        }
    );
}

function positionCameraForWASD() {
    if (!galleryModel) return;
    
    const box = new THREE.Box3().setFromObject(galleryModel);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    console.log('Model bounds:', box);
    console.log('Model center:', center);
    console.log('Model size:', size);
    
    // Position camera INSIDE the gallery room at proper height
    // Force camera to a specific position that works
    camera.position.set(2, 1.5, 6); // Fixed position that should work
    camera.lookAt(0, 1.5, -2); // Look toward the back of the gallery
    
    // Store initial position as valid
    lastValidPosition.copy(camera.position);
    
    // Simpan arah gerakan awal (tetap, tidak berubah)
    camera.getWorldDirection(initialDirection);
    initialDirection.y = 0;
    initialDirection.normalize();
    
    // Setup collision detection
    setupCollisionDetection();
    
    console.log('✅ Camera positioned DEEP INSIDE gallery at:', camera.position);
    console.log('Gallery center:', center);
}

function setupControls() {
    console.log('Setting up PointerLockControls...');
    controls = new THREE.PointerLockControls(camera, document.body);
    scene.add(controls.getObject());
    
    // Pointer lock events
    controls.addEventListener('lock', () => {
        isPointerLocked = true;
        document.body.classList.remove('cursor-visible');
        document.body.classList.add('cursor-hidden');
        document.body.style.userSelect = 'none'; // Disable text selection
        console.log('✅ Pointer locked - WASD navigation active');
        
        // Hide instructions when locked
        const instructions = document.getElementById('instructions');
        if (instructions) {
            instructions.style.display = 'none';
        }
    });
    
    controls.addEventListener('unlock', () => {
        isPointerLocked = false;
        console.log('❌ Pointer unlocked - FORCING CURSOR VISIBLE');
        
        // AGGRESSIVE CURSOR FORCING
        document.body.style.cursor = 'default';
        document.body.style.pointerEvents = 'auto';
        document.documentElement.style.cursor = 'default';
        document.body.style.userSelect = 'text';
        
        // Remove any hiding classes
        document.body.classList.remove('cursor-hidden');
        document.body.classList.add('cursor-visible');
        
        // Multiple timeouts to ensure cursor appears
        setTimeout(() => {
            document.body.style.cursor = 'default';
            document.documentElement.style.cursor = 'default';
            document.body.style.pointerEvents = 'auto';
            console.log('🖱️ TIMEOUT 1: Cursor forced');
        }, 50);
        
        setTimeout(() => {
            document.body.style.cursor = 'default';
            document.documentElement.style.cursor = 'default';
            document.body.style.pointerEvents = 'auto';
            console.log('🖱️ TIMEOUT 2: Cursor forced again');
        }, 200);
        
        setTimeout(() => {
            document.body.style.cursor = 'default';
            document.documentElement.style.cursor = 'default';
            document.body.style.pointerEvents = 'auto';
            console.log('🖱️ TIMEOUT 3: Final cursor force');
        }, 500);
        
        // Show instructions when unlocked
        const instructions = document.getElementById('instructions');
        if (instructions) {
            instructions.style.display = 'block';
            console.log('📋 Instructions displayed');
        }
    });
    
    console.log('✅ PointerLockControls initialized');
}


function setupCollisionDetection() {
    // Collision detection disabled - free movement
    console.log('🆓 Collision detection disabled - free movement enabled');
}

function setupEventListeners() {
    // Start button
    document.getElementById('start-btn').addEventListener('click', () => {
        document.getElementById('ui-overlay').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('ui-overlay').style.display = 'none';
            document.getElementById('instructions').style.display = 'block';
            document.getElementById('viewer-info').style.display = 'block';
        }, 500);
    });
    
    // Movement controls - Full WASD movement
    const onKeyDown = (event) => {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                moveForward = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = true;
                break;
            case 'ArrowDown':
            case 'KeyS':
                moveBackward = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                moveRight = true;
                break;
        }
    };
    
    const onKeyUp = (event) => {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                moveForward = false;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = false;
                break;
            case 'ArrowDown':
            case 'KeyS':
                moveBackward = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                moveRight = false;
                break;
        }
    };
    
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    
    // Click to lock pointer
    document.addEventListener('click', () => {
        if (!isPointerLocked) {
            console.log('🖱️ Click detected - attempting to lock pointer...');
            controls.lock();
        }
    });
    
    // Window resize
    window.addEventListener('resize', onWindowResize);
    
    // Audio controls
    setupAudioControls();
    
    // Enter key to start exploration
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Enter' && !isPointerLocked) {
            event.preventDefault(); // Prevent default behavior
            event.stopPropagation(); // Stop event bubbling
            const startBtn = document.getElementById('start-btn');
            if (startBtn && startBtn.offsetParent !== null) { // Check if button is visible
                console.log('🚀 Enter key pressed, clicking start button');
                startBtn.click();
            }
        }
    });
    
    // ESC key to UNLOCK pointer (exit navigation mode)
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            
            console.log('🔄 ESC pressed! Current state:', isPointerLocked);
            
            if (isPointerLocked) {
                // UNLOCK POINTER - Exit navigation mode
                console.log('🔓 UNLOCKING POINTER - Exiting navigation mode...');
                controls.unlock();
                console.log('✅ Pointer unlocked - Navigation mode exited');
            } else {
                console.log('ℹ️ Pointer already unlocked');
            }
        }
    });
    
    // REMOVED - Using window listener instead
    
    // Alternative: Add Enter key listener to the button itself
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('keydown', (event) => {
            if (event.code === 'Enter') {
                event.preventDefault();
                startBtn.click();
                console.log('🚀 Enter key on button pressed');
            }
        });
    }
    
    // Click to start navigation (only when not locked)
    document.addEventListener('click', (event) => {
        if (!isPointerLocked && event.target !== startBtn) {
            console.log('🖱️ Click detected - starting navigation...');
            controls.lock();
        }
    });
    
    
    // SIMPLE SHIFT LISTENER - Direct approach
    window.addEventListener('keydown', (event) => {
        if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
            event.preventDefault();
            event.stopPropagation();
            
            if (isPointerLocked) {
                controls.unlock();
            }
        }
    });
    
}

function onWindowResize() {
    // Performance optimization: limit resolution for better FPS
    const maxWidth = 1280;
    const maxHeight = 720;
    
    const width = Math.min(window.innerWidth, maxWidth);
    const height = Math.min(window.innerHeight, maxHeight);
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    
}

function setupAudioControls() {
    const audio = document.getElementById('background-music');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeDisplay = document.getElementById('volume-display');
    
    let isPlaying = false;
    
    // Play/Pause button
    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            playPauseBtn.textContent = '🎵';
            isPlaying = false;
        } else {
            audio.play().then(() => {
                playPauseBtn.textContent = '⏸️';
                isPlaying = true;
            }).catch(error => {
                console.log('Audio play failed:', error);
                // User interaction required for autoplay
                playPauseBtn.textContent = '🎵';
            });
        }
    });
    
    // Volume control
    volumeSlider.addEventListener('input', () => {
        const volume = volumeSlider.value / 100;
        audio.volume = volume;
        volumeDisplay.textContent = volumeSlider.value + '%';
    });
    
    // Set initial volume
    audio.volume = 0.5;
    
    // Auto-play when user starts exploring
    document.getElementById('start-btn').addEventListener('click', () => {
        setTimeout(() => {
            audio.play().then(() => {
                playPauseBtn.textContent = '⏸️';
                isPlaying = true;
            }).catch(error => {
                console.log('Auto-play failed:', error);
            });
        }, 1000);
    });
}

function optimizeMaterial(material) {
    // Optimize material properties for performance
    if (material.map) {
        material.map.generateMipmaps = false;
        material.map.minFilter = THREE.LinearFilter;
        material.map.magFilter = THREE.LinearFilter;
    }
    material.needsUpdate = true;
}

function ultraOptimizeMaterial(material) {
    if (material) {
        // Ultra performance optimizations
        material.transparent = false;
        material.alphaTest = 0;
        material.side = THREE.FrontSide;
        material.needsUpdate = true;
        
        // Disable expensive features
        material.envMap = null;
        material.normalMap = null;
        material.bumpMap = null;
        material.roughnessMap = null;
        material.metalnessMap = null;
        material.emissiveMap = null;
        material.aoMap = null;
        material.displacementMap = null;
        
        // Simplify shader
        material.vertexColors = false;
        material.skinning = false;
        material.morphTargets = false;
        material.morphNormals = false;
        
        // Force simple rendering
        material.wireframe = false;
        material.flatShading = false;
        
        // Optimize textures
        if (material.map) {
            material.map.generateMipmaps = false;
            material.map.minFilter = THREE.NearestFilter;
            material.map.magFilter = THREE.NearestFilter;
        }
        
    }
}

// Collision detection removed - free movement enabled

function animate() {
    requestAnimationFrame(animate);
    
    const time = performance.now();
    
    // Skip frames for better performance (render every 2nd frame)
    if (time - prevTime < 16) return; // ~60fps max
    
    if (isPointerLocked) {
        const delta = (time - prevTime) / 1000;
        
        // Store current position
        const currentPosition = camera.position.clone();
        
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        
        // Full WASD movement
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();
        
        if (moveForward || moveBackward) velocity.z -= direction.z * 25.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 25.0 * delta;
        
        // Apply movement
        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);
        
        // Keep camera inside gallery bounds like Sketchfab
        if (galleryModel) {
            const galleryBox = new THREE.Box3().setFromObject(galleryModel);
            
            // Create room bounds to keep camera inside
            const roomBox = new THREE.Box3();
            roomBox.copy(galleryBox);
            roomBox.expandByScalar(-0.5); // Keep camera inside room
            
            // Keep camera at proper eye level (don't force if already higher)
            const eyeLevel = galleryBox.min.y + 1.6; // Floor level + eye height
            if (camera.position.y < eyeLevel) {
                camera.position.y = eyeLevel;
            }
            
            // Check if camera is outside room bounds
            if (!roomBox.containsPoint(camera.position)) {
                // Move camera back to center if outside
                const center = galleryBox.getCenter(new THREE.Vector3());
                camera.position.set(center.x, center.y - 0.5, center.z);
            }
        }
        
        // No collision detection - free movement
    }
    
    prevTime = time;
    
    // Only render if we have all components
    if (renderer && scene && camera) {
        // Ultra performance: reduce quality for better FPS
        renderer.setPixelRatio(1); // Force low pixel ratio
        renderer.render(scene, camera);
    }
}

// Initialize when page loads
window.addEventListener('load', function() {
    console.log('🌐 Page loaded, initializing WASD GLB viewer...');
    
    // Wait a bit for all libraries to load
    setTimeout(() => {
        try {
            init();
            console.log('✅ Initialization complete');
        } catch (error) {
            console.error('❌ Initialization failed:', error);
        }
    }, 500);
});