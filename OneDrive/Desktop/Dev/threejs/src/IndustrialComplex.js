
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set up camera position and controls
camera.position.set(20, 20, 20);
const controls = new OrbitControls(camera, renderer.domElement);

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 5);
scene.add(directionalLight);

// Helper function to create a building
function createBuilding(position, size, color, name, details) {
  const geometry = new THREE.BoxGeometry(...size);
  const material = new THREE.MeshStandardMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.userData = { name, details };
  return mesh;
}

// Create buildings
const buildings = [
  // building.load('assets/scene.glb', function(glb) {
  //   console.log(glb);
  //   const root = glb.scene;
  //   root.scale.set(0.06, 0.40, 0.08);
  //   building.add(root);
  // })
  createBuilding([0, 5, 0], [7, 15, 7], 0x87CEEB, "Industry Office", "Main administrative building with 4 floors and modern facilities."),
  createBuilding([5, 5, 0], [1, 20, 1], 0x808080, "Chimney", "Industrial chimney for exhaust gases, <br>height: 20 meters. <br> progress: 95%"),
  createBuilding([-5, 0.5, 5], [10, 0.1, 10], 0x0000FF, "Solar Panels", "Large solar panel array,<br> capacity: 500 kW."),
  createBuilding([8, 2, 5], [6, 4, 6], 0xFFA500, "Storage", "Main storage facility for raw materials and finished products."),
  createBuilding([-8, 2, -5], [5, 4, 5], 0x008000, "Food Processing", "Food processing plant with state-of-the-art equipment."),
  createBuilding([0, 0.1, 10], [15, 0.1, 5], 0x808080, "Parking", "Employee and visitor parking area, capacity: 100 vehicles."),
  createBuilding([-5, 3, -10], [8, 6, 8], 0x90EE90, "Software Office", "R&D center for software development and IT operations."),
  createBuilding([10, 2, -8], [4, 4, 4], 0xFF0000, "Medical Facility", "On-site medical center for employee health and emergencies.")
  
];


buildings.forEach(building => scene.add(building));

// Create ground
const groundGeometry = new THREE.PlaneGeometry(50, 50);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xD3D3D3 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.1
ground.userData = { name: "Ground", details: "Industrial complex ground area." };
scene.add(ground);

// Set up raycaster for click detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Create info display
const infoElement = document.createElement('div');
infoElement.style.position = 'absolute';
infoElement.style.top = '10px';
infoElement.style.right = '10px';
infoElement.style.backgroundColor = 'white';
infoElement.style.color = 'black';
infoElement.style.padding = '10px';
infoElement.style.borderRadius = '5px';
infoElement.style.maxWidth = '300px';
infoElement.style.display = 'none';
document.body.appendChild(infoElement);

// Handle click events
function onClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const object = intersects[0].object;
    if (object.userData.name) {
      infoElement.innerHTML = `<h3>${object.userData.name}</h3><p>${object.userData.details}</p>`;
      infoElement.style.display = 'block';
    }
  } else {
    infoElement.style.display = 'none';
  }
}

window.addEventListener('click', onClick);

// Handle window resize
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);

// Animation loop
function animate() {
  window.requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  buildings.forEach(building => building.rotation.y += 0.001);
  ground.rotation.z += 0.001;

}

animate();

console.log("Interactive Industrial Complex created:");
console.log("- Click on components to see information");
console.log("- Includes: Industry Office, Chimney, Solar Panels, Storage, Food Processing, Parking, Software Office, Medical Facility");
console.log("- Interactive controls (drag to rotate, scroll to zoom)");