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
    if (typeof MeshoptDecoder !== 'undefined') {
        gltfLoader.setMeshoptDecoder(MeshoptDecoder);
    }

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
        if (typeof controls !== 'undefined') controls.update();
        if (typeof renderer !== 'undefined' && typeof scene !== 'undefined' && typeof camera !== 'undefined') {
            renderer.render(scene, camera);
        }
    }
    animate();

    // PRELOADER CACHE
    const modelCache = {};
    // gltfLoader and dracoLoader are already declared in the outer scope

    window.preloadMachineModel = function (path) {
        if (modelCache[path]) return;
        gltfLoader.load(path, (gltf) => {
            const model = gltf.scene;
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.x -= center.x;
            model.position.y -= center.y;
            model.position.z -= center.z;
            modelCache[path] = model;
        });
    };

    ['model-optimized.glb', 'engine.glb', 'battery-optimized.glb', 'motor.glb'].forEach(p => {
        window.preloadMachineModel(p);
    });

    // CINEMATIC SPACE WARP
    window.triggerSpaceWarp = function (modelPath, onComplete) {
        const overlay = document.getElementById('space-overlay');
        if (!overlay) return;

        overlay.style.display = 'flex';
        overlay.style.backgroundColor = 'rgba(250, 250, 249, 1)'; // Solid ivory background for the "warp tunnel"
        overlay.style.opacity = '1';
        overlay.innerHTML = '<div class="warp-text" id="warp-loader" style="position: absolute; bottom: 10%; width: 100%; text-align: center; font-weight: 800; color: var(--accent); letter-spacing: 0.2em; text-transform: uppercase;">Initializing Neural Link...</div>';

        const startAnimation = (model) => {
            const tScene = new THREE.Scene();
            const tCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
            const tRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            tRenderer.setSize(window.innerWidth, window.innerHeight);
            overlay.appendChild(tRenderer.domElement);

            tScene.add(new THREE.AmbientLight(0xffffff, 1.5));
            const pLight = new THREE.PointLight(0xffffff, 2);
            pLight.position.set(10, 10, 10);
            tScene.add(pLight);

            tScene.add(model);

            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);

            // Frame model to cover ~70% of the space initially
            tCamera.position.z = maxDim * 1.5;

            let scale = 1.0;
            let velocity = 0.005; // Slightly faster initial zoom since we start further out
            let zVelocity = 0.1;

            function animateWarp() {
                if (scale <= 0.001) {
                    tRenderer.dispose();
                    overlay.style.opacity = '0';
                    setTimeout(() => {
                        overlay.style.display = 'none';
                        overlay.innerHTML = '';
                        if (onComplete) onComplete();
                    }, 300);
                    return;
                }

                requestAnimationFrame(animateWarp);

                scale -= velocity;
                tCamera.position.z += zVelocity;
                velocity *= 1.08;
                zVelocity *= 1.15;

                model.scale.set(Math.max(scale, 0), Math.max(scale, 0), Math.max(scale, 0));
                model.rotation.y += 0.15;
                model.rotation.z += 0.05;

                tRenderer.render(tScene, tCamera);
            }
            animateWarp();
        };

        if (modelCache[modelPath]) {
            startAnimation(modelCache[modelPath].clone());
        } else {
            gltfLoader.load(modelPath, (gltf) => {
                startAnimation(gltf.scene);
            });
        }
    };
})();
