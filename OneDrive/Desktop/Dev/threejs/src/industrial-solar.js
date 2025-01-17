import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


// Create scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Set up camera and controls
camera.position.set(30, 30, 30);
const controls = new OrbitControls(camera, renderer.domElement);
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI / 2;
controls.minDistance = 10;
controls.maxDistance = 50;

// Create lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(10, 20, 10);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
scene.add(directionalLight);

// Materials
const solarPanelMaterial = new THREE.MeshStandardMaterial({
  color: 0x2C5282,
  roughness: 0.3,
  metalness: 0.8
});

const buildingMaterial = new THREE.MeshStandardMaterial({ color: 0xE2E8F0 });
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x718096 });
const doorMaterial = new THREE.MeshStandardMaterial({ color: 0xE53E3E });

// Helper function to create a solar panel
function createSolarPanel(width = 1, height = 0.1, depth = 2) {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  return new THREE.Mesh(geometry, solarPanelMaterial);
}

// Create main building
function createMainBuilding() {
  const building = new THREE.Group();
  building.userData = { type: 'Main Building' };
  
  const loader = new GLTFLoader();  
  loader.load('assets/scene.glb', function(glb) {
    console.log(glb);
    const root = glb.scene;
    root.scale.set(0.06, 0.40, 0.08);
    building.add(root);
  }, function(xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
  }, function(error) { 
    console.log('error', error); 
  });

  return building;
}

// Create warehouse units
function createWarehouseUnits() {
  const warehouse = new THREE.Group();
  warehouse.position.set(10, 2.5, 0);

  for (let i = 0; i < 4; i++) {
    const unit = new THREE.Group();
    unit.position.x = i * 4;

    // Unit structure
    const unitGeometry = new THREE.BoxGeometry(3.5, 5, 8);
    const unitMesh = new THREE.Mesh(unitGeometry, buildingMaterial);
    unit.add(unitMesh);

    // Door
    const doorGeometry = new THREE.BoxGeometry(2, 3, 0.1);
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, 1.5, 4);
    unit.add(door);

    warehouse.add(unit);
  }

  warehouse.userData = { type: 'Warehouse Units' };
  return warehouse; 
}

// Create ground solar array
function createGroundSolarArray() {
  const array = new THREE.Group();
  array.position.set(-10, 0, -5);

  for (let row = 0; row < 4; row++) {
    const panel = createSolarPanel(10, 0.1, 2);
    panel.position.set(0, 1, row * 3);
    panel.rotation.x = -0.3;
    array.add(panel);
  }

  array.userData = { type: 'Ground Solar' };
  return array;
}

// Create ground
const groundGeometry = new THREE.BoxGeometry(60, 0.5, 30);
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.position.set(0, 0, -1);
scene.add(ground);

// Add main components to scene
const mainBuilding = createMainBuilding();
const warehouseUnits = createWarehouseUnits();
const groundSolarArray = createGroundSolarArray();

scene.add(mainBuilding);
scene.add(warehouseUnits);
scene.add(groundSolarArray);

function makeObjectsInteractive(objects) {
  objects.forEach(obj => {
    obj.traverse((child) => {
      if (child.isMesh) {
        child.userData.type = obj.userData.type;
      }
    });
  });
}

makeObjectsInteractive([mainBuilding, warehouseUnits, groundSolarArray]);

// Raycaster for click detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Info box setup
//const infoBox = document.createElement('div');
// infoBox.style.position = 'absolute';
// infoBox.style.top = '10px';
// infoBox.style.left = '10px';
// infoBox.style.backgroundColor = 'rgba(140, 74, 74, 0.7)';
// infoBox.style.color = 'white';
// infoBox.style.padding = '10px';
// infoBox.style.borderRadius = '5px';
// infoBox.style.display = 'none';
// document.body.appendChild(infoBox);
const infoBox = document.createElement('div');
infoBox.style.position = 'fixed';
infoBox.style.top = '20px';
infoBox.style.right = '20px';
infoBox.style.width = '300px';
infoBox.style.maxHeight = '200px';
infoBox.style.overflowY = 'auto';
infoBox.style.backgroundColor = "white";
infoBox.style.color = 'black';
infoBox.style.padding = '15px';
infoBox.style.borderRadius = '10px';
infoBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
infoBox.style.fontSize = '14px';
infoBox.style.display = 'none';
document.body.appendChild(infoBox);

