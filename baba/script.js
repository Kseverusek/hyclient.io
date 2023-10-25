const e = document.querySelector(".amt");
const date = new Date("27 Oct 2023 15:00:00 GMT+0200");

setInterval(() => {
    update();
}, 100);

function getETA() {
    let d = new Date(date.getTime()-Date.now());
    return d;
}
function update() {
    let e = document.querySelector(".amt");

    let d = getETA();
    let a = d>0?format(((d.getDate()-1)*24)+(d.getHours()-1))+":"+format(d.getMinutes())+":"+format(d.getSeconds()):"00:00:00";

    e.innerHTML = a;
}
function format(a) {
    return a<10?"0"+a:a;
}
