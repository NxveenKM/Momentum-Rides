// 3d-hero.js - UPDATED with upward tilt

document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.querySelector('.hero');
    const canvasContainer = document.getElementById('hero-canvas-container');
    if (!heroSection || !canvasContainer) return;

    const modelUrl = 'https://raw.githubusercontent.com/NxveenKM/Momentum-Rides/main/Car.glb'; 

    // 1. Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, heroSection.clientWidth / heroSection.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(heroSection.clientWidth, heroSection.clientHeight);
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
            carModel.position.y = -0.8;
            
            // === THIS IS THE FIX: Changed from -0.2 to 0.2 ===
            // Tilts the model slightly upwards on the x-axis
            carModel.rotation.x = 0.2; 
            
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
            // === THIS IS THE FIX: The resting rotation is now the upward tilt ===
            let targetRotationY = 0;
            let targetRotationX = 0.2; 

            if (isMouseInside) {
                targetRotationY = mouseX * 0.8;
                targetRotationX = -(mouseY * 0.5) + 0.2; // Maintain the base upward tilt
            }

            carModel.rotation.y += (targetRotationY - carModel.rotation.y) * 0.05;
            carModel.rotation.x += (targetRotationX - carModel.rotation.x) * 0.05;
        }

        renderer.render(scene, camera);
    }

    // Handle window resizing
    window.addEventListener('resize', () => {
        camera.aspect = heroSection.clientWidth / heroSection.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(heroSection.clientWidth, heroSection.clientHeight);
    });

    animate();
});