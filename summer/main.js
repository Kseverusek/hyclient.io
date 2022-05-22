const date = getEndOfSchoolYearDate(), start = getStartOfSchoolYearDate();
const canv = document.querySelector(".grid"), c = canv.getContext("2d");
const ls = localStorage;
var minutesInSchoolYear = minutesInDate(date-start), remainingMinutes = minutesInSchoolYear;
var mode = -1;

function getEndOfSchoolYearDate() {
    let cd = new Date(), eoty = new Date(cd.getFullYear()+(cd.getMonth()>=8?1:0), 5, 20, 9, 0, 0);
    while(eoty.getDay() != 5) {
        eoty.setDate(eoty.getDate()+1);
    }
    return eoty;
}
function getStartOfSchoolYearDate() {
    let cd = new Date(), soty = new Date(cd.getFullYear()-(cd.getMonth()<8?1:0), 8, 1, 9, 0, 0);
    while(soty.getDay() > 5) {
        soty.setDate(soty.getDate()+1);
    }

    return soty;
}

function getString() {
    let d = new Date(date-new Date());
    if(d.getTime()<0) {
        return "SUMMER STARTED! :)";
    }
    d.setHours(d.getHours()-1);
    return f((d.getMonth()*30)+d.getDate()-1)+"d "+f((d.getHours()))+"h "+f((d.getMinutes()))+"m "+f((d.getSeconds()))+"s";
}
function f(i) {
    return i<10?"0"+i:i;
}

function tick() {
    window.requestAnimationFrame(tick);

    canv.width = window.innerWidth;
    canv.height = window.innerHeight;

    remainingMinutes = minutesInDate(date-new Date());

    let percOfYear = (new Date().getTime()-start)/(date.getTime()-start);

    c.clearRect(0, 0, canv.width, canv.height);
    c.beginPath();
    c.fillStyle = mode == -1 ? "rgb(45, 45, 45)" : "rgb(245, 245, 245)";
    c.rect(0, 0, canv.width, canv.height);
    c.fill();
    c.restore();

    c.beginPath();
    c.fillStyle = "black";
    c.rect(0, canv.height/2-25, canv.width, 50);
    c.fill();
    c.restore();

    c.beginPath();
    c.fillStyle = "rgb(50, 250, 50)";
    c.rect(0, canv.height/2-20, canv.width*percOfYear, 40);
    c.fill();
    c.restore();
    
    c.font = "30px sans-serif";
    c.textAlign = "center";
    c.fillStyle = "black";
    c.fillText((Math.round(percOfYear*10000000)/100000) + "%", canv.width/2, canv.height/2-30);
    c.font = "50px sans-serif";
    c.fillText("SUMMER STARTS IN", canv.width/2, canv.height/2-150);
    c.fillText(getString(), canv.width/2, canv.height/2-90);

    c.beginPath();
    c.fillStyle = mode == 1 ? "rgb(45, 45, 45)" : "rgb(245, 245, 245)";
    c.rect(10, 10, 50, 50);
    c.fill();
    c.restore();
    c.font = "10px sans-serif";
    c.fillText("MODE", 25, 70);

    c.beginPath();
    c.strokeStyle = "black";
    c.lineWidth = 10;
    c.arc(canv.width/2, 100, 0, Math.PI*2, false);
    c.stroke();
    c.restore();
    // c.beginPath();
    // c.strokeStyle = "rgb(50, 250, 50)";
    // c.lineWidth = 5;
    // c.arc(canv.width/2, 100, 100, 0, Math.PI*((Math.round(percOfYear*10000000)/10000000)*2), false);
    // c.stroke();
    // c.restore();
}
load();
tick();

function minutesInDate(date) {
    let d = new Date(date);
    return ((d.getMonth()+1)*30*1440)+(d.getDate()*1440);
}

function load() {
    if(ls.getItem("timer:mode") != null) {
        mode = ls.getItem("timer:mode");
    } else {
        mode = -1;
        ls.setItem("timer:mode", mode);
    }
}
function update() {
    mode = ls.getItem("timer:mode");
}
function changeMode() {
    mode = mode == -1 ? 1 : -1;
    ls.setItem("timer:mode", mode);
    update();
}
window.onclick = function(e) {
    if(clickedAt(e.x, e.y, 10, 10, 50, 50)) {
        changeMode();
    }
}
function clickedAt(mx, my, x, y, w, h) {
    return mx >= x && mx <= x+w && my >= y && my <= y+h;
}