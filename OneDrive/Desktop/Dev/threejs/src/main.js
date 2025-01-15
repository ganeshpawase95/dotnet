import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const canvas = document.getElementById('canvas');
const scene = new THREE.Scene();



const loader = new GLTFLoader();
loader.load('assets/scene.glb', function(glb) {
  console.log(glb);
  const root = glb.scene;
  camera.position.z = 3;
  camera.position.x = 1;
  camera.position.y = 1;
  root.scale.set(0.03, 0.05, 0.05);
  scene.add(root);
}, function(xhr) {
  console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
}, function(error) { 
  console.log('error', error); 
});


const popup = document.createElement('canvas');
popup.style.position = 'absolute';
popup.style.display = 'none';
popup.style.backgroundColor = 'white';
popup.style.padding = '10px';
popup.style.border = '1px solid black';
document.body.appendChild(popup);

// Initialize the raycaster and mouse
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Function to handle mouse click
function onClick(event) {
  // Calculate mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the raycaster with the current mouse and camera
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    console.log('Intersected objects:', intersects);
    // You can handle the intersection logic here, e.g., highlighting an object
  }
}

// Add the event listener for mouse click
window.addEventListener('click', onClick, false);

// Adding a directional light to the scene
const light = new THREE.DirectionalLight(0xffffff, 12);
light.position.set(2, 2, 5);
light.castShadow = true;
scene.add(light);


const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;

scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas:canvas });

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.gammaOutput = true;
renderer.render(scene, camera);

const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
  window.requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();

}

animate();