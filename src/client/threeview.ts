import * as THREE from "/assets/js/three.module.js";
import { Color } from "/assets/js/three.module.js";
import { OrbitControls } from "/jsm/controls/OrbitControls";

// Création de la scène
const scene: THREE.Scene = new THREE.Scene();

// Création de la caméra
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);

// Création du renderer
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();

// Et ajout au div wrapper prévu
document.getElementById('banner-three-wrapper')!.appendChild(renderer.domElement);

// Création de la géometrie
/*
const lathe = [];
for (let x = 0; x < 50; x++) {
    lathe.push(new THREE.Vector2(Math.cos(x * 0.64) * 1.5 + 2, (x - 25) * 0.04 + 0.25));
}
const geometry: THREE.LatheBufferGeometry = new THREE.LatheBufferGeometry(lathe, 50, 0, Math.PI * 2);
*/
const particles = [];
for (let p = 0; p < 2500; p++) {
    let px = Math.random() * 5 - 2.5;
    let py = Math.random() * 5 - 2.5;
    let pz = Math.random() * 5 - 2.5;
    particles.push(px, py, pz);
}
const geometry: THREE.BufferGeometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(particles), 3))

const material: THREE.PointsMaterial = new THREE.PointsMaterial({
    size: 0.05,
    transparent: true,
    blending: THREE.AdditiveBlending,
    alphaTest: 0.5,
    opacity: 0.75,
    map: createPointMaterial()
});

function createPointMaterial() {
    // Création du matériel pour le point
    let texCanvas = document.createElement('canvas');
    texCanvas.width = 16;
    texCanvas.height = 16;

    let context = texCanvas.getContext('2d');
    let gradient = context!.createRadialGradient(8, 8, 0, 8, 8, 8);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(192, 192, 0, 1)');
    gradient.addColorStop(0.6, 'rgba(0, 0, 0, 0)');
    context!.fillStyle = gradient;
    context!.fillRect(0, 0, 16, 16);

    let texture = new THREE.Texture(texCanvas);
    texture.needsUpdate = true;

    return texture;
}

const mesh: THREE.Points = new THREE.Points(geometry, material);
scene.add(mesh);

camera.position.z = 2

let resize = function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

let animate = function () {
    requestAnimationFrame(animate)

    mesh.rotation.y += 0.001 % Math.PI;

    renderer.render(scene, camera)
};

// On mets en place un redimensionnement si la fenêtre est redimensionnée
window.onresize = resize;
resize();
animate();