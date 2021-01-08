import * as THREE from "/assets/js/three.module.js";
import {Color, Object3D} from "/assets/js/three.module.js";
import { OrbitControls } from "/jsm/controls/OrbitControls";

// Création de la scène
const scene: THREE.Scene = new THREE.Scene();

// Création de la caméra
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);

// Création du renderer
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();

// Détermination du centre de la page
let pageCoord = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);
let pageRatio = new THREE.Vector2(1, 0);

// Et ajout au div wrapper prévu
document.getElementById('banner-three-wrapper')!.appendChild(renderer.domElement);

// Création de la géometrie
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

const mesh: THREE.Points = new THREE.Points(geometry, material);
scene.add(mesh);

camera.position.z = 2


// On mets en place un redimensionnement si la fenêtre est redimensionnée
window.addEventListener('resize', resize);
resize();

// Met en place le listener pour le mouvement du background
window.addEventListener('mousemove', tiltBackground);

animate();

function animate() {
    requestAnimationFrame(animate)
    mesh.rotation.y += (0.001 * pageRatio.x) % Math.PI;
    renderer.render(scene, camera)
}

/**
 * Callback pour le redimensionnement de la fenêtre.
 * Met à jour le ratio de l'écran pour la caméra,
 * redimensionne la taille du rendu,
 * et met à jour les coordonnées du centre de l'écran.
 */
function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    pageCoord.x = window.innerWidth / 2;
    pageCoord.y = window.innerHeight / 2;
}

/**
 * Callback pour le background réactif
 * @param event L'évènement mousemove en cours
 */
function tiltBackground(event: MouseEvent) {
    pageRatio.x = (event.clientX - pageCoord.x) / pageCoord.x;
    pageRatio.y = (event.clientY - pageCoord.x) / pageCoord.y;
    mesh.rotation.x = (0.05 * pageRatio.y) % Math.PI;
}

/**
 * Créée le materiel pour les particules
 */
function createPointMaterial() {
    // Création du canvas pour dessiner la texture
    let texCanvas = document.createElement('canvas');
    texCanvas.width = 16;
    texCanvas.height = 16;
    let context = texCanvas.getContext('2d');

    // Création de l'image de la texture : un point jaune
    let gradient = context!.createRadialGradient(8, 8, 0, 8, 8, 8);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(192, 192, 0, 1)');
    gradient.addColorStop(0.6, 'rgba(0, 0, 0, 0)');
    context!.fillStyle = gradient;
    context!.fillRect(0, 0, 16, 16);

    // Création de la texture
    let texture = new THREE.Texture(texCanvas);
    texture.needsUpdate = true;

    return texture;
}