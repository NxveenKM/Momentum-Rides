// 3d-hero.js - UPDATED with better camera and more immersive controls

document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    // --- This is the correct URL for your model ---
    const modelUrl = 'https://raw.githubusercontent.com/NxveenKM/Momentum-Rides/main/Car.glb'; 

    // 1. Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    heroSection.appendChild(renderer.domElement);

    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.zIndex = '-1';

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // 3. Load the 3D Model
    const loader = new THREE.GLTFLoader();
    let carModel;

    loader.load(
        modelUrl,
        function (gltf) {
            carModel = gltf.scene;
            
            // Adjust model scale and position
            carModel.scale.set(1.5, 1.5, 1.5);
            carModel.position.y = -1;
            
            scene.add(carModel);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.error('An error happened while loading the 3D model:', error);
        }
    );

    // === THIS IS THE FIX for the zoom ===
    camera.position.z = 8; // Increased from 5 to zoom out

    // 4. Mouse Interaction (UPDATED)
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (event) => {
        // Normalize mouse position from -1 to 1 for both X and Y
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // 5. Animation Loop (UPDATED)
    function animate() {
        requestAnimationFrame(animate);

        if (carModel) {
            // === THIS IS THE FIX for more immersive rotation ===
            // The model now tilts up/down and left/right based on mouse position
            // The multiplication factor (e.g., 0.5) controls the intensity
            carModel.rotation.y += (mouseX * 0.5 - carModel.rotation.y) * 0.05;
            carModel.rotation.x += (mouseY * 0.3 - carModel.rotation.x) * 0.05;
        }

        renderer.render(scene, camera);
    }

    // Handle window resizing
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
});