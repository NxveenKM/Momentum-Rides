// 3d-hero.js - UPDATED with 360-degree drag rotation

document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

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
            
            carModel.scale.set(1.5, 1.5, 1.5);
            carModel.position.y = -1;
            
            // === THIS IS THE FIX for the initial orientation ===
            // Rotates the model 180 degrees to face the front
            carModel.rotation.y = Math.PI; 
            
            scene.add(carModel);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.error('An error happened while loading the 3D model:', error);
        }
    );

    camera.position.z = 8;

    // 4. Mouse Interaction for 360 Drag (UPDATED)
    let isDragging = false;
    let previousMousePosition = {
        x: 0
    };

    renderer.domElement.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition.x = e.clientX;
    });

    renderer.domElement.addEventListener('mousemove', (e) => {
        if (isDragging && carModel) {
            const deltaX = e.clientX - previousMousePosition.x;
            // The rotation speed is controlled by the multiplier (e.g., 0.01)
            carModel.rotation.y += deltaX * 0.01;
            previousMousePosition.x = e.clientX;
        }
    });

    renderer.domElement.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    // Also handle leaving the window to stop dragging
    renderer.domElement.addEventListener('mouseleave', () => {
        isDragging = false;
    });


    // 5. Animation Loop
    function animate() {
        requestAnimationFrame(animate);
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