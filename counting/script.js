update();
setInterval(() => {
    update();
}, 500);

function getETA() {
    let czas = new Date("04 Sep 2023 10:00:00 GMT+0200")
    let d = new Date(czas.getTime()-Date.now());
    return d;
}
function update() {
    let e = document.querySelector(".countdown");

    let d = getETA();
    let a = d>0?format((d.getDate()*24)+d.getHours())+":"+format(d.getMinutes())+":"+format(d.getSeconds()):"00:00:00";

    e.innerHTML = a;
    document.title = a;
}
function format(a) {
    return a<10?"0"+a:a;
}