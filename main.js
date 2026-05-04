import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.5));

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 2, 5);
scene.add(light);

const controls = new OrbitControls(camera, renderer.domElement);

let targetMesh = null;
const loader = new GLTFLoader();
loader.load(
  "./models/classic_muscle_car.glb",
  (gltf) => {
    const model = gltf.scene;
    scene.add(model);

    model.traverse((child) => {
      if (child.isMesh && child.name === "Object_4") {
        targetMesh = child;
        console.log("Found mesh:", child);
      }
    });
  },
  undefined,
  (error) => {
    console.error(error);
  },
);

document.getElementById("redBtn").addEventListener("click", () => {
  if (targetMesh) targetMesh.material.color.set(0xff0000);
});

document.getElementById("greenBtn").addEventListener("click", () => {
  if (targetMesh) targetMesh.material.color.set(0x00ff00);
});

document.getElementById("blueBtn").addEventListener("click", () => {
  if (targetMesh) targetMesh.material.color.set(0x0000ff);
});

window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

function animate() {
  controls.update();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
