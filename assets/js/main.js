// Initialisation de la liste des projets
let menu = document.getElementById('project-menu');
let projectTitle = document.getElementById('project-title');
let projectDescription = document.getElementById('project-description');
let projectList = JSON.parse('{ "show-front": { "cube-index": 1, "title": "Calendrier", "description": "Développé lors d\'un TP sur PHP.  Mise en oeuvre du pattern MVC." } , "show-right": { "cube-index": 2, "title": "Calculatrice", "description": "Développé à titre personnel pour l\'apprentissage du C#, du pattern MVVM, et de la programmation Windows avec le framework WPF." } , "show-back": { "cube-index": 3, "title": "Labyrinthe", "description": "Développé pour expérimenter la manipulation du DOM en Javascript et la création d\'éléments HTML personnalisés." } , "show-left": { "cube-index": 4, "title": "Solitaire", "description": "Développé pour pousser un peu plus mon étude du DOM en Javascript." } , "show-bottom": { "cube-index": 5, "title": "Tetris", "description": "Adaptation en Javascript d\'un projet originalement écrit en C++." } , "show-top": { "cube-index": 6, "title": "TSIRC", "description": "Un client IRC, pour apprendre Typescript et Node.js." } }');
projectDescFill('show-front');

// Initialisation cube
let cube = document.getElementById('cube');
cube.addEventListener('mousedown', () => cube.style.cursor = 'grabbing');
cube.addEventListener('mouseup', () => cube.style.cursor = 'grab');

let deltaX = null;
let deltaY = null;
let lastX = 0;
let lastY = 0;
const hammer = new Hammer(document.getElementById('project-diap'));
hammer.get('pan').set({direction: Hammer.DIRECTION_ALL});
hammer.on('pan', ev => dragCube(getOffset(ev.deltaX, deltaX), getOffset(-ev.deltaY, deltaY)));
hammer.on('panend', () => { deltaX = lastY; deltaY = lastX; });

// Calcul et affichage de l'age
document.getElementById('dynamic-age').textContent = getAge().toString();

/**
 * Permet d'obtenir l'âge courant
 * @returns {number}
 */
function getAge() {
    let birthday = new Date('1979-12-26 15:30');
    let today = new Date();
    let age = new Date(today - birthday);
    return age.getFullYear() - 1970;
}

/**
 * Callback de l'évènement Hammer pan
 * @param distY Distance parcourue par la souris sur l'axe y
 * @param distX Distance parcourue par la souris sur l'axe x
 */
function dragCube(distY, distX) {
    cube.style.transition = '';
    cube.style.transform = `translateZ(-150px) rotateY(${distY}deg) rotateX(${distX}deg)`;
    lastX = distX % 360;
    lastY = distY % 360;
}

/**
 * Retourne la distance entre la position actuelle et la nouvelle position de la souris
 * @param dist Distance actuelle de la souris
 * @param delta Ancienne distance
 * @returns {number} La distance entre les deux points
 */
function getOffset(dist, delta) {
    return dist / 2 + delta;
}

/**
 * Tourne le cube pour faire apparaitre la face désirée.
 * @param string face Le nom de la face à afficher
 * @param HTMLElement listItem L'élément à activer dans la liste des projets
 */
function rotCube(face, listItem) {
    cube.style.transition = 'transform 1s';
    cube.style.transform = '';
    clearMenu();
    listItem.classList.add("active");
    cube.className = face;
    projectDescShow(false);
    setTimeout(() => projectDescFill(face), 250);
    setTimeout(() => projectDescShow(true), 500);
}

/**
 * Remet à jour les éléments de la liste des projets
 */
function clearMenu() {
    menu.childNodes.forEach((item) => {
        if (item.nodeName.includes("LI")) {
            if (item.className.includes("active")) {
                item.classList.remove("active");
            }
        }
    });
}

/**
 * Met à jour la description du projet actuellement sélectionné
 * @param string face Le div contenant la description
 */
function projectDescFill(face) {
    projectTitle.innerHTML = projectList[face]['title'];
    projectDescription.innerHTML = projectList[face]['description'];
}

/**
 * Gére les classes pour l'effet sur le sélecteur de projet
 * @param boolean showStatus Si on doit afficher ou non la description
 */
function projectDescShow(showStatus) {
    let toRemove, toAdd;
    if (showStatus) {
        toRemove = 'out';
        toAdd = 'in';
    }
    else {
        toRemove = 'in';
        toAdd = 'out';
    }
    if (projectTitle.className.includes("project-fade-" + toRemove)) {
        projectTitle.classList.remove("project-fade-" + toRemove);
        projectDescription.classList.remove("project-fade-" + toRemove);
    }
    projectTitle.classList.add("project-fade-" + toAdd);
    projectDescription.classList.add("project-fade-" + toAdd);
}