console.log('Info box created:', infoBox);




//click 
// function onDocumentMouseDown(event) {
//   event.preventDefault();

//   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

//   raycaster.setFromCamera(mouse, camera);

//   const intersects = raycaster.intersectObjects(scene.children, true);

//   if (intersects.length > 0) {
//     let selectedObject = intersects[0].object;
//     while(selectedObject.parent && !selectedObject.userData.type) {
//       selectedObject = selectedObject.parent;
//     }
//     if(selectedObject.userData.type) {
//       showInfo(selectedObject.userData.type, event.clientX, event.clientY);
//     }
//   } else {
//     hideInfo();
//   }
  
// }

function onDocumentMouseDown(event) {
  event.preventDefault();
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    let selectedObject = intersects[0].object;

    // Traverse up to find the parent with userData.type
    while (selectedObject.parent && !selectedObject.userData.type) {
      selectedObject = selectedObject.parent;
    }

    if (selectedObject.userData.type) {
      // Define component-specific details
      let type = selectedObject.userData.type;
      let machine, status, temperature, progress;

      switch (type) {
        case 'Main Building':
          machine = 'Admin Machine 01';
          status = 'Operational';
          temperature = '22°C';
          progress = '90%';
          break;

        case 'Warehouse Units':
          machine = 'Storage Unit Controller';
          status = 'Idle';
          temperature = '08°C';
          progress = '50%';
          break;

        case 'Ground Solar':
          machine = 'Solar Panel Array';
          status = 'Active';
          temperature = '30°C';
          progress = '75%';
          break;

        default:
          machine = 'Unknown';
          status = 'Unknown';
          temperature = 'N/A';
          progress = '0%';
      }

      // Show the information
      showInfo(type, machine, status, temperature, progress);
    }
  } else {
    hideInfo();
  }
}

function showInfo(type, machine, status, temperature, progress) {
  let info = `
    <strong>Type:</strong> ${type}<br>
    <strong>Machine:</strong> ${machine}<br>
    <strong>Status:</strong> ${status}<br>
    <strong>Temperature:</strong> ${temperature}<br>
    <strong>Progress:</strong> ${progress}
    
  `;
  infoBox.innerHTML = info;
  infoBox.style.display = 'block';
}


// function showInfo(type, x, y) {
//   let info = '';
//   switch(type) {
//     case 'Main Building':
//       info = 'Main Building: Houses the administrative offices and features rooftop solar panels for energy generation.';
//       break;
//     case 'Warehouse Units':
//       info = 'Warehouse Units: Storage facilities for equipment and materials, each unit with individual access.';
//       break;
//     case 'Ground Solar':
//       info = 'Ground Solar: Large-scale solar panel installation for maximum energy production.';
//       break;
//   }
//   infoBox.textContent = info;
//   infoBox.style.left = `${x + 10}px`;
//   infoBox.style.top = `${y + 10}px`;
//   infoBox.style.display = 'block';
// }
// function showInfo(type) {
//   let info = '';
//   switch(type) {
//     case 'Main Building':
//       info = 'Main Building: Houses the administrative offices and features rooftop solar panels for energy generation.';
//       break;
//     case 'Warehouse Units':
//       info = 'Warehouse Units: Storage facilities for equipment and materials, each unit with individual access.';
//       break;
//     case 'Ground Solar':
//       info = 'Ground Solar: Large-scale solar panel installation for maximum energy production.';
//       break;
//   }
//   infoBox.textContent = info;
//   infoBox.style.display = 'block';
// }





function hideInfo() {
  infoBox.style.display = 'none';
}


// Add click event listener
document.addEventListener('mousedown', onDocumentMouseDown, false);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
animate();

console.log('Interactive Industrial Solar Facility created:');
console.log('- Click on components to see information');
console.log('- Main building with rooftop solar panels');
console.log('- 5 warehouse units');
console.log('- Ground-mounted solar array');
console.log('- Interactive controls (drag to rotate, scroll to zoom)');

