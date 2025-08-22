// 3d-hero.js - FINAL VERSION with Correct Sizing and Interaction

document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.querySelector('.hero');
    const canvasContainer = document.getElementById('hero-canvas-container');
    if (!heroSection || !canvasContainer) return;

    const modelUrl = 'https://raw.githubusercontent.com/NxveenKM/Momentum-Rides/main/Car.glb'; 

    // 1. Scene Setup
    const scene = new THREE.Scene();
    // === THIS IS THE FIX: Camera aspect ratio now uses the full window ===
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    // === THIS IS THE FIX: Renderer is now sized to the full window ===
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    canvasContainer.appendChild(renderer.domElement);

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
            carModel.scale.set(1.2, 1.2, 1.2);
            carModel.position.y = -1.2;
            scene.add(carModel);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.error('An error happened while loading the 3D model:', error);
        }
    );

    camera.position.z = 10;

    // 4. Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let isMouseInside = false;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    heroSection.addEventListener('mouseenter', () => {
        isMouseInside = true;
    });

    heroSection.addEventListener('mouseleave', () => {
        isMouseInside = false;
    });

    // 5. Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        if (carModel) {
            let targetRotationY = 0;
            let targetRotationX = 0;

            if (isMouseInside) {
                targetRotationY = mouseX * 0.5;
                targetRotationX = -(mouseY * 0.3);
            }

            carModel.rotation.y += (targetRotationY - carModel.rotation.y) * 0.05;
            carModel.rotation.x += (targetRotationX - carModel.rotation.x) * 0.05;
        }

        renderer.render(scene, camera);
    }

    // Handle window resizing
    window.addEventListener('resize', () => {
        // === THIS IS THE FIX: Resize logic now uses the full window ===
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
});