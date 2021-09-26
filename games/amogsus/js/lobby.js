const particles = document.querySelector(".particles");
const p = particles.getContext("2d");
const nickField = document.querySelector(".nick");
const idField = document.querySelector(".gameid");

var ps = [];
var crews = [];

var nickFieldFocused = false;
var nickFieldText = "";
var nickFieldUpdated = -1;
var nickFloorAdded = false;

var idFieldFocused = false;
var idFieldText = "";
var idFieldUpdated = -1;
var idFloorAdded = false;

let lastColor = 0;

function generateCrew(amount) {
    for(let i = 0; i < amount; i++) crews[crews.length] = new crew();
}
function drawLine(x, y, x2, y2) {
    p.beginPath();
    p.strokeStyle = "gray";
    p.moveTo(x, y);
    p.lineTo(x2, y2);
    p.stroke();
}

function tick() {
    if(crews.length > 7) {
        crews.forEach((e, i) => {
            if(i > 7) crews = removeTable(crews, e);
        });
    }
    p.clearRect(0, 0, width, height);

    //PARTICLES
    ps.forEach((p, i) => {
        p.draw();
    });
    crews.forEach((p, i) => {
        p.draw();
    });

    if(nickFieldUpdated+500 < getCurrentMilis()) {
        let i = nickField.innerHTML;
        nickFieldUpdated = getCurrentMilis();
        if(nickFieldFocused) {
            if(nickFloorAdded) {
                nickField.innerHTML = i.substring(0, i.length-1);
                nickFloorAdded = false;
            } else {
                nickField.innerHTML = nickFieldText + "_";
                nickFloorAdded = true;
            }
        }
    }
    if(idFieldUpdated+500 < getCurrentMilis()) {
        let i = idField.innerHTML;
        idFieldUpdated = getCurrentMilis();
        if(idFieldFocused) {
            if(idFloorAdded) {
                idField.innerHTML = i.substring(0, i.length-1);
                idFloorAdded = false;
            } else {
                idField.innerHTML = idFieldText + "_";
                idFloorAdded = true;
            }
        }
    }
}

function elementClicked(event) {
    if(event.target == nickField) {
        nickFieldFocused = true;
        if(nickFieldText == "") event.target.innerHTML = "";
    } else {
        nickFieldFocused = false;
        if(nickFieldText == "") nickField.innerHTML = "Enter Username";
        else if(nickFloorAdded) {
            nickFloorAdded = false;
            updateField();
        }
    }
    if(event.target == idField) {
        idFieldFocused = true;
        if(idFieldText == "") event.target.innerHTML = "";
    } else {
        idFieldFocused = false;
        if(idFieldText == "") idField.innerHTML = "Enter GameID";
        else if(idFloorAdded) {
            idFloorAdded = false;
            updateField2();
        }
    }
    if(event.target.className.includes("host")) {
        let link = window.location.href + "game/?nick=" + nickFieldText;
        window.location.href = link;
    }
    if(event.target.className.includes("join")) {
        let link = window.location.href + "game/?gameId=" + idFieldText + "&nick=" + nickFieldText;
        window.location.href = link;
    }
}

function keyTyped(event) {
    if(nickFieldFocused) {
        if(event.key == "Backspace") {
            nickFieldText = nickFieldText.substring(0, nickFieldText.length-1);
        } if(event.key.length == 1) {
            nickFieldText+=event.key;
        }
        updateField();
    }
    if(idFieldFocused) {
        if(event.key == "Backspace") {
            idFieldText = idFieldText.substring(0, idFieldText.length-1);
        } if(event.key.length == 1 && idFieldText.length < 7) {
            idFieldText+=event.key;
        }
        updateField2();
    }
}

function updateField() {
    let suffix = "";
    if(nickFloorAdded) suffix = "_";
    nickField.innerHTML = nickFieldText + suffix;
}
function updateField2() {
    let suffix2 = "";
    if(idFloorAdded) suffix2 = "_";
    idField.innerHTML = idFieldText + suffix2;
}

function particle(x, y) {
    this.x = x;
    this.y = y;
    this.vel = [vel(), vel()];
    this.draw = function() {
        p.beginPath();
        p.fillRect(this.x, this.y, 2, 2);
        p.fillStyle = "white";
        p.stroke();
        this.x+=this.vel[0];
        this.y+=this.vel[1];
        if(this.x == 0) this.x = width-1;
        if(this.x == width) this.x = 1;
        if(this.y == 0) this.y = height-1;
        if(this.y == height) this.y = 1;

        if(Math.abs(this.x-mouseX) <= 150 && Math.abs(this.y-mouseY) <= 150) {
            drawLine(mouseX, mouseY, this.x, this.y);
        }
    }
}

function crew() {
    lastColor++;
    if(lastColor > 9) lastColor = 0;
    this.path = "models/" + lastColor + ".png";
    this.scale = 5
    this.w = 200;
    this.left = rand(0, 1) == 1;
    this.x = this.left ? -this.w : width+this.w;
    this.y = rand(0, height);
    this.ychange = rand(-5, 5);
    this.xchange = rand(1, 10);
    this.deg = rand(0, 180);
    this.degChange = rand(-100, 100)/10;
    this.draw = function() {
        let img = new Image();
        img.src = this.path;

        p.save();

        p.translate(this.x, this.y);
        p.rotate(this.deg*Math.PI/180);
        p.translate(-this.w/2, -this.w/2);
        p.drawImage(img, 0, 0, this.w, this.w);

        p.restore();

        this.x+=this.left?this.xchange:-this.xchange;
        this.y+=this.ychange;
        this.deg+=this.degChange;
        if(this.x+this.w > width+500 || this.y+this.w < 0 || this.y+this.w > height+500) {
            generateCrew(1);
            crews.forEach((e, i) => {
                if(e == this) crews = removeTable(crews, e);
            });
        }
    }
}

setInterval(() => { tick(); }, 50);
setInterval(() => { generateCrew(1); }, 5000);
document.addEventListener("mousedown", (e) => { elementClicked(e); });
document.addEventListener("keydown", (e) => { keyTyped(e); });