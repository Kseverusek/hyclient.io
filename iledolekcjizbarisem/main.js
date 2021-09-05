const background = document.querySelector(".bg");
const themes = document.querySelector(".theme");
const timer = document.querySelector(".timer");
const storage = localStorage;
var theme = storage.getItem("theme");

if(theme == null) {
    storage.setItem("theme", "black");
    theme = "black";
}
setupBackground();

themes.addEventListener("click", function() {
    if(theme == "black") {
        storage.setItem("theme", "white");
        theme = "white";
        setupBackground();
        return;
    } else {
        storage.setItem("theme", "black");
        theme = "black";
        setupBackground();
        return;
    }
});

function setupBackground() {
    if(theme.includes("b")) {
        background.setAttribute("style", "top: -5vh; left: -5vw; width: 150vw; height: 150vh; border-radius: 10vw;");
        document.body.style.color = "white";
        themes.setAttribute("style", "background-color: white;")
    } if(theme.includes("w")) {
        background.setAttribute("style", "top: 92vh; left: 10vw; width: 0vw; height: 0vh; border-radius: 0vw;");
        document.body.style.color = "black";
        themes.removeAttribute("style");
    }
}

setInterval(() => {
    let d = new Date();
    let day = d.getDay() == 0 ? 7 : d.getDay();

    let hrs = ((8-day)*24 + (11-d.getHours())),
    mins = 30-d.getMinutes(), secs = 60-d.getSeconds();

    if(mins <= 0) {
        hrs--;
        mins = 60+mins;
    }

    timer.innerHTML = hrs + "h:" + mins + "min:" + secs + "sec";
}, 500);

function fixTime(param) {
    return ("" + param).length < 2 ? "0" + param : param;
}