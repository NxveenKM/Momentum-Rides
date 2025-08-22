// 3d-hero.js - FINAL VERSION with Raycasting for Hover Interaction

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
    
    // === NEW: Raycaster for detecting mouse intersection ===
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // 3. Load the 3D Model
    const loader = new THREE.GLTFLoader();
    let carModel;

    loader.load(
        modelUrl,
        function (gltf) {
            carModel = gltf.scene;
            
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

    camera.position.z = 10;

    // 4. Mouse Interaction
    document.addEventListener('mousemove', (event) => {
        // Update the mouse vector for the raycaster.
        // This converts the mouse position to normalized device coordinates (-1 to +1).
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // 5. Animation Loop (UPDATED with Raycasting Logic)
    function animate() {
        requestAnimationFrame(animate);

        if (carModel) {
            // Update the raycaster with the camera and mouse position
            raycaster.setFromCamera(mouse, camera);

            // Calculate objects intersecting the raycaster's ray
            const intersects = raycaster.intersectObjects(carModel.children, true);

            if (intersects.length > 0) {
                // If the mouse is over the model, apply the sensitive rotation
                const targetRotationY = mouse.x * Math.PI;
                const targetRotationX = -(mouse.y * 0.5);
                
                carModel.rotation.y += (targetRotationY - carModel.rotation.y) * 0.1;
                carModel.rotation.x += (targetRotationX - carModel.rotation.x) * 0.1;
            } else {
                // If the mouse is NOT over the model, smoothly return to a default state
                carModel.rotation.y += (0 - carModel.rotation.y) * 0.05; // Return to center
                carModel.rotation.x += (0 - carModel.rotation.x) * 0.05; // Return to level
            }
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