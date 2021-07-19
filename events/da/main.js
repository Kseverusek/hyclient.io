const timer = document.getElementById("timer");

updateTimer();

setInterval(() => {
    updateTimer();
}, 500);

function updateTimer() {
    let c = new Date();
    let d = new Date();
    d.setMinutes(54);
    d.setHours(c.getMinutes() > 54 ? c.getHours()+1 : c.getHours());
    d.setSeconds(59);
    let f = new Date(d-c);
    timer.innerHTML = fixTime(f.getMinutes()) + " minutes and " + fixTime(f.getSeconds()) + " seconds";
}

function fixTime(time) {
    if((time + "").length < 2) {
        return "0" + time;
    }
    return time;
}