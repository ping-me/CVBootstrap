import * as THREE from "/assets/js/three.module.js";

// Création de la scène
const scene: THREE.Scene = new THREE.Scene();

// Création de la caméra
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);

// Création du renderer
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();

// Détermination du centre de la page
let pageCoord: THREE.Vector2 = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);
let pageRatio: THREE.Vector2 = new THREE.Vector2(1, 0);

// Et ajout au div wrapper prévu
document.getElementById('banner-three-wrapper')!.appendChild(renderer.domElement);

// Création de la géometrie pour les particules
const particles = [];
for (let p: number = 0; p < 1000; p++) {
    let px: number = Math.random() * 5 - 2.5;
    let py: number = Math.random() * 5 - 2.5;
    let pz: number = Math.random() * 5 - 2.5;
    particles.push(px, py, pz);
}
const particlesGeometry: THREE.BufferGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(particles), 3))

// Création du materiau pour les particules
const particlesMaterial: THREE.PointsMaterial = new THREE.PointsMaterial({
    size: 0.05,
    transparent: true,
    blending: THREE.AdditiveBlending,
    alphaTest: 0.5,
    opacity: 0.75,
    map: createPointMaterial()
});

// Création des meshes et ajout à la scene
const particlesMesh: THREE.Points = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

camera.position.z = 2
particlesMesh.position.y = -0.5;

// On mets en place un redimensionnement si la fenêtre est redimensionnée
window.addEventListener('resize', resize);
resize();

// Met en place le listener pour le mouvement du background
window.addEventListener('mousemove', tiltBackground);

// Met en place le listener pour le défilement du background
window.addEventListener('scroll', scrollPage);

// Lancement de la boucle d'animation principale
animate();

/**
 * Boucle d'animation principale
 */
function animate() {
    requestAnimationFrame(animate)
    particlesMesh.rotation.y += (0.001 * pageRatio.x) % Math.PI;
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
    particlesMesh.rotation.x = (0.05 * pageRatio.y) % Math.PI;
}

function scrollPage() {
    let backgroundY = document.documentElement.scrollTop / (document.documentElement.scrollHeight - window.innerHeight) - 0.5;
    particlesMesh.position.y = backgroundY;
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