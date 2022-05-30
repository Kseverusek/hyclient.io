const cubes = [];
const list = document.querySelector(".list");
const listEl = [
    ["Example project", "This is an example project that doesn't do much here", "https://example.com"],
    ["Tic Tac Toe", "Simple multiplayer tic tac toe", "/tictactoe/index.html"]
];
var conf = {
    bgColor: "rgb(50, 50, 50)"
};

window.onresize = () => {
    update();
}
function update() {
    cv.width = window.innerWidth;
    cv.height = window.innerHeight;
}
update();

for(let i = 0; i < 50; i++) {
    cubes.push(new Cube3d(r(0, cv.width), r(0, cv.height), r(10, 100),r(10, 100),r(10, 100), r(0, 360),r(0, 360),r(0, 360)));
}

function draw() {
    window.requestAnimationFrame(draw);

    c.save();
    c.fillStyle = conf.bgColor;
    c.rect(0, 0, cv.width, cv.height);
    c.fill();
    c.restore();

    c.save();
    c.translate(cv.width/2, cv.height/2);
    c.shadowBlur = 10;
    c.shadowColor = "black";
    cubes.forEach((e, i) => {
        c.save();
        c.scale(e.scale, e.scale);
        c.translate(-cv.width/2, -cv.height/2);
        e.scale+=e.scaleChange;
        if(Math.abs(e.scale) >= 2) e.scaleChange = -e.scaleChange;
        e.draw();
        c.restore();
    });
    c.restore();
}
draw();

function doList() {
    listEl.forEach((el, i) => {
        let e = document.createElement("div");

        e.className = "el";
        let title = document.createElement("div");
        title.className = "title";
        title.innerHTML = el[0];
        e.appendChild(title);
        let desc = document.createElement("div");
        desc.className = "desc";
        desc.innerHTML = el[1];
        e.appendChild(desc);
        let dl = document.createElement("a");
        dl.className = "dl";
        dl.href = el[2];
        dl.innerHTML = "Open file";
        e.appendChild(dl);

        list.appendChild(e);
    });
}
doList();
