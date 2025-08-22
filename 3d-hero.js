// 3d-hero.js - Three.js logic for the homepage hero section

document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); // alpha:true for transparent background

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    heroSection.appendChild(renderer.domElement);

    // Style the canvas
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.zIndex = '-1'; // Place it behind other content

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // 3. Create the Car Model from basic shapes
    const carGroup = new THREE.Group();

    // Car Body
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x1E90FF, metalness: 0.5, roughness: 0.5 });
    const bodyGeometry = new THREE.BoxGeometry(4, 1, 2);
    const carBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
    carBody.position.y = 0.5;
    carGroup.add(carBody);

    // Car Cabin
    const cabinGeometry = new THREE.BoxGeometry(2, 0.8, 1.8);
    const carCabin = new THREE.Mesh(cabinGeometry, bodyMaterial);
    carCabin.position.set(-0.5, 1.4, 0);
    carGroup.add(carCabin);

    // Wheels
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.2, roughness: 0.8 });
    const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32);
    
    const wheelPositions = [
        { x: -1.5, y: 0.4, z: 1 },
        { x: 1.5, y: 0.4, z: 1 },
        { x: -1.5, y: 0.4, z: -1 },
        { x: 1.5, y: 0.4, z: -1 }
    ];

    wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(pos.x, pos.y, pos.z);
        wheel.rotation.x = Math.PI / 2;
        carGroup.add(wheel);
    });

    scene.add(carGroup);
    camera.position.z = 5;

    // 4. Mouse Interaction
    let mouseX = 0;
    document.addEventListener('mousemove', (event) => {
        // Normalize mouse position from -1 to 1
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    });

    // 5. Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        // Gentle rotation based on mouse position
        carGroup.rotation.y += (mouseX * 0.5 - carGroup.rotation.y) * 0.05;

        // Slow constant rotation
        carGroup.rotation.y += 0.001;

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