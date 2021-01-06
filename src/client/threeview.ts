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
// @ts-ignore
document.getElementById('banner-three-wrapper').appendChild(renderer.domElement);

// Création de la géometrie
const lathe = [];
for (let x = 0; x < 50; x++) {
    lathe.push(new THREE.Vector2(Math.cos(x * 0.64) * 1.5 + 2, (x - 25) * 0.04 + 0.25));
}
const geometry: THREE.LatheBufferGeometry = new THREE.LatheBufferGeometry(lathe, 50, 0, Math.PI * 2);

const material: THREE.PointsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.05,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthTest: true,
    alphaTest: 0.1,
    map: createPointMaterial()
});

function createPointMaterial() {
    // Création du matériel pour le point
    let texCanvas = document.createElement('canvas');
    texCanvas.width = 16;
    texCanvas.height = 16;

    let context = texCanvas.getContext('2d');
    // @ts-ignore
    let gradient = context.createRadialGradient(8, 8, 0, 8, 8, 8);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(0.2, 'rgba(192, 192, 0, 0.8)');
    gradient.addColorStop(0.8, 'rgba(192, 192, 0, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    // @ts-ignore
    context.fillStyle = gradient;
    // @ts-ignore
    context.fillRect(0, 0, 16, 16);

    let texture = new THREE.Texture(texCanvas);
    texture.needsUpdate = true;

    return texture;
}

const latheMesh: THREE.Points = new THREE.Points(geometry, material)
scene.add(latheMesh)

camera.position.z = 2

let resize = function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

let animate = function () {
    requestAnimationFrame(animate)

    latheMesh.rotation.y += 0.0001 % Math.PI;

    renderer.render(scene, camera)
};

// On mets en place un redimensionnement si la fenêtre est redimensionnée
window.onresize = resize;
resize();
animate();