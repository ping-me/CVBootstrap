var cube = document.getElementById('cube');
var menu = document.getElementById('project-menu');

function rotCube(face, obj) {
    clearMenu();
    obj.classList += " active";
    cube.className = face;
}

function clearMenu() {
    menu.childNodes.forEach((item, index) => {
        if (item.nodeName.includes("LI")) {
            if (item.className.includes(" active")) {
                item.className = item.className.replace(" active", "");
            }
        }
    });
}