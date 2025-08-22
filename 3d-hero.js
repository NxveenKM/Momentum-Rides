// 3d-hero.js - UPDATED to load your custom GLTF model

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
            
            // --- ADJUST MODEL SCALE AND POSITION HERE ---
            // You may need to change these values to fit your specific model
            carModel.scale.set(1.5, 1.5, 1.5); // Example: make the model 1.5 times bigger
            carModel.position.y = -1;       // Example: move the model down
            
            scene.add(carModel);
        },
        // Optional: progress function
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        // Optional: error function
        function (error) {
            console.error('An error happened while loading the 3D model:', error);
        }
    );

    camera.position.z = 5;

    // 4. Mouse Interaction
    let mouseX = 0;
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    });

    // 5. Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        if (carModel) {
            // Gentle rotation based on mouse position
            carModel.rotation.y += (mouseX * 0.5 - carModel.rotation.y) * 0.05;
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