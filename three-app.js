// three-app.js — GLB Model Integration with Draco Compression
(function () {
    const container = document.getElementById('three-container');
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingText = document.getElementById('loading-text');
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null; // transparent

    // Camera
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(10, 5, 10);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Performance optimization
    renderer.shadowMap.enabled = true;
    renderer.outputEncoding = THREE.sRGBEncoding; // Correct texture colors
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(10, 10, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    // Materials / Model Group
    let model;

    // --- Loaders Setup ---
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onProgress = (url, loaded, total) => {
        const progress = Math.round((loaded / total) * 100);
        if (loadingText) loadingText.innerText = `Loading Model... ${progress}%`;
    };
    loadingManager.onLoad = () => {
        if (loadingOverlay) loadingOverlay.style.opacity = '0';
        setTimeout(() => { if (loadingOverlay) loadingOverlay.style.display = 'none'; }, 500);
    };

    const dracoLoader = new THREE.DRACOLoader();
    // Using official Google CDN for decoders
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

    const gltfLoader = new THREE.GLTFLoader(loadingManager);
    gltfLoader.setDRACOLoader(dracoLoader);

    // Initial load - model-optimized.glb should be ready soon
    gltfLoader.load(
        'model-optimized.glb',
        (gltf) => {
            model = gltf.scene;
            scene.add(model);

            // Center and Frame Model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            model.position.x += (model.position.x - center.x);
            model.position.y += (model.position.y - center.y);
            model.position.z += (model.position.z - center.z);

            // Compute camera distance
            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = camera.fov * (Math.PI / 180);
            let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
            cameraZ *= 0.8; // extremely tight showcase
            camera.position.set(cameraZ, cameraZ * 0.5, cameraZ);
            camera.updateProjectionMatrix();

            // Set controls target to center
            controls.target.set(0, 0, 0);
        },
        undefined,
        (error) => {
            console.error('Error loading model:', error);
            if (loadingText) loadingText.innerText = '3D System Offline. Using proxy.';
            
            // Show fallback image
            const fallback = document.getElementById('fallback-machine-image');
            if (fallback) fallback.style.display = 'block';
            if (loadingOverlay) {
                loadingOverlay.style.opacity = '0';
                setTimeout(() => loadingOverlay.style.display = 'none', 500);
            }
        }
    );

    // Controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0;

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

    // UI Interaction is now handled in app.js for better synchronization

})();
