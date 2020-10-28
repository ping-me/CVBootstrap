var cube = document.getElementById('cube');
var menu = document.getElementById('project-menu');
var projectTitle = document.getElementById('project-title');
var projectDescription = document.getElementById('project-description');
var projectList = JSON.parse('{ "show-front": { "cube-index": 1, "title": "Refonte du site du bar Le Loot", "description": "Le site web du bar Le Loot a été entièrement refait en utilisant le framework Bootstrap" } , "show-right": { "cube-index": 2, "title": "Projet 2 à venir", "description": "Description à venir..." } , "show-back": { "cube-index": 3, "title": "Projet 3 à venir", "description": "Description à venir..." } , "show-left": { "cube-index": 4, "title": "Projet 4 à venir", "description": "Description à venir..." } , "show-bottom": { "cube-index": 5, "title": "Projet 5 à venir", "description": "Description à venir..." } , "show-top": { "cube-index": 6, "title": "CV Numérique", "description": "Mon CV en ligne, réalisé avec le framework Bootstrap." } }');

// Initialisation de la liste des projets
projectTitle.innerHTML = projectList['show-front']['title'];
projectDescription.innerHTML = projectList['show-front']['description'];

//Initialisation Hammer pour le cube drag
var deltaX = 0;
var deltaY = 0;
var lastX = 0;
var lastY = 0;
const hammer = new Hammer(document.getElementById('project-diap'));
hammer.get('pan').set({direction: Hammer.DIRECTION_ALL});
hammer.on('pan', ev => dragCube(getOffset(ev.deltaX, deltaX), getOffset(-ev.deltaY, deltaY)));
hammer.on('panend', ev => { deltaX = lastY; deltaY = lastX; });

function dragCube(distY, distX) {
    cube.style.transition = '';
    cube.style.transform = `translateZ(-150px) rotateY(${distY}deg) rotateX(${distX}deg)`;
    lastX = distX;
    lastY = distY;
}

function getOffset(dist, delta) {
    return dist / 2 + delta;
}

function rotCube(face, obj)
{
    cube.style.transition = 'transform 1s';
    cube.style.transform = '';
    clearMenu();
    obj.classList.add("active");
    cube.className = face;
    projectDescShow(false);
    setTimeout(function() {projectDescFill(face);}, 250);
    setTimeout(function() {projectDescShow(true);}, 500);
}

function clearMenu()
{
    menu.childNodes.forEach((item, index) =>
    {
        if (item.nodeName.includes("LI"))
        {
            if (item.className.includes("active"))
            {
                item.classList.remove("active");
            }
        }
    });
}

function projectDescFill(face) {
    projectTitle.innerHTML = projectList[face]['title'];
    projectDescription.innerHTML = projectList[face]['description'];
}

function projectDescShow(showStatus) {
    if (showStatus) {
        if (projectTitle.className.includes("project-fade-out")) {
            projectTitle.classList.remove("project-fade-out");
            projectDescription.classList.remove("project-fade-out");
        }
        projectTitle.classList.add("project-fade-in");
        projectDescription.classList.add("project-fade-in");
    }
    else {
        if (projectTitle.className.includes("project-fade-in")) {
            projectTitle.classList.remove("project-fade-in");
            projectDescription.classList.remove("project-fade-in");
        }
        projectTitle.classList.add("project-fade-out");
        projectDescription.classList.add("project-fade-out");
    }
}