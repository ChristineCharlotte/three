import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls';

const gui = new dat.GUI();
const world = {
  plane: {
    width: 6,
    height: 6,
    widthSegments: 50,
    heightSegments: 50,
  },
};

gui.add(world.plane, 'width', 1, 20).onChange(generatePlane);
gui.add(world.plane, 'height', 1, 20).onChange(generatePlane);
gui.add(world.plane, 'widthSegments', 1, 30).onChange(generatePlane);
gui.add(world.plane, 'heightSegments', 1, 30).onChange(generatePlane);

function generatePlane() {
  planeMesh.geometry.dispose();
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  );

  const { array } = planeMesh.geometry.attributes.position;

  for (let i = 0; i < array.length; i += 3) {
    const x = array[i];
    const y = array[i + 1];
    const z = array[i + 2];

    array[i + 2] = z + Math.random() * 10;
  }
}

const raycaster = new THREE.Raycaster();
console.log(raycaster);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  150,
  innerWidth / innerHeight,
  0.5,
  3000
);
const renderer = new THREE.WebGL1Renderer();

renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.append(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

// create box
// const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshBasicMaterial({color: 0x00FF00})
// const mesh = new THREE.Mesh(boxGeometry, material)
// scene.add(mesh)

// create mesh
const planeGeometry = new THREE.PlaneGeometry(5, 5, 30, 30);
const planeMaterial = new THREE.MeshPhongMaterial({
  color: 0xff0000,
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

console.log(planeMesh.geometry);

const { array } = planeMesh.geometry.attributes.position;

for (let i = 0; i < array.length; i += 3) {
  const x = array[i];
  const y = array[i + 1];
  const z = array[i + 2];

  array[i + 2] = z + Math.random();
}

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1);
scene.add(light);

const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(0, 0, -1);
scene.add(backLight);

camera.position.z = 2;

// add mouse listener
const mouse = {
  x: undefined,
  y: undefined,
};
addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / innerHeight) * 2 + 1;
  console.log(mouse);
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  // mesh.rotation.x += 0.01
  // mesh.rotation.y += 0.01
  // planeMesh.rotation.x += 0.01
  // planeMesh.rotation.y += 0.01

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(planeMesh);
  if (intersects.length > 0) {
    console.log('intersecting');
  }
}

renderer.render(scene, camera);

animate();
