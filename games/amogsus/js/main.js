var width, height;

var mouseX = -100, mouseY = -100;

function onload() {
    width = window.innerWidth;
    height = window.innerHeight;
    particles.width = width;
    particles.height = height;

    for(let i = 0; i < rand(100, 225); i++) ps[ps.length] = new particle(rand(0, width), rand(0, height));
    generateCrew(5);
}
function mouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
}

function rand(first, second) {
    return Math.round(Math.random()*(second-first))+first;
}

function vel() {
    let r = rand(-1, 1);
    return r == 0 ? vel() : r;
}

function removeTable(table, element) {
    let r = [];
    table.forEach((e) => {
        if(e != element) r[r.length] = e;
    });
    return r;
}

function contains(table, element) {
    let r = false;
    table.forEach((e) => {
        if(e == element) r = true;
    });
    return r;
}

function getCurrentMilis() {
    return new Date()*1;
}