// three-app.js — GLB Model Integration with Dynamic Switching
(function () {
    const container = document.getElementById('three-container');
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingText = document.getElementById('loading-text');
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null; 

    // Camera
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(10, 5, 10);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(10, 10, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    // Loaders Setup
    let currentModel;
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onProgress = (url, loaded, total) => {
        const progress = Math.round((loaded / total) * 100);
        if (loadingText) loadingText.innerText = `Calibrating System... ${progress}%`;
    };
    loadingManager.onLoad = () => {
        if (loadingOverlay) {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => { loadingOverlay.style.display = 'none'; }, 500);
        }
    };

    const dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

    const gltfLoader = new THREE.GLTFLoader(loadingManager);
    gltfLoader.setDRACOLoader(dracoLoader);

    // Global function to switch models
    window.loadMachineModel = (modelPath) => {
        // Show loading
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
            loadingOverlay.style.opacity = '1';
        }
        if (loadingText) loadingText.innerText = 'Initializing...';

        // Clear existing model
        if (currentModel) {
            scene.remove(currentModel);
            // Optional: dispose geometries/materials for memory
        }

        gltfLoader.load(
            modelPath,
            (gltf) => {
                currentModel = gltf.scene;
                scene.add(currentModel);

                // Center and Frame Model
                const box = new THREE.Box3().setFromObject(currentModel);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());

                currentModel.position.x += (currentModel.position.x - center.x);
                currentModel.position.y += (currentModel.position.y - center.y);
                currentModel.position.z += (currentModel.position.z - center.z);

                // Compute camera distance
                const maxDim = Math.max(size.x, size.y, size.z);
                const fov = camera.fov * (Math.PI / 180);
                let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
                
                // Adjust framing based on model
                let multiplier = 0.8;
                if (modelPath.includes('engine')) multiplier = 1.0;
                if (modelPath.includes('battery')) multiplier = 1.1; // Give the battery some room
                cameraZ *= multiplier;

                camera.position.set(cameraZ, cameraZ * 0.5, cameraZ);
                camera.updateProjectionMatrix();
                controls.target.set(0, 0, 0);
            },
            undefined,
            (error) => {
                console.error('Error loading model:', error);
                if (loadingText) loadingText.innerText = 'System Offline. Using proxy.';
                // Show fallback
                const fallback = document.getElementById('fallback-machine-image');
                if (fallback) fallback.style.display = 'block';
                if (loadingOverlay) {
                    loadingOverlay.style.opacity = '0';
                    setTimeout(() => loadingOverlay.style.display = 'none', 500);
                }
            }
        );
    };

    // Controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;

    // Resizing
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    // Initial Load - default model
    window.loadMachineModel('model-optimized.glb');

    // PRELOADER CACHE
    const modelCache = {};
    window.preloadMachineModel = function(path) {
        if (modelCache[path]) return;
        gltfLoader.load(path, (gltf) => { modelCache[path] = gltf.scene; });
    };
    
    // Preload motor immediately
    window.preloadMachineModel('motor.glb');

    // CINEMATIC SPACE WARP
    window.triggerSpaceWarp = function(modelPath, onComplete) {
        const overlay = document.getElementById('space-overlay');
        if (!overlay) return;
        
        // Show solid black immediately
        overlay.style.display = 'flex';
        overlay.innerHTML = '<div class="warp-text" id="warp-loader">Initializing Jump Drive...</div>';
        
        const startAnimation = (model) => {
            const loaderText = document.getElementById('warp-loader');
            if (loaderText) loaderText.innerText = 'Engaging Warp...';
            
            // Setup scene
            const tScene = new THREE.Scene();
            const tCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
            const tRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            tRenderer.setSize(window.innerWidth, window.innerHeight);
            overlay.appendChild(tRenderer.domElement);
            
            tScene.add(new THREE.AmbientLight(0xffffff, 1.2));
            const pLight = new THREE.PointLight(0xffffff, 2);
            pLight.position.set(10, 10, 10);
            tScene.add(pLight);

            tScene.add(model);
            
            // Start LARGE (fill screen)
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            tCamera.position.z = maxDim * 1.2; 
            
            let scale = 1.0;
            let velocity = 0.003;
            let zVelocity = 0.05;
            
            function animateWarp() {
                if (scale <= 0.005) {
                    // Cleanup
                    tRenderer.dispose();
                    overlay.style.display = 'none';
                    if (onComplete) onComplete();
                    return;
                }
                
                requestAnimationFrame(animateWarp);
                
                // Gentler acceleration (slower jump)
                scale -= velocity;
                tCamera.position.z += zVelocity;
                velocity *= 1.08; 
                zVelocity *= 1.12;
                
                model.scale.set(Math.max(scale, 0), Math.max(scale, 0), Math.max(scale, 0));
                model.rotation.y += 0.15; // Slower spin
                model.rotation.z += 0.05;
                
                tRenderer.render(tScene, tCamera);
            }
            animateWarp();
        };

        // Check cache first
        if (modelCache[modelPath]) {
            startAnimation(modelCache[modelPath].clone());
        } else {
            gltfLoader.load(modelPath, (gltf) => {
                startAnimation(gltf.scene);
            });
        }
    };

})();
