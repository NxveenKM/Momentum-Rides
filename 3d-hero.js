// 3d-hero.js - UPDATED with Smoother Interaction and Correct Sizing

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
    
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // 3. Load the 3D Model
    const loader = new THREE.GLTFLoader();
    let carModel;

    loader.load(
        modelUrl,
        function (gltf) {
            carModel = gltf.scene;
            
            // === THIS IS THE FIX for sizing ===
            carModel.scale.set(1.2, 1.2, 1.2); // Slightly smaller scale
            carModel.position.y = -1.2;      // Moved down a bit more
            
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
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // 5. Animation Loop (UPDATED with Smoother Logic)
    function animate() {
        requestAnimationFrame(animate);

        if (carModel) {
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(carModel.children, true);

            // === THIS IS THE FIX for the glitchy interaction ===
            let targetRotationY = 0; // Default rotation when not hovering
            let targetRotationX = 0;

            if (intersects.length > 0) {
                // Only apply sensitive rotation when the mouse is over the model
                targetRotationY = mouse.x * 0.5; // Less extreme rotation
                targetRotationX = -(mouse.y * 0.3);
            }

            // Smoothly interpolate to the target rotation in every frame
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